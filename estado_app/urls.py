from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoEstados, agregarEditarEstado, eliminarEstado, getEstado, getAllEstados

urlpatterns = [
    path('lista_estado/', login_required(listadoEstados.as_view()),
         name='lista_estado'),
    path('agregar_estado/', login_required(agregarEditarEstado.as_view()),
         name='agregar_estado'),
    path('get_estado/', login_required(getEstado.as_view()),
         name='get_estado'),
    path('eliminar_estado/', login_required(eliminarEstado.as_view()),
         name='eliminar_estado'),
    path('get_estados/', getAllEstados, name='get_estados'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioEstado/', login_required(TemplateView.as_view(template_name='configuracion/estado/lista_estado.html')),
         name='inicio_estado'),
]
