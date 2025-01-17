from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoEstadoAtencion, agregarEditarEstadoAtencion, getEstadoAtencion, eliminarEstadoAtencion, getAllEstadosAtenciones

urlpatterns = [
    path('lista_estado_atencion/', login_required(listadoEstadoAtencion.as_view()),
         name='lista_estado_atencion'),
    path('agregar_estado_atencion/', login_required(agregarEditarEstadoAtencion.as_view()),
         name='agregar_estado_atencion'),
    path('get_estado_atencion/', login_required(getEstadoAtencion.as_view()),
         name='get_estado_atencion'),
    path('eliminar_estado_atencion/', login_required(eliminarEstadoAtencion.as_view()),
         name='eliminar_estado_atencion'),
    path('get_all_estados_atencion/', getAllEstadosAtenciones,
         name='get_all_estados_atencion'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioEstadoAtencion/', login_required(TemplateView.as_view(template_name='configuracion/estado_atencion/lista_estado_atencion.html')),
         name='inicio_estado_atencion'),
]
