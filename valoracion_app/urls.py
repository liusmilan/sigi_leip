from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import agregarEditarValoracion, getValoracionByAtencion

urlpatterns = [
    path('agregar_valoracion/', login_required(agregarEditarValoracion.as_view()),
         name='agregar_valoracion'),
    path('get_valoracion_by_atencion/', login_required(getValoracionByAtencion.as_view()),
         name='get_valoracion_by_atencion'),
]
