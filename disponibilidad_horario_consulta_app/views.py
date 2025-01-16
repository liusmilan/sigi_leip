import json
from django.shortcuts import render
from django.core import serializers
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from django.http import HttpResponse, JsonResponse
from .models import disponibilidad_horario_consulta, atencion_psicologica


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class agregarEditarDisponibilidadHorarioConsulta(CreateView):
    model = disponibilidad_horario_consulta

    def get(self, request, *args, **kwargs):
        accion = request.GET.get('accion', '')
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        datosHorarioLunes = request.GET.getlist('horarioLunes[]', '')
        datosHorarioMartes = request.GET.getlist('horarioMartes[]', '')
        datosHorarioMiercoles = request.GET.getlist('horarioMiercoles[]', '')
        datosHorarioJueves = request.GET.getlist('horarioJueves[]', '')
        datosHorarioViernes = request.GET.getlist('horarioViernes[]', '')
        datosHorarioSabado = request.GET.getlist('horarioSabado[]', '')

        if accion == 'agregar':
            # se esta agregando
            if datosHorarioLunes[0] != '':
                listaHorarioLunes = json.loads(datosHorarioLunes[0])
                dia = listaHorarioLunes[0].get('dia')
                guardarDisponibilidadHorarioConsulta(
                    dia, listaHorarioLunes, atencion_obj)

            if datosHorarioMartes[0] != '':
                listaHorarioMartes = json.loads(datosHorarioMartes[0])
                dia = listaHorarioMartes[0].get('dia')
                guardarDisponibilidadHorarioConsulta(
                    dia, listaHorarioMartes, atencion_obj)

            if datosHorarioMiercoles[0] != '':
                listaHorarioMiercoles = json.loads(datosHorarioMiercoles[0])
                dia = listaHorarioMiercoles[0].get('dia')
                guardarDisponibilidadHorarioConsulta(
                    dia, listaHorarioMiercoles, atencion_obj)

            if datosHorarioJueves[0] != '':
                listaHorarioJueves = json.loads(datosHorarioJueves[0])
                dia = listaHorarioJueves[0].get('dia')
                guardarDisponibilidadHorarioConsulta(
                    dia, listaHorarioJueves, atencion_obj)

            if datosHorarioViernes[0] != '':
                listaHorarioViernes = json.loads(datosHorarioViernes[0])
                dia = listaHorarioViernes[0].get('dia')
                guardarDisponibilidadHorarioConsulta(
                    dia, listaHorarioViernes, atencion_obj)

            if datosHorarioSabado[0] != '':
                listaHorarioSabado = json.loads(datosHorarioSabado[0])
                dia = listaHorarioSabado[0].get('dia')
                guardarDisponibilidadHorarioConsulta(
                    dia, listaHorarioSabado, atencion_obj)

            mensaje = 'Se ha agregado correctamente la Disponibilidad de Horario para Consulta.'
            tipo_mensaje = 'success'
            accion = 'agregar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result
        elif accion == 'editar':
            # se esta editando
            eliminarDisponibilidadHorarioConsulta(atencion_obj)

            if datosHorarioLunes[0] != '':
                listaHorarioLunes = json.loads(datosHorarioLunes[0])
                dia = listaHorarioLunes[0].get('dia')
                guardarDisponibilidadHorarioConsulta(
                    dia, listaHorarioLunes, atencion_obj)

            if datosHorarioMartes[0] != '':
                listaHorarioMartes = json.loads(datosHorarioMartes[0])
                dia = listaHorarioMartes[0].get('dia')
                guardarDisponibilidadHorarioConsulta(
                    dia, listaHorarioMartes, atencion_obj)

            if datosHorarioMiercoles[0] != '':
                listaHorarioMiercoles = json.loads(datosHorarioMiercoles[0])
                dia = listaHorarioMiercoles[0].get('dia')
                guardarDisponibilidadHorarioConsulta(
                    dia, listaHorarioMiercoles, atencion_obj)

            if datosHorarioJueves[0] != '':
                listaHorarioJueves = json.loads(datosHorarioJueves[0])
                dia = listaHorarioJueves[0].get('dia')
                guardarDisponibilidadHorarioConsulta(
                    dia, listaHorarioJueves, atencion_obj)

            if datosHorarioViernes[0] != '':
                listaHorarioViernes = json.loads(datosHorarioViernes[0])
                dia = listaHorarioViernes[0].get('dia')
                guardarDisponibilidadHorarioConsulta(
                    dia, listaHorarioViernes, atencion_obj)

            if datosHorarioSabado[0] != '':
                listaHorarioSabado = json.loads(datosHorarioSabado[0])
                dia = listaHorarioSabado[0].get('dia')
                guardarDisponibilidadHorarioConsulta(
                    dia, listaHorarioSabado, atencion_obj)

            mensaje = 'Se ha editado correctamente la Disponibilidad de Horario para Consulta.'
            tipo_mensaje = 'success'
            accion = 'editar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result


class getDisponibilidadHorarioConsultaByAtencion(TemplateView):
    model = disponibilidad_horario_consulta

    def get(self, request, *args, **kwargs):
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        data = {}

        disponibilidad = disponibilidad_horario_consulta.objects.filter(
            atencion=atencion_obj)

        if len(disponibilidad) > 0:
            horas_lunes = disponibilidad_horario_consulta.objects.filter(
                atencion=atencion_obj, dia='lunes')
            horas_martes = disponibilidad_horario_consulta.objects.filter(
                atencion=atencion_obj, dia='martes')
            horas_miercoles = disponibilidad_horario_consulta.objects.filter(
                atencion=atencion_obj, dia='miercoles')
            horas_jueves = disponibilidad_horario_consulta.objects.filter(
                atencion=atencion_obj, dia='jueves')
            horas_viernes = disponibilidad_horario_consulta.objects.filter(
                atencion=atencion_obj, dia='viernes')
            horas_sabado = disponibilidad_horario_consulta.objects.filter(
                atencion=atencion_obj, dia='sabado')

            if len(horas_lunes) > 0:
                data_horas_lunes = serializers.serialize('json', horas_lunes)
            else:
                data_horas_lunes = ''

            if len(horas_martes) > 0:
                data_horas_martes = serializers.serialize('json', horas_martes)
            else:
                data_horas_martes = ''

            if len(horas_miercoles) > 0:
                data_horas_miercoles = serializers.serialize(
                    'json', horas_miercoles)
            else:
                data_horas_miercoles = ''

            if len(horas_jueves) > 0:
                data_horas_jueves = serializers.serialize('json', horas_jueves)
            else:
                data_horas_jueves = ''

            if len(horas_viernes) > 0:
                data_horas_viernes = serializers.serialize(
                    'json', horas_viernes)
            else:
                data_horas_viernes = ''

            if len(horas_sabado) > 0:
                data_horas_sabado = serializers.serialize('json', horas_sabado)
            else:
                data_horas_sabado = ''

            data['horario_lunes'] = {'dia': 'lunes', 'horas': data_horas_lunes}
            data['horario_martes'] = {
                'dia': 'martes', 'horas': data_horas_martes}
            data['horario_miercoles'] = {
                'dia': 'miercoles', 'horas': data_horas_miercoles}
            data['horario_jueves'] = {
                'dia': 'jueves', 'horas': data_horas_jueves}
            data['horario_viernes'] = {
                'dia': 'viernes', 'horas': data_horas_viernes}
            data['horario_sabado'] = {
                'dia': 'sabado', 'horas': data_horas_sabado}
            data['mensaje'] = 'existe'
            return JsonResponse(data)
        else:
            data['mensaje'] = 'no_existe'
            return JsonResponse(data)


def guardarDisponibilidadHorarioConsulta(dia, listaHoras, atencion):
    for h in listaHoras[0].get('horas'):
        disponibilidad_horario_consulta.objects.create(
            dia=dia, hora=h, atencion=atencion)


def eliminarDisponibilidadHorarioConsulta(atencion):
    for d in disponibilidad_horario_consulta.objects.filter(atencion=atencion):
        d.delete()
