from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoPersonas, agregarEditarPersona, getPersona, eliminarPersona, getAllPersonas

urlpatterns = [
    path('lista_persona/', login_required(listadoPersonas.as_view()),
         name='lista_persona'),
    path('agregar_persona/', login_required(agregarEditarPersona.as_view()),
         name='agregar_persona'),
    path('get_persona/', login_required(getPersona.as_view()),
         name='get_persona'),
    path('eliminar_persona/', login_required(eliminarPersona.as_view()),
         name='eliminar_persona'),
    path('get_personas/', getAllPersonas, name='get_personas'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioPersona/', login_required(TemplateView.as_view(template_name='seguridad/persona/lista_persona.html')),
         name='inicio_persona'),
]
