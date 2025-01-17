from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoViveCon, agregarEditarViveCon, getViveCon, eliminarViveCon, getAllViveCon

urlpatterns = [
    path('lista_vive_con/', login_required(listadoViveCon.as_view()),
         name='lista_vive_con'),
    path('agregar_vive_con/', login_required(agregarEditarViveCon.as_view()),
         name='agregar_vive_con'),
    path('get_vive_con/', login_required(getViveCon.as_view()),
         name='get_vive_con'),
    path('eliminar_vive_con/', login_required(eliminarViveCon.as_view()),
         name='eliminar_vive_con'),
    path('get_all_vive_con/', getAllViveCon,
         name='get_all_vive_con'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioViveCon/', login_required(TemplateView.as_view(template_name='configuracion/vive_con/lista_vive_con.html')),
         name='inicio_vive_con'),
]
