import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import tipo_instrumento_psicologico


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoTipoInstrumentoPsicologico(ListView):
    model = tipo_instrumento_psicologico

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_tipo_instrumento_psicologico = []
            for ti in self.get_queryset():
                data = {}
                data['id'] = ti.id
                data['nombre'] = ti.nombre
                data['estado'] = ti.estado
                lista_tipo_instrumento_psicologico.append(data)
            return HttpResponse(json.dumps(lista_tipo_instrumento_psicologico), 'application/json')
        else:
            return redirect('tipo_instrumento:inicio_tipo_instrumento')


class agregarEditarTipoInstrumentoPsicologico(CreateView):
    model = tipo_instrumento_psicologico

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
                ti = tipo_instrumento_psicologico.objects.get(id=id)
                ti.nombre = nombre
                ti.estado = habilitado
                ti.save()
                mensaje = 'Se ha editado correctamente el Tipo de Instrumento Psicológico.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': ti.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except tipo_instrumento_psicologico.DoesNotExist:
                mensaje = 'Este Tipo de Instrumento Psicológico no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                tipo_instrumento_psicologico.objects.get(nombre=nombre)
                mensaje = 'Este Tipo de Instrumento Psicológico ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except tipo_instrumento_psicologico.DoesNotExist:
                obj = tipo_instrumento_psicologico.objects.create(
                    nombre=nombre, estado=habilitado)
                mensaje = 'Se ha agregado correctamente el Tipo de Instrumento Psicológico.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getTipoInstrumentoPsicologico(TemplateView):
    model = tipo_instrumento_psicologico

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            ti = tipo_instrumento_psicologico.objects.get(id=id)
            nombre = ti.nombre
            estado = ti.estado
            result = JsonResponse(
                {'nombre': nombre, 'estado': estado})
            return result
        except tipo_instrumento_psicologico.DoesNotExist:
            mensaje = 'Este Tipo de Instrumento Psicológico no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarTipoInstrumentoPsicologico(DeleteView):
    model = tipo_instrumento_psicologico

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            tipo_instrumento_psicologico.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Tipo de Instrumento Psicológico seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except tipo_instrumento_psicologico.DoesNotExist:
            mensaje = 'Este Tipo de Instrumento Psicológico no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
