# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
from django.shortcuts import render
from django.core.files.uploadedfile import UploadedFile
from itertools import islice
import codecs
import csv
import ast
import re
from deeperlib.web import deeper_web


# Create your views here.
def index(request):
    return render(request, 'deeperweb/index.html')


def demo(request):
    return render(request, 'deeperweb/demo.html')


def advance(request):
    return render(request, 'deeperweb/advance.html')


def about(request):
    return render(request, 'deeperweb/about.html')


def contact(request):
    return render(request, 'deeperweb/contact.html')


def smartcrawl(request):
    original_data = request.POST.get('original_data')
    local_match = request.POST.getlist('local_match[]')
    hidden_match = request.POST.getlist('hidden_match[]')
    api_msg = request.POST.get('api_msg')
    lines = re.split(r"[\n]", original_data)
    original_csv = []
    for i in lines:
        if len(i.strip()):
            templist = []
            split_list = re.split(',', i)
            for s in split_list:
                if s.startswith(' ') and len(templist) > 0:
                    templist[-1] = templist[-1] + s
                else:
                    templist.append(s)
            original_csv.append(templist)
    join_csv = deeper_web.smartcrawl_web(16, api_msg, original_csv, local_match, hidden_match)
    return JsonResponse({'join_csv': join_csv})


def importTable(request):
    original_data = ast.literal_eval(request.POST.get('original_data'))
    request.session['original_data'] = original_data
    return JsonResponse({})


class Echo(object):
    """An object that implements just the write method of the file-like
    interface.
    """

    def write(self, value):
        """Write the value by returning it, instead of storing in a buffer."""
        return value


def exportCSV(request):
    if len(request.session['original_data']) < 500:
        response = HttpResponse(content_type='text/csv;charset=utf-8')
        response.write(codecs.BOM_UTF8)
        writer = csv.writer(response)
        for row in request.session['original_data']:
            writer.writerow(row)
    else:
        pseudo_buffer = Echo()
        writer = csv.writer(pseudo_buffer)
        response = StreamingHttpResponse((writer.writerow(row) for row in request.session['original_data']),
                                         content_type="text/csv;charset=utf-8")
    response['Content-Disposition'] = 'attachment; filename="extended_table.csv"'
    del request.session['original_data']
    return response


def uploadCSV(request):
    file = request.FILES[u'files[]']
    wrapped_file = UploadedFile(file)
    csv_file = csv.reader(wrapped_file)
    csv_input = [row for row in csv_file]
    if len(csv_input) != 0:
        csv_input[0][0] = csv_input[0][0].replace(b'\xef\xbb\xbf', '')
    return JsonResponse({'csv_input': csv_input})
