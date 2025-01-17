import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import categoria_trastorno


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoCategoriaTrastorno(ListView):
    model = categoria_trastorno

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_categoria_trastorno = []
            for c in self.get_queryset():
                data = {}
                data['id'] = c.id
                data['nombre'] = c.nombre
                data['estado'] = c.estado
                lista_categoria_trastorno.append(data)
            return HttpResponse(json.dumps(lista_categoria_trastorno), 'application/json')
        else:
            return redirect('categoria_trastorno:inicio_categoria_trastorno')


class agregarEditarCategoriaTrastorno(CreateView):
    model = categoria_trastorno

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
                c = categoria_trastorno.objects.get(id=id)
                c.nombre = nombre
                c.estado = habilitado
                c.save()
                mensaje = 'Se ha editado correctamente la Categoría.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': c.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except categoria_trastorno.DoesNotExist:
                mensaje = 'Esta Categoría no se encuentra registrada en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                categoria_trastorno.objects.get(nombre=nombre)
                mensaje = 'Esta Categoría ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except categoria_trastorno.DoesNotExist:
                obj = categoria_trastorno.objects.create(
                    nombre=nombre, estado=habilitado)
                mensaje = 'Se ha agregado correctamente la Categoría.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getCategoriaTrastorno(TemplateView):
    model = categoria_trastorno

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            c = categoria_trastorno.objects.get(id=id)
            nombre = c.nombre
            estado = c.estado
            result = JsonResponse(
                {'nombre': nombre, 'estado': estado})
            return result
        except categoria_trastorno.DoesNotExist:
            mensaje = 'Esta Categoría no se encuentra registrada en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarCategoriaTrastorno(DeleteView):
    model = categoria_trastorno

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            categoria_trastorno.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado la Categoría seleccionada correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except categoria_trastorno.DoesNotExist:
            mensaje = 'Esta Categoría no se encuentra registrada en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllCategoriasTrastorno(request):
    categorias = categoria_trastorno.objects.all()

    if len(categorias) > 0:
        lista_categorias = []
        for c in categorias:
            data = {}
            data['id'] = c.id
            data['nombre'] = c.nombre
            data['estado'] = c.estado
            lista_categorias.append(data)
        mensaje = 'success'
        return JsonResponse({'categorias_trastorno': lista_categorias, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
