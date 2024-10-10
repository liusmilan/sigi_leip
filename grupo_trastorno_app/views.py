import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import grupo_trastorno, categoria_trastorno


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoGruposTrastorno(ListView):
    model = grupo_trastorno

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_grupo_trastorno = []
            for g in self.get_queryset():
                data = {}
                data_categoria = {'id': g.categoria.id,
                                  'nombre': g.categoria.nombre}
                data['id'] = g.id
                data['nombre'] = g.nombre
                data['categoria'] = data_categoria
                data['estado'] = g.estado
                lista_grupo_trastorno.append(data)
            return HttpResponse(json.dumps(lista_grupo_trastorno), 'application/json')
        else:
            return redirect('grupo_trastorno:inicio_grupo_trastorno')


class agregarEditarGrupoTrastorno(CreateView):
    model = grupo_trastorno

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')
        nombre = request.GET.get('nombre', '')
        id_categoria = request.GET.get('id_categoria', '')
        categoria_obj = categoria_trastorno.objects.get(id=id_categoria)
        estado = request.GET.get('estado', '')
        habilitado = ''

        if estado == 'true':
            habilitado = 'HABILITADO'
        else:
            habilitado = 'DESABILITADO'

        if id != '':
            # se esta editando
            try:
                g = grupo_trastorno.objects.get(id=id)
                g.nombre = nombre
                g.categoria = categoria_obj
                g.estado = habilitado
                g.save()
                mensaje = 'Se ha editado correctamente el Grupo de Trastorno.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': g.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except grupo_trastorno.DoesNotExist:
                mensaje = 'Este Grupo de Trastorno no se encuentra registrado en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                grupo_trastorno.objects.get(nombre=nombre)
                mensaje = 'Este Grupo de Trastorno ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except grupo_trastorno.DoesNotExist:
                obj = grupo_trastorno.objects.create(
                    nombre=nombre, categoria=categoria_obj, estado=habilitado)
                mensaje = 'Se ha agregado correctamente el Grupo de Trastorno.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getGrupoTrastorno(TemplateView):
    model = grupo_trastorno

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            g = grupo_trastorno.objects.get(id=id)
            nombre = g.nombre
            data_categoria = {'id': g.categoria.id,
                              'nombre': g.categoria.nombre}
            estado = g.estado
            result = JsonResponse(
                {'nombre': nombre, 'categoria': data_categoria, 'estado': estado})
            return result
        except grupo_trastorno.DoesNotExist:
            mensaje = 'Este Grupo de Trastorno no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarGrupoTrastorno(DeleteView):
    model = grupo_trastorno

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            grupo_trastorno.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado el Grupo de Trastorno seleccionado correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except grupo_trastorno.DoesNotExist:
            mensaje = 'Este Grupo de Trastorno no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllGruposTrastorno(request):
    grupos = grupo_trastorno.objects.all()

    if len(grupos) > 0:
        lista_grupos = []
        for g in grupos:
            data = {}
            data_categoria = {'id': g.categoria.id,
                              'nombre': g.categoria.nombre}
            data['id'] = g.id
            data['nombre'] = g.nombre
            data['categoria'] = data_categoria
            data['estado'] = g.estado
            lista_grupos.append(data)
        mensaje = 'success'
        return JsonResponse({'grupos_trastorno': lista_grupos, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})


class getGruposByCategoria(TemplateView):
    model = grupo_trastorno

    def get(self, request, *args, **kwargs):
        id_categoria = request.GET.get('id_categoria', '')
        obj_categoria = categoria_trastorno.objects.get(id=id_categoria)
        grupos = grupo_trastorno.objects.filter(categoria=obj_categoria)

        if len(grupos) > 0:
            lista_grupos = []
            for g in grupos:
                data = {}
                data_categoria = {'id': g.categoria.id,
                                  'nombre': g.categoria.nombre}
                data['id'] = g.id
                data['nombre'] = g.nombre
                data['categoria'] = data_categoria
                lista_grupos.append(data)
            mensaje = 'success'
            return JsonResponse({'grupos': lista_grupos, 'mensaje': mensaje})
        else:
            mensaje = 'error'
            return JsonResponse({'mensaje': mensaje})
