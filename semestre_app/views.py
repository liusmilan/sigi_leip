import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import semestre


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoSemestres(ListView):
    model = semestre

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_semestre = []
            for ta in self.get_queryset():
                data = {}
                data['id'] = ta.id
                data['nombre'] = ta.nombre
                data['estado'] = ta.estado
                lista_semestre.append(data)
            return HttpResponse(json.dumps(lista_semestre), 'application/json')
        else:
            return redirect('semestre:inicio_semestre')


class agregarEditarSemestre(CreateView):
    model = semestre

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
                s = semestre.objects.get(id=id)
                s.nombre = nombre
                s.estado = habilitado
                s.save()
                mensaje = 'Se ha editado correctamente el Semestre.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': s.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except semestre.DoesNotExist:
                mensaje = 'Este Semestre no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                semestre.objects.get(nombre=nombre)
                mensaje = 'Este Semestre ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except semestre.DoesNotExist:
                obj = semestre.objects.create(
                    nombre=nombre, estado=habilitado)
                mensaje = 'Se ha agregado correctamente el Semestre.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getSemestre(TemplateView):
    model = semestre

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            s = semestre.objects.get(id=id)
            nombre = s.nombre
            estado = s.estado
            result = JsonResponse(
                {'nombre': nombre, 'estado': estado})
            return result
        except semestre.DoesNotExist:
            mensaje = 'Este Semestre no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarSemestre(DeleteView):
    model = semestre

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            semestre.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Semestre seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except semestre.DoesNotExist:
            mensaje = 'Este Semestre no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllSemestres(request):
    semestres = semestre.objects.all()

    if len(semestres) > 0:
        lista_semestres = []
        for s in semestres:
            data = {}
            data['id'] = s.id
            data['nombre'] = s.nombre
            data['estado'] = s.estado
            lista_semestres.append(data)
        mensaje = 'success'
        return JsonResponse({'semestres': lista_semestres, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
