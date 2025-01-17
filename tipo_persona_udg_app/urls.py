from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoTipoPersonaUdg, agregarTipoPersonaUdg, getTipoPersonaUdg, eliminarTipoPersonaUdg, getAllTipoPersonaUdg

urlpatterns = [
    path('lista_tipo_persona_udg/', login_required(listadoTipoPersonaUdg.as_view()),
         name='lista_tipo_persona_udg'),
    path('agregar_tipo_persona_udg/', login_required(agregarTipoPersonaUdg.as_view()),
         name='agregar_tipo_persona_udg'),
    path('get_tipo_persona_udg/', login_required(getTipoPersonaUdg.as_view()),
         name='get_tipo_persona_udg'),
    path('eliminar_tipo_persona_udg/', login_required(eliminarTipoPersonaUdg.as_view()),
         name='eliminar_tipo_persona_udg'),
    path('get_all_tipo_persona_udg/', getAllTipoPersonaUdg,
         name='get_all_tipo_persona_udg'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioTipoPersonaUdg/', login_required(TemplateView.as_view(template_name='configuracion/tipo_persona_udg/lista_tipo_persona_udg.html')),
         name='inicio_tipo_persona_udg'),
]
