# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render


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


from django.http import HttpResponse, JsonResponse
import re
from deeperlib.web import deeper_web


def smartcrawl(request):
    csv = request.POST.get('original_data')
    lines = re.split(r"[\n]", csv)
    original_csv = []
    for i in lines:
        print i
        if len(i.strip()):
            templist = []
            split_list = re.split(',', i)
            for s in split_list:
                if s.startswith(' ') and len(templist)>0:
                    templist[-1] = templist[-1] + s
                else:
                    templist.append(s)
            original_csv.append(templist)
    join_csv = deeper_web.smartcrawl_web(16, original_csv)
    return JsonResponse({'join_csv': join_csv})


def testpage(request):
    return render(request, 'deeperweb/testpage.html')
