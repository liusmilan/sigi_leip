from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import agregarEditarDiagnostico, listadoDiagnosticos, eliminarDiagnostico, getDiagnostico, getAllDiagnosticos, getDiagnosticosByCategoria

urlpatterns = [
    path('lista_diagnostico/', login_required(listadoDiagnosticos.as_view()),
         name='lista_diagnostico'),
    path('agregar_diagnostico/', login_required(agregarEditarDiagnostico.as_view()),
         name='agregar_diagnostico'),
    path('get_diagnostico/', login_required(getDiagnostico.as_view()),
         name='get_diagnostico'),
    path('eliminar_diagnostico/', login_required(eliminarDiagnostico.as_view()),
         name='eliminar_diagnostico'),
    path('get_all_diagnosticos/', getAllDiagnosticos,
         name='get_all_diagnosticos'),
    path('get_diagnosticos_by_categoria/', login_required(getDiagnosticosByCategoria.as_view()),
         name='get_diagnosticos_by_categoria'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioDiagnostico/', login_required(TemplateView.as_view(template_name='configuracion/diagnostico/lista_diagnostico.html')),
         name='inicio_diagnostico'),
]
