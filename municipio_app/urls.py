from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import agregarEditarMunicipio, listadoMunicipios, eliminarMunicipio, getMunicipio, getAllMunicipios, getMunicipiosByEstado

urlpatterns = [
    path('lista_municipio/', login_required(listadoMunicipios.as_view()),
         name='lista_municipio'),
    path('agregar_municipio/', login_required(agregarEditarMunicipio.as_view()),
         name='agregar_municipio'),
    path('get_municipio/', login_required(getMunicipio.as_view()),
         name='get_municipio'),
    path('eliminar_municipio/', login_required(eliminarMunicipio.as_view()),
         name='eliminar_municipio'),
    path('get_municipios/', getAllMunicipios, name='get_municipios'),
    path('get_municipios_by_estado/', getMunicipiosByEstado.as_view(),
         name='get_municipios_by_estado'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioMunicipio/', login_required(TemplateView.as_view(template_name='configuracion/municipio/lista_municipio.html')),
         name='inicio_municipio'),
]
