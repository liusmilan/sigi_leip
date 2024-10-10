from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoSemestres, agregarEditarSemestre, getSemestre, eliminarSemestre, getAllSemestres

urlpatterns = [
    path('lista_semestre/', login_required(listadoSemestres.as_view()),
         name='lista_semestre'),
    path('agregar_semestre/', login_required(agregarEditarSemestre.as_view()),
         name='agregar_semestre'),
    path('get_semestre/', login_required(getSemestre.as_view()),
         name='get_semestre'),
    path('eliminar_semestre/', login_required(eliminarSemestre.as_view()),
         name='eliminar_semestre'),
    path('get_all_semestre/', getAllSemestres,
         name='get_all_semestre'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioSemestre/', login_required(TemplateView.as_view(template_name='configuracion/semestre/lista_semestre.html')),
         name='inicio_semestre'),
]
