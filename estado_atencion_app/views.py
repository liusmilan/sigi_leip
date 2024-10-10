import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import estado_atencion


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoEstadoAtencion(ListView):
    model = estado_atencion

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_estado_atencion = []
            for e in self.get_queryset():
                data = {}
                data['id'] = e.id
                data['nombre'] = e.nombre
                data['estado'] = e.estado
                lista_estado_atencion.append(data)
            return HttpResponse(json.dumps(lista_estado_atencion), 'application/json')
        else:
            return redirect('estado_atencion:inicio_estado_atencion')


class agregarEditarEstadoAtencion(CreateView):
    model = estado_atencion

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
                e = estado_atencion.objects.get(id=id)
                e.nombre = nombre
                e.estado = habilitado
                e.save()
                mensaje = 'Se ha editado correctamente el Estado de Atención.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': e.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except estado_atencion.DoesNotExist:
                mensaje = 'Este Estado de Atención no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                estado_atencion.objects.get(nombre=nombre)
                mensaje = 'Este Estado de Atención ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except estado_atencion.DoesNotExist:
                obj = estado_atencion.objects.create(
                    nombre=nombre, estado=habilitado)
                mensaje = 'Se ha agregado correctamente el Estado de Atención.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getEstadoAtencion(TemplateView):
    model = estado_atencion

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            e = estado_atencion.objects.get(id=id)
            nombre = e.nombre
            estado = e.estado
            result = JsonResponse(
                {'nombre': nombre, 'estado': estado})
            return result
        except estado_atencion.DoesNotExist:
            mensaje = 'Este Estado de Atención no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarEstadoAtencion(DeleteView):
    model = estado_atencion

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            estado_atencion.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Estado de Atención seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except estado_atencion.DoesNotExist:
            mensaje = 'Este Estado de Atención no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllEstadosAtenciones(request):
    estados = estado_atencion.objects.all()

    if len(estados) > 0:
        lista_estados = []
        for e in estados:
            data = {}
            data['id'] = e.id
            data['nombre'] = e.nombre
            data['estado'] = e.estado
            lista_estados.append(data)
        mensaje = 'success'
        return JsonResponse({'estados': lista_estados, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
