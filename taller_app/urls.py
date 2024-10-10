from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoTalleres, agregarEditarTaller, getTaller, eliminarTaller, getAllTalleres, getAllModalidades

urlpatterns = [
    path('lista_taller/', login_required(listadoTalleres.as_view()),
         name='lista_taller'),
    path('agregar_taller/', login_required(agregarEditarTaller.as_view()),
         name='agregar_taller'),
    path('get_taller/', login_required(getTaller.as_view()),
         name='get_taller'),
    path('eliminar_taller/', login_required(eliminarTaller.as_view()),
         name='eliminar_taller'),
    path('get_talleres/', getAllTalleres, name='get_talleres'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioTaller/', login_required(TemplateView.as_view(template_name='configuracion/taller/lista_taller.html')),
         name='inicio_taller'),
]

# URLS de modalidades
urlpatterns += [
    path('get_modalidades/', getAllModalidades, name='get_modalidades'),
]
