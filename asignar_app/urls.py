from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import getHorariosMotivoConsulta, agregarPersonaAsignada, getAsignadoByAtencion, getHorarioDisponilidadHorarioConsulta

urlpatterns = [
    path('get_horarios_motivo_consulta/', login_required(getHorariosMotivoConsulta.as_view()),
         name='get_horarios_motivo_consulta'),
    path('agregar_persona_asignada/', login_required(agregarPersonaAsignada.as_view()),
         name='agregar_persona_asignada'),
    path('get_asignado_by_atencion/', login_required(getAsignadoByAtencion.as_view()),
         name='get_asignado_by_atencion'),
    path('get_horarios_disponibilidad/', login_required(getHorarioDisponilidadHorarioConsulta.as_view()),
         name='get_horarios_disponibilidad'),
]
