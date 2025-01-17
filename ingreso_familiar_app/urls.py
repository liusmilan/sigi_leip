from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import ListadoIngresosFailiares, agregarEditarIngresoFamiliar, getIngresoFamiliar, eliminarIngresoFamiliar, getAllIngresosFamiliares

urlpatterns = [
    path('lista_ingreso_familiar/', login_required(ListadoIngresosFailiares.as_view()),
         name='lista_ingreso_familiar'),
    path('agregar_ingreso_familiar/', login_required(agregarEditarIngresoFamiliar.as_view()),
         name='agregar_ingreso_familiar'),
    path('get_ingreso_familiar/', login_required(getIngresoFamiliar.as_view()),
         name='get_ingreso_familiar'),
    path('eliminar_ingreso_familiar/', login_required(eliminarIngresoFamiliar.as_view()),
         name='eliminar_ingreso_familiar'),
    path('get_all_ingreso_familiar/', getAllIngresosFamiliares,
         name='get_all_ingreso_familiar'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioIngresoFamiliar/', login_required(TemplateView.as_view(template_name='configuracion/ingreso_familiar/lista_ingreso_familiar.html')),
         name='inicio_ingreso_familiar'),
]
