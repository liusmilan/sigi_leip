import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import estado_civil


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoEstadosCiviles(ListView):
    model = estado_civil

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_estados = []
            for e in self.get_queryset():
                data = {}
                data['id'] = e.id
                data['nombre'] = e.nombre
                data['estado'] = e.estado
                lista_estados.append(data)
            return HttpResponse(json.dumps(lista_estados), 'application/json')
        else:
            return redirect('estado_civil:inicio_estado_civil')


class agregarEditarEstadoCivil(CreateView):
    model = estado_civil

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
                e = estado_civil.objects.get(id=id)
                e.nombre = nombre
                e.estado = habilitado
                e.save()
                mensaje = 'Se ha editado correctamente el Estado Civil.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': e.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except estado_civil.DoesNotExist:
                mensaje = 'Este Estado Civil no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                estado_civil.objects.get(nombre=nombre)
                mensaje = 'Este Estado Civil ya existe. Por favor agregue otra.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except estado_civil.DoesNotExist:
                obj = estado_civil.objects.create(
                    nombre=nombre, estado=habilitado)
                mensaje = 'Se ha agregado correctamente el Estado Civil.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getEstadoCivil(TemplateView):
    model = estado_civil

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            e = estado_civil.objects.get(id=id)
            nombre = e.nombre
            estado = e.estado
            result = JsonResponse(
                {'nombre': nombre, 'estado': estado})
            return result
        except estado_civil.DoesNotExist:
            mensaje = 'Este Estado Civil no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarEstadoCivil(DeleteView):
    model = estado_civil

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            estado_civil.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Estado Civil seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except estado_civil.DoesNotExist:
            mensaje = 'Este Estado Civil no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllEstadosCiviles(request):
    estados_civiles = estado_civil.objects.all()

    if len(estados_civiles) > 0:
        lista_estados_civiles = []
        for e in estados_civiles:
            data = {}
            data['id'] = e.id
            data['nombre'] = e.nombre
            data['estado'] = e.estado
            lista_estados_civiles.append(data)
        mensaje = 'success'
        return JsonResponse({'estados_civiles': lista_estados_civiles, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
