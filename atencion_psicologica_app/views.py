import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from django.db.models import Q, Count
from datetime import datetime
from .models import persona, municipio, estado, licenciatura, semestre, ingreso_familiar, vive_con, grado_academico, atencion_psicologica
from asignar_app.models import asignar
from seguimiento_atencion_app.models import seguimiento_atencion
from eval_psico_mst_nivel1_app.models import mst_nivel1
from eval_psico_fpp_app.models import fpp
from eval_psico_ssi_beck_app.models import ssi_beck
from usuario_app.models import Usuario, UsuarioRol
from valoracion_app.models import valoracion


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoAtencionesPsicologicas(ListView):
    model = atencion_psicologica

    # retorna la consulta
    def get_queryset(self):
        id_user = self.request.GET.get('id_user_aut')
        # usuario autenticado
        usuario1 = Usuario.objects.get(id=id_user)
        # roles del usuario autenticado
        roles_usuario = UsuarioRol.objects.filter(usuario=usuario1)

        # si el usuario tiene mas de un rol
        if len(roles_usuario) > 1:
            # si el usuario tiene rol EVALUACION_PSICOLOGICA || CONSULTA_PSICOTERAPEUTICA
            roles = roles_usuario.filter(Q(usuario__usuariorol__rol__nombre__in=['EVALUACION_PSICOLOGICA']) | Q(
                usuario__usuariorol__rol__nombre__in=['CONSULTA_PSICOTERAPEUTICA'])).distinct()
            if len(roles) > 0:
                # devolver todas las atenciones del usuario
                atenciones = atencion_psicologica.objects.filter(
                    solicitante__usuario=usuario1)
            else:
                atenciones = self.model.objects.all()
        else:
            # el usuario tiene un solo rol y es solicitante?
            roles_solicitante = UsuarioRol.objects.filter(
                usuario__usuariorol__rol__nombre='SOLICITANTE')
            # si el rol que tiene es solicitante
            if len(roles_solicitante) > 0:
                # devolver todas las atenciones del usuario
                atenciones = atencion_psicologica.objects.filter(
                    solicitante__usuario=usuario1)
            else:
                atenciones = []
        return atenciones

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_atenciones_psicologicas = []

            for a in self.get_queryset():
                data = {}
                data_estado = {'id': a.estado.id,
                               'nombre': a.estado.nombre}
                data_municipio = {'id': a.municipio.id,
                                  'nombre': a.municipio.nombre}
                data_solicitante = {'id': a.solicitante.id,
                                    'nombre': a.solicitante.nombre,
                                    'segundo_nombre': a.solicitante.segundo_nombre,
                                    'apellido': a.solicitante.apellido,
                                    'segundo_apellido': a.solicitante.segundo_apellido}
                data_vive_con = {'id': a.vive_con.id,
                                 'nombre': a.vive_con.vive_con}
                data_licenciatura = {'id': a.licenciatura.id,
                                     'nombre': a.licenciatura.nombre}
                data_semestre = {'id': a.semestre.id,
                                 'nombre': a.semestre.nombre}
                data_grado_academico = {'id': a.grado_academico.id,
                                        'nombre': a.grado_academico.nombre}
                data_ingreso_familiar = {'id': a.ingreso_familiar.id,
                                         'ingreso': a.ingreso_familiar.ingreso,
                                         'nivel': a.ingreso_familiar.nivel,
                                         'color': a.ingreso_familiar.color}
                fecha_atencion = datetime.strftime(
                    a.fecha_atencion, '%d/%m/%Y')

                # entrevistador
                try:
                    entrevistador_asignado = asignar.objects.get(
                        atencion=a, tipo_persona='entrevistador').persona_asignada
                    entrevistador = {'id': entrevistador_asignado.id,
                                     'nombre': entrevistador_asignado.nombre,
                                     'segundo_nombre': entrevistador_asignado.segundo_nombre,
                                     'apellido': entrevistador_asignado.apellido,
                                     'segundo_apellido': entrevistador_asignado.segundo_apellido}
                except asignar.DoesNotExist:
                    entrevistador = None

                # psicoterapeuta
                try:
                    psicoterapeuta_asignado = asignar.objects.get(
                        atencion=a, tipo_persona='psicoterapeuta').persona_asignada
                    psicoterapeuta = {'id': psicoterapeuta_asignado.id,
                                      'nombre': psicoterapeuta_asignado.nombre,
                                      'segundo_nombre': psicoterapeuta_asignado.segundo_nombre,
                                      'apellido': psicoterapeuta_asignado.apellido,
                                      'segundo_apellido': psicoterapeuta_asignado.segundo_apellido}
                except asignar.DoesNotExist:
                    psicoterapeuta = None

                # Seguimiento
                seguimiento = seguimiento_atencion.objects.filter(atencion=a)

                if len(seguimiento) > 0:
                    seguimiento_last = {'id': seguimiento.last().id,
                                        'fecha': datetime.strftime(seguimiento.last().fecha, '%d/%m/%Y'),
                                        'estado': {'id': seguimiento.last().estado.id,
                                                   'nombre': seguimiento.last().estado.nombre
                                                   },
                                        'observaciones': seguimiento.last().observaciones}
                else:
                    seguimiento_last = None

                # mst nivel 1
                try:
                    mst = mst_nivel1.objects.get(atencion=a)
                    mst1 = {'id': mst.id,
                            'total': mst.total,
                            'color': mst.color,
                            'nivel': mst.nivel,
                            'pregunta11': mst.pregunta11}
                except mst_nivel1.DoesNotExist:
                    mst1 = None

                # fpp
                try:
                    fpp1 = fpp.objects.get(atencion=a)
                    fpp2 = {'id': fpp1.id,
                            'total': fpp1.total,
                            'color': fpp1.color,
                            'nivel': fpp1.nivel}
                except fpp.DoesNotExist:
                    fpp2 = None

                # ssi beck
                try:
                    beck = ssi_beck.objects.get(atencion=a)
                    ssi = {'id': beck.id,
                           'total': beck.total,
                           'color': beck.color,
                           'nivel': beck.nivel}
                except ssi_beck.DoesNotExist:
                    ssi = None

                # valoracion
                try:
                    decidir_valoracion1 = valoracion.objects.get(atencion=a)
                    decidir_valoracion = {'id': decidir_valoracion1.id,
                                          'fecha_valoracion': datetime.strftime(decidir_valoracion1.fecha_valoracion, '%d/%m/%Y'),
                                          'tipo_atencion': decidir_valoracion1.tipo_atencion.nombre}
                except valoracion.DoesNotExist:
                    decidir_valoracion = None

                data['id'] = a.id
                data['fecha_atencion'] = fecha_atencion
                data['hijos'] = a.hijos
                data['trabaja'] = a.trabaja
                data['beca_apoyo_economico'] = a.beca_apoyo_economico
                data['direccion'] = a.direccion
                data['estado'] = data_estado
                data['municipio'] = data_municipio
                data['solicitante'] = data_solicitante
                data['vive_con'] = data_vive_con
                data['licenciatura'] = data_licenciatura
                data['semestre'] = data_semestre
                data['grado_academico'] = data_grado_academico
                data['ingreso_familiar'] = data_ingreso_familiar
                data['entrevistador'] = entrevistador
                data['psicoterapeuta'] = psicoterapeuta
                data['seguimiento'] = seguimiento_last
                data['mst_nivel1'] = mst1
                data['instrumentos_aplicados'] = None
                # data['ids'] = None
                data['ssi_beck'] = ssi
                data['fpp'] = fpp2
                data['tipo_atencion'] = decidir_valoracion
                data['detalles'] = None
                lista_atenciones_psicologicas.append(data)
            return HttpResponse(json.dumps(lista_atenciones_psicologicas), 'application/json')
        else:
            return redirect('atencion_psicologica:inicio_atencion_psicologica')


class agregarAtencionPsicologica(CreateView):
    model = atencion_psicologica

    def get(self, request, *args, **kwargs):
        fecha_atencion_1 = request.GET.get('fecha_atencion', '')
        fecha_atencion = datetime.strptime(fecha_atencion_1, '%d/%m/%Y')
        hijos = False
        trabaja = False
        beca_apoyo_economico = False
        direccion = request.GET.get('direccion', '')
        vive_con_otro = request.GET.get('vive_con_otro', '')
        grado_academico_otro = request.GET.get('grado_academico_otro', '')
        id_estado = request.GET.get('id_estado', '')
        estado_obj = estado.objects.get(id=id_estado)
        id_municipio = request.GET.get('id_municipio', '')
        municipio_obj = municipio.objects.get(id=id_municipio)
        id_solicitante = request.GET.get('id_solicitante', '')
        solicitante_obj = Usuario.objects.get(id=id_solicitante).persona
        id_ingreso_familiar = request.GET.get('id_ingreso_familiar', '')
        ingreso_familiar_obj = ingreso_familiar.objects.get(
            id=id_ingreso_familiar)
        id_semestre = request.GET.get('id_semestre', '')
        semestre_obj = semestre.objects.get(id=id_semestre)
        id_licenciatura = request.GET.get('id_licenciatura', '')
        licenciatura_obj = licenciatura.objects.get(id=id_licenciatura)

        id_vive_con = request.GET.get('id_vive_con', '')
        if id_vive_con == '':
            vive_con_obj = None
        else:
            vive_con_obj = vive_con.objects.get(id=id_vive_con)

        id_grado_academico = request.GET.get('id_grado_academico', '')
        if id_grado_academico == '':
            grado_academico_obj = None
        else:
            grado_academico_obj = grado_academico.objects.get(
                id=id_grado_academico)

        if request.GET.get('hijos', '') == 'true':
            hijos = True

        if request.GET.get('trabaja', '') == 'true':
            trabaja = True

        if request.GET.get('beca_apoyo_economico', '') == 'true':
            beca_apoyo_economico = True

        a = atencion_psicologica.objects.filter(
            solicitante=solicitante_obj, fecha_atencion=fecha_atencion)

        if a.count() > 0:
            mensaje = 'Ya existe un Solicitante que tiene una Solicitud de Atención para la fecha seleccionada. Por favor agregue otra.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        else:
            atencion_psicologica.objects.create(
                fecha_atencion=fecha_atencion,
                hijos=hijos,
                trabaja=trabaja,
                beca_apoyo_economico=beca_apoyo_economico,
                direccion=direccion,
                vive_con_otro=vive_con_otro,
                grado_academico_otro=grado_academico_otro,
                estado=estado_obj,
                municipio=municipio_obj,
                solicitante=solicitante_obj,
                vive_con=vive_con_obj,
                semestre=semestre_obj,
                licenciatura=licenciatura_obj,
                grado_academico=grado_academico_obj,
                ingreso_familiar=ingreso_familiar_obj
            )
            mensaje = 'Se ha agregado correctamente la Persona.'
            tipo_mensaje = 'success'
            accion = 'agregar'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
            return result


# para mostrar/ocultar las alertas
def existenNomencladoresDependientes(request):
    grados = grado_academico.objects.all()
    semestres = semestre.objects.all()
    licenciaturas = licenciatura.objects.all()
    estados = estado.objects.all()
    municipios = municipio.objects.all()
    ingresos = ingreso_familiar.objects.all()
    vives = vive_con.objects.all()
    data = {}

    if len(grados) > 0 and len(semestres) > 0 and len(licenciaturas) > 0 and len(estados) > 0 and len(municipios) > 0 and len(ingresos) > 0 and len(vives) > 0:
        data['mostrar_alertas'] = False
        return JsonResponse({'datos': data})
    else:
        data['mostrar_alertas'] = True

        if len(grados) == 0:
            data['grados'] = True
        else:
            data['grados'] = False

        if len(semestres) == 0:
            data['semestres'] = True
        else:
            data['semestres'] = False

        if len(licenciaturas) == 0:
            data['licenciaturas'] = True
        else:
            data['licenciaturas'] = False

        if len(estados) == 0:
            data['estados'] = True
        else:
            data['estados'] = False

        if len(municipios) == 0:
            data['municipios'] = True
        else:
            data['municipios'] = False

        if len(ingresos) == 0:
            data['ingresos'] = True
        else:
            data['ingresos'] = False

        if len(vives) == 0:
            data['vives'] = True
        else:
            data['vives'] = False

        return JsonResponse({'datos': data})


class getAtencionBySolicitante(TemplateView):
    model = atencion_psicologica

    def get(self, request, *args, **kwargs):
        id_user_aut = request.GET.get('id_user_aut', '')

        try:
            solicitante = Usuario.objects.get(id=id_user_aut).persona
            atencion = atencion_psicologica.objects.filter(
                solicitante=solicitante).order_by('fecha_atencion').last()

            if atencion != None:
                data = {}
                data_estado = {'id': atencion.estado.id,
                               'nombre': atencion.estado.nombre}
                data_municipio = {'id': atencion.municipio.id,
                                  'nombre': atencion.municipio.nombre}
                data_solicitante = {'id': atencion.solicitante.id,
                                    'nombre': atencion.solicitante.nombre,
                                    'segundo_nombre': atencion.solicitante.segundo_nombre,
                                    'apellido': atencion.solicitante.apellido,
                                    'segundo_apellido': atencion.solicitante.segundo_apellido}
                data_vive_con = {'id': atencion.vive_con.id,
                                 'nombre': atencion.vive_con.vive_con}
                data_licenciatura = {'id': atencion.licenciatura.id,
                                     'nombre': atencion.licenciatura.nombre}
                data_semestre = {'id': atencion.semestre.id,
                                 'nombre': atencion.semestre.nombre}
                data_grado_academico = {'id': atencion.grado_academico.id,
                                        'nombre': atencion.grado_academico.nombre}
                data_ingreso_familiar = {'id': atencion.ingreso_familiar.id,
                                         'ingreso': atencion.ingreso_familiar.ingreso,
                                         'nivel': atencion.ingreso_familiar.nivel,
                                         'color': atencion.ingreso_familiar.color}
                fecha_atencion = datetime.strftime(
                    atencion.fecha_atencion, '%d/%m/%Y')

                data['id'] = atencion.id
                data['fecha_atencion'] = fecha_atencion
                data['hijos'] = atencion.hijos
                data['trabaja'] = atencion.trabaja
                data['beca_apoyo_economico'] = atencion.beca_apoyo_economico
                data['direccion'] = atencion.direccion
                data['estado'] = data_estado
                data['municipio'] = data_municipio
                data['solicitante'] = data_solicitante
                data['vive_con'] = data_vive_con
                data['licenciatura'] = data_licenciatura
                data['semestre'] = data_semestre
                data['grado_academico'] = data_grado_academico
                data['ingreso_familiar'] = data_ingreso_familiar
                data['vive_con_otro'] = atencion.vive_con_otro
                data['grado_academico_otro'] = atencion.grado_academico_otro
                result = JsonResponse(
                    {'mensaje': 'existe', 'atencion': data})
            else:
                result = JsonResponse({'mensaje': 'no_existe'})

            return result
        except persona.DoesNotExist:
            mensaje = 'El Usuario autenticado no se encuentra registrado en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
