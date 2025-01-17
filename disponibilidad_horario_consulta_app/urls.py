from django.urls import path
from django.contrib.auth.decorators import login_required
# from django.views.generic import TemplateView
from .views import agregarEditarDisponibilidadHorarioConsulta, getDisponibilidadHorarioConsultaByAtencion

urlpatterns = [
    path('agregar_disponibilidad_horario_consulta/', login_required(agregarEditarDisponibilidadHorarioConsulta.as_view()),
         name='agregar_disponibilidad_horario_consulta'),
    path('get_disponibilidad_horario_consulta_by_atencion/', login_required(getDisponibilidadHorarioConsultaByAtencion.as_view()),
         name='get_disponibilidad_horario_consulta_by_atencion'),
]
