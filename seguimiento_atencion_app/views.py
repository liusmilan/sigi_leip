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
