import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import vive_en


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoViveEn(ListView):
    model = vive_en

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_vive_en = []
            for v in self.get_queryset():
                data = {}
                data['id'] = v.id
                data['vive_en'] = v.vive_en
                data['estado'] = v.estado
                lista_vive_en.append(data)
            return HttpResponse(json.dumps(lista_vive_en), 'application/json')
        else:
            return redirect('vive_en:inicio_vive_en')


class agregarEditarViveEn(CreateView):
    model = vive_en

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')
        vive = request.GET.get('vive_en', '')
        estado = request.GET.get('estado', '')
        habilitado = ''
        
        if estado == 'true':
            habilitado = 'HABILITADO'
        else:
            habilitado = 'DESABILITADO'

        if id != '':
            # se esta editando
            try:
                v = vive_en.objects.get(id=id)
                v.vive_en = vive
                v.estado = habilitado
                v.save()
                mensaje = 'Se han editado correctamente los datos.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'vive_en': v.vive_en, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except vive_en.DoesNotExist:
                mensaje = 'Estos datos no se encuentran registrados en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                vive_en.objects.get(vive_en=vive)
                mensaje = 'Estos datos ya existen. Por favor agregue otros.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except vive_en.DoesNotExist:
                obj = vive_en.objects.create(
                    vive_en=vive, estado=habilitado)
                mensaje = 'Se han agregado correctamente los datos.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'vive_en': obj.vive_en, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getViveEn(TemplateView):
    model = vive_en

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            v = vive_en.objects.get(id=id)
            vive = v.vive_en
            estado = v.estado
            result = JsonResponse(
                {'vive_en': vive, 'estado': estado})
            return result
        except vive_en.DoesNotExist:
            mensaje = 'Estos datos no se encuentran registrados en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarViveEn(DeleteView):
    model = vive_en

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            vive_en.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado correctamente el dato seleccionado.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except vive_en.DoesNotExist:
            mensaje = 'Estos datos no se encuentran registrados en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllViveEn(request):
    vives = vive_en.objects.all()

    if len(vives) > 0:
        lista_vives = []
        for v in vives:
            data = {}
            data['id'] = v.id
            data['nombre'] = v.vive_en
            data['estado'] = v.estado
            lista_vives.append(data)
        mensaje = 'success'
        return JsonResponse({'vives': lista_vives, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
