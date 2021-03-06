# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse, JsonResponse, StreamingHttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.core.files.uploadedfile import UploadedFile
from models import Subscriber
from deeperlib.web.deeper_web import Deeper_WEB
import codecs
import csv
import ast


# Create your views here.
def index(request):
    return render(request, 'deeperweb/index.html', {'user': request.user})


def demo(request):
    cookies_expired = False
    if request.COOKIES.get('email') is None:
        cookies_expired = True
    elif len(Subscriber.objects.filter(email=request.COOKIES.get('email'))) == 0:
        cookies_expired = True
    return render(request, 'deeperweb/demo.html', {'user': request.user, 'cookies_expired': cookies_expired})


def about(request):
    return render(request, 'deeperweb/about.html', {'user': request.user})


def contact(request):
    return render(request, 'deeperweb/contact.html', {'user': request.user})


def subscribe(request):
    name = request.POST.get('name')
    email = request.POST.get('email')
    if len(Subscriber.objects.filter(email=email)) == 0:
        Subscriber.objects.get_or_create(name=name, email=email)
    jsonresponse = JsonResponse({'user_num': Subscriber.objects.count()})
    jsonresponse.set_cookie('name', name, 2 * 24 * 3600)
    jsonresponse.set_cookie('email', email, 2 * 24 * 3600)
    return jsonresponse


def smartcrawl(request):
    original_data = request.POST.get('original_data')
    local_match = request.POST.getlist('local_match[]')
    hidden_match = request.POST.getlist('hidden_match[]')
    api_msg = request.POST.getlist('api_msg[]')
    try:
        original_csv = ast.literal_eval(original_data)
    except SyntaxError:
        original_csv = []
        lines = original_data.splitlines()
        for line in lines:
            row = []
            for i in line.split(','):
                if len(row) and len(i) and i[0].isspace():
                    row[-1] += i
                else:
                    row.append(i)
            original_csv.append(row)

    if len(original_csv) > 1:
        result = Deeper_WEB(4, api_msg, original_csv, local_match, hidden_match)
    else:
        result = {}

    return JsonResponse(result)


def uploadCSV(request):
    file = request.FILES[u'files[]']
    wrapped_file = UploadedFile(file)
    csv_file = csv.reader(wrapped_file)
    csv_input = [row for row in csv_file]
    if len(csv_input) != 0:
        csv_input[0][0] = csv_input[0][0].replace(b'\xef\xbb\xbf', '')
    return JsonResponse({'csv_input': csv_input})


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


def paper(request):
    return HttpResponseRedirect('/static/deeperweb/pdf/deeper-vldb-v0.1.pdf')
