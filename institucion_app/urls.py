from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoInstituciones, agregarEditarInstitucion, getInstitucion, eliminarInstitucion, getAllInstituciones

urlpatterns = [
    path('lista_institucion/', login_required(listadoInstituciones.as_view()),
         name='lista_institucion'),
    path('agregar_institucion/', login_required(agregarEditarInstitucion.as_view()),
         name='agregar_institucion'),
    path('get_institucion/', login_required(getInstitucion.as_view()),
         name='get_institucion'),
    path('eliminar_institucion/', login_required(eliminarInstitucion.as_view()),
         name='eliminar_institucion'),
    path('get_all_instituciones/', getAllInstituciones,
         name='get_all_instituciones'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioInstitucion/', login_required(TemplateView.as_view(template_name='configuracion/institucion/lista_institucion.html')),
         name='inicio_institucion'),
]
