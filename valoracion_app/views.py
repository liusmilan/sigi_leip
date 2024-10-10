import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from datetime import datetime
from .models import valoracion_taller, valoracion, atencion_psicologica, tipo_atencion, institucion, persona, taller
from usuario_app.models import Usuario


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class agregarEditarValoracion(CreateView):
    model = valoracion

    def get(self, request, *args, **kwargs):
        params = request.GET.get('params', '')
        datos_valoracion = json.loads(params)
        id_atencion = datos_valoracion.get('id_atencion')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        accion = datos_valoracion.get('accion')
        fecha = datos_valoracion.get('fecha')
        fecha_valoracion = datetime.strptime(fecha, '%d/%m/%Y')
        id_user_aut = datos_valoracion.get('id_user_aut')
        valorado_por = Usuario.objects.get(id=id_user_aut).persona
        id_tipo_atencion = datos_valoracion.get(
            'tipo_atencion_valoracion')
        tipo_atencion_obj = tipo_atencion.objects.get(
            id=id_tipo_atencion)
        tipo_institucion = datos_valoracion.get('tipo_institucion')
        talleres = datos_valoracion.get('talleres')
        id_institucion = datos_valoracion.get('institucion')

        if id_institucion != '':
            institucion_obj = institucion.objects.get(id=id_institucion)
        else:
            institucion_obj = None

        if accion == 'agregar':
            # se esta agregando
            obj = valoracion.objects.create(fecha_valoracion=fecha_valoracion, valorado_por=valorado_por, institucion=institucion_obj,
                                            tipo_atencion=tipo_atencion_obj, tipo_institucion=tipo_institucion, atencion=atencion_obj)

            if len(talleres) > 0:
                guardarTalleres(talleres, obj)

            mensaje = 'Se ha agregado correctamente la Valoración.'
            tipo_mensaje = 'success'
            accion = 'agregar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result
        elif accion == 'editar':
            # se esta editando
            v = valoracion.objects.get(atencion=atencion_obj)
            v.fecha_valoracion = fecha_valoracion
            v.valorado_por = valorado_por
            v.tipo_atencion = tipo_atencion_obj
            v.tipo_institucion = tipo_institucion
            v.institucion = institucion_obj
            v.atencion = atencion_obj
            v.save()

            if len(talleres) > 0:
                eliminarTalleres(v)
                guardarTalleres(talleres, obj)

            mensaje = 'Se ha editado correctamente la Valoración.'
            tipo_mensaje = 'success'
            accion = 'editar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result


class getValoracionByAtencion(TemplateView):
    model = valoracion

    def get(self, request, *args, **kwargs):
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        data = {}

        try:
            v = valoracion.objects.get(atencion=atencion_obj)
            valorado_por = {'id': v.valorado_por.id,
                            'nombre': v.valorado_por.nombre,
                            'segundo_nombre': v.valorado_por.segundo_nombre,
                            'apellido': v.valorado_por.apellido,
                            'segundo_apellido': v.valorado_por.segundo_apellido}
            if v.institucion != None:
                institucion = {'id': v.institucion.id,
                               'nombre': v.institucion.nombre}
            else:
                institucion = None
            tipo_atencion = {'id': v.tipo_atencion.id,
                             'nombre': v.tipo_atencion.nombre}
            data['fecha_valoracion'] = datetime.strftime(
                v.fecha_valoracion, '%d/%m/%Y')
            data['tipo_institucion'] = v.tipo_institucion
            data['valorado_por'] = valorado_por
            data['institucion'] = institucion
            data['tipo_atencion'] = tipo_atencion
            data['mensaje'] = 'existe'
            return JsonResponse({'datos': data, 'talleres': getTalleresByValoracion(v)})
        except valoracion.DoesNotExist:
            data['mensaje'] = 'no_existe'
            return JsonResponse({'datos': data})


def guardarTalleres(listaTalleres, obj):
    for t in listaTalleres:
        taller_obj = taller.objects.get(id=t.get('id'))
        valoracion_taller.objects.create(valoracion=obj, taller=taller_obj)


def eliminarTalleres(v):
    for t in valoracion_taller.objects.filter(valoracion=v):
        t.delete()


def getTalleresByValoracion(valoracion):
    lista_talleres = []
    for v in valoracion_taller.objects.filter(valoracion=valoracion):
        taller = {'id': v.taller.id,
                  'nombre': v.taller.nombre,
                  'modalidad': {'id': v.taller.modalidad.id,
                                'nombre': v.taller.modalidad.nombre},
                  'fecha_inicio': datetime.strftime(v.taller.fecha_inicio, '%d/%m/%Y'),
                  'fecha_fin': datetime.strftime(v.taller.fecha_fin, '%d/%m/%Y'),
                  'especialista': v.taller.especialista,
                  'estado': v.taller.estado}
        lista_talleres.append(taller)

    return lista_talleres
