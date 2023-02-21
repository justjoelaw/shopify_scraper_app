from django.shortcuts import HttpResponse
from django.contrib.auth import login, authenticate, logout
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.

from django.shortcuts import render


def index(request):
    return render(request, 'index.html')
