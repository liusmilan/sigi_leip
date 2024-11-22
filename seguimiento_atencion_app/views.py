import json
from typing import Any
from django import http
from django.db import models
from datetime import datetime
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView
from .models import estado_atencion, seguimiento_atencion, persona, atencion_psicologica
from usuario_app.models import Usuario


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class agregarSeguimientoAtencion(CreateView):
    model = seguimiento_atencion

    def get(self, request, *args, **kwargs):
        fecha = datetime.strptime(request.GET.get('fecha', ''), '%d/%m/%Y')
        observaciones = request.GET.get('observaciones', '')
        id_user_aut = request.GET.get('id_user_aut', '')
        persona_obj = Usuario.objects.get(id=id_user_aut).persona
        id_estado = request.GET.get('id_estado', '')
        estado_obj = estado_atencion.objects.get(id=id_estado)
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)

        obj = seguimiento_atencion.objects.create(
            fecha=fecha, persona=persona_obj, estado=estado_obj, observaciones=observaciones, atencion=atencion_obj)
        mensaje = 'Se ha registrado correctamente el Seguimiento para la Atención seleccionada.'
        tipo_mensaje = 'success'
        accion = 'agregar'
        result = JsonResponse(
            {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
        return result


def getAllSeguimientos(request):
    id_atencion = request.GET.get('id_atencion', '')
    print('////////////////////////////////////////////////////////////')
    print(id_atencion)
    atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
    seguimientos = seguimiento_atencion.objects.filter(atencion=atencion_obj)

    if len(seguimientos) > 0:
        lista_seguimientos = []
        for s in seguimientos:
            data = {}
            data_persona = {'id': s.persona.id,
                                'nombre': s.persona.nombre,
                                'segundo_nombre': s.persona.segundo_nombre,
                                'apellido': s.persona.apellido,
                                'segundo_apellido': s.persona.segundo_apellido}
            data_estado = {'id': s.estado.id,
                           'nombre': s.estado.nombre
                           }
            data['id'] = s.id
            data['fecha'] = datetime.strftime(s.fecha, '%d/%m/%Y')
            data['persona'] = data_persona
            data['estado'] = data_estado
            data['observaciones'] = s.observaciones
            lista_seguimientos.append(data)
        mensaje = 'success'
        return JsonResponse({'seguimientos': lista_seguimientos, 'mensaje': mensaje})
    else:
        mensaje = 'no_existe'
        return JsonResponse({'mensaje': mensaje})


def eliminarSeguimiento(request):
    id_seguimiento = request.GET.get('id_seguimiento', '')
    try:
        seguimiento_atencion.objects.get(id=id_seguimiento).delete()
        mensaje = 'Se ha eliminado el Seguimiento seleccionado correctamente.'
        tipo_mensaje = 'success'
        return JsonResponse({'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
    except seguimiento_atencion.DoesNotExist:
        mensaje = 'Este Seguimiento no se encuentra registrado en la Base de Datos.'
        tipo_mensaje = 'error'
        return JsonResponse({'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
