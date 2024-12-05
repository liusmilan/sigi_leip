import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.generic import CreateView, TemplateView
from .models import mst_nivel1, atencion_psicologica
from asignar_app.models import asignar
from usuario_app.views import existeRol


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class agregarEditarMstNivel1(CreateView):
    model = mst_nivel1

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
        total = request.GET.get('total', '')
        color = request.GET.get('color', '')
        nivel = request.GET.get('nivel', '')
        observaciones = request.GET.get('observaciones', '')

        if accion == 'agregar':
            # se esta agregando
            obj = mst_nivel1.objects.create(atencion=atencion_obj, pregunta1=pregunta1, pregunta2=pregunta2, pregunta3=pregunta3, pregunta4=pregunta4, pregunta5=pregunta5, pregunta6=pregunta6, pregunta7=pregunta7, pregunta8=pregunta8, pregunta9=pregunta9, pregunta10=pregunta10, pregunta11=pregunta11,
                                            pregunta12=pregunta12, pregunta13=pregunta13, pregunta14=pregunta14, pregunta15=pregunta15, pregunta16=pregunta16, pregunta17=pregunta17, pregunta18=pregunta18, pregunta19=pregunta19, pregunta20=pregunta20, pregunta21=pregunta21, pregunta22=pregunta22, pregunta23=pregunta23, total=total, color=color, nivel=nivel, observaciones=observaciones)
            mensaje = 'Se ha guardado correctamente la Evaluación psicológica (Mst Nivel 1).'
            tipo_mensaje = 'success'
            accion = 'agregar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result
        elif accion == 'editar':
            # se esta editando
            m = mst_nivel1.objects.get(atencion=atencion_obj)
            m.pregunta1 = pregunta1
            m.pregunta2 = pregunta2
            m.pregunta3 = pregunta3
            m.pregunta4 = pregunta4
            m.pregunta5 = pregunta5
            m.pregunta6 = pregunta6
            m.pregunta7 = pregunta7
            m.pregunta8 = pregunta8
            m.pregunta9 = pregunta9
            m.pregunta10 = pregunta10
            m.pregunta11 = pregunta11
            m.pregunta12 = pregunta12
            m.pregunta13 = pregunta13
            m.pregunta14 = pregunta14
            m.pregunta15 = pregunta15
            m.pregunta16 = pregunta16
            m.pregunta17 = pregunta17
            m.pregunta18 = pregunta18
            m.pregunta19 = pregunta19
            m.pregunta20 = pregunta20
            m.pregunta21 = pregunta21
            m.pregunta22 = pregunta22
            m.pregunta23 = pregunta23
            m.total = total
            m.color = color
            m.nivel = nivel
            m.observaciones = observaciones
            m.save()
            mensaje = 'Se ha editado correctamente la Evaluación psicológica (Mst Nivel 1).'
            tipo_mensaje = 'success'
            accion = 'editar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result


class getMstNivel1(TemplateView):
    model = mst_nivel1

    def get(self, request, *args, **kwargs):
        id_atencion = request.GET.get('id_atencion', '')
        id_user = request.GET.get('id_usuario', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        data = {}

        try:
            evaluador_obj = asignar.objects.get(atencion=atencion_obj)
            evaluador = True            
        except asignar.DoesNotExist:
            evaluador = False

        try:
            m = mst_nivel1.objects.get(atencion=atencion_obj)
            data['pregunta1'] = m.pregunta1
            data['pregunta2'] = m.pregunta2
            data['pregunta3'] = m.pregunta3
            data['pregunta4'] = m.pregunta4
            data['pregunta5'] = m.pregunta5
            data['pregunta6'] = m.pregunta6
            data['pregunta7'] = m.pregunta7
            data['pregunta8'] = m.pregunta8
            data['pregunta9'] = m.pregunta9
            data['pregunta10'] = m.pregunta10
            data['pregunta11'] = m.pregunta11
            data['pregunta12'] = m.pregunta12
            data['pregunta13'] = m.pregunta13
            data['pregunta14'] = m.pregunta14
            data['pregunta15'] = m.pregunta15
            data['pregunta16'] = m.pregunta16
            data['pregunta17'] = m.pregunta17
            data['pregunta18'] = m.pregunta18
            data['pregunta19'] = m.pregunta19
            data['pregunta20'] = m.pregunta20
            data['pregunta21'] = m.pregunta21
            data['pregunta22'] = m.pregunta22
            data['pregunta23'] = m.pregunta23
            data['total'] = m.total
            data['color'] = m.color
            data['nivel'] = m.nivel
            data['observaciones'] = m.observaciones
            data['evaluador'] = evaluador
            data['roles'] = {'solicitante': True if existeRol(id_user, 'SOLICITANTE').get('existe') == True and existeRol(id_user, 'SOLICITANTE').get('cant') == 1 else False,
                             'administrador': existeRol(id_user, 'ADMINISTRADOR').get('existe')}
            data['mensaje'] = 'existe'
            return JsonResponse(data)
        except mst_nivel1.DoesNotExist:
            data['mensaje'] = 'no_existe'
            return JsonResponse(data)
