from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import ListadoRoles, eliminarRol, getRol, agregarEditarRol, getAllRoles

urlpatterns = [
    path('lista_rol/', login_required(ListadoRoles.as_view()), name='lista_rol'),
    path('agregar_rol/', login_required(agregarEditarRol.as_view()),
         name='agregar_rol'),
    path('get_rol/', login_required(getRol.as_view()), name='get_rol'),
    path('eliminar_rol/', login_required(eliminarRol.as_view()), name='eliminar_rol'),
    path('get_roles/', getAllRoles, name='get_roles'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioRol/', login_required(TemplateView.as_view(template_name='seguridad/rol/lista_rol.html')),
         name='inicio_rol'),
]
