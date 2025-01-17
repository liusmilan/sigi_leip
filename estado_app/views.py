import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import estado
from municipio_app.models import municipio


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoEstados(ListView):
    model = estado

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_estados = []
            for est in self.get_queryset():
                data = {}
                data['id'] = est.id
                data['nombre'] = est.nombre
                lista_estados.append(data)
            return HttpResponse(json.dumps(lista_estados), 'application/json')
        else:
            return redirect('estado:inicio_estado')


class agregarEditarEstado(CreateView):
    model = estado

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')
        nombre = request.GET.get('nombre', '')

        if id != '':
            # se esta editando
            try:
                est = estado.objects.get(id=id)
                est.nombre = nombre
                est.save()
                mensaje = 'Se ha editado correctamente el Estado.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': est.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except estado.DoesNotExist:
                mensaje = 'Este Estado no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                estado.objects.get(nombre=nombre)
                mensaje = 'Este Estado ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except estado.DoesNotExist:
                obj = estado.objects.create(nombre=nombre)
                mensaje = 'Se ha agregado correctamente el Estado.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getEstado(TemplateView):
    model = estado

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            est = estado.objects.get(id=id)
            nombre = est.nombre
            result = JsonResponse({'nombre': nombre})
            return result
        except estado.DoesNotExist:
            mensaje = 'Este Estado no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarEstado(DeleteView):
    model = estado

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            est = estado.objects.get(id=id)

            if municipio.objects.filter(estado=est).exists():
                mensaje = 'Este Estado no se puede eliminar debido a que tiene Municipios asociados.'
                tipo_mensaje = 'error_mun_asociado'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            else:
                est.delete()
                mensaje = 'Se ha eliminado el Estado seleccionado correctamente.'
                tipo_mensaje = 'success'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        except estado.DoesNotExist:
            mensaje = 'Este Estado no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllEstados(request):
    estados = estado.objects.all()

    if len(estados) > 0:
        lista_estados = []
        for e in estados:
            data = {}
            data['id'] = e.id
            data['nombre'] = e.nombre
            lista_estados.append(data)
        mensaje = 'success'
        return JsonResponse({'estados': lista_estados, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
