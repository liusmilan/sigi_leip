from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoViveEn, agregarEditarViveEn, getViveEn, eliminarViveEn, getAllViveEn

urlpatterns = [
    path('lista_vive_en/', login_required(listadoViveEn.as_view()),
         name='lista_vive_en'),
    path('agregar_vive_en/', login_required(agregarEditarViveEn.as_view()),
         name='agregar_vive_en'),
    path('get_vive_en/', login_required(getViveEn.as_view()),
         name='get_vive_en'),
    path('eliminar_vive_en/', login_required(eliminarViveEn.as_view()),
         name='eliminar_vive_en'),
    path('get_all_vive_en/', getAllViveEn,
         name='get_all_vive_en'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioViveEn/', login_required(TemplateView.as_view(template_name='configuracion/vive_en/lista_vive_en.html')),
         name='inicio_vive_en'),
]
