# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Subscriber(models.Model):
    name = models.CharField(max_length=30)
    email = models.EmailField()

    def __unicode__(self):
        return self.name