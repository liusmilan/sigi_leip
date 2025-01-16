import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from datetime import datetime
from .models import modalidad, taller


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoTalleres(ListView):
    model = taller

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_talleres = []
            for t in self.get_queryset():
                data = {}
                fecha_inicio = datetime.strftime(t.fecha_inicio, '%d/%m/%Y')
                fecha_fin = datetime.strftime(t.fecha_fin, '%d/%m/%Y')
                data_modalidad = {'id': t.modalidad.id,
                                  'nombre': t.modalidad.nombre}
                data['id'] = t.id
                data['nombre'] = t.nombre
                data['modalidad'] = data_modalidad
                data['fecha_inicio'] = fecha_inicio
                data['fecha_fin'] = fecha_fin
                data['especialista'] = t.especialista
                data['estado'] = t.estado
                data['hora_inicio'] = t.hora_inicio
                lista_talleres.append(data)
            return HttpResponse(json.dumps(lista_talleres), 'application/json')
        else:
            return redirect('taller:inicio_taller')


class agregarEditarTaller(CreateView):
    model = taller

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')
        nombre = request.GET.get('nombre', '')
        fecha_inicio_1 = request.GET.get('fecha_inicio', '')
        fecha_fin_1 = request.GET.get('fecha_fin', '')
        fecha_inicio = datetime.strptime(fecha_inicio_1, '%d/%m/%Y')
        fecha_fin = datetime.strptime(fecha_fin_1, '%d/%m/%Y')
        especialista = request.GET.get('especialista', '')
        id_modalidad = request.GET.get('id_modalidad', '')
        hora_inicio = request.GET.get('hora_inicio', '')
        modalidad_obj = modalidad.objects.get(id=id_modalidad)
        estado = request.GET.get('estado', '')
        habilitado = ''

        if estado == 'true':
            habilitado = 'HABILITADO'
        else:
            habilitado = 'DESABILITADO'

        if id != '':
            # se esta editando
            try:
                t = taller.objects.get(id=id)
                t.nombre = nombre
                t.modalidad = modalidad_obj
                t.especialista = especialista
                t.fecha_inicio = fecha_inicio
                t.fecha_fin = fecha_fin
                t.hora_inicio = hora_inicio
                t.estado = habilitado
                t.save()
                mensaje = 'Se ha editado correctamente el Taller.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except taller.DoesNotExist:
                mensaje = 'Este Taller no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            obj = taller.objects.create(
                    nombre=nombre, modalidad=modalidad_obj, especialista=especialista, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin, estado=habilitado, hora_inicio=hora_inicio)
            mensaje = 'Se ha agregado correctamente el Taller.'
            tipo_mensaje = 'success'
            accion = 'agregar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result    


class getTaller(TemplateView):
    model = taller

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            t = taller.objects.get(id=id)
            data = {}
            fecha_inicio = datetime.strftime(t.fecha_inicio, '%d/%m/%Y')
            fecha_fin = datetime.strftime(t.fecha_fin, '%d/%m/%Y')
            data_modalidad = {'id': t.modalidad.id,
                              'nombre': t.modalidad.nombre}
            data['id'] = t.id
            data['nombre'] = t.nombre
            data['modalidad'] = data_modalidad
            data['fecha_inicio'] = fecha_inicio
            data['fecha_fin'] = fecha_fin
            data['especialista'] = t.especialista
            data['estado'] = t.estado
            data['hora_inicio'] = t.hora_inicio
            result = JsonResponse(data)
            return result
        except taller.DoesNotExist:
            mensaje = 'Este Taller no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarTaller(DeleteView):
    model = taller

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            taller.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Taller seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except taller.DoesNotExist:
            mensaje = 'Este Taller no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllTalleres(request):
    talleres = taller.objects.all()

    if len(talleres) > 0:
        lista_talleres = []
        for t in talleres:
            data = {}
            if t.estado == 'HABILITADO':
                fecha_inicio = datetime.strftime(t.fecha_inicio, '%d/%m/%Y')
                fecha_fin = datetime.strftime(t.fecha_fin, '%d/%m/%Y')
                data_modalidad = {'id': t.modalidad.id,
                                  'nombre': t.modalidad.nombre}
                data['id'] = t.id
                data['nombre'] = t.nombre
                data['modalidad'] = data_modalidad
                data['fecha_inicio'] = fecha_inicio
                data['fecha_fin'] = fecha_fin
                data['especialista'] = t.especialista
                data['estado'] = t.estado
                data['hora_inicio'] = t.hora_inicio
                lista_talleres.append(data)
        mensaje = 'success'
        return JsonResponse({'talleres': lista_talleres, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})


def getAllModalidades(request):
    modalidades = modalidad.objects.all()

    if len(modalidades) > 0:
        lista_modalidades = []
        for t in modalidades:
            data = {}
            data['id'] = t.id
            data['nombre'] = t.nombre
            lista_modalidades.append(data)
        mensaje = 'success'
        return JsonResponse({'modalidades': lista_modalidades, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
