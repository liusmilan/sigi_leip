from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoUsuarios, agregarEditarUsuario, getUsuario, eliminarUsuario

urlpatterns = [
    path('lista_usuario/', login_required(listadoUsuarios.as_view()),
         name='lista_usuario'),
    path('agregar_usuario/', login_required(agregarEditarUsuario.as_view()),
         name='agregar_usuario'),
    path('get_usuario/', login_required(getUsuario.as_view()),
         name='get_usuario'),
    path('eliminar_usuario/', login_required(eliminarUsuario.as_view()),
         name='eliminar_usuario'),

]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioUsuario/', login_required(TemplateView.as_view(template_name='seguridad/usuario/lista_usuarios.html')),
         name='inicio_usuario'),
]
