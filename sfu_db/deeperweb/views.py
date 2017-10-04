# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.conf import settings
import os

# Create your views here.
def index(request):
    return render(request, 'deeperweb/index.html')

def setting(request):
    return render(request, 'deeperweb/setting.html')

def interactive(request):
    return render(request, 'deeperweb/interactive.html')

def about(request):
    return render(request, 'deeperweb/about.html')

def contact(request):
    return render(request, 'deeperweb/contact.html')

from dblp_example import backend
def smartcrawl(request):
    if request.method == 'POST':
        print request.POST.get('top_k')
        backend()
    return render(request, 'deeperweb/smartcrawl.html')