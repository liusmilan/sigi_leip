from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import inicio

urlpatterns = [
    path('', login_required(inicio.as_view()), name='dashboard')
]
