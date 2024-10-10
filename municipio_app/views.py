import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import municipio
from .models import estado


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoMunicipios(ListView):
    model = municipio

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_municipios = []
            for mun in self.get_queryset():
                data = {}
                data_estado = {'id': mun.estado.id,
                               'nombre': mun.estado.nombre}
                data['id'] = mun.id
                data['nombre'] = mun.nombre
                data['estado'] = data_estado
                lista_municipios.append(data)
            return HttpResponse(json.dumps(lista_municipios), 'application/json')
        else:
            return redirect('municipio:inicio_municipio')


class agregarEditarMunicipio(CreateView):
    model = municipio

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')
        nombre = request.GET.get('nombre', '')
        id_estado = request.GET.get('id_estado', '')
        estado_obj = estado.objects.get(id=id_estado)

        if id != '':
            # se esta editando
            try:
                mun = municipio.objects.get(id=id)
                mun.nombre = nombre
                mun.estado = estado_obj
                mun.save()
                mensaje = 'Se ha editado correctamente el Municipio.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': mun.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except municipio.DoesNotExist:
                mensaje = 'Este Municipio no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                municipio.objects.get(nombre=nombre)
                mensaje = 'Este Municipio ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except municipio.DoesNotExist:
                obj = municipio.objects.create(
                    nombre=nombre, estado=estado_obj)
                mensaje = 'Se ha agregado correctamente el Municipio.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getMunicipio(TemplateView):
    model = municipio

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            mun = municipio.objects.get(id=id)
            nombre = mun.nombre
            data_estado = {'id': mun.estado.id,
                           'nombre': mun.estado.nombre}
            result = JsonResponse({'nombre': nombre, 'estado': data_estado})
            return result
        except municipio.DoesNotExist:
            mensaje = 'Este Municipio no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarMunicipio(DeleteView):
    model = municipio

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            municipio.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Municipio seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except municipio.DoesNotExist:
            mensaje = 'Este Municipio no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllMunicipios(request):
    municipios = municipio.objects.all()

    if len(municipios) > 0:
        lista_municipios = []
        for m in municipios:
            data = {}
            data_estado = {'id': m.estado.id,
                           'nombre': m.estado.nombre}
            data['id'] = m.id
            data['nombre'] = m.nombre
            data['estado'] = data_estado
            lista_municipios.append(data)
        mensaje = 'success'
        return JsonResponse({'municipios': lista_municipios, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})


class getMunicipiosByEstado(TemplateView):
    model = municipio

    def get(self, request, *args, **kwargs):
        id_estado = request.GET.get('id_estado', '')
        obj_estado = estado.objects.get(id=id_estado)
        municipios = municipio.objects.filter(estado=obj_estado)

        if len(municipios) > 0:
            lista_municipios = []
            for m in municipios:
                data = {}
                data_estado = {'id': m.estado.id,
                               'nombre': m.estado.nombre}
                data['id'] = m.id
                data['nombre'] = m.nombre
                data['estado'] = data_estado
                lista_municipios.append(data)
            mensaje = 'success'
            return JsonResponse({'municipios': lista_municipios, 'mensaje': mensaje})
        else:
            mensaje = 'error'
            return JsonResponse({'mensaje': mensaje})
