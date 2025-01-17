import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.generic import CreateView, TemplateView
from .models import ssi_beck, atencion_psicologica


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class agregarEditarSSIBeck(CreateView):
    model = ssi_beck

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
        total = request.GET.get('total', '')
        color = request.GET.get('color', '')
        nivel = request.GET.get('nivel', '')
        observaciones = request.GET.get('observaciones', '')

        if accion == 'agregar':
            # se esta agregando
            obj = ssi_beck.objects.create(atencion=atencion_obj, pregunta1=pregunta1, pregunta2=pregunta2, pregunta3=pregunta3, pregunta4=pregunta4, pregunta5=pregunta5, pregunta6=pregunta6, pregunta7=pregunta7, pregunta8=pregunta8, pregunta9=pregunta9, pregunta10=pregunta10, pregunta11=pregunta11,
                                          pregunta12=pregunta12, pregunta13=pregunta13, pregunta14=pregunta14, pregunta15=pregunta15, pregunta16=pregunta16, pregunta17=pregunta17, pregunta18=pregunta18, pregunta19=pregunta19, total=total, color=color, nivel=nivel, observaciones=observaciones)
            mensaje = 'Se ha guardado correctamente la Escala de Ideación Suicida de Beck (SSI BECK).'
            tipo_mensaje = 'success'
            accion = 'agregar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result
        elif accion == 'editar':
            # se esta editando
            s = ssi_beck.objects.get(atencion=atencion_obj)
            s.pregunta1 = pregunta1
            s.pregunta2 = pregunta2
            s.pregunta3 = pregunta3
            s.pregunta4 = pregunta4
            s.pregunta5 = pregunta5
            s.pregunta6 = pregunta6
            s.pregunta7 = pregunta7
            s.pregunta8 = pregunta8
            s.pregunta9 = pregunta9
            s.pregunta10 = pregunta10
            s.pregunta11 = pregunta11
            s.pregunta12 = pregunta12
            s.pregunta13 = pregunta13
            s.pregunta14 = pregunta14
            s.pregunta15 = pregunta15
            s.pregunta16 = pregunta16
            s.pregunta17 = pregunta17
            s.pregunta18 = pregunta18
            s.pregunta19 = pregunta19
            s.total = total
            s.color = color
            s.nivel = nivel
            s.observaciones = observaciones
            s.save()
            mensaje = 'Se ha editado correctamente la Escala de Ideación Suicida de Beck (SSI BECK).'
            tipo_mensaje = 'success'
            accion = 'editar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result


class getSSIBeck(TemplateView):
    model = ssi_beck

    def get(self, request, *args, **kwargs):
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        data = {}

        try:
            s = ssi_beck.objects.get(atencion=atencion_obj)
            data['pregunta1'] = s.pregunta1
            data['pregunta2'] = s.pregunta2
            data['pregunta3'] = s.pregunta3
            data['pregunta4'] = s.pregunta4
            data['pregunta5'] = s.pregunta5
            data['pregunta6'] = s.pregunta6
            data['pregunta7'] = s.pregunta7
            data['pregunta8'] = s.pregunta8
            data['pregunta9'] = s.pregunta9
            data['pregunta10'] = s.pregunta10
            data['pregunta11'] = s.pregunta11
            data['pregunta12'] = s.pregunta12
            data['pregunta13'] = s.pregunta13
            data['pregunta14'] = s.pregunta14
            data['pregunta15'] = s.pregunta15
            data['pregunta16'] = s.pregunta16
            data['pregunta17'] = s.pregunta17
            data['pregunta18'] = s.pregunta18
            data['pregunta19'] = s.pregunta19
            data['total'] = s.total
            data['color'] = s.color
            data['nivel'] = s.nivel
            data['observaciones'] = s.observaciones
            data['mensaje'] = 'existe'
            return JsonResponse(data)
        except ssi_beck.DoesNotExist:
            data['mensaje'] = 'no_existe'
            return JsonResponse(data)
