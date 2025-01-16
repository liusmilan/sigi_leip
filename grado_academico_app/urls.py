from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoGradoAcademico, agregarEditarGradoAcademico, getGradoAcademico, eliminarGradoAcademico, getAllGradosAcademicos

urlpatterns = [
    path('lista_grado_academico/', login_required(listadoGradoAcademico.as_view()),
         name='lista_grado_academico'),
    path('agregar_grado_academico/', login_required(agregarEditarGradoAcademico.as_view()),
         name='agregar_grado_academico'),
    path('get_grado_academico/', login_required(getGradoAcademico.as_view()),
         name='get_grado_academico'),
    path('eliminar_grado_academico/', login_required(eliminarGradoAcademico.as_view()),
         name='eliminar_grado_academico'),
    path('get_all_grado_academico/', getAllGradosAcademicos,
         name='get_all_grado_academico'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioGradoAcademico/', login_required(TemplateView.as_view(template_name='configuracion/grado_academico/lista_grado_academico.html')),
         name='inicio_grado_academico'),
]
