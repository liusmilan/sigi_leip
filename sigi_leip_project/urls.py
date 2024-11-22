"""
URL configuration for sigi_leip_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import path, include
from usuario_app.views import Login, logoutUsuario

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(('configuracion_app.urls', 'inicio'))),
    path('tipo_atencion/', include(('tipo_atencion_app.urls', 'tipo_atencion'))),
    path('tipo_instrumento/',
         include(('tipo_instrumento_psicologico_app.urls', 'tipo_instrumento'))),
    path('accounts/login/', Login.as_view(), name='login'),
    path('logout/', login_required(logoutUsuario), name='logout'),
    path('estado/', include(('estado_app.urls', 'estado'))),
    path('municipio/', include(('municipio_app.urls', 'municipio'))),
    path('semestre/', include(('semestre_app.urls', 'semestre'))),
    path('ingreso_familiar/',
         include(('ingreso_familiar_app.urls', 'ingreso_familiar'))),
    path('licenciatura/',
         include(('licenciatura_app.urls', 'licenciatura'))),
    path('estado_atencion/', include(('estado_atencion_app.urls', 'estado_atencion'))),
    path('institucion/', include(('institucion_app.urls', 'institucion'))),
    path('vive_con/', include(('vive_con_app.urls', 'vive_con'))),
    path('vive_en/', include(('vive_en_app.urls', 'vive_en'))),
    path('categoria_trastorno/',
         include(('categoria_trastorno_app.urls', 'categoria_trastorno'))),
    path('taller/',
         include(('taller_app.urls', 'taller'))),
    path('grupo_trastorno/',
         include(('grupo_trastorno_app.urls', 'grupo_trastorno'))),
    path('grado_academico/',
         include(('grado_academico_app.urls', 'grado_academico'))),
    path('diagnostico/', include(('diagnostico_app.urls', 'diagnostico'))),
    path('horario/', include(('horarios_app.urls', 'horario'))),
    path('persona/', include(('persona_app.urls', 'persona'))),
    path('usuario/', include(('usuario_app.urls', 'usuario'))),
    path('rol/', include(('rol_app.urls', 'rol'))),
    path('atencion_psicologica/',
         include(('atencion_psicologica_app.urls', 'atencion_psicologica'))),
    path('motivo_consulta/', include(('motivo_consulta_app.urls', 'motivo_consulta'))),
    path('asignar/', include(('asignar_app.urls', 'asignar'))),
    path('disponibilidad_horario_consulta/',
         include(('disponibilidad_horario_consulta_app.urls', 'disponibilidad_horario_consulta'))),
    path('seguimiento_atencion/',
         include(('seguimiento_atencion_app.urls', 'seguimiento_atencion'))),
    path('mst_nivel1/',
         include(('eval_psico_mst_nivel1_app.urls', 'mst_nivel1'))),
    path('mst_nivel2/',
         include(('eval_psico_mst_nivel2_app.urls', 'mst_nivel2'))),
    path('fpp/',
         include(('eval_psico_fpp_app.urls', 'fpp'))),
    path('ssi_beck/',
         include(('eval_psico_ssi_beck_app.urls', 'ssi_beck'))),
    path('auto_eva_psico/',
         include(('eval_psico_autoevaluacion_app.urls', 'auto_eva_psico'))),
    path('valoracion/',
         include(('valoracion_app.urls', 'valoracion'))),
    path('religion/',
         include(('religion_app.urls', 'religion'))),
    path('estado_civil/',
         include(('estado_civil_app.urls', 'estado_civil'))),
    path('historia_clinica/',
          include(('historia_clinica_app.urls', 'historia_clinica'))),
    path('tipo_persona_udg/',
          include(('tipo_persona_udg_app.urls', 'tipo_persona_udg'))),
]
