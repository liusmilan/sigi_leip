from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import listadoUsuarios, agregarEditarUsuario, getUsuario, eliminarUsuario, cambiarContrasenna, crear_cuenta, existeUsuario, agregarUsuarioSinAutenticacion

urlpatterns = [
    path('lista_usuario/', login_required(listadoUsuarios.as_view()),
         name='lista_usuario'),
    path('agregar_usuario/', login_required(agregarEditarUsuario.as_view()),
         name='agregar_usuario'),
    path('get_usuario/', login_required(getUsuario.as_view()),
         name='get_usuario'),
    path('eliminar_usuario/', login_required(eliminarUsuario.as_view()),
         name='eliminar_usuario'),
    path('cambiar_contrasenna/', login_required(cambiarContrasenna),
         name='cambiar_contrasenna'),
    path('cambiar_contrasenna/', login_required(cambiarContrasenna),
         name='cambiar_contrasenna'),
    path('crear_cuenta/', crear_cuenta,
         name='crear_cuenta'),
    path('existe_usuario/', existeUsuario,
         name='existe_usuario'),
    path('agregar_usuario_no_autenticacion/', agregarUsuarioSinAutenticacion,
         name='agregar_usuario_no_autenticacion'),
]

# URLS de vistas implicitas
urlpatterns += [
    path('InicioUsuario/', login_required(TemplateView.as_view(template_name='seguridad/usuario/lista_usuarios.html')),
         name='inicio_usuario'),
]
