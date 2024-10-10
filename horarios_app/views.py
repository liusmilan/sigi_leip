from django.shortcuts import render, redirect
import json
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from django.http import HttpResponse, JsonResponse
from .models import horario


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class horario_cita_valoracion(TemplateView):
    model = horario

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_horarios = []
            data = {}
            data_lunes = getHorasDia('cita', 'lunes')
            data_martes = getHorasDia('cita', 'martes')
            data_miercoles = getHorasDia('cita', 'miercoles')
            data_jueves = getHorasDia('cita', 'jueves')
            data_viernes = getHorasDia('cita', 'viernes')
            data_sabado = getHorasDia('cita', 'sabado')

            data['horario_lunes'] = data_lunes
            data['horario_martes'] = data_martes
            data['horario_miercoles'] = data_miercoles
            data['horario_jueves'] = data_jueves
            data['horario_viernes'] = data_viernes
            data['horario_sabado'] = data_sabado
            lista_horarios.append(data)
            return HttpResponse(json.dumps(lista_horarios), 'application/json')
        else:
            return redirect('horario:inicio_horario_cita_valoracion')


class horario_consulta_psicoterapeutica(TemplateView):
    # template_name = 'configuracion/horarios/horario_consulta_psicoterapeutica.html'
    model = horario

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_horarios = []
            data = {}
            data_lunes = getHorasDia('consulta', 'lunes')
            data_martes = getHorasDia('consulta', 'martes')
            data_miercoles = getHorasDia('consulta', 'miercoles')
            data_jueves = getHorasDia('consulta', 'jueves')
            data_viernes = getHorasDia('consulta', 'viernes')
            data_sabado = getHorasDia('consulta', 'sabado')

            data['horario_lunes'] = data_lunes
            data['horario_martes'] = data_martes
            data['horario_miercoles'] = data_miercoles
            data['horario_jueves'] = data_jueves
            data['horario_viernes'] = data_viernes
            data['horario_sabado'] = data_sabado
            lista_horarios.append(data)
            return HttpResponse(json.dumps(lista_horarios), 'application/json')
        else:
            return redirect('horario:inicio_horario_consulta_psicoterapeutica')


class agregarHorario(CreateView):
    model = horario

    def get(self, request, *args, **kwargs):
        tipoHorario = request.GET.get('tipoHorario', '')
        datosHorarioLunes = request.GET.getlist('horarioLunes[]', '')
        datosHorarioMartes = request.GET.getlist('horarioMartes[]', '')
        datosHorarioMiercoles = request.GET.getlist('horarioMiercoles[]', '')
        datosHorarioJueves = request.GET.getlist('horarioJueves[]', '')
        datosHorarioViernes = request.GET.getlist('horarioViernes[]', '')
        datosHorarioSabado = request.GET.getlist('horarioSabado[]', '')

        eliminarHorarios(tipoHorario)

        if datosHorarioLunes[0] != '':
            listaHorarioLunes = json.loads(datosHorarioLunes[0])
            dia = listaHorarioLunes[0].get('dia')
            guardarHorarios(dia, listaHorarioLunes, tipoHorario)

        if datosHorarioMartes[0] != '':
            listaHorarioMartes = json.loads(datosHorarioMartes[0])
            dia = listaHorarioMartes[0].get('dia')
            guardarHorarios(dia, listaHorarioMartes, tipoHorario)

        if datosHorarioMiercoles[0] != '':
            listaHorarioMiercoles = json.loads(datosHorarioMiercoles[0])
            dia = listaHorarioMiercoles[0].get('dia')
            guardarHorarios(dia, listaHorarioMiercoles, tipoHorario)

        if datosHorarioJueves[0] != '':
            listaHorarioJueves = json.loads(datosHorarioJueves[0])
            dia = listaHorarioJueves[0].get('dia')
            guardarHorarios(dia, listaHorarioJueves, tipoHorario)

        if datosHorarioViernes[0] != '':
            listaHorarioViernes = json.loads(datosHorarioViernes[0])
            dia = listaHorarioViernes[0].get('dia')
            guardarHorarios(dia, listaHorarioViernes, tipoHorario)

        if datosHorarioSabado[0] != '':
            listaHorarioSabado = json.loads(datosHorarioSabado[0])
            dia = listaHorarioSabado[0].get('dia')
            guardarHorarios(dia, listaHorarioSabado, tipoHorario)

        mensaje = 'Se ha guardado correctamente el nuevo horario.'
        tipo_mensaje = 'success'
        result = JsonResponse(
            {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
        return result


def eliminarHorarios(tipoHorario):
    for h in horario.objects.filter(tipo_horario=tipoHorario):
        h.delete()


def guardarHorarios(dia, listaHoras, tipoHorario):
    for h in listaHoras[0].get('horas'):
        horario.objects.create(dia=dia, hora=h, tipo_horario=tipoHorario)


def getHorasDia(tipoHorario, dia):
    horas = ''

    for h in horario.objects.filter(tipo_horario=tipoHorario, dia=dia):
        horas += h.hora + ','

    data = {'dia': dia, 'horas': horas}

    return data
