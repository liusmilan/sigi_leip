from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoAtencionesPsicologicas, agregarAtencionPsicologica, existenNomencladoresDependientes, getAtencionBySolicitante
from .views_diagnostico_dsm5 import agregarEditarDiagnosticoDSM5, getAllDiagnosticosDSM5

urlpatterns = [
    path('lista_atencion_psicologica/', login_required(listadoAtencionesPsicologicas.as_view()),
         name='lista_atencion_psicologica'),
    path('agregar_atencion_psicologica/', login_required(agregarAtencionPsicologica.as_view()),
         name='agregar_atencion_psicologica'),
    path('nom_dependientes/', existenNomencladoresDependientes,
         name='nom_dependientes'),
    path('get_atencion_by_solicitante/', login_required(getAtencionBySolicitante.as_view()),
         name='get_atencion_by_solicitante'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioAtencionPsicologica/', login_required(TemplateView.as_view(template_name='evaluacion_psicologica/lista_atencion_psicologica.html')),
         name='inicio_atencion_psicologica'),
]

# URLS de la vista diagnostico_dsm5
urlpatterns += [
    path('agregar_editar_diagnostico_dsm5/', login_required(agregarEditarDiagnosticoDSM5.as_view()),
         name='agregar_editar_diagnostico_dsm5'),
    path('get_all_diagnosticos_dsm5/', login_required(getAllDiagnosticosDSM5.as_view()),
         name='get_all_diagnosticos_dsm5'),
]
