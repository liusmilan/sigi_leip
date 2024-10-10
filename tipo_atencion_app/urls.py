from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoTipoAtencion, agregarEditarTipoAtencion, getTipoAtencion, eliminarTipoAtencion, getAllTipoAtencion

urlpatterns = [
    path('lista_tipo_atencion/', login_required(listadoTipoAtencion.as_view()),
         name='lista_tipo_atencion'),
    path('agregar_tipo_atencion/', login_required(agregarEditarTipoAtencion.as_view()),
         name='agregar_tipo_atencion'),
    path('get_tipo_atencion/', login_required(getTipoAtencion.as_view()),
         name='get_tipo_atencion'),
    path('eliminar_tipo_atencion/', login_required(eliminarTipoAtencion.as_view()),
         name='eliminar_tipo_atencion'),
    path('get_all_tipo_atencion/', getAllTipoAtencion,
         name='get_all_tipo_atencion'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioTipoAtencion/', login_required(TemplateView.as_view(template_name='configuracion/tipo_atencion/lista_tipo_atencion.html')),
         name='inicio_tipo_atencion'),
]
