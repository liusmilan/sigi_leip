from collections import defaultdict
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from datetime import datetime
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import asignar, atencion_psicologica, persona
from motivo_consulta_app.models import motivo_consulta, horario_motivo_consulta
from disponibilidad_horario_consulta_app.models import disponibilidad_horario_consulta
from motivo_consulta_app.views import getHorasDia


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class getHorariosMotivoConsulta(TemplateView):

    def get(self, request, *args, **kwargs):
        data = {}
        id_atencion = request.GET.get('id_atencion', '')

        try:
            atencion = atencion_psicologica.objects.get(id=id_atencion)
            mc = motivo_consulta.objects.get(atencion=atencion)
            hmc = horario_motivo_consulta.objects.filter(motivo_consulta=mc)
            # horario_dia = getHorariosMotivoConsulta(hmc)
            horario_dia = serializers.serialize(
                'json', hmc)
            data['mensaje'] = 'existe_motivo_consulta'
            data['horario'] = horario_dia
            return JsonResponse(data)
        except motivo_consulta.DoesNotExist:
            data['mensaje'] = 'no_existe_motivo_consulta'
            return JsonResponse(data)


class getHorarioDisponilidadHorarioConsulta(TemplateView):

    def get(self, request, *args, **kwargs):
        data = {}
        id_atencion = request.GET.get('id_atencion', '')
        atencion = atencion_psicologica.objects.get(id=id_atencion)
        disponibilidad = disponibilidad_horario_consulta.objects.filter(
            atencion=atencion)

        if len(disponibilidad) > 0:
            horario_dia = serializers.serialize('json', disponibilidad)
            data['mensaje'] = 'existe_disponibilidad'
            data['horario'] = horario_dia
            return JsonResponse(data)
        else:
            data['mensaje'] = 'no_existe_disponibilidad'
            return JsonResponse(data)


class agregarPersonaAsignada(CreateView):
    model = asignar

    def get(self, request, *args, **kwargs):
        accion = request.GET.get('accion', '')
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        id_persona_asignada = request.GET.get('persona_asignada', '')
        persona_obj = persona.objects.get(id=id_persona_asignada)
        fecha = datetime.strptime(request.GET.get(
            'fecha', ''), '%d/%m/%Y')
        hora = request.GET.get('hora', '')
        tipo_persona = request.GET.get('tipo_persona', '')

        if accion == 'agregar':
            # se esta agregando
            obj = asignar.objects.create(
                tipo_persona=tipo_persona, hora=hora, fecha=fecha, persona_asignada=persona_obj, atencion=atencion_obj)
            mensaje = 'Se han guardado correctamente los datos.'
            tipo_mensaje = 'success'
            accion = 'agregar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result
        elif accion == 'editar':
            # se esta editando
            asig = asignar.objects.get(atencion=atencion_obj)
            asig.persona_asignada = persona_obj
            asig.fecha = fecha
            asig.hora = hora
            asig.tipo_persona = tipo_persona
            asig.atencion = atencion_obj
            asig.save()
            mensaje = 'Se han guardado correctamente los datos.'
            tipo_mensaje = 'success'
            accion = 'editar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result


class getAsignadoByAtencion(TemplateView):
    model = asignar

    def get(self, request, *args, **kwargs):
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        tipo_persona = request.GET.get('tipo_persona', '')
        data = {}

        try:
            asig = asignar.objects.get(
                atencion=atencion_obj, tipo_persona=tipo_persona)
            fecha = datetime.strftime(asig.fecha, '%d/%m/%Y')
            data_persona = {'id': asig.persona_asignada.id,
                            'nombre': asig.persona_asignada.nombre,
                            'segundo_nombre': asig.persona_asignada.segundo_nombre,
                            'apellido': asig.persona_asignada.apellido,
                            'segundo_apellido': asig.persona_asignada.segundo_apellido}
            data['tipo_persona'] = asig.tipo_persona
            data['fecha'] = fecha
            data['hora'] = asig.hora
            data['persona_asignada'] = data_persona
            data['mensaje'] = 'existe'
            return JsonResponse(data)
        except asignar.DoesNotExist:
            data['mensaje'] = 'no_existe'
            return JsonResponse(data)


# def getHorariosMotivoConsulta(hmc):
#     resultado = ''
#     horas_por_dia = defaultdict(list)
#     for item in hmc:
#         print('item.dia', item.dia)
#         print('item.hora', item.hora)
#         horas_por_dia[item.dia].append(item.hora)

#     for dia, horas in horas_por_dia.items():
#         resultado += f"{dia}: {'/ '.join(horas)}<br/>"

#     return resultado
