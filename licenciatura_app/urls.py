from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoLicenciatura, agregarEditarLicenciatura, getLicenciatura, eliminarLicenciatura, getAllLicenciaturas

urlpatterns = [
    path('lista_licenciatura/', login_required(listadoLicenciatura.as_view()),
         name='lista_licenciatura'),
    path('agregar_licenciatura/', login_required(agregarEditarLicenciatura.as_view()),
         name='agregar_licenciatura'),
    path('get_licenciatura/', login_required(getLicenciatura.as_view()),
         name='get_licenciatura'),
    path('eliminar_licenciatura/', login_required(eliminarLicenciatura.as_view()),
         name='eliminar_licenciatura'),
    path('get_all_licenciatura/', getAllLicenciaturas,
         name='get_all_licenciatura'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioLicenciatura/', login_required(TemplateView.as_view(template_name='configuracion/licenciatura/lista_licenciatura.html')),
         name='inicio_licenciatura'),
]
