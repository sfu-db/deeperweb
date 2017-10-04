from django import forms

class SmartcrawlForm(forms.Form):
    top_k = forms.IntegerField()
