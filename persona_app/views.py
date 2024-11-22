import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from datetime import datetime
from django.utils import timezone
from .models import persona, municipio, estado
from usuario_app.models import Usuario
from tipo_persona_udg_app.models import tipo_persona_udg


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
                
                if p.tipo_persona_udg:                
                    data_tipo_persona_udg = {'id': p.tipo_persona_udg.id, "nombre": p.tipo_persona_udg.nombre}
                else:
                    data_tipo_persona_udg = None
                
                data['id'] = p.id
                data['nombre'] = p.nombre
                data['segundo_nombre'] = p.segundo_nombre
                data['apellido'] = p.apellido
                data['segundo_apellido'] = p.segundo_apellido
                data['email'] = p.email
                data['sexo'] = p.sexo
                data['genero'] = p.genero
                data['fecha_nacimiento'] = fecha_nacimiento
                data['telefono'] = p.telefono
                data['direccion'] = p.direccion
                data['nombre_emergencia'] = p.nombre_emergencia
                data['parentesco'] = p.parentesco
                data['telefono_emergencia'] = p.telefono_emergencia
                data['nombre_responsable'] = p.nombre_responsable
                data['codigo_udg'] = p.codigo_udg
                data['estado'] = data_estado
                data['municipio'] = data_municipio
                data['activo'] = p.activo
                data['tipo_persona'] = p.tipo_persona
                data['tipo_persona_udg'] = data_tipo_persona_udg
                data['codigo_udg'] = p.codigo_udg
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
        genero = request.GET.get('genero', '')
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
        id_tipo_persona_udg = request.GET.get('id_tipo_persona_udg', '')
        tipo_persona_udg_obj = tipo_persona_udg.objects.get(id=id_tipo_persona_udg) if id_tipo_persona_udg != 'sel' and id_tipo_persona_udg != '-' else None
        tipo_persona = request.GET.get('tipo_persona', '')
        codigo_udg = request.GET.get('codigo_udg', '')        

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
                p.genero = genero
                p.fecha_nacimiento = fecha_nacimiento
                p.telefono = telefono
                p.direccion = direccion
                p.nombre_emergencia = nombre_emergencia
                p.parentesco = parentesco
                p.telefono_emergencia = telefono_emergencia
                p.nombre_responsable = nombre_responsable
                p.estado = estado_obj
                p.municipio = municipio_obj
                p.tipo_persona_udg = tipo_persona_udg_obj
                p.tipo_persona = tipo_persona
                p.codigo_udg = codigo_udg
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
                    genero=genero,
                    fecha_nacimiento=fecha_nacimiento,
                    telefono=telefono,
                    direccion=direccion,
                    nombre_emergencia=nombre_emergencia,
                    parentesco=parentesco,
                    telefono_emergencia=telefono_emergencia,
                    nombre_responsable=nombre_responsable,
                    estado=estado_obj,
                    municipio=municipio_obj,
                    tipo_persona=tipo_persona,
                    tipo_persona_udg=tipo_persona_udg_obj,
                    codigo_udg=codigo_udg
                    # ,activo=p_act
                )
                mensaje = 'Se ha agregado correctamente la Persona.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'id': obj.id, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
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
            
            if p.tipo_persona_udg:
                data_tipo_persona_udg = {'id': p.tipo_persona_udg.id, 'nombre': p.tipo_persona_udg.nombre}
            else:
                data_tipo_persona_udg = None
            
            fecha_nacimiento = datetime.strftime(
                p.fecha_nacimiento, '%d/%m/%Y')
            data['nombre'] = p.nombre
            data['segundo_nombre'] = p.segundo_nombre
            data['apellido'] = p.apellido
            data['segundo_apellido'] = p.segundo_apellido
            data['email'] = p.email
            data['sexo'] = p.sexo
            data['genero'] = p.genero
            data['fecha_nacimiento'] = fecha_nacimiento
            data['telefono'] = p.telefono
            data['direccion'] = p.direccion
            data['nombre_emergencia'] = p.nombre_emergencia
            data['parentesco'] = p.parentesco
            data['telefono_emergencia'] = p.telefono_emergencia
            data['nombre_responsable'] = p.nombre_responsable
            data['codigo_udg'] = p.codigo_udg
            data['estado'] = data_estado
            data['municipio'] = data_municipio
            data['activo'] = p.activo
            data['tipo_persona_udg'] = data_tipo_persona_udg
            data['tipo_persona'] = p.tipo_persona
            data['codigo_udg'] = p.codigo_udg
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
        mensaje = ''
        tipo_mensaje = ''

        try:
            p = persona.objects.get(id=id)
        except persona.DoesNotExist:
            p = None
        
        if p is not None:
            try:
                usuario = Usuario.objects.get(persona=p)
            except Usuario.DoesNotExist:
                usuario = None
            
            if usuario is not None:
                usuario.usuario_activo = False
                usuario.save()
                p.activo = False
                p.save()
                mensaje = 'La Persona seleccionada y el Usuario que tiene asociado, ya no se encuentran activos en el sistema.'
                tipo_mensaje = 'success_disabled'
                result = JsonResponse({'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            else:
                p.delete()
                mensaje = 'Se ha eliminado la Persona seleccionada.'
                tipo_mensaje = 'success_deleted'
                result = JsonResponse({'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
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
                data['has_user'] = True
            except Usuario.DoesNotExist:
                data['roles'] = None
                data['has_user'] = False

            data_estado = {'id': p.estado.id,
                           'nombre': p.estado.nombre}
            data_municipio = {'id': p.municipio.id,
                              'nombre': p.municipio.nombre}
            
            if p.tipo_persona_udg:
                data_tipo_persona_udg = {'id': p.tipo_persona_udg.id, 'nombre': p.tipo_persona_udg.nombre}
            else:
                data_tipo_persona_udg = None
            
            fecha_nacimiento = datetime.strftime(
                p.fecha_nacimiento, '%d/%m/%Y')
            data['id'] = p.id
            data['nombre'] = p.nombre
            data['segundo_nombre'] = p.segundo_nombre
            data['apellido'] = p.apellido
            data['segundo_apellido'] = p.segundo_apellido
            data['email'] = p.email
            data['sexo'] = p.sexo
            data['genero'] = p.genero
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
            data['tipo_persona_udg'] = data_tipo_persona_udg
            data['tipo_persona'] = p.tipo_persona
            data['codigo_udg'] = p.codigo_udg
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


def existePersona(request):
    nombre = request.GET.get('nombre', '')
    segundo_nombre = request.GET.get('segundo_nombre', '')
    apellido = request.GET.get('apellido', '')
    segundo_apellido = request.GET.get('segundo_apellido', '')
    
    try:
        per = persona.objects.get(nombre=nombre, segundo_nombre=segundo_nombre, apellido=apellido, segundo_apellido=segundo_apellido)
        mensaje = 'Ya existe una Persona registrada con este nombre y apellidos. Por favor agregue otra.'
        tipo_mensaje = 'error'
        result = JsonResponse({'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
        return result
    except persona.DoesNotExist:
        tipo_mensaje = 'success'
        result = JsonResponse({'mensaje': '', 'tipo_mensaje': tipo_mensaje})
        return result


def agregarPersonaSinAutenticacion(request):
    fecha_nacimiento_1 = request.GET.get('fecha_nacimiento', '')
    nombre = request.GET.get('nombre', '')
    segundo_nombre = request.GET.get('segundo_nombre', '')
    apellido = request.GET.get('apellido', '')
    segundo_apellido = request.GET.get('segundo_apellido', '')
    email = request.GET.get('email', '')
    sexo = request.GET.get('sexo', '')
    genero = request.GET.get('genero', '')
    fecha_nacimiento = datetime.strptime(fecha_nacimiento_1, '%d/%m/%Y')
    fecha_nacimiento2 = timezone.make_aware(fecha_nacimiento)
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
    id_tipo_persona_udg = request.GET.get('id_tipo_persona_udg', '')
    tipo_persona_udg_obj = tipo_persona_udg.objects.get(id=id_tipo_persona_udg) if id_tipo_persona_udg != 'sel' and id_tipo_persona_udg != '-' else None
    codigo_udg = request.GET.get('codigo_udg', '')
    tipo_persona = request.GET.get('tipo_persona', '')
    
    obj = persona.objects.create(
        nombre=nombre,
        segundo_nombre=segundo_nombre,
        apellido=apellido,
        segundo_apellido=segundo_apellido,
        email=email,
        sexo=sexo,
        genero=genero,
        fecha_nacimiento=fecha_nacimiento2,
        telefono=telefono,
        direccion=direccion,
        nombre_emergencia=nombre_emergencia,
        parentesco=parentesco,
        telefono_emergencia=telefono_emergencia,
        nombre_responsable=nombre_responsable,
        estado=estado_obj,
        municipio=municipio_obj,
        tipo_persona_udg=tipo_persona_udg_obj,
        codigo_udg=codigo_udg,
        tipo_persona=tipo_persona,
        activo=True
    )
    
    tipo_mensaje = 'success'
    result = JsonResponse({'id': obj.id, 'tipo_mensaje': tipo_mensaje})
    return result