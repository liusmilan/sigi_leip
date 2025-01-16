import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import tipo_persona_udg


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoTipoPersonaUdg(ListView):
    model = tipo_persona_udg

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_tipo_persona_udg = []
            for e in self.get_queryset():
                data = {}
                data['id'] = e.id
                data['nombre'] = e.nombre
                data['estado'] = e.estado
                lista_tipo_persona_udg.append(data)
            return HttpResponse(json.dumps(lista_tipo_persona_udg), 'application/json')
        else:
            return redirect('tipo_persona_udg:inicio_tipo_persona_udg')


class agregarTipoPersonaUdg(CreateView):
    model = tipo_persona_udg

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')
        nombre = request.GET.get('nombre', '')
        estado = request.GET.get('estado', '')
        habilitado = ''

        if estado == 'true':
            habilitado = 'HABILITADO'
        else:
            habilitado = 'DESABILITADO'

        if id != '':
            # se esta editando
            try:
                tp = tipo_persona_udg.objects.get(id=id)
                tp.nombre = nombre
                tp.estado = habilitado
                tp.save()
                mensaje = 'Se ha editado correctamente el Tipo de Persona.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': tp.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except tipo_persona_udg.DoesNotExist:
                mensaje = 'Este Tipo de Persona no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                tipo_persona_udg.objects.get(nombre=nombre)
                mensaje = 'Este Tipo de Persona ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except tipo_persona_udg.DoesNotExist:
                obj = tipo_persona_udg.objects.create(nombre=nombre, estado=habilitado)
                mensaje = 'Se ha agregado correctamente el Tipo de Persona.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getTipoPersonaUdg(TemplateView):
    model = tipo_persona_udg

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            tp = tipo_persona_udg.objects.get(id=id)
            nombre = tp.nombre
            estado = tp.estado
            result = JsonResponse(
                {'nombre': nombre, 'estado': estado})
            return result
        except tipo_persona_udg.DoesNotExist:
            mensaje = 'Este Tipo de Persona no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarTipoPersonaUdg(DeleteView):
    model = tipo_persona_udg

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            tipo_persona_udg.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Tipo de Persona seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except tipo_persona_udg.DoesNotExist:
            mensaje = 'Este Tipo de Persona no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllTipoPersonaUdg(request):
    tipos_personas = tipo_persona_udg.objects.all()

    if len(tipos_personas) > 0:
        lista_tipos_personas = []
        for tp in tipos_personas:
            data = {}
            data['id'] = tp.id
            data['nombre'] = tp.nombre
            data['estado'] = tp.estado
            lista_tipos_personas.append(data)
        mensaje = 'success'
        return JsonResponse({'tipos_personas': lista_tipos_personas, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})