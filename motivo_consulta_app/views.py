from django.shortcuts import render, redirect
import json
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from django.http import HttpResponse, JsonResponse
from .models import motivo_consulta, horario_motivo_consulta
from .models import atencion_psicologica
from asignar_app.models import asignar
from usuario_app.views import existeRol


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class agregarEditarMotivoConsulta(CreateView):
    model = motivo_consulta

    def get(self, request, *args, **kwargs):
        accion = request.GET.get('accion', '')
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        pregunta_tres = request.GET.get('pregunta_tres', '')
        pregunta_dos = request.GET.get('pregunta_dos', '')
        pregunta_uno = request.GET.get('pregunta_uno', '')
        datosHorarioLunes = request.GET.getlist('horarioLunes[]', '')
        datosHorarioMartes = request.GET.getlist('horarioMartes[]', '')
        datosHorarioMiercoles = request.GET.getlist('horarioMiercoles[]', '')
        datosHorarioJueves = request.GET.getlist('horarioJueves[]', '')
        datosHorarioViernes = request.GET.getlist('horarioViernes[]', '')
        datosHorarioSabado = request.GET.getlist('horarioSabado[]', '')

        if accion == 'agregar':
            # se esta agregando
            obj = motivo_consulta.objects.create(
                pregunta_uno=pregunta_uno, pregunta_dos=pregunta_dos, pregunta_tres=pregunta_tres, atencion=atencion_obj)

            if datosHorarioLunes[0] != '':
                listaHorarioLunes = json.loads(datosHorarioLunes[0])
                dia = listaHorarioLunes[0].get('dia')
                guardarHorariosMotivoConsulta(dia, listaHorarioLunes, obj)

            if datosHorarioMartes[0] != '':
                listaHorarioMartes = json.loads(datosHorarioMartes[0])
                dia = listaHorarioMartes[0].get('dia')
                guardarHorariosMotivoConsulta(dia, listaHorarioMartes, obj)

            if datosHorarioMiercoles[0] != '':
                listaHorarioMiercoles = json.loads(datosHorarioMiercoles[0])
                dia = listaHorarioMiercoles[0].get('dia')
                guardarHorariosMotivoConsulta(
                    dia, listaHorarioMiercoles, obj)

            if datosHorarioJueves[0] != '':
                listaHorarioJueves = json.loads(datosHorarioJueves[0])
                dia = listaHorarioJueves[0].get('dia')
                guardarHorariosMotivoConsulta(dia, listaHorarioJueves, obj)

            if datosHorarioViernes[0] != '':
                listaHorarioViernes = json.loads(datosHorarioViernes[0])
                dia = listaHorarioViernes[0].get('dia')
                guardarHorariosMotivoConsulta(
                    dia, listaHorarioViernes, obj)

            if datosHorarioSabado[0] != '':
                listaHorarioSabado = json.loads(datosHorarioSabado[0])
                dia = listaHorarioSabado[0].get('dia')
                guardarHorariosMotivoConsulta(dia, listaHorarioSabado, obj)

            mensaje = 'Se ha agregado correctamente el Motivo de Consulta.'
            tipo_mensaje = 'success'
            accion = 'agregar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result
        elif accion == 'editar':
            # se esta editando
            mc = motivo_consulta.objects.get(atencion=atencion_obj)
            mc.pregunta_uno = pregunta_uno
            mc.pregunta_dos = pregunta_dos
            mc.pregunta_tres = pregunta_tres
            mc.atencion = atencion_obj
            mc.save()

            eliminarHorariosMotivoConsulta(mc)

            if datosHorarioLunes[0] != '':
                listaHorarioLunes = json.loads(datosHorarioLunes[0])
                dia = listaHorarioLunes[0].get('dia')
                guardarHorariosMotivoConsulta(dia, listaHorarioLunes, mc)

            if datosHorarioMartes[0] != '':
                listaHorarioMartes = json.loads(datosHorarioMartes[0])
                dia = listaHorarioMartes[0].get('dia')
                guardarHorariosMotivoConsulta(dia, listaHorarioMartes, mc)

            if datosHorarioMiercoles[0] != '':
                listaHorarioMiercoles = json.loads(datosHorarioMiercoles[0])
                dia = listaHorarioMiercoles[0].get('dia')
                guardarHorariosMotivoConsulta(
                    dia, listaHorarioMiercoles, mc)

            if datosHorarioJueves[0] != '':
                listaHorarioJueves = json.loads(datosHorarioJueves[0])
                dia = listaHorarioJueves[0].get('dia')
                guardarHorariosMotivoConsulta(dia, listaHorarioJueves, mc)

            if datosHorarioViernes[0] != '':
                listaHorarioViernes = json.loads(datosHorarioViernes[0])
                dia = listaHorarioViernes[0].get('dia')
                guardarHorariosMotivoConsulta(
                    dia, listaHorarioViernes, mc)

            if datosHorarioSabado[0] != '':
                listaHorarioSabado = json.loads(datosHorarioSabado[0])
                dia = listaHorarioSabado[0].get('dia')
                guardarHorariosMotivoConsulta(dia, listaHorarioSabado, mc)

            mensaje = 'Se ha editado correctamente el Motivo de Consulta.'
            tipo_mensaje = 'success'
            accion = 'editar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result


class getMotivoConsultaByAtencion(TemplateView):
    model = motivo_consulta

    def get(self, request, *args, **kwargs):
        id_atencion = request.GET.get('id_atencion', '')
        id_user = request.GET.get('id_usuario', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        data = {}
        
        try:
            evaluador_obj = asignar.objects.get(atencion=atencion_obj, tipo_persona='entrevistador')
            evaluador = True            
        except asignar.DoesNotExist:
            evaluador = False

        try:
            mc = motivo_consulta.objects.get(atencion=atencion_obj)
            data_lunes = getHorasDia(mc, 'lunes')
            data_martes = getHorasDia(mc, 'martes')
            data_miercoles = getHorasDia(mc, 'miercoles')
            data_jueves = getHorasDia(mc, 'jueves')
            data_viernes = getHorasDia(mc, 'viernes')
            data_sabado = getHorasDia(mc, 'sabado')

            data['pregunta_uno'] = mc.pregunta_uno
            data['pregunta_dos'] = mc.pregunta_dos
            data['pregunta_tres'] = mc.pregunta_tres
            data['horario_lunes'] = data_lunes
            data['horario_martes'] = data_martes
            data['horario_miercoles'] = data_miercoles
            data['horario_jueves'] = data_jueves
            data['horario_viernes'] = data_viernes
            data['horario_sabado'] = data_sabado
            data['evaluador'] = evaluador
            data['roles'] = {'solicitante': True if existeRol(id_user, 'SOLICITANTE').get('existe') == True and existeRol(id_user, 'SOLICITANTE').get('cant') == 1 else False,
                             'administrador': existeRol(id_user, 'ADMINISTRADOR').get('existe')}
            data['mensaje'] = 'existe'
            return JsonResponse(data)
        except motivo_consulta.DoesNotExist:
            data['mensaje'] = 'no_existe'
            return JsonResponse(data)


def guardarHorariosMotivoConsulta(dia, listaHoras, mc):
    for h in listaHoras[0].get('horas'):
        horario_motivo_consulta.objects.create(
            dia=dia, hora=h, motivo_consulta=mc)


def eliminarHorariosMotivoConsulta(mc):
    for h in horario_motivo_consulta.objects.filter(motivo_consulta=mc):
        h.delete()


def getHorasDia(mc, dia):
    horas = ''

    for h in horario_motivo_consulta.objects.filter(motivo_consulta=mc, dia=dia):
        horas += h.hora + ','

    data = {'dia': dia, 'horas': horas}

    return data
