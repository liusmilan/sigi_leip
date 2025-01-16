from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import agregarEditarSSIBeck, getSSIBeck

urlpatterns = [
    path('agregar_editar_ssi_beck/', login_required(agregarEditarSSIBeck.as_view()),
         name='agregar_editar_ssi_beck'),
    path('get_ssi_beck/', login_required(getSSIBeck.as_view()),
         name='get_ssi_beck'),
]
