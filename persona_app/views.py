import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from datetime import datetime
from .models import persona, municipio, estado
from usuario_app.models import Usuario


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoPersonas(ListView):
    model = persona

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_personas = []
            for p in self.get_queryset():
                data = {}
                data_estado = {'id': p.estado.id,
                               'nombre': p.estado.nombre}
                data_municipio = {'id': p.municipio.id,
                                  'nombre': p.municipio.nombre}
                fecha_nacimiento = datetime.strftime(
                    p.fecha_nacimiento, '%d/%m/%Y')
                data['id'] = p.id
                data['nombre'] = p.nombre
                data['segundo_nombre'] = p.segundo_nombre
                data['apellido'] = p.apellido
                data['segundo_apellido'] = p.segundo_apellido
                data['email'] = p.email
                data['sexo'] = p.sexo
                data['fecha_nacimiento'] = fecha_nacimiento
                data['telefono'] = p.telefono
                data['direccion'] = p.direccion
                data['nombre_emergencia'] = p.nombre_emergencia
                data['parentesco'] = p.parentesco
                data['telefono_emergencia'] = p.telefono_emergencia
                data['nombre_responsable'] = p.nombre_responsable
                data['tipo_persona_udg'] = p.tipo_persona_udg
                data['codigo_udg'] = p.codigo_udg
                data['estado'] = data_estado
                data['municipio'] = data_municipio
                data['activo'] = p.activo
                lista_personas.append(data)
            return HttpResponse(json.dumps(lista_personas), 'application/json')
        else:
            return redirect('persona:inicio_persona')


class agregarEditarPersona(CreateView):
    model = persona

    def get(self, request, *args, **kwargs):
        fecha_nacimiento_1 = request.GET.get('fecha_nacimiento', '')
        id = request.GET.get('id', '')
        nombre = request.GET.get('nombre', '')
        segundo_nombre = request.GET.get('segundo_nombre', '')
        apellido = request.GET.get('apellido', '')
        segundo_apellido = request.GET.get('segundo_apellido', '')
        email = request.GET.get('email', '')
        sexo = request.GET.get('sexo', '')
        fecha_nacimiento = datetime.strptime(fecha_nacimiento_1, '%d/%m/%Y')
        telefono = request.GET.get('telefono', '')
        direccion = request.GET.get('direccion', '')
        nombre_emergencia = request.GET.get('nombre_emergencia', '')
        parentesco = request.GET.get('parentesco', '')
        telefono_emergencia = request.GET.get('telefono_emergencia', '')
        nombre_responsable = request.GET.get('nombre_responsable', '')
        id_estado = request.GET.get('id_estado', '')
        estado_obj = estado.objects.get(id=id_estado)
        id_municipio = request.GET.get('id_municipio', '')
        municipio_obj = municipio.objects.get(id=id_municipio)
        # activo = request.GET.get('activo', '')
        # p_act = False

        # if activo == 'activo':
        #     p_act = True
        # else:
        #     p_act = False

        if id != '':
            # se esta editando
            try:
                p = persona.objects.get(id=id)
                p.nombre = nombre
                p.segundo_nombre = segundo_nombre
                p.apellido = apellido
                p.segundo_apellido = segundo_apellido
                p.email = email
                p.sexo = sexo
                p.fecha_nacimiento = fecha_nacimiento
                p.telefono = telefono
                p.direccion = direccion
                p.nombre_emergencia = nombre_emergencia
                p.parentesco = parentesco
                p.telefono_emergencia = telefono_emergencia
                p.nombre_responsable = nombre_responsable
                p.estado = estado_obj
                p.municipio = municipio_obj
                # p.activo = p_act
                p.save()
                mensaje = 'Se ha editado correctamente la Persona.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': p.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except persona.DoesNotExist:
                mensaje = 'Esta Persona no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            per = persona.objects.filter(nombre=nombre, segundo_nombre=segundo_nombre,
                                         apellido=apellido, segundo_apellido=segundo_apellido)

            if per:
                mensaje = 'Ya existe una Persona registrada con este nombre y apellidos. Por favor agregue otra.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            else:
                obj = persona.objects.create(
                    nombre=nombre,
                    segundo_nombre=segundo_nombre,
                    apellido=apellido,
                    segundo_apellido=segundo_apellido,
                    email=email,
                    sexo=sexo,
                    fecha_nacimiento=fecha_nacimiento,
                    telefono=telefono,
                    direccion=direccion,
                    nombre_emergencia=nombre_emergencia,
                    parentesco=parentesco,
                    telefono_emergencia=telefono_emergencia,
                    nombre_responsable=nombre_responsable,
                    estado=estado_obj,
                    municipio=municipio_obj
                    # ,activo=p_act
                )
                mensaje = 'Se ha agregado correctamente la Persona.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getPersona(TemplateView):
    model = persona

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            p = persona.objects.get(id=id)
            data = {}
            data_estado = {'id': p.estado.id,
                           'nombre': p.estado.nombre}
            data_municipio = {'id': p.municipio.id,
                              'nombre': p.municipio.nombre}
            fecha_nacimiento = datetime.strftime(
                p.fecha_nacimiento, '%d/%m/%Y')
            data['nombre'] = p.nombre
            data['segundo_nombre'] = p.segundo_nombre
            data['apellido'] = p.apellido
            data['segundo_apellido'] = p.segundo_apellido
            data['email'] = p.email
            data['sexo'] = p.sexo
            data['fecha_nacimiento'] = fecha_nacimiento
            data['telefono'] = p.telefono
            data['direccion'] = p.direccion
            data['nombre_emergencia'] = p.nombre_emergencia
            data['parentesco'] = p.parentesco
            data['telefono_emergencia'] = p.telefono_emergencia
            data['nombre_responsable'] = p.nombre_responsable
            data['tipo_persona_udg'] = p.tipo_persona_udg
            data['codigo_udg'] = p.codigo_udg
            data['estado'] = data_estado
            data['municipio'] = data_municipio
            data['activo'] = p.activo
            result = JsonResponse(data)
            return result
        except municipio.DoesNotExist:
            mensaje = 'Esta Persona no se encuentra registrada en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarPersona(DeleteView):
    model = persona

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            p = persona.objects.get(id=id)

            if Usuario.objects.filter(persona=p, usuario_activo=True).exists():
                mensaje = 'Esta Persona no se puede eliminar debido a que tiene un Usuario asociado activo.'
                tipo_mensaje = 'error_user_asociado'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            else:
                p.activo = False
                p.save()
                mensaje = 'Se ha inhabilitado la Persona seleccionada correctamente.'
                tipo_mensaje = 'success'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        except persona.DoesNotExist:
            mensaje = 'Esta Persona no se encuentra registrada en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllPersonas(request):
    personas = persona.objects.all()

    if len(personas) > 0:
        lista_personas = []
        for p in personas:
            data = {}
            try:
                rol = Usuario.objects.get(persona=p).rol.all()
                data['roles'] = serializers.serialize('json', rol)
            except Usuario.DoesNotExist:
                data['roles'] = None

            data_estado = {'id': p.estado.id,
                           'nombre': p.estado.nombre}
            data_municipio = {'id': p.municipio.id,
                              'nombre': p.municipio.nombre}
            fecha_nacimiento = datetime.strftime(
                p.fecha_nacimiento, '%d/%m/%Y')
            data['id'] = p.id
            data['nombre'] = p.nombre
            data['segundo_nombre'] = p.segundo_nombre
            data['apellido'] = p.apellido
            data['segundo_apellido'] = p.segundo_apellido
            data['email'] = p.email
            data['sexo'] = p.sexo
            data['fecha_nacimiento'] = fecha_nacimiento
            data['telefono'] = p.telefono
            data['direccion'] = p.direccion
            data['nombre_emergencia'] = p.nombre_emergencia
            data['parentesco'] = p.parentesco
            data['telefono_emergencia'] = p.telefono_emergencia
            data['nombre_responsable'] = p.nombre_responsable
            data['tipo_persona_udg'] = p.tipo_persona_udg
            data['codigo_udg'] = p.codigo_udg
            data['estado'] = data_estado
            data['municipio'] = data_municipio
            data['activo'] = p.activo
            lista_personas.append(data)
        mensaje = 'success'
        return JsonResponse({'personas': lista_personas, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})


# metodo que se utiliza en HC
def editarPersona(personaDic):
    p = persona.objects.get(id=personaDic['id'])
    p.email = personaDic['email']
    p.sexo = personaDic['sexo']
    p.fecha_nacimiento = personaDic['fecha_nacimiento']
    p.telefono = personaDic['telefono']
    p.direccion = personaDic['direccion']
    p.parentesco = personaDic['parentesco']
    p.estado = estado.objects.get(id=personaDic['estado'])
    p.municipio = municipio.objects.get(id=personaDic['municipio'])
    p.save()