import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.generic import CreateView, TemplateView
from .models import mst_nivel2, atencion_psicologica


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class agregarEditarMstNivel2(CreateView):
    model = mst_nivel2

    def get(self, request, *args, **kwargs):
        params = request.GET.get('params', '')
        datos_mst_nivel2 = json.loads(params)
        accion = datos_mst_nivel2.get('accion')
        id_atencion = datos_mst_nivel2.get('id_atencion')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)

        depresion_pregunta1 = datos_mst_nivel2.get('depresion_pregunta1')
        depresion_pregunta2 = datos_mst_nivel2.get('depresion_pregunta2')
        depresion_pregunta3 = datos_mst_nivel2.get('depresion_pregunta3')
        depresion_pregunta4 = datos_mst_nivel2.get('depresion_pregunta4')
        depresion_pregunta5 = datos_mst_nivel2.get('depresion_pregunta5')
        depresion_pregunta6 = datos_mst_nivel2.get('depresion_pregunta6')
        depresion_pregunta7 = datos_mst_nivel2.get('depresion_pregunta7')
        depresion_pregunta8 = datos_mst_nivel2.get('depresion_pregunta8')
        evaluacion_depresion = datos_mst_nivel2.get('evaluacion_depresion')
        color_evaluacion_depresion = datos_mst_nivel2.get(
            'color_evaluacion_depresion')
        nivel_evaluacion_depresion = datos_mst_nivel2.get(
            'nivel_evaluacion_depresion')

        ira_pregunta1 = datos_mst_nivel2.get('ira_pregunta1')
        ira_pregunta2 = datos_mst_nivel2.get('ira_pregunta2')
        ira_pregunta3 = datos_mst_nivel2.get('ira_pregunta3')
        ira_pregunta4 = datos_mst_nivel2.get('ira_pregunta4')
        ira_pregunta5 = datos_mst_nivel2.get('ira_pregunta5')
        evaluacion_ira = datos_mst_nivel2.get('evaluacion_ira')
        color_evaluacion_ira = datos_mst_nivel2.get('color_evaluacion_ira')
        nivel_evaluacion_ira = datos_mst_nivel2.get('nivel_evaluacion_ira')

        mania_pregunta1 = datos_mst_nivel2.get('mania_pregunta1')
        mania_pregunta2 = datos_mst_nivel2.get('mania_pregunta2')
        mania_pregunta3 = datos_mst_nivel2.get('mania_pregunta3')
        mania_pregunta4 = datos_mst_nivel2.get('mania_pregunta4')
        mania_pregunta5 = datos_mst_nivel2.get('mania_pregunta5')
        evaluacion_mania = datos_mst_nivel2.get('evaluacion_mania')
        color_evaluacion_mania = datos_mst_nivel2.get('color_evaluacion_mania')
        nivel_evaluacion_mania = datos_mst_nivel2.get('nivel_evaluacion_mania')

        ansiedad_pregunta1 = datos_mst_nivel2.get('ansiedad_pregunta1')
        ansiedad_pregunta2 = datos_mst_nivel2.get('ansiedad_pregunta2')
        ansiedad_pregunta3 = datos_mst_nivel2.get('ansiedad_pregunta3')
        ansiedad_pregunta4 = datos_mst_nivel2.get('ansiedad_pregunta4')
        ansiedad_pregunta5 = datos_mst_nivel2.get('ansiedad_pregunta5')
        ansiedad_pregunta6 = datos_mst_nivel2.get('ansiedad_pregunta6')
        ansiedad_pregunta7 = datos_mst_nivel2.get('ansiedad_pregunta7')
        evaluacion_ansiedad = datos_mst_nivel2.get('evaluacion_ansiedad')
        color_evaluacion_ansiedad = datos_mst_nivel2.get(
            'color_evaluacion_ansiedad')
        nivel_evaluacion_ansiedad = datos_mst_nivel2.get(
            'nivel_evaluacion_ansiedad')

        somaticos_pregunta1 = datos_mst_nivel2.get('somaticos_pregunta1')
        somaticos_pregunta2 = datos_mst_nivel2.get('somaticos_pregunta2')
        somaticos_pregunta3 = datos_mst_nivel2.get('somaticos_pregunta3')
        somaticos_pregunta4 = datos_mst_nivel2.get('somaticos_pregunta4')
        somaticos_pregunta5 = datos_mst_nivel2.get('somaticos_pregunta5')
        somaticos_pregunta6 = datos_mst_nivel2.get('somaticos_pregunta6')
        somaticos_pregunta7 = datos_mst_nivel2.get('somaticos_pregunta7')
        somaticos_pregunta8 = datos_mst_nivel2.get('somaticos_pregunta8')
        somaticos_pregunta9 = datos_mst_nivel2.get('somaticos_pregunta9')
        somaticos_pregunta10 = datos_mst_nivel2.get('somaticos_pregunta10')
        somaticos_pregunta11 = datos_mst_nivel2.get('somaticos_pregunta11')
        somaticos_pregunta12 = datos_mst_nivel2.get('somaticos_pregunta12')
        somaticos_pregunta13 = datos_mst_nivel2.get('somaticos_pregunta13')
        somaticos_pregunta14 = datos_mst_nivel2.get('somaticos_pregunta14')
        somaticos_pregunta15 = datos_mst_nivel2.get('somaticos_pregunta15')
        evaluacion_somaticos = datos_mst_nivel2.get('evaluacion_somatico')
        color_evaluacion_somaticos = datos_mst_nivel2.get(
            'color_evaluacion_somatico')
        nivel_evaluacion_somaticos = datos_mst_nivel2.get(
            'nivel_evaluacion_somatico')

        suenno_pregunta1 = datos_mst_nivel2.get('suenno_pregunta1')
        suenno_pregunta2 = datos_mst_nivel2.get('suenno_pregunta2')
        suenno_pregunta3 = datos_mst_nivel2.get('suenno_pregunta3')
        suenno_pregunta4 = datos_mst_nivel2.get('suenno_pregunta4')
        suenno_pregunta5 = datos_mst_nivel2.get('suenno_pregunta5')
        suenno_pregunta6 = datos_mst_nivel2.get('suenno_pregunta6')
        suenno_pregunta7 = datos_mst_nivel2.get('suenno_pregunta7')
        suenno_pregunta8 = datos_mst_nivel2.get('suenno_pregunta8')
        evaluacion_suenno = datos_mst_nivel2.get('evaluacion_suenno')
        color_evaluacion_suenno = datos_mst_nivel2.get(
            'color_evaluacion_suenno')
        nivel_evaluacion_suenno = datos_mst_nivel2.get(
            'nivel_evaluacion_suenno')

        repetitivo_pregunta1 = datos_mst_nivel2.get('repetitivo_pregunta1')
        repetitivo_pregunta2 = datos_mst_nivel2.get('repetitivo_pregunta2')
        repetitivo_pregunta3 = datos_mst_nivel2.get('repetitivo_pregunta3')
        repetitivo_pregunta4 = datos_mst_nivel2.get('repetitivo_pregunta4')
        repetitivo_pregunta5 = datos_mst_nivel2.get('repetitivo_pregunta5')
        evaluacion_repetitivo = datos_mst_nivel2.get('evaluacion_repetitivo')
        color_evaluacion_repetitivo = datos_mst_nivel2.get(
            'color_evaluacion_repetitivo')
        nivel_evaluacion_repetitivo = datos_mst_nivel2.get(
            'nivel_evaluacion_repetitivo')

        sustancia_pregunta1 = datos_mst_nivel2.get('sustancia_pregunta1')
        sustancia_pregunta2 = datos_mst_nivel2.get('sustancia_pregunta2')
        sustancia_pregunta3 = datos_mst_nivel2.get('sustancia_pregunta3')
        sustancia_pregunta4 = datos_mst_nivel2.get('sustancia_pregunta4')
        sustancia_pregunta5 = datos_mst_nivel2.get('sustancia_pregunta5')
        sustancia_pregunta6 = datos_mst_nivel2.get('sustancia_pregunta6')
        sustancia_pregunta7 = datos_mst_nivel2.get('sustancia_pregunta7')
        sustancia_pregunta8 = datos_mst_nivel2.get('sustancia_pregunta8')
        sustancia_pregunta9 = datos_mst_nivel2.get('sustancia_pregunta9')
        sustancia_pregunta10 = datos_mst_nivel2.get('sustancia_pregunta10')
        evaluacion_sustancia = datos_mst_nivel2.get('evaluacion_sustancia')
        color_evaluacion_sustancia = datos_mst_nivel2.get(
            'color_evaluacion_sustancia')
        nivel_evaluacion_sustancia = datos_mst_nivel2.get(
            'nivel_evaluacion_sustancia')

        if accion == 'agregar':
            # se esta agregando
            obj = mst_nivel2.objects.create(atencion=atencion_obj, depresion_pregunta1=depresion_pregunta1, depresion_pregunta2=depresion_pregunta2, depresion_pregunta3=depresion_pregunta3, depresion_pregunta4=depresion_pregunta4, depresion_pregunta5=depresion_pregunta5, depresion_pregunta6=depresion_pregunta6, depresion_pregunta7=depresion_pregunta7, depresion_pregunta8=depresion_pregunta8, evaluacion_depresion=evaluacion_depresion, color_evaluacion_depresion=color_evaluacion_depresion, nivel_evaluacion_depresion=nivel_evaluacion_depresion,
                                            ira_pregunta1=ira_pregunta1, ira_pregunta2=ira_pregunta2, ira_pregunta3=ira_pregunta3, ira_pregunta4=ira_pregunta4, ira_pregunta5=ira_pregunta5, evaluacion_ira=evaluacion_ira, color_evaluacion_ira=color_evaluacion_ira, nivel_evaluacion_ira=nivel_evaluacion_ira,
                                            mania_pregunta1=mania_pregunta1, mania_pregunta2=mania_pregunta2, mania_pregunta3=mania_pregunta3, mania_pregunta4=mania_pregunta4, mania_pregunta5=mania_pregunta5, evaluacion_mania=evaluacion_mania, color_evaluacion_mania=color_evaluacion_mania, nivel_evaluacion_mania=nivel_evaluacion_mania,
                                            ansiedad_pregunta1=ansiedad_pregunta1, ansiedad_pregunta2=ansiedad_pregunta2, ansiedad_pregunta3=ansiedad_pregunta3, ansiedad_pregunta4=ansiedad_pregunta4, ansiedad_pregunta5=ansiedad_pregunta5, ansiedad_pregunta6=ansiedad_pregunta6, ansiedad_pregunta7=ansiedad_pregunta7, evaluacion_ansiedad=evaluacion_ansiedad, color_evaluacion_ansiedad=color_evaluacion_ansiedad, nivel_evaluacion_ansiedad=nivel_evaluacion_ansiedad,
                                            somaticos_pregunta1=somaticos_pregunta1, somaticos_pregunta2=somaticos_pregunta2, somaticos_pregunta3=somaticos_pregunta3, somaticos_pregunta4=somaticos_pregunta4, somaticos_pregunta5=somaticos_pregunta5, somaticos_pregunta6=somaticos_pregunta6, somaticos_pregunta7=somaticos_pregunta7, somaticos_pregunta8=somaticos_pregunta8, somaticos_pregunta9=somaticos_pregunta9, somaticos_pregunta10=somaticos_pregunta10, somaticos_pregunta11=somaticos_pregunta11, somaticos_pregunta12=somaticos_pregunta12, somaticos_pregunta13=somaticos_pregunta13, somaticos_pregunta14=somaticos_pregunta14, somaticos_pregunta15=somaticos_pregunta15, evaluacion_somaticos=evaluacion_somaticos, color_evaluacion_somaticos=color_evaluacion_somaticos, nivel_evaluacion_somaticos=nivel_evaluacion_somaticos,
                                            suenno_pregunta1=suenno_pregunta1, suenno_pregunta2=suenno_pregunta2, suenno_pregunta3=suenno_pregunta3, suenno_pregunta4=suenno_pregunta4, suenno_pregunta5=suenno_pregunta5, suenno_pregunta6=suenno_pregunta6, suenno_pregunta7=suenno_pregunta7, suenno_pregunta8=suenno_pregunta8, evaluacion_suenno=evaluacion_suenno, color_evaluacion_suenno=color_evaluacion_suenno, nivel_evaluacion_suenno=nivel_evaluacion_suenno,
                                            repetitivo_pregunta1=repetitivo_pregunta1, repetitivo_pregunta2=repetitivo_pregunta2, repetitivo_pregunta3=repetitivo_pregunta3, repetitivo_pregunta4=repetitivo_pregunta4, repetitivo_pregunta5=repetitivo_pregunta5, evaluacion_repetitivo=evaluacion_repetitivo, color_evaluacion_repetitivo=color_evaluacion_repetitivo, nivel_evaluacion_repetitivo=nivel_evaluacion_repetitivo,
                                            sustancia_pregunta1=sustancia_pregunta1, sustancia_pregunta2=sustancia_pregunta2, sustancia_pregunta3=sustancia_pregunta3, sustancia_pregunta4=sustancia_pregunta4, sustancia_pregunta5=sustancia_pregunta5, sustancia_pregunta6=sustancia_pregunta6, sustancia_pregunta7=sustancia_pregunta7, sustancia_pregunta8=sustancia_pregunta8, sustancia_pregunta9=sustancia_pregunta9, sustancia_pregunta10=sustancia_pregunta10, evaluacion_sustancia=evaluacion_sustancia, color_evaluacion_sustancia=color_evaluacion_sustancia, nivel_evaluacion_sustancia=nivel_evaluacion_sustancia)
            mensaje = 'Se ha guardado correctamente la Evaluación psicológica (Mst Nivel 2).'
            tipo_mensaje = 'success'
            accion = 'agregar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result
        elif accion == 'editar':
            # se esta editando
            m = mst_nivel2.objects.get(atencion=atencion_obj)
            m.depresion_pregunta1 = depresion_pregunta1
            m.depresion_pregunta2 = depresion_pregunta2
            m.depresion_pregunta3 = depresion_pregunta3
            m.depresion_pregunta4 = depresion_pregunta4
            m.depresion_pregunta5 = depresion_pregunta5
            m.depresion_pregunta6 = depresion_pregunta6
            m.depresion_pregunta7 = depresion_pregunta7
            m.depresion_pregunta8 = depresion_pregunta8
            m.evaluacion_depresion = evaluacion_depresion
            m.color_evaluacion_depresion = color_evaluacion_depresion
            m.nivel_evaluacion_depresion = nivel_evaluacion_depresion

            m.ira_pregunta1 = ira_pregunta1
            m.ira_pregunta2 = ira_pregunta2
            m.ira_pregunta3 = ira_pregunta3
            m.ira_pregunta4 = ira_pregunta4
            m.ira_pregunta5 = ira_pregunta5
            m.evaluacion_ira = evaluacion_ira
            m.color_evaluacion_ira = color_evaluacion_ira
            m.nivel_evaluacion_ira = nivel_evaluacion_ira

            m.mania_pregunta1 = mania_pregunta1
            m.mania_pregunta2 = mania_pregunta2
            m.mania_pregunta3 = mania_pregunta3
            m.mania_pregunta4 = mania_pregunta4
            m.mania_pregunta5 = mania_pregunta5
            m.evaluacion_mania = evaluacion_mania
            m.color_evaluacion_mania = color_evaluacion_mania
            m.nivel_evaluacion_mania = nivel_evaluacion_mania

            m.ansiedad_pregunta1 = ansiedad_pregunta1
            m.ansiedad_pregunta2 = ansiedad_pregunta2
            m.ansiedad_pregunta3 = ansiedad_pregunta3
            m.ansiedad_pregunta4 = ansiedad_pregunta4
            m.ansiedad_pregunta5 = ansiedad_pregunta5
            m.ansiedad_pregunta6 = ansiedad_pregunta6
            m.ansiedad_pregunta7 = ansiedad_pregunta7
            m.evaluacion_ansiedad = evaluacion_ansiedad
            m.color_evaluacion_ansiedad = color_evaluacion_ansiedad
            m.nivel_evaluacion_ansiedad = nivel_evaluacion_ansiedad

            m.somaticos_pregunta1 = somaticos_pregunta1
            m.somaticos_pregunta2 = somaticos_pregunta2
            m.somaticos_pregunta3 = somaticos_pregunta3
            m.somaticos_pregunta4 = somaticos_pregunta4
            m.somaticos_pregunta5 = somaticos_pregunta5
            m.somaticos_pregunta6 = somaticos_pregunta6
            m.somaticos_pregunta7 = somaticos_pregunta7
            m.somaticos_pregunta8 = somaticos_pregunta8
            m.somaticos_pregunta9 = somaticos_pregunta9
            m.somaticos_pregunta10 = somaticos_pregunta10
            m.somaticos_pregunta11 = somaticos_pregunta11
            m.somaticos_pregunta12 = somaticos_pregunta12
            m.somaticos_pregunta13 = somaticos_pregunta13
            m.somaticos_pregunta14 = somaticos_pregunta14
            m.somaticos_pregunta15 = somaticos_pregunta15
            m.evaluacion_somaticos = evaluacion_somaticos
            m.color_evaluacion_somaticos = color_evaluacion_somaticos
            m.nivel_evaluacion_somaticos = nivel_evaluacion_somaticos

            m.suenno_pregunta1 = suenno_pregunta1
            m.suenno_pregunta2 = suenno_pregunta2
            m.suenno_pregunta3 = suenno_pregunta3
            m.suenno_pregunta4 = suenno_pregunta4
            m.suenno_pregunta5 = suenno_pregunta5
            m.suenno_pregunta6 = suenno_pregunta6
            m.suenno_pregunta7 = suenno_pregunta7
            m.suenno_pregunta8 = suenno_pregunta8
            m.evaluacion_suenno = evaluacion_suenno
            m.color_evaluacion_suenno = color_evaluacion_suenno
            m.nivel_evaluacion_suenno = nivel_evaluacion_suenno

            m.repetitivo_pregunta1 = repetitivo_pregunta1
            m.repetitivo_pregunta2 = repetitivo_pregunta2
            m.repetitivo_pregunta3 = repetitivo_pregunta3
            m.repetitivo_pregunta4 = repetitivo_pregunta4
            m.repetitivo_pregunta5 = repetitivo_pregunta5
            m.evaluacion_repetitivo = evaluacion_repetitivo
            m.color_evaluacion_repetitivo = color_evaluacion_repetitivo
            m.nivel_evaluacion_repetitivo = nivel_evaluacion_repetitivo

            m.sustancia_pregunta1 = sustancia_pregunta1
            m.sustancia_pregunta2 = sustancia_pregunta2
            m.sustancia_pregunta3 = sustancia_pregunta3
            m.sustancia_pregunta4 = sustancia_pregunta4
            m.sustancia_pregunta5 = sustancia_pregunta5
            m.sustancia_pregunta6 = sustancia_pregunta6
            m.sustancia_pregunta7 = sustancia_pregunta7
            m.sustancia_pregunta8 = sustancia_pregunta8
            m.sustancia_pregunta9 = sustancia_pregunta9
            m.sustancia_pregunta10 = sustancia_pregunta10
            m.evaluacion_sustancia = evaluacion_sustancia
            m.color_evaluacion_sustancia = color_evaluacion_sustancia
            m.nivel_evaluacion_sustancia = nivel_evaluacion_sustancia

            m.save()
            mensaje = 'Se ha editado correctamente la Evaluación psicológica (Mst Nivel 2).'
            tipo_mensaje = 'success'
            accion = 'editar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result


class getMstNivel2(TemplateView):
    model = mst_nivel2

    def get(self, request, *args, **kwargs):
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        data = {}

        try:
            m = mst_nivel2.objects.get(atencion=atencion_obj)
            data['depresion_pregunta1'] = m.depresion_pregunta1
            data['depresion_pregunta2'] = m.depresion_pregunta2
            data['depresion_pregunta3'] = m.depresion_pregunta3
            data['depresion_pregunta4'] = m.depresion_pregunta4
            data['depresion_pregunta5'] = m.depresion_pregunta5
            data['depresion_pregunta6'] = m.depresion_pregunta6
            data['depresion_pregunta7'] = m.depresion_pregunta7
            data['depresion_pregunta8'] = m.depresion_pregunta8
            data['evaluacion_depresion'] = m.evaluacion_depresion
            data['color_evaluacion_depresion'] = m.color_evaluacion_depresion
            data['nivel_evaluacion_depresion'] = m.nivel_evaluacion_depresion

            data['ira_pregunta1'] = m.ira_pregunta1
            data['ira_pregunta2'] = m.ira_pregunta2
            data['ira_pregunta3'] = m.ira_pregunta3
            data['ira_pregunta4'] = m.ira_pregunta4
            data['ira_pregunta5'] = m.ira_pregunta5
            data['evaluacion_ira'] = m.evaluacion_ira
            data['color_evaluacion_ira'] = m.color_evaluacion_ira
            data['nivel_evaluacion_ira'] = m.nivel_evaluacion_ira

            data['mania_pregunta1'] = m.mania_pregunta1
            data['mania_pregunta2'] = m.mania_pregunta2
            data['mania_pregunta3'] = m.mania_pregunta3
            data['mania_pregunta4'] = m.mania_pregunta4
            data['mania_pregunta5'] = m.mania_pregunta5
            data['evaluacion_mania'] = m.evaluacion_mania
            data['color_evaluacion_mania'] = m.color_evaluacion_mania
            data['nivel_evaluacion_mania'] = m.nivel_evaluacion_mania

            data['ansiedad_pregunta1'] = m.ansiedad_pregunta1
            data['ansiedad_pregunta2'] = m.ansiedad_pregunta2
            data['ansiedad_pregunta3'] = m.ansiedad_pregunta3
            data['ansiedad_pregunta4'] = m.ansiedad_pregunta4
            data['ansiedad_pregunta5'] = m.ansiedad_pregunta5
            data['ansiedad_pregunta6'] = m.ansiedad_pregunta6
            data['ansiedad_pregunta7'] = m.ansiedad_pregunta7
            data['evaluacion_ansiedad'] = m.evaluacion_ansiedad
            data['color_evaluacion_ansiedad'] = m.color_evaluacion_ansiedad
            data['nivel_evaluacion_ansiedad'] = m.nivel_evaluacion_ansiedad

            data['somaticos_pregunta1'] = m.somaticos_pregunta1
            data['somaticos_pregunta2'] = m.somaticos_pregunta2
            data['somaticos_pregunta3'] = m.somaticos_pregunta3
            data['somaticos_pregunta4'] = m.somaticos_pregunta4
            data['somaticos_pregunta5'] = m.somaticos_pregunta5
            data['somaticos_pregunta6'] = m.somaticos_pregunta6
            data['somaticos_pregunta7'] = m.somaticos_pregunta7
            data['somaticos_pregunta8'] = m.somaticos_pregunta8
            data['somaticos_pregunta9'] = m.somaticos_pregunta9
            data['somaticos_pregunta10'] = m.somaticos_pregunta10
            data['somaticos_pregunta11'] = m.somaticos_pregunta11
            data['somaticos_pregunta12'] = m.somaticos_pregunta12
            data['somaticos_pregunta13'] = m.somaticos_pregunta13
            data['somaticos_pregunta14'] = m.somaticos_pregunta14
            data['somaticos_pregunta15'] = m.somaticos_pregunta15
            data['evaluacion_somaticos'] = m.evaluacion_somaticos
            data['color_evaluacion_somaticos'] = m.color_evaluacion_somaticos
            data['nivel_evaluacion_somaticos'] = m.nivel_evaluacion_somaticos

            data['suenno_pregunta1'] = m.suenno_pregunta1
            data['suenno_pregunta2'] = m.suenno_pregunta2
            data['suenno_pregunta3'] = m.suenno_pregunta3
            data['suenno_pregunta4'] = m.suenno_pregunta4
            data['suenno_pregunta5'] = m.suenno_pregunta5
            data['suenno_pregunta6'] = m.suenno_pregunta6
            data['suenno_pregunta7'] = m.suenno_pregunta7
            data['suenno_pregunta8'] = m.suenno_pregunta8
            data['evaluacion_suenno'] = m.evaluacion_suenno
            data['color_evaluacion_suenno'] = m.color_evaluacion_suenno
            data['nivel_evaluacion_suenno'] = m.nivel_evaluacion_suenno

            data['repetitivo_pregunta1'] = m.repetitivo_pregunta1
            data['repetitivo_pregunta2'] = m.repetitivo_pregunta2
            data['repetitivo_pregunta3'] = m.repetitivo_pregunta3
            data['repetitivo_pregunta4'] = m.repetitivo_pregunta4
            data['repetitivo_pregunta5'] = m.repetitivo_pregunta5
            data['evaluacion_repetitivo'] = m.evaluacion_repetitivo
            data['color_evaluacion_repetitivo'] = m.color_evaluacion_repetitivo
            data['nivel_evaluacion_repetitivo'] = m.nivel_evaluacion_repetitivo

            data['sustancia_pregunta1'] = m.sustancia_pregunta1
            data['sustancia_pregunta2'] = m.sustancia_pregunta2
            data['sustancia_pregunta3'] = m.sustancia_pregunta3
            data['sustancia_pregunta4'] = m.sustancia_pregunta4
            data['sustancia_pregunta5'] = m.sustancia_pregunta5
            data['sustancia_pregunta6'] = m.sustancia_pregunta6
            data['sustancia_pregunta7'] = m.sustancia_pregunta7
            data['sustancia_pregunta8'] = m.sustancia_pregunta8
            data['sustancia_pregunta9'] = m.sustancia_pregunta9
            data['sustancia_pregunta10'] = m.sustancia_pregunta10
            data['evaluacion_sustancia'] = m.evaluacion_sustancia
            data['color_evaluacion_sustancia'] = m.color_evaluacion_sustancia
            data['nivel_evaluacion_sustancia'] = m.nivel_evaluacion_sustancia

            data['mensaje'] = 'existe'
            return JsonResponse(data)
        except mst_nivel2.DoesNotExist:
            data['mensaje'] = 'no_existe'
            return JsonResponse(data)
