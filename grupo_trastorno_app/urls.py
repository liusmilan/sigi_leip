from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import agregarEditarGrupoTrastorno, listadoGruposTrastorno, eliminarGrupoTrastorno, getAllGruposTrastorno, getGrupoTrastorno, getGruposByCategoria

urlpatterns = [
    path('lista_grupo_trastorno/', login_required(listadoGruposTrastorno.as_view()),
         name='lista_grupo_trastorno'),
    path('agregar_grupo_trastorno/', login_required(agregarEditarGrupoTrastorno.as_view()),
         name='agregar_grupo_trastorno'),
    path('get_grupo_trastorno/', login_required(getGrupoTrastorno.as_view()),
         name='get_grupo_trastorno'),
    path('eliminar_grupo_trastorno/', login_required(eliminarGrupoTrastorno.as_view()),
         name='eliminar_grupo_trastorno'),
    path('get_all_grupo_trastornos/', getAllGruposTrastorno,
         name='get_all_grupo_trastornos'),
    path('get_grupos_by_categoria/', getGruposByCategoria.as_view(),
         name='get_grupos_by_categoria'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioGrupoTrastornos/', login_required(TemplateView.as_view(template_name='configuracion/grupo_trastorno/lista_grupo_trastorno.html')),
         name='inicio_grupo_trastorno'),
]
