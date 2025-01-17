import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import grupo_trastorno, categoria_trastorno, diagnostico


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoDiagnosticos(ListView):
    model = diagnostico

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_diagnostico = []
            for d in self.get_queryset():
                data = {}
                data_categoria = {'id': d.categoria.id,
                                  'nombre': d.categoria.nombre}

                if d.grupo:
                    data_grupo = {'id': d.grupo.id, 'nombre': d.grupo.nombre}
                else:
                    data_grupo = ''

                data['id'] = d.id
                data['nombre'] = d.nombre
                data['categoria'] = data_categoria
                data['grupo'] = data_grupo
                data['estado'] = d.estado
                lista_diagnostico.append(data)
            return HttpResponse(json.dumps(lista_diagnostico), 'application/json')
        else:
            return redirect('diagnostico:inicio_diagnostico')


class agregarEditarDiagnostico(CreateView):
    model = diagnostico

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')
        nombre = request.GET.get('nombre', '')
        id_categoria = request.GET.get('id_categoria', '')
        categoria_obj = categoria_trastorno.objects.get(id=id_categoria)
        id_grupo = request.GET.get('id_grupo', '')
        estado = request.GET.get('estado', '')
        habilitado = ''

        if estado == 'true':
            habilitado = 'HABILITADO'
        else:
            habilitado = 'DESABILITADO'

        if id_grupo != 'sel' and id_grupo != '-':
            grupo_obj = grupo_trastorno.objects.get(id=id_grupo)
        else:
            grupo_obj = None

        if id != '':
            # se esta editando
            try:
                d = diagnostico.objects.get(id=id)
                d.nombre = nombre
                d.categoria = categoria_obj
                d.grupo = grupo_obj
                d.estado = habilitado
                d.save()
                mensaje = 'Se ha editado correctamente el Diagnóstico.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': d.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except diagnostico.DoesNotExist:
                mensaje = 'Este Diagnóstico no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                diagnostico.objects.get(nombre=nombre)
                mensaje = 'Este Diagnóstico ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except diagnostico.DoesNotExist:
                obj = diagnostico.objects.create(
                    nombre=nombre, categoria=categoria_obj, grupo=grupo_obj, estado=habilitado)
                mensaje = 'Se ha agregado correctamente el Diagnóstico.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getDiagnostico(TemplateView):
    model = diagnostico

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            d = diagnostico.objects.get(id=id)
            nombre = d.nombre
            data_categoria = {'id': d.categoria.id,
                              'nombre': d.categoria.nombre}

            if d.grupo:
                data_grupo = {'id': d.grupo.id, 'nombre': d.grupo.nombre}
            else:
                data_grupo = ''
            estado = d.estado
            result = JsonResponse(
                {'nombre': nombre, 'categoria': data_categoria, 'grupo': data_grupo, 'estado': estado})
            return result
        except diagnostico.DoesNotExist:
            mensaje = 'Este Diagnóstico no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarDiagnostico(DeleteView):
    model = diagnostico

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            diagnostico.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Diagnóstico seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except diagnostico.DoesNotExist:
            mensaje = 'Este Diagnóstico no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllDiagnosticos(request):
    diag = diagnostico.objects.all()

    if len(diag) > 0:
        lista_diagnosticos = []
        for d in diag:
            data = {}
            data_categoria = {'id': d.categoria.id,
                              'nombre': d.categoria.nombre}
            if d.grupo != None:
                data_grupo = {'id': d.grupo.id,
                              'nombre': d.grupo.nombre}
            else:
                data_grupo = None

            data['id'] = d.id
            data['nombre'] = d.nombre
            data['estado'] = d.estado
            data['categoria'] = data_categoria
            data['grupo'] = data_grupo
            lista_diagnosticos.append(data)
        mensaje = 'success'
        return JsonResponse({'diagnosticos': lista_diagnosticos, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})


class getDiagnosticosByCategoria(TemplateView):
    model = diagnostico

    def get(self, request, *args, **kwargs):
        id_categoria = request.GET.get('id_categoria', '')
        obj_categoria = categoria_trastorno.objects.get(id=id_categoria)
        diag = diagnostico.objects.filter(categoria=obj_categoria)

        if len(diag) > 0:
            lista_diagnosticos = []
            for d in diag:
                data = {}
                data_categoria = {'id': d.categoria.id,
                                  'nombre': d.categoria.nombre}
                if d.grupo != None:
                    data_grupo = {'id': d.grupo.id,
                                  'nombre': d.grupo.nombre}
                else:
                    data_grupo = None

                data['id'] = d.id
                data['nombre'] = d.nombre
                data['estado'] = d.estado
                data['categoria'] = data_categoria
                data['grupo'] = data_grupo
                lista_diagnosticos.append(data)
            mensaje = 'success'
            return JsonResponse({'diagnosticos': lista_diagnosticos, 'mensaje': mensaje})
        else:
            mensaje = 'error'
            return JsonResponse({'mensaje': mensaje})
