import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import religion


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoReligiones(ListView):
    model = religion

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_religiones = []
            for r in self.get_queryset():
                data = {}
                data['id'] = r.id
                data['nombre'] = r.nombre
                data['estado'] = r.estado
                lista_religiones.append(data)
            return HttpResponse(json.dumps(lista_religiones), 'application/json')
        else:
            return redirect('religion:inicio_religion')


class agregarEditarReligion(CreateView):
    model = religion

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
                r = religion.objects.get(id=id)
                r.nombre = nombre
                r.estado = habilitado
                r.save()
                mensaje = 'Se ha editado correctamente la Religión.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': r.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except religion.DoesNotExist:
                mensaje = 'Esta Religión no se encuentra registrada en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                religion.objects.get(nombre=nombre)
                mensaje = 'Esta Religión ya existe. Por favor agregue otra.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except religion.DoesNotExist:
                obj = religion.objects.create(
                    nombre=nombre, estado=habilitado)
                mensaje = 'Se ha agregado correctamente la Religión.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getReligion(TemplateView):
    model = religion

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            r = religion.objects.get(id=id)
            nombre = r.nombre
            estado = r.estado
            result = JsonResponse(
                {'nombre': nombre, 'estado': estado})
            return result
        except religion.DoesNotExist:
            mensaje = 'Esta Religión no se encuentra registrada en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarReligión(DeleteView):
    model = religion

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            religion.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado la Religión seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except religion.DoesNotExist:
            mensaje = 'Esta Religión no se encuentra registrada en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllReligiones(request):
    religiones = religion.objects.all()

    if len(religiones) > 0:
        lista_religiones = []
        for r in religiones:
            data = {}
            data['id'] = r.id
            data['nombre'] = r.nombre
            data['estado'] = r.estado
            lista_religiones.append(data)
        mensaje = 'success'
        return JsonResponse({'religiones': lista_religiones, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
