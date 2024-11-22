import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import tipo_atencion


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoTipoAtencion(ListView):
    model = tipo_atencion

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_tipo_atencion = []
            for ta in self.get_queryset():
                data = {}
                categorias = []
                data['id'] = ta.id
                data['nombre'] = ta.nombre
                data['derivar'] = ta.derivar
                data['taller'] = ta.taller
                data['consulta'] = ta.consulta
                data['estado'] = ta.estado
                
                if ta.derivar:
                    categorias.append('<span class="badge badge-light-success">' + 'Derivar' + '</span>')
                
                if ta.taller:
                    categorias.append('<span class="badge badge-light-success">' + 'Taller' + '</span>')
                
                if ta.consulta:
                    categorias.append('<span class="badge badge-light-success">' + 'Consulta' + '</span>')
                
                data['categorias'] = '<br>'.join(categorias)
                lista_tipo_atencion.append(data)
            return HttpResponse(json.dumps(lista_tipo_atencion), 'application/json')
        else:
            return redirect('tipo_atencion:inicio_tipo_atencion')


class agregarEditarTipoAtencion(CreateView):
    model = tipo_atencion

    def get(self, request, *args, **kwargs):
        params = request.GET.get('params', '')
        datos = json.loads(params)
        id = datos.get('id')
        nombre = datos.get('nombre')
        derivar = datos.get('derivar')
        taller = datos.get('taller')
        consulta = datos.get('consulta')
        estado = datos.get('estado')
        habilitado = ''

        if estado:
            habilitado = 'HABILITADO'
        else:
            habilitado = 'DESABILITADO'

        if id != '':
            # se esta editando
            try:
                ta = tipo_atencion.objects.get(id=id)
                ta.nombre = nombre
                ta.derivar = derivar
                ta.taller = taller
                ta.consulta = consulta
                ta.estado = habilitado
                ta.save()
                mensaje = 'Se ha editado correctamente el Tipo de Atención.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': ta.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except tipo_atencion.DoesNotExist:
                mensaje = 'Este Tipo de Atención no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                tipo_atencion.objects.get(nombre=nombre)
                mensaje = 'Este Tipo de Atención ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except tipo_atencion.DoesNotExist:
                obj = tipo_atencion.objects.create(
                    nombre=nombre, derivar=derivar, taller=taller, consulta=consulta, estado=habilitado)
                mensaje = 'Se ha agregado correctamente el Tipo de Atención.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getTipoAtencion(TemplateView):
    model = tipo_atencion

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            ta = tipo_atencion.objects.get(id=id)
            data = {}
            data['id'] = ta.id
            data['nombre'] = ta.nombre
            data['derivar'] = ta.derivar
            data['taller'] = ta.taller
            data['consulta'] = ta.consulta
            data['estado'] = ta.estado
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'tipo_atencion': data, 'tipo_mensaje': tipo_mensaje})
            return result
        except tipo_atencion.DoesNotExist:
            mensaje = 'Este Tipo de Atención no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarTipoAtencion(DeleteView):
    model = tipo_atencion

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            tipo_atencion.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Tipo de Atención seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except tipo_atencion.DoesNotExist:
            mensaje = 'Este Tipo de Atención no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllTipoAtencion(request):
    tipos_atenciones = tipo_atencion.objects.all()

    if len(tipos_atenciones) > 0:
        lista_ta = []
        for ta in tipos_atenciones:
            data = {}
            data['id'] = ta.id
            data['nombre'] = ta.nombre
            data['derivar'] = ta.derivar
            data['taller'] = ta.taller
            data['consulta'] = ta.consulta
            data['estado'] = ta.estado
            lista_ta.append(data)
        mensaje = 'success'
        return JsonResponse({'tipos_atenciones': lista_ta, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
