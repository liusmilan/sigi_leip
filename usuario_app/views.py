import json
from typing import Any
from django import http
from django.contrib import messages
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.core import serializers
from django.views.generic import FormView
from django.contrib.auth import login, logout
from django.http import HttpResponse, JsonResponse
from django.http import HttpResponseRedirect
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .forms import formularioLogin
from .models import Usuario, UsuarioRol, persona, rol


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class Login(FormView):
    template_name = 'seguridad/login/login.html'
    form_class = formularioLogin
    success_url = reverse_lazy('inicio:dashboard')

    @method_decorator(csrf_protect)
    @method_decorator(never_cache)
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return HttpResponseRedirect(self.get_success_url())
        else:
            return super(Login, self).dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        login(self.request, form.get_user())
        return super(Login, self).form_valid(form)
    
    def form_invalid(self, form):
        messages.error(self.request, "Usuario o contraseña incorrectos.")
        return super(Login, self).form_invalid(form)


def logoutUsuario(request):
    logout(request)
    return HttpResponseRedirect('/accounts/login/')


class listadoUsuarios(ListView):
    model = Usuario

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_usuarios = []
            for u in self.get_queryset():
                data = {}
                data_persona = {'id': u.persona.id,
                                'nombre': u.persona.nombre,
                                'segundo_nombre': u.persona.segundo_nombre,
                                'apellido': u.persona.apellido,
                                'segundo_apellido': u.persona.segundo_apellido}
                data['id'] = u.id
                data['nombre'] = u.username
                data['trabajador_ley'] = u.trabajador_ley
                data['persona'] = data_persona
                data['usuario_activo'] = u.usuario_activo
                data['usuario_administrador'] = u.usuario_administrador
                # data['roles'] = devolverRolesDelUsuario(user.id)
                data['roles'] = serializers.serialize(
                    'json', u.rol.all())
                lista_usuarios.append(data)
            return HttpResponse(json.dumps(lista_usuarios), 'application/json')
        else:
            return redirect('usuario:inicio_usuario')


class agregarEditarUsuario(CreateView):
    model = Usuario

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')
        nombre_usuario = request.GET.get('usuario', '')
        id_persona = request.GET.get('persona', '')
        persona_obj = persona.objects.get(id=id_persona)
        contrasenna = request.GET.get('contrasenna', '')
        roles_usuario = []

        for r in request.GET.getlist('roles[]'):
            roles_usuario.append(rol.objects.get(id=int(r)))

        if request.GET.get('trabajador_ley', '') == 'true':
            trabajador_ley = True
        else:
            trabajador_ley = False

        if request.GET.get('usuario_habilitado', '') == 'true':
            usuario_activo = True
        else:
            usuario_activo = False


        if id != '':
            # se esta editando
            try:
                u = Usuario.objects.get(id=id)
                u.username = nombre_usuario
                u.trabajador_ley = trabajador_ley
                u.persona = persona_obj
                u.usuario_activo = usuario_activo
                # u.set_password(contrasenna)
                u.save()

                # guardar los roles
                for ur in UsuarioRol.objects.filter(usuario=u):
                    ur.delete()

                for r1 in roles_usuario:
                    UsuarioRol.objects.create(
                        rol=r1,
                        usuario=u
                    )
                
                # editando la persona asociada
                persona_obj.activo = usuario_activo
                persona_obj.save()

                mensaje = 'Se ha editado correctamente el Usuario.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': u.username, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except Usuario.DoesNotExist:
                mensaje = 'Este Usuario no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            u = Usuario.objects.filter(username=nombre_usuario)

            if u:
                mensaje = 'Ya existe un Usuario registrado con este nombre. Por favor agregue otra.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            else:
                obj = Usuario(username=nombre_usuario, persona=persona_obj, trabajador_ley=trabajador_ley, usuario_activo=usuario_activo)
                obj.set_password(contrasenna)
                obj.save()

                # guardar los roles
                for r2 in roles_usuario:
                    UsuarioRol.objects.create(rol=r2, usuario=obj)

                mensaje = 'Se ha agregado correctamente el Usuario.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.username, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getUsuario(TemplateView):
    model = Usuario

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            u = Usuario.objects.get(id=id)
            data = {}
            data_persona = {'id': u.persona.id,
                            'nombre': u.persona.nombre,
                            'segundo_nombre': u.persona.segundo_nombre,
                            'apellido': u.persona.apellido,
                            'segundo_apellido': u.persona.segundo_apellido}
            data['id'] = u.id
            data['nombre_usuario'] = u.username
            data['trabajador_ley'] = u.trabajador_ley
            data['persona'] = data_persona
            data['usuario_activo'] = u.usuario_activo
            data['usuario_administrador'] = u.usuario_administrador
            data['roles'] = serializers.serialize(
                'json', u.rol.all())
            result = JsonResponse(data)
            return result
        except Usuario.DoesNotExist:
            mensaje = 'Este Usuario no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarUsuario(DeleteView):
    model = Usuario

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            Usuario.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Usuario seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except Usuario.DoesNotExist:
            mensaje = 'Este Usuario no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def existeUsuario(request):
    nombre_usuario = request.GET.get('usuario', '')
    
    try:
        user = Usuario.objects.get(username=nombre_usuario)
        mensaje = 'Ya existe un Usuario registrado con este nombre. Por favor agregue otro.'
        tipo_mensaje = 'error'
        result = JsonResponse({'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
        return result
    except Usuario.DoesNotExist:
        tipo_mensaje = 'success'
        result = JsonResponse({'mensaje': '', 'tipo_mensaje': tipo_mensaje})
        return result


def cambiarContrasenna(request):
    id_user_aut = request.GET.get('id_user_aut', '')
    contrasenna = request.GET.get('contrasenna', '')
    
    try:
        u = Usuario.objects.get(id=id_user_aut)
        u.set_password(contrasenna)
        u.save()

        mensaje = "Se ha cambiado correctamente la contraseña."
        tipo_mensaje = 'success'
        result = JsonResponse({'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
        return result
    except Usuario.DoesNotExist:
        mensaje = 'Este Usuario no se encuentra registrado en la Base de Datos.'
        tipo_mensaje = 'error'
        result = JsonResponse({'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
        return result
    

def crear_cuenta(request):
    return render(request,'seguridad/usuario/crear_cuenta.html')


def agregarUsuarioSinAutenticacion(request):
    nombre_usuario = request.GET.get('usuario', '')
    id_persona = request.GET.get('persona', '')
    persona_obj = persona.objects.get(id=id_persona)
    contrasenna = request.GET.get('contrasenna', '')
    rol_user = rol.objects.get(nombre='SOLICITANTE')
    
    if request.GET.get('trabajador_ley', '') == 'true':
        trabajador_ley = True
    else:
        trabajador_ley = False

    print(persona_obj);
        
    obj = Usuario(username=nombre_usuario, persona=persona_obj, trabajador_ley=trabajador_ley, usuario_activo=True)
    obj.set_password(contrasenna)
    obj.save()
    
    UsuarioRol.objects.create(rol=rol_user, usuario=obj)
    
    tipo_mensaje = 'success'
    result = JsonResponse({'tipo_mensaje': tipo_mensaje})
    return result

# metodo que busca si un usuario tiene un solo rol
def existeRol(id_user, nombre_rol):
    existe = False
    usuario1 = Usuario.objects.get(id=id_user)
    roles_usuario = UsuarioRol.objects.filter(usuario=usuario1)
    roles_solicitante = roles_usuario.filter(rol__nombre=nombre_rol).distinct()

    if len(roles_solicitante) > 0:
        existe = True
    else:
        existe = False
    
    return {'existe': existe, 'cant': len(roles_usuario)}