import json
from typing import Any
from django import http
from django.db import models
from datetime import datetime
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, TemplateView
from .models import autoevaluacion_psico, atencion_psicologica


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class agregarEditarAutoEvaPsico(CreateView):
    model = autoevaluacion_psico

    def get(self, request, *args, **kwargs):
        accion = request.GET.get('accion', '')
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        pregunta1 = request.GET.get('pregunta1', '')
        pregunta2 = request.GET.get('pregunta2', '')
        pregunta3 = request.GET.get('pregunta3', '')
        pregunta4 = request.GET.get('pregunta4', '')
        pregunta5 = request.GET.get('pregunta5', '')
        pregunta6 = request.GET.get('pregunta6', '')
        pregunta7 = request.GET.get('pregunta7', '')
        pregunta8 = request.GET.get('pregunta8', '')
        pregunta9 = request.GET.get('pregunta9', '')
        pregunta10 = request.GET.get('pregunta10', '')
        pregunta11 = request.GET.get('pregunta11', '')
        pregunta12 = request.GET.get('pregunta12', '')
        pregunta13 = request.GET.get('pregunta13', '')
        pregunta14 = request.GET.get('pregunta14', '')
        pregunta15 = request.GET.get('pregunta15', '')
        pregunta16 = request.GET.get('pregunta16', '')
        pregunta17 = request.GET.get('pregunta17', '')
        pregunta18 = request.GET.get('pregunta18', '')
        pregunta19 = request.GET.get('pregunta19', '')
        pregunta20 = request.GET.get('pregunta20', '')
        pregunta21 = request.GET.get('pregunta21', '')
        pregunta22 = request.GET.get('pregunta22', '')
        pregunta23 = request.GET.get('pregunta23', '')
        pregunta24 = request.GET.get('pregunta24', '')
        pregunta25 = request.GET.get('pregunta25', '')
        pregunta26 = request.GET.get('pregunta26', '')
        pregunta27 = request.GET.get('pregunta27', '')
        pregunta28 = request.GET.get('pregunta28', '')
        pregunta29 = request.GET.get('pregunta29', '')
        pregunta30 = request.GET.get('pregunta30', '')
        pregunta31 = request.GET.get('pregunta31', '')
        pregunta32 = request.GET.get('pregunta32', '')
        pregunta33 = request.GET.get('pregunta33', '')
        total = request.GET.get('total', '')
        color = request.GET.get('color', '')
        nivel = request.GET.get('nivel', '')

        if accion == 'agregar':
            # se esta agregando
            obj = autoevaluacion_psico.objects.create(atencion=atencion_obj, pregunta1=pregunta1, pregunta2=pregunta2, pregunta3=pregunta3, pregunta4=pregunta4, pregunta5=pregunta5, pregunta6=pregunta6, pregunta7=pregunta7, pregunta8=pregunta8, pregunta9=pregunta9, pregunta10=pregunta10, pregunta11=pregunta11, pregunta12=pregunta12, pregunta13=pregunta13, pregunta14=pregunta14, pregunta15=pregunta15, pregunta16=pregunta16, pregunta17=pregunta17,
                                                      pregunta18=pregunta18, pregunta19=pregunta19, pregunta20=pregunta20, pregunta21=pregunta21, pregunta22=pregunta22, pregunta23=pregunta23, pregunta24=pregunta24, pregunta25=pregunta25, pregunta26=pregunta26, pregunta27=pregunta27, pregunta28=pregunta28, pregunta29=pregunta29, pregunta30=pregunta30, pregunta31=pregunta31, pregunta32=pregunta32, pregunta33=pregunta33, total=total, color=color, nivel=nivel)
            mensaje = 'Se ha guardado correctamente la Autoevaluación psicológica.'
            tipo_mensaje = 'success'
            accion = 'agregar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result
        elif accion == 'editar':
            # se esta editando
            a = autoevaluacion_psico.objects.get(atencion=atencion_obj)
            a.pregunta1 = pregunta1
            a.pregunta2 = pregunta2
            a.pregunta3 = pregunta3
            a.pregunta4 = pregunta4
            a.pregunta5 = pregunta5
            a.pregunta6 = pregunta6
            a.pregunta7 = pregunta7
            a.pregunta8 = pregunta8
            a.pregunta9 = pregunta9
            a.pregunta10 = pregunta10
            a.pregunta11 = pregunta11
            a.pregunta12 = pregunta12
            a.pregunta13 = pregunta13
            a.pregunta14 = pregunta14
            a.pregunta15 = pregunta15
            a.pregunta16 = pregunta16
            a.pregunta17 = pregunta17
            a.pregunta18 = pregunta18
            a.pregunta19 = pregunta19
            a.pregunta20 = pregunta20
            a.pregunta21 = pregunta21
            a.pregunta22 = pregunta22
            a.pregunta23 = pregunta23
            a.pregunta24 = pregunta24
            a.pregunta25 = pregunta25
            a.pregunta26 = pregunta26
            a.pregunta27 = pregunta27
            a.pregunta28 = pregunta28
            a.pregunta29 = pregunta29
            a.pregunta30 = pregunta30
            a.pregunta31 = pregunta31
            a.pregunta32 = pregunta32
            a.pregunta33 = pregunta33
            a.total = total
            a.color = color
            a.nivel = nivel
            a.save()
            mensaje = 'Se ha editado correctamente la Autoevaluación psicológica.'
            tipo_mensaje = 'success'
            accion = 'editar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result


class getAutoEvaPisco(TemplateView):
    model = autoevaluacion_psico

    def get(self, request, *args, **kwargs):
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        data = {}

        try:
            a = autoevaluacion_psico.objects.get(atencion=atencion_obj)
            data['pregunta1'] = a.pregunta1
            data['pregunta2'] = a.pregunta2
            data['pregunta3'] = a.pregunta3
            data['pregunta4'] = a.pregunta4
            data['pregunta5'] = a.pregunta5
            data['pregunta6'] = a.pregunta6
            data['pregunta7'] = a.pregunta7
            data['pregunta8'] = a.pregunta8
            data['pregunta9'] = a.pregunta9
            data['pregunta10'] = a.pregunta10
            data['pregunta11'] = a.pregunta11
            data['pregunta12'] = a.pregunta12
            data['pregunta13'] = a.pregunta13
            data['pregunta14'] = a.pregunta14
            data['pregunta15'] = a.pregunta15
            data['pregunta16'] = a.pregunta16
            data['pregunta17'] = a.pregunta17
            data['pregunta18'] = a.pregunta18
            data['pregunta19'] = a.pregunta19
            data['pregunta20'] = a.pregunta20
            data['pregunta21'] = a.pregunta21
            data['pregunta22'] = a.pregunta22
            data['pregunta23'] = a.pregunta23
            data['pregunta24'] = a.pregunta24
            data['pregunta25'] = a.pregunta25
            data['pregunta26'] = a.pregunta26
            data['pregunta27'] = a.pregunta27
            data['pregunta28'] = a.pregunta28
            data['pregunta29'] = a.pregunta29
            data['pregunta30'] = a.pregunta30
            data['pregunta31'] = a.pregunta31
            data['pregunta32'] = a.pregunta32
            data['pregunta33'] = a.pregunta33
            data['total'] = a.total
            data['color'] = a.color
            data['nivel'] = a.nivel
            data['mensaje'] = 'existe'
            return JsonResponse(data)
        except autoevaluacion_psico.DoesNotExist:
            data['mensaje'] = 'no_existe'
            return JsonResponse(data)
