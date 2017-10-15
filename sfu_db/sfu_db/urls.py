"""sfu_db URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from deeperweb import views

urlpatterns = [
    url(r'^index/$', views.index, name='index'),
    url(r'^$', views.demo, name='demo'),
    url(r'^about/$', views.about, name='about'),
    url(r'^contact/$', views.contact, name='contact'),
    url(r'^subscribe/$', views.subscribe, name='subscribe'),
    url(r'^smartcrawl/$', views.smartcrawl, name='smartcrawl'),
    url(r'^uploadCSV/$', views.uploadCSV, name='uploadCSV'),
    url(r'^importTable/$', views.importTable, name='importTable'),
    url(r'^exportCSV/$', views.exportCSV, name='exportCSV'),
    url(r'^admin/', admin.site.urls),
]
