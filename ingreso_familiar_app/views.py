import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import ingreso_familiar


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class ListadoIngresosFailiares(ListView):
    model = ingreso_familiar

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_ingresos_familiares = []
            for ing in self.get_queryset():
                data = {}
                data['id'] = ing.id
                data['ingreso'] = ing.ingreso
                data['nivel'] = ing.nivel
                data['color'] = ing.color
                data['estado'] = ing.estado
                lista_ingresos_familiares.append(data)
            return HttpResponse(json.dumps(lista_ingresos_familiares), 'application/json')
        else:
            return redirect('ingreso_familiar:inicio_ingreso_familiar')


class agregarEditarIngresoFamiliar(CreateView):
    model = ingreso_familiar

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')
        ingreso = request.GET.get('ingreso', '')
        nivel = request.GET.get('nivel', '')
        color = request.GET.get('color', '')
        estado = request.GET.get('estado', '')
        habilitado = ''

        if estado == 'true':
            habilitado = 'HABILITADO'
        else:
            habilitado = 'DESABILITADO'

        if id != '':
            # se esta editando
            try:
                ing = ingreso_familiar.objects.get(id=id)
                ing.ingreso = ingreso
                ing.nivel = nivel
                ing.color = color
                ing.estado = habilitado
                ing.save()
                mensaje = 'Se ha editado correctamente el Ingreso familiar.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except ingreso_familiar.DoesNotExist:
                mensaje = 'Este Ingreso familiar no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                ingreso_familiar.objects.get(ingreso=ingreso)
                mensaje = 'Este Ingreso familiar ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except ingreso_familiar.DoesNotExist:
                obj = ingreso_familiar.objects.create(
                    ingreso=ingreso, nivel=nivel, color=color, estado=habilitado)
                mensaje = 'Se ha agregado correctamente el Ingreso familiar.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getIngresoFamiliar(TemplateView):
    model = ingreso_familiar

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            ing = ingreso_familiar.objects.get(id=id)
            ingreso = ing.ingreso
            nivel = ing.nivel
            color = ing.color
            estado = ing.estado
            result = JsonResponse(
                {'ingreso': ingreso, 'nivel': nivel, 'color': color, 'estado': estado})
            return result
        except ingreso_familiar.DoesNotExist:
            mensaje = 'Este Ingreso familiar no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarIngresoFamiliar(DeleteView):
    model = ingreso_familiar

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            ingreso_familiar.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Ingreso familiar seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except ingreso_familiar.DoesNotExist:
            mensaje = 'Este Ingreso familiar no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllIngresosFamiliares(request):
    ingresos_familiares = ingreso_familiar.objects.all()

    if len(ingresos_familiares) > 0:
        lista_ingresos_familiares = []
        for i in ingresos_familiares:
            data = {}
            data['id'] = i.id
            data['ingreso'] = i.ingreso
            data['nivel'] = i.nivel
            data['color'] = i.color
            data['estado'] = i.estado
            lista_ingresos_familiares.append(data)
        mensaje = 'success'
        return JsonResponse({'ingresos_familiares': lista_ingresos_familiares, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
