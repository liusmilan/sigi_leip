import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import rol


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class ListadoRoles(ListView):
    model = rol

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_roles = []
            for r in self.get_queryset():
                data = {}
                data['id'] = r.id
                data['nombre'] = r.nombre
                lista_roles.append(data)
            return HttpResponse(json.dumps(lista_roles), 'application/json')
        else:
            return redirect('rol:inicio_rol')


class agregarEditarRol(CreateView):
    model = rol

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')
        nombre = request.GET.get('nombre', '')

        if id != '':
            # se esta editando
            try:
                r = rol.objects.get(id=id)
                r.nombre = nombre
                r.save()
                mensaje = 'Se ha editado correctamente el Rol.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': r.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except rol.DoesNotExist:
                mensaje = 'Este Rol no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                rol.objects.get(nombre=nombre)
                mensaje = 'Este Rol ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except rol.DoesNotExist:
                obj = rol.objects.create(nombre=nombre)
                mensaje = 'Se ha agregado correctamente el Rol.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getRol(TemplateView):
    model = rol

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            ta = rol.objects.get(id=id)
            nombre = ta.nombre
            result = JsonResponse(
                {'nombre': nombre})
            return result
        except rol.DoesNotExist:
            mensaje = 'Este Rol no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarRol(DeleteView):
    model = rol

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            rol.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Rol seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except rol.DoesNotExist:
            mensaje = 'Este Rol no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllRoles(request):
    roles = rol.objects.all()

    if len(roles) > 0:
        lista_roles = []
        for r in roles:
            data = {}
            data['id'] = r.id
            data['nombre'] = r.nombre
            lista_roles.append(data)
        mensaje = 'success'
        return JsonResponse({'roles': lista_roles, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
