import json
from typing import Any
from django import http
from django.db import models
from datetime import datetime
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, TemplateView
from .models import fpp, atencion_psicologica


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class agregarEditarFPP(CreateView):
    model = fpp

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
            obj = fpp.objects.create(atencion=atencion_obj, pregunta1=pregunta1, pregunta2=pregunta2, pregunta3=pregunta3, pregunta4=pregunta4, pregunta5=pregunta5, pregunta6=pregunta6, pregunta7=pregunta7, pregunta8=pregunta8, pregunta9=pregunta9, pregunta10=pregunta10, pregunta11=pregunta11, pregunta12=pregunta12, pregunta13=pregunta13, pregunta14=pregunta14, pregunta15=pregunta15, pregunta16=pregunta16, pregunta17=pregunta17,
                                     pregunta18=pregunta18, pregunta19=pregunta19, pregunta20=pregunta20, pregunta21=pregunta21, pregunta22=pregunta22, pregunta23=pregunta23, pregunta24=pregunta24, pregunta25=pregunta25, pregunta26=pregunta26, pregunta27=pregunta27, pregunta28=pregunta28, pregunta29=pregunta29, pregunta30=pregunta30, pregunta31=pregunta31, pregunta32=pregunta32, pregunta33=pregunta33, total=total, color=color, nivel=nivel)
            mensaje = 'Se ha guardado correctamente la Evaluación psicológica (FPP).'
            tipo_mensaje = 'success'
            accion = 'agregar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result
        elif accion == 'editar':
            # se esta editando
            f = fpp.objects.get(atencion=atencion_obj)
            f.pregunta1 = pregunta1
            f.pregunta2 = pregunta2
            f.pregunta3 = pregunta3
            f.pregunta4 = pregunta4
            f.pregunta5 = pregunta5
            f.pregunta6 = pregunta6
            f.pregunta7 = pregunta7
            f.pregunta8 = pregunta8
            f.pregunta9 = pregunta9
            f.pregunta10 = pregunta10
            f.pregunta11 = pregunta11
            f.pregunta12 = pregunta12
            f.pregunta13 = pregunta13
            f.pregunta14 = pregunta14
            f.pregunta15 = pregunta15
            f.pregunta16 = pregunta16
            f.pregunta17 = pregunta17
            f.pregunta18 = pregunta18
            f.pregunta19 = pregunta19
            f.pregunta20 = pregunta20
            f.pregunta21 = pregunta21
            f.pregunta22 = pregunta22
            f.pregunta23 = pregunta23
            f.pregunta24 = pregunta24
            f.pregunta25 = pregunta25
            f.pregunta26 = pregunta26
            f.pregunta27 = pregunta27
            f.pregunta28 = pregunta28
            f.pregunta29 = pregunta29
            f.pregunta30 = pregunta30
            f.pregunta31 = pregunta31
            f.pregunta32 = pregunta32
            f.pregunta33 = pregunta33
            f.total = total
            f.color = color
            f.nivel = nivel
            f.save()
            mensaje = 'Se ha editado correctamente la Evaluación psicológica (FPP).'
            tipo_mensaje = 'success'
            accion = 'editar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result


class getFPP(TemplateView):
    model = fpp

    def get(self, request, *args, **kwargs):
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        data = {}

        try:
            f = fpp.objects.get(atencion=atencion_obj)
            data['pregunta1'] = f.pregunta1
            data['pregunta2'] = f.pregunta2
            data['pregunta3'] = f.pregunta3
            data['pregunta4'] = f.pregunta4
            data['pregunta5'] = f.pregunta5
            data['pregunta6'] = f.pregunta6
            data['pregunta7'] = f.pregunta7
            data['pregunta8'] = f.pregunta8
            data['pregunta9'] = f.pregunta9
            data['pregunta10'] = f.pregunta10
            data['pregunta11'] = f.pregunta11
            data['pregunta12'] = f.pregunta12
            data['pregunta13'] = f.pregunta13
            data['pregunta14'] = f.pregunta14
            data['pregunta15'] = f.pregunta15
            data['pregunta16'] = f.pregunta16
            data['pregunta17'] = f.pregunta17
            data['pregunta18'] = f.pregunta18
            data['pregunta19'] = f.pregunta19
            data['pregunta20'] = f.pregunta20
            data['pregunta21'] = f.pregunta21
            data['pregunta22'] = f.pregunta22
            data['pregunta23'] = f.pregunta23
            data['pregunta24'] = f.pregunta24
            data['pregunta25'] = f.pregunta25
            data['pregunta26'] = f.pregunta26
            data['pregunta27'] = f.pregunta27
            data['pregunta28'] = f.pregunta28
            data['pregunta29'] = f.pregunta29
            data['pregunta30'] = f.pregunta30
            data['pregunta31'] = f.pregunta31
            data['pregunta32'] = f.pregunta32
            data['pregunta33'] = f.pregunta33
            data['total'] = f.total
            data['color'] = f.color
            data['nivel'] = f.nivel
            data['mensaje'] = 'existe'
            return JsonResponse(data)
        except fpp.DoesNotExist:
            data['mensaje'] = 'no_existe'
            return JsonResponse(data)
