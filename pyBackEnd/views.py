from django.shortcuts import render
from .models import Client

def index(request):
    clients = Client.objects.all()
    return render(request, 'index.html', {'clients': clients})
