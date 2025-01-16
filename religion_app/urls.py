from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoReligiones, agregarEditarReligion, getReligion, eliminarReligión, getAllReligiones

urlpatterns = [
    path('lista_religion/', login_required(listadoReligiones.as_view()),
         name='lista_religion'),
    path('agregar_religion/', login_required(agregarEditarReligion.as_view()),
         name='agregar_religion'),
    path('get_religion/', login_required(getReligion.as_view()),
         name='get_religion'),
    path('eliminar_religion/', login_required(eliminarReligión.as_view()),
         name='eliminar_religion'),
    path('get_all_religion/', getAllReligiones,
         name='get_all_religion'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioReligion/', login_required(TemplateView.as_view(template_name='configuracion/religion/lista_religion.html')),
         name='inicio_religion'),
]
