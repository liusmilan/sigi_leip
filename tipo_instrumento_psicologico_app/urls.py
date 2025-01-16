from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import agregarEditarTipoInstrumentoPsicologico, getTipoInstrumentoPsicologico, eliminarTipoInstrumentoPsicologico, listadoTipoInstrumentoPsicologico

urlpatterns = [
    path('lista_tipo_instrumento/', login_required(
        listadoTipoInstrumentoPsicologico.as_view()), name='lista_tipo_instrumento'),
    path('agregar_tipo_instrumento/', login_required(
        agregarEditarTipoInstrumentoPsicologico.as_view()), name='agregar_tipo_instrumento'),
    path('eliminar_tipo_instrumento/', login_required(
        eliminarTipoInstrumentoPsicologico.as_view()), name='eliminar_tipo_instrumento'),
    path('get_tipo_instrumento/', login_required(getTipoInstrumentoPsicologico.as_view()),
         name='get_tipo_instrumento'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioTipoInstrumentoPsicologico/', login_required(TemplateView.as_view(template_name='configuracion/tipo_instrumento_psicologico/lista_tipo_instrumento.html')),
         name='inicio_tipo_instrumento'),
]
