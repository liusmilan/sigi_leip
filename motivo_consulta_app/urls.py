from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import agregarEditarMotivoConsulta, getMotivoConsultaByAtencion

urlpatterns = [
    path('agregar_motivo_consulta/', login_required(agregarEditarMotivoConsulta.as_view()),
         name='agregar_motivo_consulta'),
    path('get_motivo_consulta_by_atencion/', login_required(getMotivoConsultaByAtencion.as_view()),
         name='get_motivo_consulta_by_atencion'),
]
