import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import grado_academico


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoGradoAcademico(ListView):
    model = grado_academico

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_grado_academico = []
            for g in self.get_queryset():
                data = {}
                data['id'] = g.id
                data['nombre'] = g.nombre
                data['estado'] = g.estado
                lista_grado_academico.append(data)
            return HttpResponse(json.dumps(lista_grado_academico), 'application/json')
        else:
            return redirect('grado_academico:inicio_grado_academico')


class agregarEditarGradoAcademico(CreateView):
    model = grado_academico

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
                g = grado_academico.objects.get(id=id)
                g.nombre = nombre
                g.estado = habilitado
                g.save()
                mensaje = 'Se ha editado correctamente el Grado Académico.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': g.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except grado_academico.DoesNotExist:
                mensaje = 'Este Grado Académico no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                grado_academico.objects.get(nombre=nombre)
                mensaje = 'Este Grado Académico ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except grado_academico.DoesNotExist:
                obj = grado_academico.objects.create(
                    nombre=nombre, estado=habilitado)
                mensaje = 'Se ha agregado correctamente el Grado Académico.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getGradoAcademico(TemplateView):
    model = grado_academico

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            g = grado_academico.objects.get(id=id)
            nombre = g.nombre
            estado = g.estado
            result = JsonResponse(
                {'nombre': nombre, 'estado': estado})
            return result
        except grado_academico.DoesNotExist:
            mensaje = 'Este Grado Académico no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarGradoAcademico(DeleteView):
    model = grado_academico

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            grado_academico.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Grado Académico seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except grado_academico.DoesNotExist:
            mensaje = 'Este Grado Académico no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllGradosAcademicos(request):
    grados = grado_academico.objects.all()

    if len(grados) > 0:
        lista_grados = []
        for g in grados:
            data = {}
            data['id'] = g.id
            data['nombre'] = g.nombre
            data['estado'] = g.estado
            lista_grados.append(data)
        mensaje = 'success'
        return JsonResponse({'grados_academicos': lista_grados, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
