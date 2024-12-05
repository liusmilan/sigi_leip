from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import agregarEditarHistoriaClinica, getHistoriaClinica

urlpatterns = [
    path('agregar_editar_hc/', login_required(agregarEditarHistoriaClinica),
         name='agregar_editar_hc'),
    path('get_hc/', login_required(getHistoriaClinica.as_view()),
         name='get_hc'),
]
