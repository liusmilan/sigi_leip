from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoCategoriaTrastorno, agregarEditarCategoriaTrastorno, getCategoriaTrastorno, eliminarCategoriaTrastorno, getAllCategoriasTrastorno

urlpatterns = [
    path('lista_categoria_trastorno/', login_required(listadoCategoriaTrastorno.as_view()),
         name='lista_categoria_trastorno'),
    path('agregar_categoria_trastorno/', login_required(agregarEditarCategoriaTrastorno.as_view()),
         name='agregar_categoria_trastorno'),
    path('get_categoria_trastorno/', login_required(getCategoriaTrastorno.as_view()),
         name='get_categoria_trastorno'),
    path('eliminar_categoria_trastorno/', login_required(eliminarCategoriaTrastorno.as_view()),
         name='eliminar_categoria_trastorno'),
    path('get_all_categoria_trastornos/', getAllCategoriasTrastorno,
         name='get_all_categoria_trastornos'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioCategoriaTrastorno/', login_required(TemplateView.as_view(template_name='configuracion/categoria_trastorno/lista_categoria_trastorno.html')),
         name='inicio_categoria_trastorno'),
]
