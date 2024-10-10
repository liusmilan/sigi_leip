import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import licenciatura


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoLicenciatura(ListView):
    model = licenciatura

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_licenciaturas = []
            for lic in self.get_queryset():
                data = {}
                data['id'] = lic.id
                data['nombre'] = lic.nombre
                data['tipo_licenciatura'] = lic.tipo_licenciatura
                data['estado'] = lic.estado
                lista_licenciaturas.append(data)
            return HttpResponse(json.dumps(lista_licenciaturas), 'application/json')
        else:
            return redirect('licenciatura:inicio_licenciatura')


class agregarEditarLicenciatura(CreateView):
    model = licenciatura

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')
        nombre = request.GET.get('nombre', '')
        tipo_licenciatura = request.GET.get('tipo_licenciatura', '')
        estado = request.GET.get('estado', '')
        habilitado = ''

        if estado == 'true':
            habilitado = 'HABILITADO'
        else:
            habilitado = 'DESABILITADO'

        if id != '':
            # se esta editando
            try:
                lic = licenciatura.objects.get(id=id)
                lic.nombre = nombre
                lic.tipo_licenciatura = tipo_licenciatura
                lic.estado = habilitado
                lic.save()
                mensaje = 'Se ha editado correctamente la Licenciatura-Postgrado.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': lic.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except licenciatura.DoesNotExist:
                mensaje = 'Esta Licenciatura-Postgrado no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                licenciatura.objects.get(
                    nombre=nombre, tipo_licenciatura=tipo_licenciatura)
                mensaje = 'Esta Licenciatura-Postgrado ya existe. Por favor agregue otra.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except licenciatura.DoesNotExist:
                obj = licenciatura.objects.create(
                    nombre=nombre, tipo_licenciatura=tipo_licenciatura, estado=habilitado)
                mensaje = 'Se ha agregado correctamente la Licenciatura-Postgrado.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getLicenciatura(TemplateView):
    model = licenciatura

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            lic = licenciatura.objects.get(id=id)
            nombre = lic.nombre
            tipo_licenciatura = lic.tipo_licenciatura
            estado = lic.estado
            result = JsonResponse(
                {'nombre': nombre, 'tipo_licenciatura': tipo_licenciatura, 'estado': estado})
            return result
        except licenciatura.DoesNotExist:
            mensaje = 'Esta Licenciatura-Postgrado no se encuentra registrada en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarLicenciatura(DeleteView):
    model = licenciatura

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            licenciatura.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado la Licenciatura-Postgrado seleccionada correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except licenciatura.DoesNotExist:
            mensaje = 'Esta Licenciatura-Postgrado no se encuentra registrada en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllLicenciaturas(request):
    licenciaturas = licenciatura.objects.all()

    if len(licenciaturas) > 0:
        lista_licenciaturas = []
        for l in licenciaturas:
            data = {}
            data['id'] = l.id
            data['nombre'] = l.nombre
            data['estado'] = l.estado
            lista_licenciaturas.append(data)
        mensaje = 'success'
        return JsonResponse({'licenciaturas': lista_licenciaturas, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
