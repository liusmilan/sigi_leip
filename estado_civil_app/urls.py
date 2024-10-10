from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoEstadosCiviles, agregarEditarEstadoCivil, getEstadoCivil, eliminarEstadoCivil, getAllEstadosCiviles

urlpatterns = [
    path('lista_estado_civil/', login_required(listadoEstadosCiviles.as_view()),
         name='lista_estado_civil'),
    path('agregar_estado_civil/', login_required(agregarEditarEstadoCivil.as_view()),
         name='agregar_estado_civil'),
    path('get_estado_civil/', login_required(getEstadoCivil.as_view()),
         name='get_estado_civil'),
    path('eliminar_estado_civil/', login_required(eliminarEstadoCivil.as_view()),
         name='eliminar_estado_civil'),
    path('get_all_estado_civil/', getAllEstadosCiviles,
         name='get_all_estado_civil'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioReligion/', login_required(TemplateView.as_view(template_name='configuracion/estado_civil/lista_estado_civil.html')),
         name='inicio_estado_civil'),
]
