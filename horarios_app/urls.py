from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import horario_cita_valoracion, horario_consulta_psicoterapeutica, agregarHorario

urlpatterns = [
    path('horario_cita_valoracion/', login_required(horario_cita_valoracion.as_view()),
         name='horario_cita_valoracion'),
    path('horario_consulta_psicoterapeutica/', login_required(
        horario_consulta_psicoterapeutica.as_view()), name='horario_consulta_psicoterapeutica'),
    path('agregar_horario/', login_required(agregarHorario.as_view()),
         name='agregar_horario'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioHorarioCitaValoracion/', login_required(TemplateView.as_view(template_name='configuracion/horarios/horario_cita_valoracion.html')),
         name='inicio_horario_cita_valoracion'),
    path('InicioHorarioConsultaPsicoterapeutica/', login_required(TemplateView.as_view(template_name='configuracion/horarios/horario_consulta_psicoterapeutica.html')),
         name='inicio_horario_consulta_psicoterapeutica'),
]
