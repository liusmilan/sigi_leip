import io
import json
import xlsxwriter
from typing import Any
from decimal import Decimal
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from django.db.models import Q, Count
from datetime import datetime
from django.utils.dateparse import parse_date                    
from .models import atencion_diagnostico_dsm5, persona, municipio, estado, licenciatura, semestre, ingreso_familiar, vive_con, grado_academico, atencion_psicologica
from asignar_app.models import asignar
from seguimiento_atencion_app.models import seguimiento_atencion
from eval_psico_mst_nivel1_app.models import mst_nivel1
from eval_psico_mst_nivel2_app.models import mst_nivel2
from eval_psico_fpp_app.models import fpp
from eval_psico_ssi_beck_app.models import ssi_beck
from usuario_app.models import Usuario, UsuarioRol
from valoracion_app.models import valoracion
from estado_atencion_app.models import estado_atencion
from tipo_atencion_app.models import tipo_atencion
from motivo_consulta_app.models import motivo_consulta
from historia_clinica_app.models import historia_clinica
from usuario_app.views import existeRol
from historia_clinica_app.views import getCaracteristicasInfanciaAdolescencia, getModalidadConductas, getModalidadImagenesMeVeo, getModalidadImagenesTengo, getModalidadPensamientos, getModalidadSensacionesFisicas, getModalidadSentimientos


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoAtencionesPsicologicas(ListView):
    model = atencion_psicologica

    # retorna la consulta
    def get_queryset(self):
        filtro_estado_atencion = self.request.GET.get('filtro_estado_atencion')
        filtro_ingreso_familiar = self.request.GET.get(
            'filtro_ingreso_familiar')
        filtro_tipo_atencion = self.request.GET.get('filtro_tipo_atencion')
        filtro_carrera = self.request.GET.get('filtro_carrera')
        filtro_inicio_mst_nivel1 = self.request.GET.get(
            'filtro_inicio_mst_nivel1')
        filtro_fin_mst_nivel1 = self.request.GET.get('filtro_fin_mst_nivel1')
        filtro_inicio_fpp = self.request.GET.get(
            'filtro_inicio_fpp')
        filtro_fin_fpp = self.request.GET.get('filtro_fin_fpp')
        filtro_inicio_p11 = self.request.GET.get('filtro_inicio_p11')
        filtro_fin_p11 = self.request.GET.get('filtro_fin_p11')
        filtro_inicio_beck = self.request.GET.get('filtro_inicio_beck')
        filtro_fin_beck = self.request.GET.get('filtro_fin_beck')
        filtro_fecha_atencion_inicio = self.request.GET.get(
            'filtro_fecha_atencion_inicio')
        filtro_fecha_atencion_fin = self.request.GET.get(
            'filtro_fecha_atencion_fin')
        filtro_sexo = self.request.GET.get('filtro_sexo')
        filtro_genero = self.request.GET.get('filtro_genero')
        
        
        id_user = self.request.GET.get('id_user_aut')
        # usuario autenticado
        usuario1 = Usuario.objects.get(id=id_user)
        # roles del usuario autenticado
        roles_usuario = UsuarioRol.objects.filter(usuario=usuario1)

        # si el usuario tiene mas de un rol
        if len(roles_usuario) > 1:
            # si el usuario tiene rol ASIGNAR, SEGUIMIENTO, VALORACION_PSICOLOGICA
            roles = roles_usuario.filter(Q(usuario__usuariorol__rol__nombre__in=['ASIGNAR']) | Q(usuario__usuariorol__rol__nombre__in=[
                                         'SEGUIMIENTO']) | Q(usuario__usuariorol__rol__nombre__in=['VALORACION_PSICOLOGICA'])).distinct()
            if len(roles) > 0:
                # devolver todas las atenciones
                atenciones = self.model.objects.all()
            else:
                # si el usuario tiene rol EVALUACION_PSICOLOGICA
                roles = roles_usuario.filter(rol__nombre='EVALUACION_PSICOLOGICA').distinct()
            
                if len(roles) > 0:
                    evaluadores_asignados = asignar.objects.filter(persona_asignada__in=[rol.usuario.persona for rol in roles]).distinct()
                    atenciones = atencion_psicologica.objects.filter(id__in=[it.atencion.id for it in evaluadores_asignados]).distinct()
                else:
                    # si el usuario tiene rol CONSULTA_PSICOTERAPEUTICA
                    roles = roles_usuario.filter(rol__nombre='CONSULTA_PSICOTERAPEUTICA').distinct()
                    
                    if len(roles) > 0:
                        consultores_asignados = asignar.objects.filter(persona_asignada__in=[rol.usuario.persona for rol in roles]).distinct()
                        atenciones = atencion_psicologica.objects.filter(id__in=[it.atencion.id for it in consultores_asignados]).distinct()
                    else:
                        # devolver todas las atenciones del usuario
                        atenciones = atencion_psicologica.objects.filter(
                            solicitante__usuario=usuario1)
        else:
            # el usuario tiene un solo rol y es solicitante?
            # roles_solicitante = UsuarioRol.objects.filter(usuario__usuariorol__rol__nombre='SOLICITANTE')
            roles_solicitante = roles_usuario.filter(rol__nombre='SOLICITANTE').distinct()
            # si el rol que tiene es solicitante
            if len(roles_solicitante) > 0:
                # devolver todas las atenciones del usuario
                atenciones = atencion_psicologica.objects.filter(
                    solicitante__usuario=usuario1)
            else:
                atenciones = []
        
        # filtros
        if filtro_fecha_atencion_inicio and filtro_fecha_atencion_fin:
            fecha_inicio = datetime.strptime(
                filtro_fecha_atencion_inicio, '%d/%m/%Y')
            fecha_fin = datetime.strptime(
                filtro_fecha_atencion_fin, '%d/%m/%Y')
            atenciones = atenciones.filter(fecha_atencion__range=(
                fecha_inicio, fecha_fin))
        if filtro_estado_atencion != 'sel' and filtro_estado_atencion != '':
            estado = estado_atencion.objects.get(id=filtro_estado_atencion)
            seguimiento_estado = seguimiento_atencion.objects.filter(
                estado=estado)
            atenciones = atenciones.filter(id__in=seguimiento_estado.values_list('atencion_id', flat=True))
        if filtro_ingreso_familiar != 'sel' and filtro_ingreso_familiar != '':
            ingreso = ingreso_familiar.objects.get(id=filtro_ingreso_familiar)
            atenciones = atenciones.filter(ingreso_familiar=ingreso)
        if filtro_tipo_atencion != 'sel' and filtro_tipo_atencion != '':
            tp = tipo_atencion.objects.get(id=filtro_tipo_atencion)
            valoracion_tipo_atencion = valoracion.objects.filter(tipo_atencion=tp)
            atenciones = atenciones.filter(id__in=valoracion_tipo_atencion.values_list('atencion_id', flat=True))
        if filtro_carrera != 'sel' and filtro_carrera != '':
            carrera = licenciatura.objects.get(id=filtro_carrera)
            atenciones = atenciones.filter(licenciatura=carrera)
        if filtro_inicio_mst_nivel1 and filtro_fin_mst_nivel1:
            examen_mst_nivel1 = mst_nivel1.objects.filter(total__range=(filtro_inicio_mst_nivel1, filtro_fin_mst_nivel1))
            atenciones = atenciones.filter(id__in=examen_mst_nivel1.values_list('atencion_id', flat=True))
        if filtro_inicio_fpp and filtro_fin_fpp:
            examen_fpp = fpp.objects.filter(total__range=(filtro_inicio_fpp, filtro_fin_fpp))
            atenciones = atenciones.filter(id__in=examen_fpp.values_list('atencion_id', flat=True))
        if filtro_inicio_p11 and filtro_fin_p11:
            examen_pregunta11 = mst_nivel1.objects.filter(pregunta11__range=(filtro_inicio_p11, filtro_fin_p11))
            atenciones = atenciones.filter(id__in=examen_pregunta11.values_list('atencion_id', flat=True))
        if filtro_inicio_beck and filtro_fin_beck:
            examen_beck = ssi_beck.objects.filter(total__range=(filtro_inicio_beck, filtro_fin_beck))
            atenciones = atenciones.filter(
                id__in=examen_beck.values_list('atencion_id', flat=True))
        if filtro_sexo != 'sel' and filtro_sexo != '':
            atenciones = atenciones.filter(solicitante__sexo=filtro_sexo)
        if filtro_genero != 'sel' and filtro_genero != '':
            atenciones = atenciones.filter(solicitante__genero=filtro_genero)
        
        return atenciones.order_by('-fecha_atencion')

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_atenciones_psicologicas = []
            id_user = self.request.GET.get('id_user_aut')

            for a in self.get_queryset():
                data = {}
                examenes = []
                data_estado = {'id': a.estado.id,
                               'nombre': a.estado.nombre}
                data_municipio = {'id': a.municipio.id,
                                  'nombre': a.municipio.nombre}
                data_solicitante = {'id': a.solicitante.id,
                                    'nombre': a.solicitante.nombre,
                                    'segundo_nombre': a.solicitante.segundo_nombre,
                                    'apellido': a.solicitante.apellido,
                                    'segundo_apellido': a.solicitante.segundo_apellido}
                data_vive_con = {'id': a.vive_con.id if a.vive_con else None,
                                 'nombre': a.vive_con.vive_con if a.vive_con else None}
                data_licenciatura = {'id': a.licenciatura.id,
                                     'nombre': a.licenciatura.nombre}
                data_semestre = {'id': a.semestre.id,
                                 'nombre': a.semestre.nombre}
                data_grado_academico = {'id': a.grado_academico.id if a.grado_academico else None,
                                        'nombre': a.grado_academico.nombre if a.grado_academico else None}
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
                    # examenes.append('MST NIVEL 1')
                    examenes.append(
                        '<span class="badge badge-light-success">' + 'MST NIVEL 1' + '</span>')
                except mst_nivel1.DoesNotExist:
                    mst1 = None

                # fpp
                try:
                    fpp1 = fpp.objects.get(atencion=a)
                    fpp2 = {'id': fpp1.id,
                            'total': fpp1.total,
                            'color': fpp1.color,
                            'nivel': fpp1.nivel}
                    examenes.append(
                        '<span class="badge badge-light-success">' + 'FPP' + '</span>')
                except fpp.DoesNotExist:
                    fpp2 = None

                # ssi beck
                try:
                    beck = ssi_beck.objects.get(atencion=a)
                    ssi = {'id': beck.id,
                           'total': beck.total,
                           'color': beck.color,
                           'nivel': beck.nivel}
                    examenes.append(
                        '<span class="badge badge-light-success">' + 'SSI BECK' + '</span>')
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

                # mst nivel 2
                try:
                    mst2 = mst_nivel2.objects.get(atencion=a)
                    examenes.append(
                        '<span class="badge badge-light-success">' + 'MST NIVEL 2' + '</span>')
                except mst_nivel2.DoesNotExist:
                    mst2 = None
                
                # motivo de consulta
                try:
                    motivo_consulta1 = motivo_consulta.objects.get(atencion=a)
                    examenes.append(
                        '<span class="badge badge-light-success">' + 'MOTIVO DE CONSULTA' + '</span>')
                except motivo_consulta.DoesNotExist:
                    motivo_consulta1 = None
                
                # DSM5
                if a.diagnostico.count() > 0:
                    examenes.append(
                        '<span class="badge badge-light-success">' + 'DSM 5' + '</span>')

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
                data['instrumentos_aplicados'] = '<br>'.join(examenes)
                # data['ids'] = None
                data['ssi_beck'] = ssi
                data['fpp'] = fpp2
                data['tipo_atencion'] = decidir_valoracion
                data['grado_academico_otro'] = a.grado_academico_otro
                data['vive_con_otro'] = a.vive_con_otro
                data['roles'] = {'solicitante': True if existeRol(id_user, 'SOLICITANTE').get('existe') == True and existeRol(id_user, 'SOLICITANTE').get('cant') == 1 else False}
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
        if id_vive_con == '' or id_vive_con == 'otro':
            vive_con_obj = None
        else:
            vive_con_obj = vive_con.objects.get(id=id_vive_con)

        id_grado_academico = request.GET.get('id_grado_academico', '')
        if id_grado_academico == '' or id_grado_academico == 'otro':
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
                data_vive_con = {'id': atencion.vive_con.id if atencion.vive_con else None,
                                 'nombre': atencion.vive_con.vive_con if atencion.vive_con else None}
                data_licenciatura = {'id': atencion.licenciatura.id,
                                     'nombre': atencion.licenciatura.nombre}
                data_semestre = {'id': atencion.semestre.id,
                                 'nombre': atencion.semestre.nombre}
                data_grado_academico = {'id': atencion.grado_academico.id if atencion.grado_academico else None,
                                        'nombre': atencion.grado_academico.nombre if atencion.grado_academico else None}
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


class getAtencionByAtencion(TemplateView):
    model = atencion_psicologica

    def get(self, request, *args, **kwargs):
        id_atencion = request.GET.get('id_atencion', '')
        atencion = atencion_psicologica.objects.get(id=id_atencion)

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
                                'segundo_apellido': atencion.solicitante.segundo_apellido,
                                'fecha_nacimiento': datetime.strftime(atencion.solicitante.fecha_nacimiento, '%d/%m/%Y'),
                                'email': atencion.solicitante.email,
                                'telefono_contacto': atencion.solicitante.telefono,
                                'direccion': atencion.solicitante.direccion,
                                'sexo': atencion.solicitante.sexo,
                                'estado': atencion.solicitante.estado.id,
                                'municipio': atencion.solicitante.municipio.id,
                                'nombre_emergencia': atencion.solicitante.nombre_emergencia,
                                'parentesco': atencion.solicitante.parentesco,
                                'telefono_emergencia': atencion.solicitante.telefono_emergencia}
            data_vive_con = {'id': atencion.vive_con.id if atencion.vive_con else None,
                             'nombre': atencion.vive_con.vive_con if atencion.vive_con else None}
            data_licenciatura = {'id': atencion.licenciatura.id,
                                 'nombre': atencion.licenciatura.nombre}
            data_semestre = {'id': atencion.semestre.id,
                             'nombre': atencion.semestre.nombre}
            data_grado_academico = {'id': atencion.grado_academico.id if atencion.grado_academico else None,
                                    'nombre': atencion.grado_academico.nombre if atencion.grado_academico else None}
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


def exportarExamenes(request):
    excel = request.GET.get('excel', '')
    id_atencion = request.GET.get('id_atencion', '')
    atencion = atencion_psicologica.objects.get(id=id_atencion)
    datos_examen = {}

    # Crear un libro
    output = io.BytesIO()
    libro = xlsxwriter.Workbook(output, {'in_memory': True})
    
    if excel == 'mst1':
        try:
            datos_examen['mst1'] = mst_nivel1.objects.get(atencion=atencion)
        except mst_nivel1.DoesNotExist:
            return JsonResponse({'mensaje': 'error'})
        
        try:
            datos_examen['fpp'] = fpp.objects.get(atencion=atencion)
        except fpp.DoesNotExist:
            return JsonResponse({'mensaje': 'error'})
        
        try:
            datos_examen['motivo_consulta'] = motivo_consulta.objects.get(atencion=atencion)
        except motivo_consulta.DoesNotExist:
            return JsonResponse({'mensaje': 'error'})
        
        exportarExamen1(
            atencion, libro, datos_examen['mst1'], datos_examen['fpp'], datos_examen['motivo_consulta']).get('hoja')
    elif excel == 'mst2':
        try:
            datos_examen['mst2'] = mst_nivel2.objects.get(atencion=atencion)
        except mst_nivel2.DoesNotExist:
            return JsonResponse({'mensaje': 'error'})

        try:
            datos_examen['beck'] = ssi_beck.objects.get(atencion=atencion)
        except ssi_beck.DoesNotExist:
            return JsonResponse({'mensaje': 'error'})

        if atencion.diagnostico.exists():
            datos_examen['dsm5'] = atencion.diagnostico.all()
        else:
            return JsonResponse({'mensaje': 'error'})
        
        exportarExamen2(atencion, libro,
                        datos_examen['mst2'], datos_examen['beck'], datos_examen['dsm5']).get('hoja')
    else:
        try:
            datos_examen['historia_clinica'] = historia_clinica.objects.get(atencion=atencion)
        except historia_clinica.DoesNotExist:
            return JsonResponse({'mensaje': 'error'})
        
        exportarExamen3(atencion, libro, datos_examen['historia_clinica']).get('hoja')

    libro.close()
    output.seek(0)
    response = HttpResponse(output, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=persona.xlsx'
    response['mensaje'] = 'success'

    return response


def exportarExamen1(atencion, libro, mst1, fpp, motivo_consulta):
    # datos de los examenes
    resultado = {}
    
    # datos de la persona
    nombre_solicitante = atencion.solicitante.nombre + \
        ' ' + (atencion.solicitante.segundo_nombre if atencion.solicitante.segundo_nombre else '') + \
        ' ' + atencion.solicitante.apellido + ' ' + \
        (atencion.solicitante.segundo_apellido if atencion.solicitante.segundo_apellido else '')
    email = atencion.solicitante.email
    licenciatura = atencion.licenciatura.nombre if atencion.licenciatura else ''
    semestre = atencion.semestre.nombre if atencion.semestre else ''
    sexo = atencion.solicitante.sexo
    vive_con = atencion.vive_con.vive_con if atencion.vive_con else ''
    trabaja = atencion.trabaja
    hijos = atencion.hijos
    municipio = atencion.municipio.nombre if atencion.municipio else ''
    grado_academico_padres = atencion.grado_academico.nombre if atencion.grado_academico else ''
    telefono_familiar = atencion.solicitante.telefono_emergencia if atencion.solicitante else ''
    ingreso_familiar_ingreso = atencion.ingreso_familiar.ingreso if atencion.ingreso_familiar else ''
    ingreso_familiar_nivel = atencion.ingreso_familiar.nivel if atencion.ingreso_familiar else ''
    beca_apoyo_economico = atencion.beca_apoyo_economico
    fecha_nacimiento = datetime.strftime(atencion.solicitante.fecha_nacimiento, '%d/%m/%Y') if atencion.solicitante.fecha_nacimiento else ''
    codigo_udg = atencion.solicitante.codigo_udg if atencion.solicitante.codigo_udg else None
    
    # crear la hoja
    hoja = libro.add_worksheet('MST Nivel 1 y FPP')
    # Definir los formatos para las celdas
    # formatos para las celdas de MST1
    blue_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#00B0F0', 'bold': True, 'align': 'center', 'font_size': 12})
    blue_celd_format1 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#BDD7EE', 'bold': True, 'align': 'center', 'font_size': 12})
    blue_celd_format2 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#00B0F0', 'bold': True, 'align': 'center', 'font_size': 12})
    blue_celd_format3 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#9BC2E6', 'bold': True, 'align': 'center', 'font_size': 12})
    blue_celd_format4 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#BDD7EE', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    blue_celd_format5 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#BDD7EE', 'bold': True, 'align': 'left', 'font_size': 12, 'text_wrap': True})
    white_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    white_celd_format1 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bold': True, 'align': 'left', 'font_size': 12, 'text_wrap': True})
    green_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#00B050', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    yellow_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#FFC000', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    red_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#ff0404', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    orange_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#e98604', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    green_celd_format1 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#C6E0B4', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    gray_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#A5A5A5', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    
    # Establecer el ancho de las columnas
    hoja.set_column('A:A', 2)
    hoja.set_column('B:B', 2)
    hoja.set_column('C:C', 30)
    hoja.set_column('D:D', 22)
    hoja.set_column('E:E', 22)
    hoja.set_column('F:F', 22)
    hoja.set_column('G:G', 22)
    hoja.set_column('H:H', 22)
    hoja.set_column('I:I', 22)
    hoja.set_column('J:J', 22)
    hoja.set_column('K:K', 22)
    hoja.set_column('L:L', 22)
    hoja.set_column('M:M', 22)
    hoja.set_column('N:N', 22)
    hoja.set_column('O:O', 22)
    hoja.set_column('P:P', 40)
    
    # Establecer la altura de las filas
    hoja.set_row(0, 21)
    hoja.set_row(23, 40)
    hoja.set_row(25, 35)
    hoja.set_row(26, 35)
    hoja.set_row(32, 90)
    
    #  datos de la persona
    hoja.merge_range('C1:F1', 'Nombre del solicitante', green_celd_format1)
    hoja.write('G1', 'Código', green_celd_format1)
    hoja.merge_range('H1:K1', 'Correo electrónico', green_celd_format1)
    hoja.merge_range('L1:O1', 'Grado Académico', green_celd_format1)
    hoja.write('P1', 'Semestre', green_celd_format1)
    hoja.merge_range('C2:F2', nombre_solicitante, white_celd_format)
    hoja.write('G2', codigo_udg, white_celd_format)
    hoja.merge_range('H2:K2', email, white_celd_format)
    hoja.merge_range('L2:O4', licenciatura, white_celd_format)
    hoja.merge_range('P2:P4', semestre, white_celd_format)
    hoja.write('C3', 'Sexo', green_celd_format1)
    hoja.merge_range('D3:E3', 'Actualmente vive con', green_celd_format1)
    hoja.write('F3', '¿Trabaja?', green_celd_format1)
    hoja.write('G3', 'Edad', green_celd_format1)
    hoja.write('H3', '¿Tiene hijo/as?', green_celd_format1)
    hoja.merge_range('I3:K3', '¿En qué municipio o localidad vive?', green_celd_format1)
    hoja.write('C4', sexo, white_celd_format)
    hoja.merge_range('D4:E4', vive_con, white_celd_format)
    hoja.write('F4', 'Sí' if trabaja == True else 'No', white_celd_format)
    hoja.write('G4', calcularEdad(fecha_nacimiento), white_celd_format)
    hoja.write('H4', 'Sí' if hijos == True else 'No', white_celd_format)
    hoja.merge_range('I4:K4', municipio, white_celd_format)
    hoja.merge_range('C5:E5', 'Grado académico de sus padres', green_celd_format1)
    hoja.merge_range('F5:H5', 'Número de contacto de un familiar', green_celd_format1)
    hoja.merge_range('I5:P5', 'Ingreso familiar mensual - Nivel socioeconómico según INEGI', green_celd_format1)
    hoja.merge_range('C6:E6', grado_academico_padres, white_celd_format)
    hoja.merge_range('F6:H6', telefono_familiar, white_celd_format)
    hoja.merge_range('I6:P6', ingreso_familiar_ingreso + ' - ' + ingreso_familiar_nivel, white_celd_format)
    hoja.merge_range(
        'I7:P7', '¿Cuenta con alguna beca o apoyo económico?', green_celd_format1)
    hoja.merge_range('I8:P8', 'Sí' if beca_apoyo_economico ==
                     True else 'No', white_celd_format)

    # datos del examen mst1
    hoja.merge_range('C7:C8', 'SUMATORIA TOTAL', green_celd_format)
    
    if mst1.nivel == 'Alto':
        hoja.merge_range('D7:D8', mst1.total, red_celd_format)
    elif mst1.nivel == 'Bajo':
        hoja.merge_range('D7:D8', mst1.total, yellow_celd_format)
    elif mst1.nivel == 'Muy bajo':
        hoja.merge_range('D7:D8', mst1.total, green_celd_format)
    else:
        hoja.merge_range('D7:D8', mst1.total, orange_celd_format)

    hoja.write('E7', 'Muy bajo', green_celd_format)
    hoja.write('F7', 'Bajo', yellow_celd_format)
    hoja.write('G7', 'Moderado', orange_celd_format)
    hoja.write('H7', 'Alto', red_celd_format)
    hoja.write('E8', '0-16', green_celd_format)
    hoja.write('F8', '17-33', yellow_celd_format)
    hoja.write('G8', '34-50', orange_celd_format)
    hoja.write('H8', '>50', red_celd_format)
    
    # leyenda mst1
    hoja.merge_range('C9:C10', 'LEYENDA', green_celd_format1)
    hoja.merge_range('D9:E9', 'Nada (en ningún momento)', green_celd_format1)
    hoja.merge_range('D10:E10', '0', white_celd_format)
    hoja.merge_range('F9:G9', 'Algo (raro, menos de un día o dos)', green_celd_format1)
    hoja.merge_range('F10:G10', '1', white_celd_format)
    hoja.merge_range('H9:I9', 'Leve (varios días)', green_celd_format1)
    hoja.merge_range('H10:I10', '2', white_celd_format)
    hoja.merge_range('J9:K9', 'Moderado (más de la mitad de los días)', green_celd_format1)
    hoja.merge_range('J10:K10', '3', white_celd_format)
    hoja.merge_range('L9:M9', 'Grave (casi cada día)', green_celd_format1)
    hoja.merge_range('L10:M10', '4', white_celd_format)
    hoja.merge_range('N9:P10', '', white_celd_format)
    
    # datos mst1
    hoja.merge_range('C11:K11', '1. ¿Poco interés o satisfacción al hacer cosas?', blue_celd_format5)
    hoja.write('L11', mst1.pregunta1, blue_celd_format4)
    hoja.merge_range('C12:K12', '2.¿Sentirse bajo/a de ánimo, deprimido/a o desesperanzado/a?', blue_celd_format5)
    hoja.write('L12', mst1.pregunta2, blue_celd_format4)
    hoja.merge_range(
        'C13:K13', '3. ¿Sentirse más irritado/a, malhumorado/a o enfadado/a que normalmente?', white_celd_format1)
    hoja.write('L13', mst1.pregunta3, white_celd_format)
    hoja.merge_range(
        'C14:K14', '4. ¿Dormir menos de lo normal pero todavía con mucha energía?', blue_celd_format5)
    hoja.write('L14', mst1.pregunta4, blue_celd_format4)
    hoja.merge_range(
        'C15:K15', '5. ¿Empezar más proyectos de lo normal o hacer cosas más arriesgadas de lo normal?', blue_celd_format5)
    hoja.write('L15', mst1.pregunta5, blue_celd_format4)
    hoja.merge_range(
        'C16:K16', '6. ¿Sentirse nervioso/a, ansioso/a, preocupado/a o al límite?', white_celd_format1)
    hoja.write('L16', mst1.pregunta6, white_celd_format)
    hoja.merge_range(
        'C17:K17', '7. ¿Sentir pánico o estar atemorizado/a?', white_celd_format1)
    hoja.write('L17', mst1.pregunta7, white_celd_format)
    hoja.merge_range(
        'C18:K18', '8. ¿Evitar situaciones que le ponen nervioso/a?', white_celd_format1)
    hoja.write('L18', mst1.pregunta8, white_celd_format)
    hoja.merge_range(
        'C19:K19', '9. ¿Dolores o molestias inexplicados (por ejemplo; cabeza, espalda, articulaciones, abdomen, piernas)?', blue_celd_format5)
    hoja.write('L19', mst1.pregunta9, blue_celd_format4)
    hoja.merge_range(
        'C20:K20', '10. ¿Sentir que sus enfermedades no se toman lo suficientemente en serio?', blue_celd_format5)
    hoja.write('L20', mst1.pregunta10, blue_celd_format4)
    hoja.merge_range(
        'C21:K21', '11. ¿Tener pensamiento de dañarse a sí mismo/a?', white_celd_format1)
    hoja.write('L21', mst1.pregunta11, white_celd_format)
    hoja.merge_range(
        'C22:K22', '12. ¿Oír cosas que otras personas no podrían oír, como voces, incluso cuando no hay nadie alrededor?', blue_celd_format5)
    hoja.write('L22', mst1.pregunta12, blue_celd_format4)
    hoja.merge_range(
        'C23:K23', '13. ¿Sentir que alguien podría oír sus pensamientos o que usted podría escuchar lo que otra persona estaba pensando?', blue_celd_format5)
    hoja.write('L23', mst1.pregunta13, blue_celd_format4)
    hoja.merge_range(
        'C24:K24', '14. ¿Problemas de sueño que afectan a su calidad de sueño en general?', white_celd_format1)
    hoja.write('L24', mst1.pregunta14, white_celd_format)
    hoja.merge_range(
        'C25:K25', '15. ¿Problemas con la memoria (por ejemplo, aprender nueva información) o con la ubicación (por ejemplo., encontrar el camino a casa)?', blue_celd_format5)
    hoja.write('L25', mst1.pregunta15, blue_celd_format4)
    hoja.merge_range(
        'C26:K26', '16. ¿Pensamientos desagradables, necesidades urgentes o imágenes repetidas en su cabeza?', white_celd_format1)
    hoja.write('L26', mst1.pregunta16, white_celd_format)
    hoja.merge_range(
        'C27:K27', '17. ¿Sentirse impulsado/a a realizar ciertos comportamientos o actos mentales una y otra vez?', white_celd_format1)
    hoja.write('L27', mst1.pregunta17, white_celd_format)
    hoja.merge_range(
        'C28:K28', '18. ¿Sentirse indiferente o distanciado de sí mismo/a, de su cuerpo, de lo que le rodea o de sus recuerdos?', blue_celd_format5)
    hoja.write('L28', mst1.pregunta18, blue_celd_format4)
    hoja.merge_range(
        'C29:K29', '19. ¿No saber quién es realmente o qué es lo que quiere de la vida?', white_celd_format1)
    hoja.write('L29', mst1.pregunta19, white_celd_format)
    hoja.merge_range(
        'C30:K30', '20. ¿No sentirse cercano a otras personas o no disfrutar de sus relaciones con ellas?', white_celd_format1)
    hoja.write('L30', mst1.pregunta20, white_celd_format)
    hoja.merge_range(
        'C31:K31', '21. ¿Tomar al menos cuatro bebidas de cualquier tipo de alcohol en un solo día?', blue_celd_format5)
    hoja.write('L31', mst1.pregunta21, blue_celd_format4)
    hoja.merge_range(
        'C32:K32', '22. ¿Fumar cigarrillos, puros o en pipa, o usar tabaco en polvo, o masticar tabaco?', blue_celd_format5)
    hoja.write('L32', mst1.pregunta22, blue_celd_format4)
    hoja.merge_range(
        'C33:K33', '23. ¿Usar una de las medicinas siguientes A SU MANERA, esto es, sin la prescripción de un médico, en mayores cantidades o más tiempo de lo prescrito [por ejemplo; analgésicos (como Termalgín codeína), estimulantes (como Rubifén), sedantes o tranquilizantes (como pastillas para dormir o Valium), o drogas como marihuana, cocaína o crack, drogas de diseño (como el éxtasis), alucinógenos (como el LSD), heroína, inhalantes o disolventes (como el pegamento), o metanfetamina (como el speed)]?', blue_celd_format5)
    hoja.write('L33', mst1.pregunta23, blue_celd_format4)
    
    # sintomas
    hoja.merge_range('M11:M12', 'Depresión', blue_celd_format4)
    hoja.merge_range('N11:N12', mst1.pregunta1 + mst1.pregunta2, blue_celd_format4)
    
    if (mst1.pregunta1 + mst1.pregunta2) > 2:
        hoja.merge_range('O11:P12', 'APLICAR ENTREVISTA NIVEL 2 "DEPRESIÓN"', white_celd_format)
    else:
        hoja.merge_range('O11:P12', 'DATOS NO SIGNIFICATIVOS', white_celd_format)
    
    hoja.write('M13', 'Ira', white_celd_format)
    hoja.write('N13', mst1.pregunta3, white_celd_format)
    
    if (mst1.pregunta3) > 2:
        hoja.merge_range(
            'O13:P13', 'APLICAR ENTREVISTA NIVEL 2 "IRA"', white_celd_format)
    else:
        hoja.merge_range('O13:P13', 'DATOS NO SIGNIFICATIVOS', white_celd_format)
    
    hoja.merge_range('M14:M15', 'Manía', blue_celd_format4)
    hoja.merge_range('N14:N15', mst1.pregunta4 +
                     mst1.pregunta5, blue_celd_format4)
    
    if (mst1.pregunta4 + mst1.pregunta5) > 2:
        hoja.merge_range(
            'O14:P15', 'APLICAR ENTREVISTA NIVEL 2 "MANÍA"', white_celd_format)
    else:
        hoja.merge_range('O14:P15', 'DATOS NO SIGNIFICATIVOS', white_celd_format)
    
    hoja.merge_range('M16:M18', 'Ansiedad', white_celd_format)
    hoja.merge_range('N16:N18', mst1.pregunta6 + mst1.pregunta7 + mst1.pregunta8, white_celd_format)
    
    if (mst1.pregunta6 + mst1.pregunta7 + mst1.pregunta8) > 2:
        hoja.merge_range(
            'O16:P18', 'APLICAR ENTREVISTA NIVEL 2 "ANSIEDAD"', white_celd_format)
    else:
        hoja.merge_range('O16:P18', 'DATOS NO SIGNIFICATIVOS', white_celd_format)
    
    hoja.merge_range('M19:M20', 'Síntomas somáticos', blue_celd_format4)
    hoja.merge_range('N19:N20', mst1.pregunta9 + mst1.pregunta10, blue_celd_format4)
    
    if (mst1.pregunta9 + mst1.pregunta10) > 2:
        hoja.merge_range(
            'O19:P20', 'APLICAR ENTREVISTA NIVEL 2 "SÍNTOMAS SOMÁTICOS"', white_celd_format)
    else:
        hoja.merge_range('O19:P20', 'DATOS NO SIGNIFICATIVOS', white_celd_format)
    
    hoja.write('M21', 'Pregunta 11', white_celd_format)
    hoja.write('N21', mst1.pregunta11, white_celd_format)
    
    if mst1.pregunta11 == 0:
        hoja.merge_range('O21:P21', 'DATOS NO SIGNIFICATIVOS', white_celd_format)
    else:
        hoja.merge_range(
            'O21:P21', 'VERIFICAR ESCALA ID SUICIDA BECK', red_celd_format)
    
    hoja.merge_range('M22:M23', 'Psicosis', blue_celd_format4)
    hoja.merge_range('N22:N23', mst1.pregunta12 + 
                     mst1.pregunta13, blue_celd_format4)
    
    if (mst1.pregunta12 + mst1.pregunta13) > 1:
        hoja.merge_range(
            'O22:P23', 'VERIFICAR TRASTORNOS PSICÓTICOS MINI 7.0', white_celd_format)
    else:
        hoja.merge_range('O22:P23', 'DATOS NO SIGNIFICATIVOS', white_celd_format)
    
    hoja.write('M24', 'Problemas de sueño', white_celd_format)
    hoja.write('N24', mst1.pregunta14, white_celd_format)
    
    if mst1.pregunta14 > 2:
        hoja.merge_range(
            'O24:P24', 'APLICAR ENTREVISTA NIVEL 2 "TRASTORNOS DE SUEÑO"', white_celd_format)
    else:
        hoja.merge_range('O24:P24', 'DATOS NO SIGNIFICATIVOS', white_celd_format)
    
    hoja.write('M25', 'Memoria', blue_celd_format4)
    hoja.write('N25', mst1.pregunta15, blue_celd_format4)
    
    if mst1.pregunta15 > 2:
        hoja.merge_range(
            'O25:P25', 'VERIFICAR TRASTORNOS DE LA MEMORIA EN DSM-5"', white_celd_format)
    else:
        hoja.merge_range('O25:P25', 'DATOS NO SIGNIFICATIVOS', white_celd_format)
    
    hoja.merge_range('M26:M27', 'Pensamientos y comportamientos repetitivos', white_celd_format)
    hoja.merge_range('N26:N27', mst1.pregunta16 + mst1.pregunta17, white_celd_format)
    
    if (mst1.pregunta16 + mst1.pregunta17) > 2:
        hoja.merge_range(
            'O26:P27', 'APLICAR ENTREVISTA NIVEL 2 "PENSAMIENTOS Y COMPORTAMIENTOS REPETITIVOS"', white_celd_format)
    else:
        hoja.merge_range('O26:P27', 'DATOS NO SIGNIFICATIVOS', white_celd_format)
    
    hoja.write('M28', 'Disociación', blue_celd_format4)
    hoja.write('N28', mst1.pregunta18, blue_celd_format4)
    
    if mst1.pregunta18 > 2:
        hoja.merge_range(
            'O28:P28', 'VERIFICAR TRASTORNOS DE DISOCIACIÓN DSM-5', white_celd_format)
    else:
        hoja.merge_range('O28:P28', 'DATOS NO SIGNIFICATIVOS', white_celd_format)
    
    hoja.merge_range('M29:M30', 'Personalidad', white_celd_format)
    hoja.merge_range('N29:N30', mst1.pregunta19 + mst1.pregunta20, white_celd_format)
    
    if (mst1.pregunta19 + mst1.pregunta20) > 2:
        hoja.merge_range(
            'O29:P30', 'VERIFICAR TRASTORNOS DE PERSONALIDAD DSM-5', white_celd_format)
    else:
        hoja.merge_range('O29:P30', 'DATOS NO SIGNIFICATIVOS', white_celd_format)
    
    hoja.merge_range('M31:M33', 'Consumo de sustancias', blue_celd_format4)
    hoja.merge_range('N31:N33', mst1.pregunta21 + mst1.pregunta22 + mst1.pregunta23, blue_celd_format4)
    
    if (mst1.pregunta21 + mst1.pregunta22 + mst1.pregunta23) > 1:
        hoja.merge_range(
            'O31:P33', 'APLICAR ENTREVISTA NIVEL 2 "ABUSO DE SUSTANCIAS"', white_celd_format)
    else:
        hoja.merge_range('O31:P33', 'DATOS NO SIGNIFICATIVOS', white_celd_format)
    
    # Observaciones MST Nivel 1
    hoja.merge_range('C34:D34', 'Observaciones MST Nivel 1', green_celd_format1)
    hoja.merge_range('E34:P34', mst1.observaciones, white_celd_format1)
    
    # fpp
    hoja.merge_range('C35:P35', 'Del 1 al 5 valora las siguientes afirmaciones (siendo el 1 totalmente en desacuerdo y el 5 totalmente de acuerdo)', green_celd_format)
    hoja.write('C36', 'Autoestima', green_celd_format1)
    hoja.write('C37', '1. Me gusta mi forma de ser', white_celd_format)
    hoja.write('C38', fpp.pregunta1, white_celd_format)
    
    hoja.write('D36', 'Resiliencia', green_celd_format1)
    hoja.write(
        'D37', '2. No me rindo fácilmente ante las dificultades de la vida', white_celd_format)
    hoja.write('D38', fpp.pregunta2, white_celd_format)
    
    hoja.write('E36', 'Optimismo', green_celd_format1)
    hoja.write('E37', '3. Me considero una persona optimista',
               white_celd_format)
    hoja.write('E38', fpp.pregunta3, white_celd_format)
    
    hoja.write('F36', 'Creatividad', green_celd_format1)
    hoja.write('F37', '4. Sé encontrar nuevos usos a las cosas',
               white_celd_format)
    hoja.write('F38', fpp.pregunta4, white_celd_format)
    
    hoja.write('G36', 'Autonomía', green_celd_format1)
    hoja.write('G37', '5. Tengo confianza y seguridad en mí mismo/a',
               white_celd_format)
    hoja.write('G38', fpp.pregunta5, white_celd_format)
    
    hoja.write('H36', 'Dominio del Entorno', green_celd_format1)
    hoja.write('H37', '6. Compagino adecuadamente mi vida laboral, social y personal',
               white_celd_format)
    hoja.write('H38', fpp.pregunta6, white_celd_format)
    
    hoja.write('I36', 'Vitalidad', green_celd_format1)
    hoja.write('I37', '7. Estoy lleno/a de vitalidad', white_celd_format)
    hoja.write('I38', fpp.pregunta7, white_celd_format)
    
    hoja.write('J36', 'Propósito Vital', green_celd_format1)
    hoja.write(
        'J37', '11. Estoy completamente entregado/a a conseguir los objetivos de mi vida ', white_celd_format)
    hoja.write('J38', fpp.pregunta11, white_celd_format)
    
    hoja.write('K36', 'Humor', green_celd_format1)
    hoja.write(
        'K37', '13. El sentido del humor es muy importante en mi vida', white_celd_format)
    hoja.write('K38', fpp.pregunta13, white_celd_format)
    
    hoja.write('L36', 'Disfrute', green_celd_format1)
    hoja.write(
        'L37', '16. Sé disfrutar las pequeñas cosas que ofrece la vida cada día ', white_celd_format)
    hoja.write('L38', fpp.pregunta16, white_celd_format)
    
    hoja.write('M36', 'Curiosidad', green_celd_format1)
    hoja.write('M37', '17. Me interesa todo lo que pasa a mi alrededor', white_celd_format)
    hoja.write('M38', fpp.pregunta17, white_celd_format)
    
    hoja.write('N36', '', green_celd_format1)
    hoja.write('N37', '', white_celd_format)
    hoja.write('N38', '', white_celd_format)
    
    valor_pregunta_uno = 0
    valor_pregunta_dos = 0
    if motivo_consulta.pregunta_uno == 'check_uno':
        valor_pregunta_uno = 1
    elif motivo_consulta.pregunta_uno == 'check_dos':
        valor_pregunta_uno = 2
    elif motivo_consulta.pregunta_uno == 'check_tres':
        valor_pregunta_uno = 3
    elif motivo_consulta.pregunta_uno == 'check_cuatro':
        valor_pregunta_uno = 4
    else:
        valor_pregunta_uno = 5
    
    if motivo_consulta.pregunta_dos == 'check_uno':
        valor_pregunta_dos = 1
    elif motivo_consulta.pregunta_dos == 'check_dos':
        valor_pregunta_dos = 2
    elif motivo_consulta.pregunta_dos == 'check_tres':
        valor_pregunta_dos = 3
    elif motivo_consulta.pregunta_dos == 'check_cuatro':
        valor_pregunta_dos = 4
    else:
        valor_pregunta_dos = 5
    
    hoja.merge_range('O36:P36', 'Motivo de Consulta', green_celd_format1)
    hoja.merge_range('O37:P37', '(1). ¿Del 1 al 5 qué tan mal se siente actualmente? (donde 1 es nada mal y 5 es muy mal)', green_celd_format1)
    hoja.merge_range('O38:P38', valor_pregunta_uno, white_celd_format)
    hoja.merge_range('O39:P39', '(2). ¿Del 1 al 5 qué tanto su estado actual afecta la vida cotidiana (trabajo, escuela, relaciones afectivas)?  (donde 1 es nada y 5 es mucho)', green_celd_format1)
    hoja.merge_range('O40:P40', valor_pregunta_dos, white_celd_format)
    hoja.merge_range('O41:P43', '(3). ¿Cuál es el motivo por el cuál solicita cita a servicios psicológicos? Explique con detalle.', green_celd_format1)
    hoja.merge_range('O44:P48', motivo_consulta.pregunta_tres, white_celd_format)
    
    hoja.write('C39', '18. Me siento orgulloso/a de ser como soy',white_celd_format)
    hoja.write('C40', fpp.pregunta18,white_celd_format)
    hoja.write('D39', '14. Ante las dificultades me hago fuerte',white_celd_format)
    hoja.write('D40', fpp.pregunta14,white_celd_format)
    hoja.write('E39', '15. Siempre veo el lado bueno de las cosas', white_celd_format)
    hoja.write('E40', fpp.pregunta15,white_celd_format)
    hoja.write('F39', '9. Sé relacionar cosas dispares y sacar algo distinto', white_celd_format)
    hoja.write('F40', fpp.pregunta9,white_celd_format)
    hoja.write('G39', '8. Para bien o para mal, las decisiones importantes en mi vida las he tomado yo', white_celd_format)
    hoja.write('G40', fpp.pregunta8,white_celd_format)
    hoja.write('H39', '22. En mi día a día no llego a todo: trabajo, familia, pareja, amigos', white_celd_format)
    hoja.write('H40', fpp.pregunta22,white_celd_format)
    hoja.write('I39', '19. Soy una persona entusiasta', white_celd_format)
    hoja.write('I40', fpp.pregunta19,white_celd_format)
    hoja.write('J39', '24. Lucho por conseguir las cosas que me importan', white_celd_format)
    hoja.write('J40', fpp.pregunta24,white_celd_format)
    hoja.write('K39', '23. Soy capaz de reírme en muchas situaciones', white_celd_format)
    hoja.write('K40', fpp.pregunta23,white_celd_format)
    hoja.write('L39', '28. Lo paso bien con casi cualquier cosa', white_celd_format)
    hoja.write('L40', fpp.pregunta28,white_celd_format)
    hoja.write('M39', '27. Muchas cosas de la vida despiertan mi curiosidad e interés', white_celd_format)
    hoja.write('M40', fpp.pregunta27,white_celd_format)
    hoja.write('N40', '',white_celd_format)
        
    hoja.write('C41', '20. Si volviera a nacer me gustaría ser tal como soy', white_celd_format)
    hoja.write('C42', fpp.pregunta20, white_celd_format)
    hoja.write('D41', '25. Superar las dificultades me ha hecho más fuerte', white_celd_format)
    hoja.write('D42', fpp.pregunta25, white_celd_format)
    hoja.write('E41', '21. Creo que el futuro me traerá más cosas buenas que malas', white_celd_format)
    hoja.write('E42', fpp.pregunta21, white_celd_format)
    hoja.write('F41', '12. Soy capaz de ver las cosas desde puntos de vista completamente diferentes', white_celd_format)
    hoja.write('F42', fpp.pregunta12, white_celd_format)
    hoja.write('G41', '10. Yo llevo las riendas de mi vida', white_celd_format)
    hoja.write('G42', fpp.pregunta10, white_celd_format)
    hoja.write('H41', '31. Manejo adecuadamente y sin agobio las obligaciones que tengo', white_celd_format)
    hoja.write('H42', fpp.pregunta31, white_celd_format)
    hoja.write('I41', '32. Soy una persona llena de energía', white_celd_format)
    hoja.write('I42', fpp.pregunta32, white_celd_format)
    hoja.write('J41', '26. Estoy en el camino de lograr mis metas personales', white_celd_format)
    hoja.write('J42', fpp.pregunta26, white_celd_format)
    hoja.write('K41', '29. Intento sacar el humor a cualquier situación', white_celd_format)
    hoja.write('K42', fpp.pregunta29, white_celd_format)
    hoja.write('L41', '33. En la vida hay muchas cosas que me llenan de ilusión', white_celd_format)
    hoja.write('L42', fpp.pregunta33, white_celd_format)
    hoja.write('M41', '30. Me apasiona aprender y descubrir cosas nuevas', white_celd_format)
    hoja.write('M42', fpp.pregunta30, white_celd_format)
    hoja.write('N42', '', white_celd_format)
    
    createCeld(hoja, 'C43', fpp.pregunta1 + fpp.pregunta18 + fpp.pregunta20, red_celd_format, orange_celd_format, yellow_celd_format, green_celd_format)
    createCeld(hoja, 'D43', fpp.pregunta2 + fpp.pregunta14 + fpp.pregunta25, red_celd_format, orange_celd_format, yellow_celd_format, green_celd_format)
    createCeld(hoja, 'E43', fpp.pregunta3 + fpp.pregunta15 + fpp.pregunta21, red_celd_format, orange_celd_format, yellow_celd_format, green_celd_format)
    createCeld(hoja, 'F43', fpp.pregunta4 + fpp.pregunta9 + fpp.pregunta12, red_celd_format, orange_celd_format, yellow_celd_format, green_celd_format)
    createCeld(hoja, 'G43', fpp.pregunta5 + fpp.pregunta8 + fpp.pregunta10, red_celd_format, orange_celd_format, yellow_celd_format, green_celd_format)
    createCeld(hoja, 'H43', fpp.pregunta6 + fpp.pregunta22 + fpp.pregunta31, red_celd_format, orange_celd_format, yellow_celd_format, green_celd_format)
    createCeld(hoja, 'I43', fpp.pregunta7 + fpp.pregunta19 + fpp.pregunta32, red_celd_format, orange_celd_format, yellow_celd_format, green_celd_format)
    createCeld(hoja, 'J43', fpp.pregunta11 + fpp.pregunta24 + fpp.pregunta26, red_celd_format, orange_celd_format, yellow_celd_format, green_celd_format)
    createCeld(hoja, 'K43', fpp.pregunta13 + fpp.pregunta23 + fpp.pregunta29, red_celd_format, orange_celd_format, yellow_celd_format, green_celd_format)
    createCeld(hoja, 'L43', fpp.pregunta16 + fpp.pregunta28 + fpp.pregunta33, red_celd_format, orange_celd_format, yellow_celd_format, green_celd_format)
    createCeld(hoja, 'M43', fpp.pregunta17 + fpp.pregunta27 + fpp.pregunta30, red_celd_format, orange_celd_format, yellow_celd_format, green_celd_format)
    
    # hoja.write('D43', fpp.pregunta2 + fpp.pregunta14 + fpp.pregunta25, gray_celd_format)
    # hoja.write('E43', fpp.pregunta3 + fpp.pregunta15 + fpp.pregunta21, gray_celd_format)
    # hoja.write('F43', fpp.pregunta4 + fpp.pregunta9 + fpp.pregunta12, gray_celd_format)
    # hoja.write('G43', fpp.pregunta5 + fpp.pregunta8 + fpp.pregunta10, gray_celd_format)
    # hoja.write('H43', fpp.pregunta6 + fpp.pregunta22 + fpp.pregunta31, gray_celd_format)
    # hoja.write('I43', fpp.pregunta7 + fpp.pregunta19 + fpp.pregunta32, gray_celd_format)
    # hoja.write('J43', fpp.pregunta11 + fpp.pregunta24 + fpp.pregunta26, gray_celd_format)
    # hoja.write('K43', fpp.pregunta13 + fpp.pregunta23 + fpp.pregunta29, gray_celd_format)
    # hoja.write('L43', fpp.pregunta16 + fpp.pregunta28 + fpp.pregunta33, gray_celd_format)
    # hoja.write('M43', fpp.pregunta17 + fpp.pregunta27 + fpp.pregunta30, gray_celd_format)
    hoja.write('N43', '', white_celd_format)
    
    fpp_porciento = (fpp.total*100)/165
    fpp_porciento_redondeado = round(fpp_porciento, 0)
    fpp_promedio = (fpp.total)/33
    hoja.merge_range('C45:C46', 'SUMATORIA TOTAL', green_celd_format)
    hoja.merge_range('D45:D46', fpp.total, white_celd_format)
    hoja.merge_range('E45:E46', '%', green_celd_format)
    hoja.merge_range('F45:F46', fpp_porciento_redondeado, white_celd_format)
    
    hoja.write('C47', 'Muy bajo', red_celd_format)
    hoja.write('C48', '0-3', red_celd_format)
    hoja.write('D47', 'Bajo', orange_celd_format)
    hoja.write('D48', '04_07', orange_celd_format)
    hoja.write('E47', 'Moderado', yellow_celd_format)
    hoja.write('E48', '08_11', yellow_celd_format)
    hoja.write('F47', 'Alto', green_celd_format)
    hoja.write('F48', '12_15', green_celd_format)
    
    # observaciones fpp
    hoja.merge_range('H45:H48', 'Observaciones FPP', green_celd_format1)
    hoja.merge_range('I45:N48', fpp.observaciones, white_celd_format)
    
    resultado['hoja'] = hoja
    
    return resultado
    
    
def exportarExamen2(atencion, libro, mst2, beck, dsm5):
    # datos de los examenes
    resultado = {}
   
    nombre_solicitante = atencion.solicitante.nombre + \
        ' ' + (atencion.solicitante.segundo_nombre if atencion.solicitante.segundo_nombre else '') + \
        ' ' + atencion.solicitante.apellido + ' ' + \
        (atencion.solicitante.segundo_apellido if atencion.solicitante.segundo_apellido else '')
    email = atencion.solicitante.email
    codigo_udg = atencion.solicitante.codigo_udg if atencion.solicitante.codigo_udg else None
    
    # llenando la hoja de excel
    # crear la hoja
    hoja = libro.add_worksheet('Evaluaciones MST 2-Beck-DSM5')
    # Definir los formatos para las celdas
    # formatos para las celdas de MST 2-Beck-DSM5
    blue_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#00B0F0', 'bold': True, 'align': 'center', 'font_size': 14})
    blue_celd_format1 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#BDD7EE', 'bold': True, 'align': 'center', 'font_size': 14})
    blue_celd_format2 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#00B0F0', 'bold': True, 'align': 'center', 'font_size': 16})
    blue_celd_format3 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#9BC2E6', 'bold': True, 'align': 'center', 'font_size': 14})
    blue_celd_format4 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#BDD7EE', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    white_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    white_porcentaje_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True, 'num_format': '0%'})
    green_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#00B050', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    yellow_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#FFC000', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    red_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#ff0404', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    orange_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#e98604', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})

    # Establecer el ancho de las columnas
    hoja.set_column('A:A', 2)
    hoja.set_column('B:B', 2)
    hoja.set_column('C:C', 30)
    hoja.set_column('D:D', 18)
    hoja.set_column('E:E', 17)
    hoja.set_column('F:F', 22)
    hoja.set_column('G:G', 30)
    hoja.set_column('H:H', 34)
    hoja.set_column('I:I', 44)

    # Establecer la altura de las filas
    hoja.set_row(0, 21)
    hoja.set_row(1, 41)
    hoja.set_row(2, 26)
    hoja.set_row(3, 26)

    #  datos de la persona
    hoja.merge_range('C1:I1', 'Resultados de la Entrevista de valoración presencial', blue_celd_format)
    hoja.merge_range('C2:F2', 'Nombre del solicitante', blue_celd_format1)
    hoja.write('G2', 'Código', blue_celd_format1)
    hoja.merge_range('H2:I2', 'Correo electrónico', blue_celd_format1)
    hoja.merge_range('C3:F3', nombre_solicitante, white_celd_format)
    hoja.write('G3', codigo_udg, white_celd_format)
    hoja.merge_range('H3:I3', email, white_celd_format)
    
    # examen mst nivel 2
    hoja.merge_range('C4:I4', 'Medidas transversales de síntomas de nivel 2 Para adultos', blue_celd_format2)
    hoja.write('C5', 'SINTOMAS', blue_celd_format3)
    hoja.write('D5', 'RESPUESTA', blue_celd_format3)
    hoja.write('E5', 'PUNTUACION (%)', blue_celd_format3)
    hoja.write('F5', 'SEMAFORO', blue_celd_format3)
    hoja.merge_range('G5:I5', 'OBSERVACIONES GENERALES DEL CASO', blue_celd_format3)
    
    hoja.write('C6', 'DEPRESIÓN', white_celd_format)
    hoja.write('D6', 'NO APLICA' if mst2.evaluacion_depresion == 0 and mst2.depresion_pregunta1 == -1 else 'APLICA', white_celd_format)
    hoja.write('E6', mst2.evaluacion_depresion if mst2.evaluacion_depresion else 0, white_celd_format)
    if mst2.nivel_evaluacion_depresion == 'Ninguno o Poco':
        hoja.write('F6', mst2.nivel_evaluacion_depresion, green_celd_format)
    elif mst2.nivel_evaluacion_depresion == 'Leve':
        hoja.write('F6', mst2.nivel_evaluacion_depresion, yellow_celd_format)
    elif mst2.nivel_evaluacion_depresion == 'Moderado':
        hoja.write('F6', mst2.nivel_evaluacion_depresion, orange_celd_format)
    elif mst2.nivel_evaluacion_depresion == 'Medio':
        hoja.write('F6', mst2.nivel_evaluacion_depresion, orange_celd_format)
    else:
        hoja.write('F6', mst2.nivel_evaluacion_depresion, red_celd_format)
    
    hoja.write('C7', 'IRA', blue_celd_format4)
    hoja.write('D7', 'NO APLICA' if mst2.evaluacion_ira == 0 and mst2.ira_pregunta1 == -1 else 'APLICA', blue_celd_format4)
    hoja.write('E7', mst2.evaluacion_ira if mst2.evaluacion_ira else 0, blue_celd_format4)
    if mst2.nivel_evaluacion_ira == 'Ninguno o Poco':
        hoja.write('F7', mst2.nivel_evaluacion_ira, green_celd_format)
    elif mst2.nivel_evaluacion_ira == 'Leve':
        hoja.write('F7', mst2.nivel_evaluacion_ira, yellow_celd_format)
    elif mst2.nivel_evaluacion_ira == 'Moderado':
        hoja.write('F7', mst2.nivel_evaluacion_ira, orange_celd_format)
    elif mst2.nivel_evaluacion_ira == 'Medio':
        hoja.write('F7', mst2.nivel_evaluacion_ira, orange_celd_format)
    else:
        hoja.write('F7', mst2.nivel_evaluacion_ira, red_celd_format)
    
    hoja.write('C8', 'MANÍA', white_celd_format)
    hoja.write('D8', 'NO APLICA' if mst2.evaluacion_mania == 0 and mst2.mania_pregunta1 == -1 else 'APLICA', white_celd_format)
    hoja.write('E8', mst2.evaluacion_mania if mst2.evaluacion_mania else 0, white_celd_format)
    if mst2.nivel_evaluacion_mania == 'Ninguno o Poco':
        hoja.write('F8', mst2.nivel_evaluacion_mania, green_celd_format)
    elif mst2.nivel_evaluacion_mania == 'Leve':
        hoja.write('F8', mst2.nivel_evaluacion_mania, yellow_celd_format)
    elif mst2.nivel_evaluacion_mania == 'Moderado':
        hoja.write('F8', mst2.nivel_evaluacion_mania, orange_celd_format)
    elif mst2.nivel_evaluacion_mania == 'Medio':
        hoja.write('F8', mst2.nivel_evaluacion_mania, orange_celd_format)
    else:
        hoja.write('F8', mst2.nivel_evaluacion_mania, red_celd_format)
    
    hoja.write('C9', 'ANSIEDAD', blue_celd_format4)
    hoja.write('D9', 'NO APLICA' if mst2.evaluacion_ansiedad == 0 and mst2.ansiedad_pregunta1 == -1 else 'APLICA', blue_celd_format4)
    hoja.write(
        'E9', mst2.evaluacion_ansiedad if mst2.evaluacion_ansiedad else 0, blue_celd_format4)
    if mst2.nivel_evaluacion_ansiedad == 'Ninguno o Poco':
        hoja.write('F9', mst2.nivel_evaluacion_ansiedad, green_celd_format)
    elif mst2.nivel_evaluacion_ansiedad == 'Leve':
        hoja.write('F9', mst2.nivel_evaluacion_ansiedad, yellow_celd_format)
    elif mst2.nivel_evaluacion_ansiedad == 'Moderado':
        hoja.write('F9', mst2.nivel_evaluacion_ansiedad, orange_celd_format)
    elif mst2.nivel_evaluacion_ansiedad == 'Medio':
        hoja.write('F9', mst2.nivel_evaluacion_ansiedad, orange_celd_format)
    else:
        hoja.write('F9', mst2.nivel_evaluacion_ansiedad, red_celd_format)
    
    hoja.write('C10', 'SINTOMAS SOMATICOS', white_celd_format)
    hoja.write('D10', 'NO APLICA' if mst2.evaluacion_somaticos == 0 and mst2.somaticos_pregunta1 == -1 else 'APLICA', white_celd_format)
    hoja.write('E10', mst2.evaluacion_somaticos if mst2.evaluacion_ansiedad else 0, white_celd_format)
    if mst2.nivel_evaluacion_somaticos == 'Mínimo':
        hoja.write('F10', mst2.nivel_evaluacion_somaticos, green_celd_format)
    elif mst2.nivel_evaluacion_somaticos == 'Bajo':
        hoja.write('F10', mst2.nivel_evaluacion_somaticos, yellow_celd_format)
    elif mst2.nivel_evaluacion_somaticos == 'Moderado':
        hoja.write('F10', mst2.nivel_evaluacion_somaticos, orange_celd_format)
    elif mst2.nivel_evaluacion_somaticos == 'Medio':
        hoja.write('F10', mst2.nivel_evaluacion_somaticos, orange_celd_format)
    elif mst2.nivel_evaluacion_somaticos == 'Alto':
        hoja.write('F10', mst2.nivel_evaluacion_somaticos, red_celd_format)
    
    hoja.write('C11', 'PROBLEMAS DE SUEÑO', blue_celd_format4)
    hoja.write('D11', 'NO APLICA' if mst2.evaluacion_suenno == 0 and mst2.suenno_pregunta1 == -1 else 'APLICA', blue_celd_format4)
    hoja.write('E11', mst2.evaluacion_suenno if mst2.evaluacion_suenno else 0, blue_celd_format4)
    if mst2.nivel_evaluacion_suenno == 'Ninguno o Poco':
        hoja.write('F11', mst2.nivel_evaluacion_suenno, green_celd_format)
    elif mst2.nivel_evaluacion_suenno == 'Leve':
        hoja.write('F11', mst2.nivel_evaluacion_suenno, yellow_celd_format)
    elif mst2.nivel_evaluacion_suenno == 'Moderado':
        hoja.write('F11', mst2.nivel_evaluacion_suenno, orange_celd_format)
    elif mst2.nivel_evaluacion_suenno == 'Medio':
        hoja.write('F11', mst2.nivel_evaluacion_suenno, orange_celd_format)
    else:
        hoja.write('F11', mst2.nivel_evaluacion_suenno, red_celd_format)
    
    hoja.write('C12', 'PENSAMIENTOS y COMPORTAMIENTOS REPETITIVOS',
               white_celd_format)
    hoja.write('D12', 'NO APLICA' if mst2.evaluacion_repetitivo == 0 and mst2.repetitivo_pregunta1 == -1 else 'APLICA', white_celd_format)
    hoja.write('E12', mst2.evaluacion_repetitivo if mst2.evaluacion_repetitivo else 0, white_celd_format)
    if mst2.nivel_evaluacion_repetitivo == 'Ninguno o Poco':
        hoja.write('F12', mst2.nivel_evaluacion_repetitivo, green_celd_format)
    elif mst2.nivel_evaluacion_repetitivo == 'Leve':
        hoja.write('F12', mst2.nivel_evaluacion_repetitivo, yellow_celd_format)
    elif mst2.nivel_evaluacion_repetitivo == 'Moderado':
        hoja.write('F12', mst2.nivel_evaluacion_repetitivo, orange_celd_format)
    elif mst2.nivel_evaluacion_repetitivo == 'Medio':
        hoja.write('F12', mst2.nivel_evaluacion_repetitivo, orange_celd_format)
    else:
        hoja.write('F12', mst2.nivel_evaluacion_repetitivo, red_celd_format)
    
    hoja.merge_range('C13:C23', 'CONSUMO DE SUSTANCIAS', blue_celd_format4)
    hoja.merge_range('D13:D23', 'NO APLICA' if mst2.evaluacion_sustancia == 0 and mst2.sustancia_pregunta1 == -1 else 'APLICA', blue_celd_format4)
    hoja.merge_range('E13:E23', mst2.evaluacion_sustancia if mst2.evaluacion_sustancia else 0, blue_celd_format4)
    if mst2.nivel_evaluacion_sustancia == 'Ninguno o Poco':
        hoja.merge_range('F13:F23', mst2.nivel_evaluacion_sustancia, green_celd_format)
    elif mst2.nivel_evaluacion_sustancia == 'Leve':
        hoja.merge_range('F13:F23', mst2.nivel_evaluacion_sustancia, yellow_celd_format)
    elif mst2.nivel_evaluacion_sustancia == 'Moderado':
        hoja.merge_range('F13:F23', mst2.nivel_evaluacion_sustancia, orange_celd_format)
    elif mst2.nivel_evaluacion_sustancia == 'Medio':
        hoja.merge_range('F13:F23', mst2.nivel_evaluacion_sustancia, orange_celd_format)
    else:
        hoja.merge_range('F13:F23', mst2.nivel_evaluacion_sustancia, red_celd_format)
    
    # medicamentos de las sustancias del examen mst nivel 2
    hoja.merge_range('G13:H13', 'Analgésicos (como Vicodin)', white_celd_format)
    hoja.merge_range('G14:H14', 'Estimulantes (como Ritalin, Adderall)', white_celd_format)
    hoja.merge_range('G15:H15', 'Sedantes o tranquilizantes (como pastillas para dormir o Valium)', white_celd_format)
    hoja.merge_range('G16:I16', 'O DROGAS COMO:', white_celd_format)
    hoja.merge_range('G17:H17', 'Marihuana', white_celd_format)
    hoja.merge_range('G18:H18', 'Cocaína o Crack', white_celd_format)
    hoja.merge_range('G19:H19', 'Drogas de club (como el éxtasis)', white_celd_format)
    hoja.merge_range('G20:H20', 'Alucinógenos (como el LSD)', white_celd_format)
    hoja.merge_range('G21:H21', 'Heroína', white_celd_format)
    hoja.merge_range('G22:H22', 'Inhalantes y disolventes (como pegamento)', white_celd_format)
    hoja.merge_range('G23:H23', 'Metanfetamina (como speed)', white_celd_format)
    hoja.write('I13', mst2.sustancia_pregunta1 if mst2.sustancia_pregunta1 >= 0 else 0, green_celd_format if mst2.sustancia_pregunta1 < 3 else red_celd_format)
    hoja.write('I14', mst2.sustancia_pregunta2 if mst2.sustancia_pregunta2 >= 0 else 0, green_celd_format if mst2.sustancia_pregunta2 < 3 else red_celd_format)
    hoja.write('I15', mst2.sustancia_pregunta3 if mst2.sustancia_pregunta3 >= 0 else 0, green_celd_format if mst2.sustancia_pregunta3 < 3 else red_celd_format)
    hoja.write('I17', mst2.sustancia_pregunta4 if mst2.sustancia_pregunta4 >= 0 else 0, green_celd_format if mst2.sustancia_pregunta4 < 3 else red_celd_format)
    hoja.write('I18', mst2.sustancia_pregunta5 if mst2.sustancia_pregunta5 >= 0 else 0, green_celd_format if mst2.sustancia_pregunta5 < 3 else red_celd_format)
    hoja.write('I19', mst2.sustancia_pregunta6 if mst2.sustancia_pregunta6 >= 0 else 0, green_celd_format if mst2.sustancia_pregunta6 < 3 else red_celd_format)
    hoja.write('I20', mst2.sustancia_pregunta7 if mst2.sustancia_pregunta7 >= 0 else 0, green_celd_format if mst2.sustancia_pregunta7 < 3 else red_celd_format)
    hoja.write('I21', mst2.sustancia_pregunta8 if mst2.sustancia_pregunta8 >= 0 else 0, green_celd_format if mst2.sustancia_pregunta8 < 3 else red_celd_format)
    hoja.write('I22', mst2.sustancia_pregunta9 if mst2.sustancia_pregunta9 >= 0 else 0, green_celd_format if mst2.sustancia_pregunta9 < 3 else red_celd_format)
    hoja.write('I23', mst2.sustancia_pregunta10 if mst2.sustancia_pregunta10 >= 0 else 0, green_celd_format if mst2.sustancia_pregunta10 < 3 else red_celd_format)
    
    # examen SSI BECK
    hoja.write('C24', 'SSI BECK', white_celd_format)
    
    if beck.nivel == 'No Aplica':
        hoja.write('D24', 'NO APLICA', white_celd_format)
        hoja.write('E24', '', white_celd_format)
        hoja.write('F24', '', white_celd_format)
    else:
        hoja.write('D24', 'APLICA', white_celd_format)
        hoja.write('E24', beck.total if beck.total else 0, white_celd_format)
    
        if beck.nivel == 'Rango normal o asintomático':
            hoja.write('F24', beck.nivel, green_celd_format)
        elif beck.nivel == 'Leve':
            hoja.write('F24', beck.nivel, yellow_celd_format)
        elif beck.nivel == 'Moderado':
            hoja.write('F24', beck.nivel, orange_celd_format)
        elif beck.nivel == 'Severo':
            hoja.write('F24', beck.nivel, red_celd_format)
    
    hoja.write('G24', 'SSI. En los items 4 y 5 del SSI de BECK puntuo 0 (Cero), ello nos da un primer indicativo de la inexistencia de intencionalidad suicida', blue_celd_format4)
    # observaciones del examen SSI BECK
    hoja.merge_range('H24:I24', beck.observaciones, white_celd_format)
    # observaciones del examen mst nivel 2
    hoja.merge_range('G6:I12', mst2.observaciones, white_celd_format)
    # observaciones del examen dsm5
    cantidad_diagnosticos = atencion.diagnostico.count()
    hoja.merge_range(f'C{26+cantidad_diagnosticos}:E{26+cantidad_diagnosticos}', 'Observaciones', blue_celd_format4)
    hoja.merge_range(f'F{26+cantidad_diagnosticos}:I{26+cantidad_diagnosticos}', atencion.observaciones, white_celd_format)
    
    # examen dsm5
    hoja.merge_range('C25:E25', 'DIAGNOSTICO PROVISONAL DSM-5 (DIAGNOSTICO)', blue_celd_format4)
    hoja.merge_range(
        'F25:H25', 'TRASTORNO GENERAL (CATEGORIA DE TRASTORNO)', blue_celd_format4)
    hoja.write('I25', 'TRASTORNO ESPECIFICO (GRUPO DE TRASTORNO)', blue_celd_format4)
    
    for idx, diagnostico in enumerate(dsm5, start=26):
        diag_nombre = diagnostico.nombre
        diag_categoria = diagnostico.categoria.nombre
        diag_grupo = diagnostico.grupo.nombre if diagnostico.grupo != None else ''
        hoja.merge_range(f'C{idx}:E{idx}', diag_nombre, white_celd_format)
        hoja.merge_range(f'F{idx}:H{idx}', diag_categoria, white_celd_format)
        hoja.write(f'I{idx}', diag_grupo, white_celd_format)
    
    resultado['hoja'] = hoja
    
    return resultado


def exportarExamen3(atencion, libro, historia_clinica):
    # datos de los examenes
    resultado = {}
    
    # datos de la persona
    nombre_solicitante = atencion.solicitante.nombre + \
        ' ' + (atencion.solicitante.segundo_nombre if atencion.solicitante.segundo_nombre else '') + \
        ' ' + atencion.solicitante.apellido + ' ' + \
        (atencion.solicitante.segundo_apellido if atencion.solicitante.segundo_apellido else '')
    email = atencion.solicitante.email
    licenciatura = atencion.licenciatura.nombre if atencion.licenciatura else ''
    semestre = atencion.semestre.nombre if atencion.semestre else ''
    sexo = atencion.solicitante.sexo
    vive_con = atencion.vive_con.vive_con if atencion.vive_con else ''
    trabaja = atencion.trabaja
    hijos = atencion.hijos
    municipio = atencion.municipio.nombre if atencion.municipio else ''
    grado_academico_padres = atencion.grado_academico.nombre if atencion.grado_academico else ''
    telefono_familiar = atencion.solicitante.telefono_emergencia
    ingreso_familiar_ingreso = atencion.ingreso_familiar.ingreso if atencion.ingreso_familiar else ''
    ingreso_familiar_nivel = atencion.ingreso_familiar.nivel if atencion.ingreso_familiar else ''
    beca_apoyo_economico = atencion.beca_apoyo_economico
    fecha_nacimiento = datetime.strftime(atencion.solicitante.fecha_nacimiento, '%d/%m/%Y') if atencion.solicitante.fecha_nacimiento else ''
    fecha_atencion = datetime.strftime(atencion.fecha_atencion, '%d/%m/%Y') if atencion.fecha_atencion else ''
    telefono = atencion.solicitante.telefono
    
    # llenando la hoja de excel
    # crear la hoja
    hoja = libro.add_worksheet('Historia Clínica')
    # Definir los formatos para las celdas
    # formatos para las celdas de MST 2-Beck-DSM5
    blue_celd_format = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#00B0F0', 'bold': True, 'align': 'center', 'font_size': 14})
    blue_celd_format1 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#BDD7EE', 'bold': True, 'align': 'center', 'font_size': 14})
    blue_celd_format2 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#00B0F0', 'bold': True, 'align': 'center', 'font_size': 16})
    blue_celd_format4 = libro.add_format(
        {'border': 1, 'valign': 'vcenter', 'bg_color': '#BDD7EE', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    
    
    white_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    green_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#00B050', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    green_celd_format1 = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#00B050', 'bold': True, 'align': 'left', 'font_size': 12, 'text_wrap': True})
    yellow_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#FFC000', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    red_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#ff0404', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    orange_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#e98604', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    blue_celd_format3 = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#9BC2E6', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    blue_celd_format6 = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#9BC2E6', 'bold': True, 'align': 'center', 'font_size': 18, 'text_wrap': True})
    blue_celd_format7 = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#9BC2E6', 'bold': True, 'align': 'left', 'font_size': 14, 'text_wrap': True})
    blue_celd_format8 = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#9BC2E6', 'bold': True, 'align': 'left', 'font_size': 14, 'text_wrap': True})
    ligth_blue_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#DDEBF7', 'bold': True, 'align': 'center', 'font_size': 16, 'text_wrap': True})
    ligth_blue_celd_format1 = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#DDEBF7', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    ligth_green_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#80FB6F', 'bold': True, 'align': 'center', 'font_size': 16, 'text_wrap': True})
    green_celd_format1 = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#C6E0B4', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    gray_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#A5A5A5', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    ligth_pink_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#FDD7F1', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    pink_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#FFAFFF', 'bold': True, 'align': 'left', 'font_size': 14, 'text_wrap': True})
    ligth_yellow_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#FFF2CC', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    cian_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#D6FEF2', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    purple_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#CABED4', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    violet_celd_format = libro.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#CEB6F4', 'bold': True, 'align': 'center', 'font_size': 12, 'text_wrap': True})
    
    # Establecer el ancho de las columnas
    hoja.set_column('A:A', 2)
    hoja.set_column('B:B', 2)
    hoja.set_column('C:C', 72)
    hoja.set_column('D:D', 60)
    hoja.set_column('E:E', 39)
    hoja.set_column('F:F', 45)
    hoja.set_column('G:G', 43)
    hoja.set_column('H:H', 61)
    hoja.set_column('I:I', 51)
    hoja.set_column('J:J', 76)
    
    # Establecer la altura de las filas
    hoja.set_row(13, 39)
    # hoja.set_row(23, 40)
    # hoja.set_row(25, 35)
    # hoja.set_row(26, 35)
    # hoja.set_row(32, 90)
    
    hoja.merge_range('C2:J3', 'Laboratorio de Evaluación e Intervención Psicológica - Servicios Psicológicos', blue_celd_format6)
    hoja.merge_range('C4:J4', 'HISTORIA CLINICA', ligth_blue_celd_format)
    hoja.write('C5', 'SECCIÓN 1', ligth_green_celd_format)
    hoja.write('C6', 'Fecha de la Solicitud de Atención', green_celd_format1)
    hoja.write('C7', fecha_atencion, white_celd_format)
    hoja.write('D6', 'Nombre(s), Apellido(s)', green_celd_format1)
    hoja.write('D7', nombre_solicitante, white_celd_format)
    hoja.write('E6', 'Fecha de nacimiento', green_celd_format1)
    hoja.write('E7', fecha_nacimiento, white_celd_format)
    hoja.write('F6', 'Religión', green_celd_format1)
    hoja.write('F7', historia_clinica.religion.nombre if historia_clinica.religion else '', white_celd_format)
    hoja.write('G6', 'Ocupación (En el caso de NO ser estudiante)', green_celd_format1)
    hoja.write('G7', historia_clinica.ocupacion, white_celd_format)
    hoja.write('H6', '¿Tiene médico de cabecera?', green_celd_format1)
    hoja.write('H7', 'Sí' if historia_clinica.medico_cabecera == True else 'No', white_celd_format)
    hoja.write('I6', '¿Ha estado en terapia antes?', green_celd_format1)
    hoja.write('I7', 'Sí' if historia_clinica.terapia_antes == True else 'No', white_celd_format)
    hoja.write('J6', '¿Ha intentado hacerse daño o suicidarse?', green_celd_format1)
    
    if historia_clinica.hacerse_danio_suicidio == True:
        hoja.write('J7', 'Sí', red_celd_format)
    else:
        hoja.write('J7', 'No', white_celd_format)
    
    hoja.write('C8', 'Dirección de correo electrónico', green_celd_format1)
    hoja.write('C9', email, white_celd_format)
    hoja.write('D8', 'Edad', green_celd_format1)
    hoja.write('D9', calcularEdad(fecha_nacimiento), white_celd_format)
    hoja.write('E8', 'Lugar de nacimiento', green_celd_format1)
    hoja.write('E9', municipio, white_celd_format)
    hoja.write('F8', 'Pasatiempos', green_celd_format1)
    hoja.write('F9', historia_clinica.pasatiempos, white_celd_format)
    hoja.write('G8', 'SI es estudiante, Carrera que cursa', green_celd_format1)
    hoja.write('G9', historia_clinica.carrera.nombre if historia_clinica.carrera else '', white_celd_format)
    hoja.write('H8', 'Nombre y número teléfonico de su médico', green_celd_format1)
    hoja.write('H9', historia_clinica.nombre_medico_cabecera + ' ' + historia_clinica.tlf_medico_cabecera, white_celd_format)
    hoja.write('I8', 'Si anteriormente ha estado en terapia, ¿cuándo y dónde fue?', green_celd_format1)
    hoja.write('I9', historia_clinica.lugar_terapia_pasada, white_celd_format)
    hoja.write('J8', 'Si la respuesta anterior es afirmativa, ¿hace cuánto tiempo y de que forma?', green_celd_format1)
    hoja.write('J9', historia_clinica.tiempo_forma_hacerse_danio_suicidio, white_celd_format)
    hoja.write('C10', 'Teléfono móvil', green_celd_format1)
    hoja.write('C11', telefono, white_celd_format)
    hoja.write('D10', 'Sexo', green_celd_format1)
    hoja.write('D11', sexo, white_celd_format)
    hoja.write('E10', 'Estado Civil', green_celd_format1)
    hoja.write('E11', historia_clinica.estado_civil.nombre, white_celd_format)
    hoja.write('F10', '¿Su peso varía?', green_celd_format1)
    hoja.write('F11', 'Sí' if historia_clinica.peso_varia == True else 'No', white_celd_format)
    hoja.write('G10', 'Semestre', green_celd_format1)
    hoja.write('G11', semestre, white_celd_format)
    hoja.write('H10', '¿Quién lo envía?', green_celd_format1)
    hoja.write('H11', historia_clinica.quien_lo_envia, white_celd_format)
    hoja.write('I10', '¿Qué tipo de ayuda ha buscado para su problema?', green_celd_format1)
    hoja.write('I11', historia_clinica.ayuda_problema, white_celd_format)
    hoja.write('J10', '¿Algún miembro de su familia ha intentado suicidarse?', green_celd_format1)
    hoja.write('J11', 'Sí' if historia_clinica.familia_suicidio == True else 'No', white_celd_format)
    hoja.write('C12', 'Contacto de Emergencia (Nombre completo, Parentesco y Número de Teléfono)', green_celd_format1)
    hoja.write('C13', atencion.solicitante.nombre_emergencia + ' ' + atencion.solicitante.parentesco + ' ' + atencion.solicitante.telefono_emergencia, white_celd_format)
    hoja.write('D12', 'Vive en:', green_celd_format1)
    hoja.write('D13', historia_clinica.vive_en.vive_en, white_celd_format)
    hoja.write('E12', 'Peso', green_celd_format1)
    hoja.write('E13', historia_clinica.peso if historia_clinica.peso > 0 else 0, white_celd_format)
    hoja.write('F12', 'Estatura', green_celd_format1)
    hoja.write('F13', historia_clinica.estatura if historia_clinica.estatura > 0 else 0, white_celd_format)
    hoja.write('G12', 'Sí NO es estudiante. ¿Cuál es su máximo grado de estudios?', green_celd_format1)
    hoja.write('G13', historia_clinica.grado_est.nombre, white_celd_format)
    hoja.write('H12', '¿Qué trabajos (Labor) ha tenido en el pasado?', green_celd_format1)
    hoja.write('H13', historia_clinica.trab_pasados, white_celd_format)
    hoja.write('I12', '¿Ha estado hospitalizado/a por problemas psicológicos o psiquiátricos?', green_celd_format1)
    hoja.write('I13', 'Sí' if historia_clinica.hosp_prob_psico == True else 'No', white_celd_format)
    hoja.write('J12', '¿Algún miembro de su familia sufre de problemas emocionales o mentales?', green_celd_format1)
    hoja.write('J13', 'Sí' if historia_clinica.prob_emocion_mental == True else 'No', white_celd_format)
    hoja.write('C14', 'Dirección', green_celd_format1)
    hoja.write('C15', atencion.solicitante.direccion, white_celd_format)
    hoja.write('D14', '¿Con quién vive?', green_celd_format1)
    hoja.write('D15', vive_con, white_celd_format)
    hoja.merge_range('E14:G14', '¿Qué hace en su trabajo?', green_celd_format1)
    hoja.merge_range('E15:G15', historia_clinica.que_hace_trab, white_celd_format)
    hoja.write('H14', '¿Le gusta su trabajo?', green_celd_format1)
    hoja.write('H15', 'Sí' if historia_clinica.gustar_trabajo == True else 'No', white_celd_format)
    hoja.merge_range('I14:J14', 'Si anteriormente ha estado hospitalizado/a por problemas psicológicos o psiquiátricos, ¿cuándo y dónde fue?', green_celd_format1)
    hoja.merge_range('I15:J15', historia_clinica.lugar_hosp_prob_psico, white_celd_format)
    hoja.write('C16', 'SECCIÓN 2', ligth_green_celd_format)
    hoja.merge_range('D16:J16', '', white_celd_format)
    
    # Seccion2
    hoja.write('C17', 'Nombre completo de su padre', green_celd_format1)
    hoja.write('C18', historia_clinica.nombre_padre, white_celd_format)
    hoja.write('D17', 'Ocupación', green_celd_format1)
    hoja.write('D18', historia_clinica.ocupacion_padre, white_celd_format)
    hoja.write('E17', 'Edad', green_celd_format1)
    hoja.write('E18', historia_clinica.edad_padre, white_celd_format)
    hoja.write('F17', 'Estado de salud', green_celd_format1)
    hoja.write('F18', historia_clinica.estado_salud_padre, white_celd_format)
    hoja.write('G17', 'Si ya murió, edad que tenía su padre al morir.', green_celd_format1)
    hoja.write('G18', historia_clinica.edad_murio_padre, white_celd_format)
    hoja.write('H17', 'Causa de muerte', green_celd_format1)
    hoja.write('H18', historia_clinica.causa_muerte_padre, white_celd_format)
    hoja.write('I17', 'Edad de usted al morir su padre.', green_celd_format1)
    hoja.write('I18', historia_clinica.edad_hijo_morir_padre, white_celd_format)
    hoja.write('J17', 'Máximo grado de estudios de su padre.', green_celd_format1)
    hoja.write('J18', historia_clinica.grado_estudio_padre, white_celd_format)
    hoja.write('C19', 'Nombre completo de su madre', green_celd_format1)
    hoja.write('C20', historia_clinica.nombre_madre, white_celd_format)
    hoja.write('D19', 'Ocupación', green_celd_format1)
    hoja.write('D20', historia_clinica.ocupacion_madre, white_celd_format)
    hoja.write('E19', 'Edad', green_celd_format1)
    hoja.write('E20', historia_clinica.edad_madre, white_celd_format)
    hoja.write('F19', 'Estado de salud', green_celd_format1)
    hoja.write('F20', historia_clinica.estado_salud_madre, white_celd_format)
    hoja.write('G19', 'Si ya murió, ¿Qué edad tenía su madre al morir?', green_celd_format1)
    hoja.write('G20', historia_clinica.edad_murio_madre, white_celd_format)
    hoja.write('H19', 'Causa de muerte.', green_celd_format1)
    hoja.write('H20', historia_clinica.causa_muerte_madre, white_celd_format)
    hoja.write('I19', 'Edad de usted al morir su madre:', green_celd_format1)
    hoja.write('I20', historia_clinica.edad_hijo_morir_madre, white_celd_format)
    hoja.write('J19', 'Máximo grado de estudios de su madre', green_celd_format1)
    hoja.write('J20', historia_clinica.grado_estudio_madre, white_celd_format)
    hoja.write('C21', '¿Cuántos hermanas y hermanos tiene?', green_celd_format1)
    hoja.write('C22', historia_clinica.cant_hermanos, white_celd_format)
    hoja.write('D21', 'Si usted no creció con sus padres, ¿Con quién creció y durante cuántos años?', green_celd_format1)
    hoja.write('D22', historia_clinica.con_quien_crecio, white_celd_format)
    hoja.write('E21', '¿De qué forma era disciplinado o castigado por sus padres?', green_celd_format1)
    hoja.write('E22', historia_clinica.forma_castigado_padres, white_celd_format)
    hoja.write('F21', '¿Era o es usted capaz de confiar en sus padres?', green_celd_format1)
    hoja.write('F22', 'Sí' if historia_clinica.confia_padres == True else 'No', white_celd_format)
    hoja.write('G21', '¿Sentía o siente amor y respeto por sus padres?', green_celd_format1)
    hoja.write('G22', 'Sí' if historia_clinica.siente_amor_padres == True else 'No', white_celd_format)
    hoja.merge_range('H21:I21', 'Describa sus impresiones acerca de la atmósfera de su casa. Mencione si existía compatibilidad entre los padres y los hijos.', green_celd_format1)
    hoja.merge_range('H22:I22', historia_clinica.atmosfera_casa, white_celd_format)
    hoja.write('J21', 'Si tiene Padrastro o Madrastra, escriba la edad de usted al volverse a casar o juntar su Madre o Padre.', green_celd_format1)
    hoja.write('J22', historia_clinica.edad_casar_padres, white_celd_format)
    hoja.write('C23', '¿Cuáles son sus edades?', green_celd_format1)
    hoja.write('C24', historia_clinica.edades_hermanos, white_celd_format)
    hoja.write('D23', 'Algunos detalles significativos de sus padres y sus hermanos.', green_celd_format1)
    hoja.write('D24', historia_clinica.detalles_padres_hermanos, white_celd_format)
    hoja.merge_range('E23:F23', 'Por favor, describa la personalidad y actitudes de su Padre hacia usted (pasado y presente)', green_celd_format1)
    hoja.merge_range('E24:F24', historia_clinica.person_actitud_padre, white_celd_format)
    hoja.merge_range('G23:H23', 'Por favor, describa la personalidad y actitudes de su Madre hacia usted (pasado y presente)', green_celd_format1)
    hoja.merge_range('G24:H24', historia_clinica.person_actitud_madre, white_celd_format)
    hoja.write('I23', '¿Alguien como papá y/o mamá, parientes o amigos han interferido con su matrimonio, ocupación, etc.?', green_celd_format1)
    hoja.write('I24', 'Sí' if historia_clinica.familia_interferir_matrimonio == True else 'No', white_celd_format)
    hoja.write('J23', 'De las siguientes aseveraciones, marque la que corresponda a las características de su infancia y adolescencia.', green_celd_format1)
    hoja.write('J24', ', '.join(getCaracteristicasInfanciaAdolescenciaQuePosee(historia_clinica)), white_celd_format)
    # seccion 3
    hoja.write('C25', 'SECCIÓN 3', ligth_green_celd_format)
    hoja.merge_range('D25:J25', '', white_celd_format)
    hoja.merge_range('C26:F26', 'Describa con sus propias palabras la naturaleza del problema actual.', green_celd_format1)
    hoja.merge_range('C27:F30', historia_clinica.desc_natu_prob, white_celd_format)
    hoja.merge_range('G26:H26', 'De las opciones presentadas, marque la que describa mejor su problema.', green_celd_format1)
    hoja.merge_range('G27:H30', getDescripcionProblema(historia_clinica), white_celd_format)
    hoja.merge_range('I26:J26', '¿Cuándo empezaron sus problemas?', green_celd_format1)
    hoja.merge_range('I27:J30', historia_clinica.empezar_prob, white_celd_format)
    hoja.merge_range('C31:E31', '¿Con qué empeora su problema?', green_celd_format1)
    hoja.merge_range('C32:E35', historia_clinica.empeora_prob, white_celd_format)
    hoja.merge_range('F31:H31', '¿Con qué mejora el problema, o qué ha sido de ayuda para usted?', green_celd_format1)
    hoja.merge_range('F32:H35', historia_clinica.mejora_prob, white_celd_format)
    hoja.write('I31', 'Siendo 1 totalmente insatisfecho y 7 muy satisfecho, ¿qué tan satisfecho/a está con su vida considerada como un todo?', green_celd_format1)
    hoja.merge_range('I32:I35', historia_clinica.satisf_vida_todo, white_celd_format)
    hoja.write('J31', 'Siendo 1 totalmente relajado y 7 muy tenso, ¿cuál cree que ha sido su nivel de tensión durante el mes pasado?', green_celd_format1)
    hoja.merge_range('J32:J35', historia_clinica.nivel_tension_mes_pasado, white_celd_format)
    # seccion 4
    hoja.write('C36', 'SECCIÓM 4', ligth_green_celd_format)
    hoja.merge_range('D36:J36', '', white_celd_format)
    hoja.merge_range('C37:E37', 'En unas cuantas palabras, ¿Qué piensa o espera de la terapia psicológica.?', green_celd_format1)
    hoja.merge_range('C38:E40', historia_clinica.piensa_espera_terapia, white_celd_format)
    hoja.merge_range('F37:H37', '¿Cuánto cree que durará su terapia?', green_celd_format1)
    hoja.merge_range('F38:H40', historia_clinica.tiempo_terapia, white_celd_format)
    hoja.merge_range('I37:J37', '¿Qué características cree usted que el terapeuta debe poseer?', green_celd_format1)
    hoja.merge_range('I38:J40', historia_clinica.caract_posee_terapeuta, white_celd_format)
    # seccion 5
    hoja.write('C41', 'SECCIÓN 5', ligth_green_celd_format)
    hoja.merge_range('D41:J41', '', white_celd_format)
    hoja.merge_range('C42:J42', 'Conductas', blue_celd_format7)
    hoja.write('C43', 'De la siguiente lista, marque las que presente actualmente:', green_celd_format1)
    hoja.write('C44', ', '.join(getConductasQuePosee(historia_clinica)), white_celd_format)
    hoja.write('D43', '¿Cuáles son los talentos o habilidades de los que se puede sentir orgulloso/a?', green_celd_format1)
    hoja.write('D44', historia_clinica.talentos_habilidades, white_celd_format)
    hoja.write('E43', '¿Qué le gustaría empezar a hacer?', green_celd_format1)
    hoja.write('E44', historia_clinica.gustaria_empezar_hacer, white_celd_format)
    hoja.write('F43', '¿Qué le gustaría dejar de hacer?', green_celd_format1)
    hoja.write('F44', historia_clinica.gustaria_dejar_hacer, white_celd_format)
    hoja.write('G43', '¿Cómo pasa su tiempo libre?', green_celd_format1)
    hoja.write('G44', historia_clinica.tiempo_libre, white_celd_format)
    hoja.write('H43', '¿Cuáles actividades considera son sus pasatiempos o disfruta usted para relajarse?', green_celd_format1)
    hoja.write('H44', historia_clinica.actividades_relajarse, white_celd_format)
    hoja.write('I43', '¿Tiene problemas para relajarse y disfrutar de sus fines de semana o vacaciones?', green_celd_format1)
    hoja.write('I44', 'Sí' if historia_clinica.prob_relajarse == True else 'No', white_celd_format)
    hoja.write('J43', 'Si pudiera pedir dos deseos ¿Cuáles serían?', green_celd_format1)
    hoja.write('J44', historia_clinica.dos_deseos, white_celd_format)
    hoja.merge_range('C45:G45', 'SENTIMIENTOS', blue_celd_format7)
    hoja.write('C46', 'De la siguiente lista, marque los que presente actualmente:', green_celd_format1)
    hoja.write('C47', ', '.join(getSentimientosQuePosee(historia_clinica)), white_celd_format)
    hoja.write('D46', 'Anote sus cinco principales miedos', green_celd_format1)
    hoja.write('D47', historia_clinica.cinco_miedos, white_celd_format)
    hoja.write('E46', '¿Cuáles son algunos sentimientos positivos que haya experimentado recientemente?', green_celd_format1)
    hoja.write('E47', historia_clinica.sentimientos_positivos_recientes, white_celd_format)
    hoja.write('F46', '¿Cómo es más probable que usted pierda el control sobre sus sentimientos?', green_celd_format1)
    hoja.write('F47', historia_clinica.perder_control_sentimientos, white_celd_format)
    hoja.write('G46', 'Describa una situación en la que se sienta calmado/a y relajado/a', green_celd_format1)
    hoja.write('G47', historia_clinica.situacion_calmado_relajado, white_celd_format)
    hoja.merge_range('H45:J45', 'SENSASIONES FISICAS', blue_celd_format7)
    hoja.write('H46', 'De la siguiente lista, marque las sensaciones que presente actualmente:', green_celd_format1)
    hoja.write('H47', ', '.join(getSensacionesFisicasQuePosee(historia_clinica)), white_celd_format)
    hoja.write('I46', '¿Qué sensaciones SI son placenteras para usted?', green_celd_format1)
    hoja.write('I47', historia_clinica.sensaciones_placenteras, white_celd_format)
    hoja.write('J46', '¿Qué sensaciones NO son placenteras para usted?', green_celd_format1)
    hoja.write('J47', historia_clinica.sensaciones_no_placenteras, white_celd_format)
    hoja.merge_range('C48:J48', 'IMÁGENES', blue_celd_format7)
    hoja.write('C49', 'De la siguiente lista, marque las imágenes que presente actualmente. Yo me veo...', green_celd_format1)
    hoja.write('C50', ', '.join(getImagenesMeVeoQuePosee(historia_clinica)), white_celd_format)
    hoja.write('D49', 'Yo tengo...', green_celd_format1)
    hoja.write('D50', ', '.join(getImagenesYoTengoQuePosee(historia_clinica)), white_celd_format)
    hoja.merge_range('E49:F49', 'Describa una imagen o fantasía muy placentera.', green_celd_format1)
    hoja.merge_range('E50:F50', historia_clinica.img_fantasia_placentera, white_celd_format)
    hoja.merge_range('G49:H49', 'Describa una imagen o fantasía nada placentera.', green_celd_format1)
    hoja.merge_range('G50:H50', historia_clinica.img_fantasia_no_placentera, white_celd_format)
    hoja.write('I49', 'Describa la imagen persistente que le moleste e interfiera con su funcionamiento cotidiano.', green_celd_format1)
    hoja.write('I50', historia_clinica.img_molesta_func_cotidiano, white_celd_format)
    hoja.write('J49', '¿Qué tan seguido tiene pesadillas?', green_celd_format1)
    hoja.write('J50', historia_clinica.pesadillas_seguidas, white_celd_format)
    hoja.merge_range('C51:J51', 'PENSAMIENTOS', blue_celd_format7)
    hoja.write('C52', 'De la siguiente lista, marque las aseveraciones que presente actualmente.', green_celd_format1)
    hoja.write('C53', ', '.join(getPensamientosQuePosee(historia_clinica)), white_celd_format)
    hoja.write('D52', '¿Cuál cree que haya sido su idea más loca?', green_celd_format1)
    hoja.write('D53', historia_clinica.idea_mas_loca, white_celd_format)
    hoja.write('E52', '¿Se ha molestado por pensamientos que vuelven y vuelven?', green_celd_format1)
    hoja.write('E53', 'Sí' if historia_clinica.pensamientos_vuelven_vuelve == True else 'No', white_celd_format)
    hoja.merge_range('F52:H52', 'Si contestó sí, ¿cuáles son esos pensamientos?', green_celd_format1)
    hoja.merge_range('F53:H53', historia_clinica.cuales_pensamto_vuelven, white_celd_format)
    hoja.merge_range('I52:J52', '¿Qué le preocupa que pueda afectar negativamente su humor o conducta?', green_celd_format1)
    hoja.merge_range('I53:J53', historia_clinica.afectar_negativamente_humor, white_celd_format)
    hoja.merge_range('C55:J55', 'De las siguientes aseveraciones, marque lo que refleje más adecuadamente su opinión, siendo 1 en total desacuerdo y 5 completamente de acuerdo', green_celd_format1)
    hoja.write('C56', '[No debo cometer errores.]', green_celd_format1)
    hoja.write('C57', historia_clinica.no_cometer_errores if historia_clinica.no_cometer_errores > 0 else '', white_celd_format)
    hoja.write('D56', '[Debo ser bueno en todo lo que haga.]', green_celd_format1)
    hoja.write('D57', historia_clinica.bueno_todo if historia_clinica.bueno_todo > 0 else '', white_celd_format)
    hoja.write('E56', '[Cuando no sepa algo, debo aparentar que sí lo sé.]', green_celd_format1)
    hoja.write('E57', historia_clinica.aparentar_saber if historia_clinica.aparentar_saber > 0 else '', white_celd_format)
    hoja.write('F56', '[No debo revelar información personal.]', green_celd_format1)
    hoja.write('F57', historia_clinica.no_relevar_info_pers if historia_clinica.no_relevar_info_pers > 0 else '', white_celd_format)
    hoja.write('G56', '[Soy víctima de las circunstancias.]', green_celd_format1)
    hoja.write('G57', historia_clinica.victima_circunstancias if historia_clinica.victima_circunstancias > 0 else '', white_celd_format)
    hoja.write('H56', '[Mi vida se encuentra controlada por fuerzas externas.]', green_celd_format1)
    hoja.write('H57', historia_clinica.vida_controlada_fuerzas_exter if historia_clinica.vida_controlada_fuerzas_exter > 0 else '', white_celd_format)
    hoja.write('I56', '[Otras personas son más felices que yo.]', green_celd_format1)
    hoja.write('I57', historia_clinica.pers_mas_felices_yo if historia_clinica.pers_mas_felices_yo > 0 else '', white_celd_format)
    hoja.write('J56', '[Es muy importante complacer a otras personas.]', green_celd_format1)
    hoja.write('J57', historia_clinica.complacer_otras_personas if historia_clinica.complacer_otras_personas > 0 else '', white_celd_format)
    hoja.write('C58', '[Hay que llevársela tranquila, no tomar riesgos.]', green_celd_format1)
    hoja.write('C59', historia_clinica.no_tomar_riesgos if historia_clinica.no_tomar_riesgos > 0 else '', white_celd_format)
    hoja.write('D58', '[No merezco ser feliz.]', green_celd_format1)
    hoja.write('D59', historia_clinica.no_merezco_feliz if historia_clinica.no_merezco_feliz > 0 else '', white_celd_format)
    hoja.write('E58', '[Si ignoro mis problemas desaparecerán.]', green_celd_format1)
    hoja.write('E59', historia_clinica.ignoro_problemas if historia_clinica.ignoro_problemas > 0 else '', white_celd_format)
    hoja.write('F58', '[Es mi responsabilidad hacer felices a otros.]', green_celd_format1)
    hoja.write('F59', historia_clinica.hacer_felices_otros if historia_clinica.hacer_felices_otros > 0 else '', white_celd_format)
    hoja.write('G58', '[Debo trabajar muy duro para lograr la perfección.]', green_celd_format1)
    hoja.write('G59', historia_clinica.trabajar_duro_perfeccion if historia_clinica.trabajar_duro_perfeccion > 0 else '', white_celd_format)
    hoja.merge_range('H58:I58', '[Básicamente hay dos formas de hacer las cosas: la correcta y la equivocada.]', green_celd_format1)
    hoja.merge_range('H59:I59', historia_clinica.formas_hacer_cosas if historia_clinica.formas_hacer_cosas > 0 else '', white_celd_format)
    hoja.write('J58', '[Nunca debo estar molesto.]', green_celd_format1)
    hoja.write('J59', historia_clinica.formas_hacer_cosas if historia_clinica.formas_hacer_cosas > 0 else '', white_celd_format)
    hoja.merge_range('C60:J60', 'RELACIONES INTERPERSONALES', blue_celd_format7)
    hoja.write('C61', 'Amistades. [¿Hace usted amigos fácilmente?]', green_celd_format1)
    hoja.write('C62', 'Sí' if historia_clinica.hace_amigos_facil == True else 'No', white_celd_format)
    hoja.write('D61', 'Amistades. [¿Conserva a sus amigos?]', green_celd_format1)
    hoja.write('D62', 'Sí' if historia_clinica.conserva_amigos == True else 'No', white_celd_format)
    hoja.write('E61', 'Amistades. [¿Tenía citas frecuentes cuando era estudiante en la secundaria?]', green_celd_format1)
    hoja.write('E62', 'Sí' if historia_clinica.citas_estudiante_secundaria == True else 'No', white_celd_format)
    hoja.write('F61', 'Amistades. [¿Tenía citas frecuentes cuando era estudiante en la preparatoria?]', green_celd_format1)
    hoja.write('F62', 'Sí' if historia_clinica.citas_estudiante_preparatoria == True else 'No', white_celd_format)
    hoja.write('G61', 'Describa una relación que le da alegría.', green_celd_format1)
    hoja.write('G62', historia_clinica.relacion_alergias, white_celd_format)
    hoja.write('H61', 'Describa una relación que le da problemas.', green_celd_format1)
    hoja.write('H62', historia_clinica.relacion_problemas, white_celd_format)
    hoja.write('I61', 'Marque el grado en el que se sienta en situaciones sociales, siendo 1 muy relajado/a y 5 muy ansioso/a.', green_celd_format1)
    hoja.write('I62', historia_clinica.grado_situaciones_sociales, white_celd_format)
    hoja.write('J61', '¿Tiene uno o más amigos con los que se sienta tranquilo compartiendo sus pensamientos más íntimos?', green_celd_format1)
    hoja.write('J62', 'FALTA', white_celd_format)
    hoja.write('C63', 'Si está casado(a), ¿Cuánto tiempo conoció a su pareja antes de casarse?', green_celd_format1)
    hoja.write('C64', historia_clinica.tiempo_pareja_antes_casarse, white_celd_format)
    hoja.write('D63', 'Si está casado(a), ¿cuánto tiempo estuvo comprometido/a antes de casarse?', green_celd_format1)
    hoja.write('D64', historia_clinica.tiempo_comprometido_antes_casarse, white_celd_format)
    hoja.write('E63', '¿Cuánto tiempo ha estado con su pareja?', green_celd_format1)
    hoja.write('E64', historia_clinica.tiempo_mujer, white_celd_format)
    hoja.write('F63', '¿Cuál es la edad de su pareja?', green_celd_format1)
    hoja.write('F64', historia_clinica.edad_pareja, white_celd_format)
    hoja.write('G63', '¿Cuál es la ocupación de su pareja?', green_celd_format1)
    hoja.write('G64', historia_clinica.ocupacion_pareja, white_celd_format)
    hoja.write('H63', 'Describa la personalidad de su pareja:', green_celd_format1)
    hoja.write('H64', historia_clinica.personalidad_pareja, white_celd_format)
    hoja.write('I63', '¿Qué es lo que más le gusta de su pareja?', green_celd_format1)
    hoja.write('I64', historia_clinica.mas_gusta_pareja, white_celd_format)
    hoja.write('J63', '¿Qué es lo que menos le gusta de su pareja?', green_celd_format1)
    hoja.write('J64', historia_clinica.menos_gusta_pareja, white_celd_format)
    hoja.write('C65', '¿Qué factores dismuyen su satisfacción de pareja?', green_celd_format1)
    hoja.write('C66', historia_clinica.factores_disminuyen_satisf_pareja, white_celd_format)
    hoja.write('D65', 'Marque el grado de satisfacción de su pareja, siendo 1 nada satisfactorio y 7 muy satisfactorio.', green_celd_format1)
    hoja.write('D66', historia_clinica.grado_satisf_pareja, white_celd_format)
    hoja.write('E65', '¿Cómo se la lleva con los amigos y familia de su pareja? Siendo 1 muy mal y 7 muy bien.', green_celd_format1)
    hoja.write('E66', historia_clinica.amigos_familiares_pareja, white_celd_format)
    hoja.write('F65', '¿Cuántos hijo(as) tienen? Por favor, indique el(los) nombre(s) y edad(es).', green_celd_format1)
    hoja.write('F66', historia_clinica.datos_hijos_tiene, white_celd_format)
    hoja.write('G65', '¿Alguno de sus hijo(as) tiene problemas?.', green_celd_format1)
    hoja.write('G66', 'Sí' if historia_clinica.hijos_con_problema == True else 'No', white_celd_format)
    hoja.write('H65', 'Si respondió sí, por favor descríbalos', green_celd_format1)
    hoja.write('H66', historia_clinica.problemas_de_hijos, white_celd_format)
    hoja.merge_range('I65:J65', '¿Algún detalle significativo de su pareja anterior?', green_celd_format1)
    hoja.merge_range('I66:J66', historia_clinica.detalle_signif_pareja_anterior, white_celd_format)
    hoja.merge_range('C67:J67', 'RELACIONES SEXUALES', blue_celd_format7)
    hoja.write('C68', 'Describa la actitud de sus padres hacia el sexo.', green_celd_format1)
    hoja.write('C69', historia_clinica.actitud_padres_sexo, white_celd_format)
    hoja.write('D68', '¿Hablaban sobre el sexo en casa? Detalles:', green_celd_format1)
    hoja.write('D69', historia_clinica.detalle_sexo_casa, white_celd_format)
    hoja.write('E68', '¿Cómo y cuándo tuvo sus primeros conocimientos acerca del sexo?', green_celd_format1)
    hoja.write('E69', historia_clinica.primeros_conoc_sobre_sexo, white_celd_format)
    hoja.write('F68', '¿Cuándo se dio cuenta por primera vez de sus impulsos sexuales?', green_celd_format1)
    hoja.write('F69', historia_clinica.impulsos_sexuales, white_celd_format)
    hoja.write('G68', '¿Ha presentado alguna vez ansiedad o pena acerca del sexo o de la masturbación?', green_celd_format1)
    hoja.write('G69', 'Sí' if historia_clinica.pena_acerca_sexo == True else 'No', white_celd_format)
    hoja.write('H68', 'Si marcó sí, por favor explique:', green_celd_format1)
    hoja.write('H69', historia_clinica.detalle_pena_acerca_sexo, white_celd_format)
    hoja.merge_range('I68:J68', '¿Algun detalle relevante respecto de su primera experiencia sexual o de alguna experiencia posterior?', green_celd_format1)
    hoja.merge_range('I69:J69', historia_clinica.detalle_primera_exp_sexual, white_celd_format)
    hoja.write('C70', '¿Su vida sexual es satisfactoria?', green_celd_format1)
    hoja.write('C71', 'Sí' if historia_clinica.visa_sexual_satisf == True else 'No', white_celd_format)
    hoja.write('D70', 'Si marcó no, por favor explique sus motivos.', green_celd_format1)
    hoja.write('D71', historia_clinica.detalles_visa_sexual_satisf, white_celd_format)
    hoja.write('E70', '¿Ha tenido alguna reacción o relación homosexual?', green_celd_format1)
    hoja.write('E71', historia_clinica.reaccion_relacion_homosexual, white_celd_format)
    hoja.write('F70', 'Anote información relacionada con el área sexual que no haya sido preguntada anteriormente en este formulario y que considere relevante.', green_celd_format1)
    hoja.write('F71', historia_clinica.info_sexual_relevante, white_celd_format)
    hoja.write('G70', '¿Tiene problemas para relacionarse con personas de su trabajo?', green_celd_format1)
    hoja.write('G71', 'Sí' if historia_clinica.probl_relac_personas_trabj == True else 'No', white_celd_format)
    hoja.write('H70', 'Si marcó sí, por favor describa:', green_celd_format1)
    hoja.write('H71', historia_clinica.detalles_probl_relac_personas_trabj, white_celd_format)
    hoja.write('I70', 'Una forma en que la gente me lastima es:', green_celd_format1)
    hoja.write('I71', historia_clinica.forma_me_lastima, white_celd_format)
    hoja.write('J70', 'Yo podría alterar a alguien haciendo:', green_celd_format1)
    hoja.write('J71', historia_clinica.alterar_alguien_haciendo, white_celd_format)
    hoja.write('C72', 'Mi pareja me describe como:', green_celd_format1)
    hoja.write('C73', historia_clinica.pareja_describe_como, white_celd_format)
    hoja.write('D72', 'Mi mejor amigo/a piensa que soy:', green_celd_format1)
    hoja.write('D73', historia_clinica.mejor_amigo_piensa_soy, white_celd_format)
    hoja.write('E72', 'La gente que no me gusta es:', green_celd_format1)
    hoja.write('E73', historia_clinica.gente_no_gusta_es, white_celd_format)
    hoja.write('F72', '¿Actualmente tiene problemas por algún rechazo o fracaso amoroso?', green_celd_format1)
    hoja.write('F73', 'Sí' if historia_clinica.prob_por_rechazo_amoroso == True else 'No', white_celd_format)
    hoja.merge_range('G72:J72', 'Si marcó sí, por favor describa:', green_celd_format1)
    hoja.merge_range('G73:J73', historia_clinica.detalle_prob_por_rechazo_amoroso, white_celd_format)
    hoja.merge_range('C74:J74', 'FACTORES BIOLÓGICOS', blue_celd_format7)
    hoja.write('C75', '¿Tiene algún problema de salud física?', green_celd_format1)
    hoja.write('C76', 'Sí' if historia_clinica.prob_salud_fisica == True else 'No', white_celd_format)
    hoja.merge_range('D75:E75', 'Si marcó sí, por favor especifique:', green_celd_format1)
    hoja.merge_range('D76:E76', historia_clinica.detalle_prob_salud_fisica, white_celd_format)
    hoja.write('F75', 'Anote los medicamentos que toma actualmente:', green_celd_format1)
    hoja.write('F76', historia_clinica.medicamentos_actuales, white_celd_format)
    hoja.write('G75', '¿Lleva una dieta balanceada consumiendo alimentos tres veces al día a horarios adecuados?', green_celd_format1)
    hoja.write('G76', 'Sí' if historia_clinica.dieta_balanceada_trees_veces_dia == True else 'No', white_celd_format)
    hoja.write('H75', '¿Practica regularmente algún tipo de ejercicio físico?', green_celd_format1)
    hoja.write('H76', 'Sí' if historia_clinica.practica_ejerc_fisico == True else 'No', white_celd_format)
    hoja.merge_range('I75:J75', 'Si marcó sí, ¿de qué tipo o con qué frecuencia?', green_celd_format1)
    hoja.merge_range('I76:J76', historia_clinica.tipo_frecuencia_ejerc_fisico, white_celd_format)
    hoja.merge_range('C77:D77', 'Haga una lista de los problemas médicos que haya padecido.', green_celd_format1)
    hoja.merge_range('C78:D78', historia_clinica.prob_medicos_haya_padecido, white_celd_format)
    hoja.merge_range('E77:F77', 'Haga una lista de los problemas médicos que haya padecida su familia.', green_celd_format1)
    hoja.merge_range('E78:F78', historia_clinica.prob_medicos_familia, white_celd_format)
    hoja.write('G77', '¿Lo/a han operado?', green_celd_format1)
    hoja.write('G78', 'Sí' if historia_clinica.operado == True else 'No', white_celd_format)
    hoja.merge_range('H77:J77', 'Si marcó sí, indique el tipo de cirugía y la fecha.', green_celd_format1)
    hoja.merge_range('H78:J78', historia_clinica.tipo_fecha_cirugia, white_celd_format)
    hoja.merge_range('C79:J79', 'Historia menstrual (Solo para Mujeres)', pink_celd_format)
    hoja.write('C80', '[¿Sabía lo que era la menstruación cuando se le presentó por primera vez?]', ligth_blue_celd_format1)
    hoja.write('C81', 'Sí' if historia_clinica.conoce_menstruacion == True else 'No', white_celd_format)
    hoja.write('D80', '[¿Sus primeras menstruaciones significaron un problema?]', ligth_blue_celd_format1)
    hoja.write('D81', 'Sí' if historia_clinica.probl_menstruaciones == True else 'No', white_celd_format)
    hoja.write('E80', '[¿Sus periodos son regulares?]', ligth_blue_celd_format1)
    hoja.write('E81', 'Sí' if historia_clinica.periodos_regulares == True else 'No', white_celd_format)
    hoja.write('F80', '[¿Su menstruación se acompaña de dolor?]', ligth_blue_celd_format1)
    hoja.write('F81', 'Sí' if historia_clinica.menstuacion_dolor == True else 'No', white_celd_format)
    hoja.write('G80', '[¿Su menstruación afecta su estado de ánimo?]', ligth_blue_celd_format1)
    hoja.write('G81', 'Sí' if historia_clinica.menst_afecta_animo == True else 'No', white_celd_format)
    hoja.write('H80', 'Edad a la que presentó su primera menstruación.', ligth_blue_celd_format1)
    hoja.write('H81', historia_clinica.edad_primera_menstruacion, white_celd_format)
    hoja.write('I80', 'Duración de sus periodos.', ligth_blue_celd_format1)
    hoja.write('I81', historia_clinica.duracion_periodos, white_celd_format)
    hoja.write('J80', 'Fecha de su último periodo menstrual.', ligth_blue_celd_format1)
    hoja.write('J81', datetime.strftime(historia_clinica.fecha_ultima_menstruacion, '%d/%m/%Y') if historia_clinica.fecha_ultima_menstruacion else '', white_celd_format)
    hoja.merge_range('C82:J82', 'Del siguiente listado, marque lo que corresponda con su persona. Nunca, Rara vez, A veces, Con frecuencia, Siempre', blue_celd_format8)
    hoja.write('C83', '[Debilidad muscular]', green_celd_format1)
    hoja.write('C84', getOpcionesCorrespondaConSuPersona(historia_clinica.debilidad_muscular), white_celd_format)
    hoja.write('D83', '[Tranquilizantes]', green_celd_format1)
    hoja.write('D84', getOpcionesCorrespondaConSuPersona(historia_clinica.tranquilizantes), white_celd_format)
    hoja.write('E83', '[Diuréticos]', green_celd_format1)
    hoja.write('E84', getOpcionesCorrespondaConSuPersona(historia_clinica.diureticos), white_celd_format)
    hoja.write('F83', '[Pastillas para adelgazar]', green_celd_format1)
    hoja.write('F84', getOpcionesCorrespondaConSuPersona(historia_clinica.pastillas_adelgazar), white_celd_format)
    hoja.write('G83', '[Marihuana]', green_celd_format1)
    hoja.write('G84', getOpcionesCorrespondaConSuPersona(historia_clinica.marihuana), white_celd_format)
    hoja.write('H83', '[Hormonas]', green_celd_format1)
    hoja.write('H84', getOpcionesCorrespondaConSuPersona(historia_clinica.hormonas), white_celd_format)
    hoja.write('I83', '[Pastillas para dormir]', green_celd_format1)
    hoja.write('I84', getOpcionesCorrespondaConSuPersona(historia_clinica.pastillas_dormir), white_celd_format)
    hoja.write('J83', '[Aspirina]', green_celd_format1)
    hoja.write('J84', getOpcionesCorrespondaConSuPersona(historia_clinica.aspirinas), white_celd_format)
    hoja.write('C85', '[Cocaína]', green_celd_format1)
    hoja.write('C86', getOpcionesCorrespondaConSuPersona(historia_clinica.cocaina), white_celd_format)
    hoja.write('D85', '[Analgésicos]', green_celd_format1)
    hoja.write('D86', getOpcionesCorrespondaConSuPersona(historia_clinica.analgesicos), white_celd_format)
    hoja.write('E85', '[Narcóticos]', green_celd_format1)
    hoja.write('E86', getOpcionesCorrespondaConSuPersona(historia_clinica.narcoticos), white_celd_format)
    hoja.write('F85', '[Estimulantes]', green_celd_format1)
    hoja.write('F86', getOpcionesCorrespondaConSuPersona(historia_clinica.estimulantes), white_celd_format)
    hoja.write('G85', '[Alucinógenos]', green_celd_format1)
    hoja.write('G86', getOpcionesCorrespondaConSuPersona(historia_clinica.alucinogenos), white_celd_format)
    hoja.write('H85', '[Laxantes]', green_celd_format1)
    hoja.write('H86', getOpcionesCorrespondaConSuPersona(historia_clinica.laxantes), white_celd_format)
    hoja.write('I85', '[Cigarrillos]', green_celd_format1)
    hoja.write('I86', getOpcionesCorrespondaConSuPersona(historia_clinica.cigarrillos), white_celd_format)
    hoja.write('J85', '[Tabaco]', green_celd_format1)
    hoja.write('J86', getOpcionesCorrespondaConSuPersona(historia_clinica.tabaco), white_celd_format)
    hoja.write('C87', '[Café]', green_celd_format1)
    hoja.write('C88', getOpcionesCorrespondaConSuPersona(historia_clinica.cafe), white_celd_format)
    hoja.write('D87', '[Alcohol]', green_celd_format1)
    hoja.write('D88', getOpcionesCorrespondaConSuPersona(historia_clinica.alcohol), white_celd_format)
    hoja.write('E87', '[Anticonceptivos orales]', green_celd_format1)
    hoja.write('E88', getOpcionesCorrespondaConSuPersona(historia_clinica.anticonceptivos_orales), white_celd_format)
    hoja.write('F87', '[Vitaminas]', green_celd_format1)
    hoja.write('F88', getOpcionesCorrespondaConSuPersona(historia_clinica.vitaminas), white_celd_format)
    hoja.write('G87', '[Escasa alimentación]', green_celd_format1)
    hoja.write('G88', getOpcionesCorrespondaConSuPersona(historia_clinica.escasa_alimentacion), white_celd_format)
    hoja.write('H87', '[Alimentación abundante]', green_celd_format1)
    hoja.write('H88', getOpcionesCorrespondaConSuPersona(historia_clinica.alimentacion_abundante), white_celd_format)
    hoja.write('I87', '[Comida "chatarra"]', green_celd_format1)
    hoja.write('I88', getOpcionesCorrespondaConSuPersona(historia_clinica.comida_chatarra), white_celd_format)
    hoja.write('J87', '[Diarrea]', green_celd_format1)
    hoja.write('J88', getOpcionesCorrespondaConSuPersona(historia_clinica.diarrea), white_celd_format)
    hoja.write('C89', '[Estreñimiento]', green_celd_format1)
    hoja.write('C90', getOpcionesCorrespondaConSuPersona(historia_clinica.estrenimiento), white_celd_format)
    hoja.write('D89', '[Gases]', green_celd_format1)
    hoja.write('D90', getOpcionesCorrespondaConSuPersona(historia_clinica.gases), white_celd_format)
    hoja.write('E89', '[Indigestión]', green_celd_format1)
    hoja.write('E90', getOpcionesCorrespondaConSuPersona(historia_clinica.indigestion), white_celd_format)
    hoja.write('F89', '[Náuseas]', green_celd_format1)
    hoja.write('F90', getOpcionesCorrespondaConSuPersona(historia_clinica.nauseas), white_celd_format)
    hoja.write('G89', '[Vómito]', green_celd_format1)
    hoja.write('G90', getOpcionesCorrespondaConSuPersona(historia_clinica.vomitos), white_celd_format)
    hoja.write('H89', '[Agruras]', green_celd_format1)
    hoja.write('H90', getOpcionesCorrespondaConSuPersona(historia_clinica.agruras), white_celd_format)
    hoja.write('I89', '[Mareos]', green_celd_format1)
    hoja.write('I90', getOpcionesCorrespondaConSuPersona(historia_clinica.mareos), white_celd_format)
    hoja.write('J89', '[Palpitaciones]', green_celd_format1)
    hoja.write('J90', getOpcionesCorrespondaConSuPersona(historia_clinica.palpitaciones), white_celd_format)
    hoja.write('C91', '[Fatiga]', green_celd_format1)
    hoja.write('C92', getOpcionesCorrespondaConSuPersona(historia_clinica.fatiga), white_celd_format)
    hoja.write('D91', '[Alergias]', green_celd_format1)
    hoja.write('D92', getOpcionesCorrespondaConSuPersona(historia_clinica.alergias), white_celd_format)
    hoja.write('E91', '[Presión arterial alta]', green_celd_format1)
    hoja.write('E92', getOpcionesCorrespondaConSuPersona(historia_clinica.presion_arterial_alta), white_celd_format)
    hoja.write('F91', '[Dolor en el pecho]', green_celd_format1)
    hoja.write('F92', getOpcionesCorrespondaConSuPersona(historia_clinica.dolor_pecho), white_celd_format)
    hoja.write('G91', '[Respiración cortada]', green_celd_format1)
    hoja.write('G92', getOpcionesCorrespondaConSuPersona(historia_clinica.respiracion_cortada), white_celd_format)
    hoja.write('H91', '[Insomnio]', green_celd_format1)
    hoja.write('H92', getOpcionesCorrespondaConSuPersona(historia_clinica.insomnio), white_celd_format)
    hoja.write('I91', '[Dormir más tiempo]', green_celd_format1)
    hoja.write('I92', getOpcionesCorrespondaConSuPersona(historia_clinica.dormir_mas_tiempo), white_celd_format)
    hoja.write('J91', '[Dormir a ratos]', green_celd_format1)
    hoja.write('J92', getOpcionesCorrespondaConSuPersona(historia_clinica.dormir_ratos), white_celd_format)
    hoja.write('C93', '[Despertarse muy temprano]', green_celd_format1)
    hoja.write('C94', getOpcionesCorrespondaConSuPersona(historia_clinica.despertarse_temprano), white_celd_format)
    hoja.write('D93', '[Dolores de oídos]', green_celd_format1)
    hoja.write('D94', getOpcionesCorrespondaConSuPersona(historia_clinica.dolor_oido), white_celd_format)
    hoja.write('E93', '[Dolores de cabeza]', green_celd_format1)
    hoja.write('E94', getOpcionesCorrespondaConSuPersona(historia_clinica.dolor_cabeza), white_celd_format)
    hoja.write('F93', '[Dolores de espalda]', green_celd_format1)
    hoja.write('F94', getOpcionesCorrespondaConSuPersona(historia_clinica.dolor_espalda), white_celd_format)
    hoja.write('G93', '[Moretones o sangrados]', green_celd_format1)
    hoja.write('G94', getOpcionesCorrespondaConSuPersona(historia_clinica.moretones_sangrado), white_celd_format)
    hoja.write('H93', '[Problemas de peso]', green_celd_format1)
    hoja.write('H94', getOpcionesCorrespondaConSuPersona(historia_clinica.prob_peso), white_celd_format)
    hoja.merge_range('C95:C96', 'Observaciones', green_celd_format1)
    hoja.merge_range('D95:H96', historia_clinica.observaciones, white_celd_format)
    
    resultado['hoja'] = hoja
    
    return resultado


def calcularEdad(fecha_nacimiento_str):
    if fecha_nacimiento_str:
        fecha_nacimiento = datetime.strptime(fecha_nacimiento_str, '%d/%m/%Y').date()
        fecha_actual = datetime.now().date()
        edad = fecha_actual.year - fecha_nacimiento.year - ((fecha_actual.month, fecha_actual.day) < (fecha_nacimiento.month, fecha_nacimiento.day))
    else:
        edad = ''
    return edad


def getCaracteristicasInfanciaAdolescenciaQuePosee(hc):
    caracteristicas = getCaracteristicasInfanciaAdolescencia(hc)
    lista = []
    
    for clave, valor in caracteristicas.items():
        if valor and clave == 'infancia_feliz':
            lista.append('Infancia feliz')
        elif valor and clave == 'infancia_infeliz':
            lista.append('Infancia infeliz')
        elif valor and clave == 'prob_emoc_cond':
            lista.append('Problemas emocionales o de conducta')
        elif valor and clave == 'prob_leg':
            lista.append('Problemas legales')
        elif valor and clave == 'muerte_familia':
            lista.append('Muerte en familia')
        elif valor and clave == 'prob_med':
            lista.append('Problemas médicos')
        elif valor and clave == 'ignorado' :
            lista.append('Ignorado')
        elif valor and clave == 'pocos_amigos':
            lista.append('Muy pocos amigos ')
        elif valor and clave == 'prob_escuela':
            lista.append('Problemas en la escuela')
        elif valor and clave == 'convicciones_religiosas':
            lista.append('Convicciones religiosas fuertes')
        elif valor and clave == 'uso_drogas':
            lista.append('Uso de drogas')
        elif valor and clave == 'uso_alcohol':
            lista.append('Uso de alcohol')
        elif valor and clave == 'castigado_sev':
            lista.append('Castigado severamente')
        elif valor and clave == 'abusado_sex':
            lista.append('Abusado sexualmente')
        elif valor and clave == 'prob_financieros':
            lista.append('Problemas financieros')
        elif valor and clave == 'int_mol_sev':
            lista.append('Intimidado o molestado severamente')
        elif valor and clave == 'prob_alim':
            lista.append('Problemas de alimentación')
    
    return lista
 
 
def getDescripcionProblema(hc):
    options = ''
    
    if hc.desc_problema_sec3 == 1:
        options = 'Es poco molesto'
    elif hc.desc_problema_sec3 == 2:
        options = 'Es muy molesto'
    elif hc.desc_problema_sec3 == 3:
        options = 'Es severo'
    elif hc.desc_problema_sec3 == 4:
        options = 'Es muy severo'
    elif hc.desc_problema_sec3 == 5:
        options = 'Totalmente incapacitante'
 
    return  options
 
 
def getConductasQuePosee(hc):
    conductas = getModalidadConductas(hc)
    lista = []
    
    for clave, valor in conductas.items():
        if valor and clave == 'comer_de_mas':
            lista.append('Comer de más')
        elif valor and clave == 'consumir_drogas':
            lista.append('Consumir drogas')
        elif valor and clave == 'no_hacer_desea':
            lista.append('No hacer lo que desa o decir lo que piensa')
        elif valor and clave == 'conductas_incorrectas':
            lista.append('Conductas incorrectas')
        elif valor and clave == 'beber_demasiado':
            lista.append('Beber demasiado')
        elif valor and clave == 'trabajar_demasiado':
            lista.append('Trabajar demasiado')
        elif valor and clave == 'demorando_algo':
            lista.append('Estar demorando algo')
        elif valor and clave == 'relaciones_impulsivas':
            lista.append('Relaciones impulsivas')
        elif valor and clave == 'perdida_control':
            lista.append('Pérdida del control')
        elif valor and clave == 'intentos_suicidas':
            lista.append('Intentos suicidas')
        elif valor and clave == 'compulsiones':
            lista.append('Compulsiones')
        elif valor and clave == 'fumar':
            lista.append('Fumar')
        elif valor and clave == 'dejar_hacer_algo':
            lista.append('Haber dejado de hacer algo')
        elif valor and clave == 'tics_nerviosos':
            lista.append('Tics nerviosos')
        elif valor and clave == 'dificultad_concentrarse':
            lista.append('Dificultades para concentrarse')
        elif valor and clave == 'trastornos_suenio':
            lista.append('Trastornos del sueño')
        elif valor and clave == 'evitacion_fobica':
            lista.append('Evitación fóbica')
        elif valor and clave == 'gastar_mucho_dinero':
            lista.append('Gastar demasiado dinero')
        elif valor and clave == 'no_encontrar_trabajo':
            lista.append('No poder encontrar trabajo')
        elif valor and clave == 'insomnio':
            lista.append('Insomnio')
        elif valor and clave == 'tomar_riesgos':
            lista.append('Tomar muchos riesgos')
        elif valor and clave == 'perezoso':
            lista.append('Perezoso')
        elif valor and clave == 'prob_alimentacion':
            lista.append('Problemas de alimentación')
        elif valor and clave == 'conducta_agresiva':
            lista.append('Conducta agresiva')
        elif valor and clave == 'llanto':
            lista.append('Llanto continuo')
        elif valor and clave == 'enojado_ocaciones':
            lista.append('Muy enojado en ocaciones')
    
    return lista


def getSentimientosQuePosee(hc):
    sentimientos = getModalidadSentimientos(hc)
    lista = []
    
    for clave, valor in sentimientos.items():
        if valor and clave == 'enojado':
            lista.append('Enojado')
        elif valor and clave == 'fastidiado':
            lista.append('Fastidiado')
        elif valor and clave == 'triste':
            lista.append('Triste')
        elif valor and clave == 'deprimido':
            lista.append('Deprimido')
        elif valor and clave == 'envidioso':
            lista.append('Envidioso')
        elif valor and clave == 'culpable':
            lista.append('culpable')
        elif valor and clave == 'feliz':
            lista.append('feliz')
        elif valor and clave == 'ansioso':
            lista.append('Ansioso')
        elif valor and clave == 'con_miedo':
            lista.append('Con miedo')
        elif valor and clave == 'con_panico':
            lista.append('Con pánico')
        elif valor and clave == 'energetico':
            lista.append('Energético')
        elif valor and clave == 'en_conflicto':
            lista.append('En conflicto')
        elif valor and clave == 'avergonzado':
            lista.append('Avergonzado')
        elif valor and clave == 'apenado':
            lista.append('Apenado')
        elif valor and clave == 'esperanzado':
            lista.append('Esperanzado')
        elif valor and clave == 'desamparado':
            lista.append('Desamparado')
        elif valor and clave == 'relajado':
            lista.append('Relajado')
        elif valor and clave == 'celoso':
            lista.append('Celoso')
        elif valor and clave == 'infeliz':
            lista.append('Infeliz')
        elif valor and clave == 'aburrido':
            lista.append('Aburrido')
        elif valor and clave == 'sin_descanso':
            lista.append('Sin descanso')
        elif valor and clave == 'solitario':
            lista.append('Solitario')
        elif valor and clave == 'satisfecho':
            lista.append('Satisfecho')
        elif valor and clave == 'excitado':
            lista.append('Excitado')
        elif valor and clave == 'optimista':
            lista.append('Optimista')
        elif valor and clave == 'tenso':
            lista.append('Tenso')
        elif valor and clave == 'sin_esperanza':
            lista.append('Sin esperanza')
        
    return lista


def getSensacionesFisicasQuePosee(hc):
    sensaciones = getModalidadSensacionesFisicas(hc)
    lista = []
    
    for clave, valor in sensaciones.items():
        if valor and clave == 'dolor_abdominal':
            lista.append('Dolor abdominal')
        elif valor and clave == '':
            lista.append('Dolor o ardor al orinar')
        elif valor and clave == 'dolor_menstruacion':
            lista.append('Dolor durante la menstruación ')
        elif valor and clave == 'dolor_cabeza':
            lista.append('Dolor de cabeza ')
        elif valor and clave == 'mareos':
            lista.append('Mareos')
        elif valor and clave == 'palpitaciones':
            lista.append('Palpitaciones')
        elif valor and clave == 'espasmos_musculares':
            lista.append('Espasmos musculares')
        elif valor and clave == 'tensiones':
            lista.append('Tensiones')
        elif valor and clave == 'trastornos_sexuales':
            lista.append('Trastornos sexuales')
        elif valor and clave == 'incapacidad_relajarse':
            lista.append('Incapacidad para relajarse')
        elif valor and clave == 'alteraciones_intestinales':
            lista.append('Alteraciones intestinales')
        elif valor and clave == 'hormigueos':
            lista.append('Hormigueos')
        elif valor and clave == 'problemas_piel':
            lista.append('Problemas de la piel')
        elif valor and clave == 'boca_seca':
            lista.append('Boca seca')
        elif valor and clave == 'sensacion_quemaduras':
            lista.append('Sensación de quemadura o comezón de la piel ')
        elif valor and clave == 'latidos_cardiacos_rapidos':
            lista.append('Latidos cardiacos rápidos')
        elif valor and clave == 'no_ser_tocado':
            lista.append('No le gusta ser tocado(a)')
        elif valor and clave == 'entumecimiento':
            lista.append('Entumecimiento')
        elif valor and clave == 'problemas_estomacales':
            lista.append('Problemas estocamales')
        elif valor and clave == 'tics':
            lista.append('Tics')
        elif valor and clave == 'fatiga':
            lista.append('Fatiga')
        elif valor and clave == 'dolor_espalda':
            lista.append('Dolor de espalda')
        elif valor and clave == 'temblores':
            lista.append('Temblores')
        elif valor and clave == 'desmayos':
            lista.append('Desmayos')
        elif valor and clave == 'escuchar_ruidos':
            lista.append('Escuchar ruidos')
        elif valor and clave == 'ojos_llorosos':
            lista.append('Ojos llorosos')
        elif valor and clave == 'catarro':
            lista.append('Catarro')
        elif valor and clave == 'nauseas':
            lista.append('Náuseas')
        elif valor and clave == 'vertigo':
            lista.append('Vértigo')
        elif valor and clave == 'sudoracion_excesiva':
            lista.append('sudoracion_excesiva')
        elif valor and clave == 'alteraciones_visuales':
            lista.append('Alteraciones visuales')
        elif valor and clave == 'problemas_audicion':
            lista.append('Problemas de audición')
        elif valor and clave == 'variacion_peso':
            lista.append('Variación de peso')

    return lista


def getImagenesMeVeoQuePosee(hc):
    imagenes = getModalidadImagenesMeVeo(hc)
    lista = []
    
    for clave, valor in imagenes.items():
        if valor and clave == 'siendo_feliz':
            lista.append('Siendo feliz')
        elif valor and clave == 'herido_sentimientos':
            lista.append('Siendo herido en mis sentimientos')
        elif valor and clave == 'incapaz_afrontar_prob':
            lista.append('Incapaz de afrontar problemas')
        elif valor and clave == 'exitoso':
            lista.append('Exitoso')
        elif valor and clave == 'perdiendo_control':
            lista.append('Perdiendo el control')
        elif valor and clave == 'siendo_seguido':
            lista.append('Siendo seguido')
        elif valor and clave == 'hablan_mi':
            lista.append('Que hablan de mí')
        elif valor and clave == 'desamparado':
            lista.append('Desamparado')
        elif valor and clave == 'lastimando_otros':
            lista.append('Lastimando a otros')
        elif valor and clave == 'cargo_cosas':
            lista.append('Estando a cargo de las cosas')
        elif valor and clave == 'fallando':
            lista.append('Fallando')
        elif valor and clave == 'atrapado':
            lista.append('Atrapado')
        elif valor and clave == 'siendo_promiscuo':
            lista.append('Siendo promiscuo')
        elif valor and clave == 'siendo_agreivo':
            lista.append('Siendo agresivo')
        
    return lista


def getImagenesYoTengoQuePosee(hc):
    imagenes = getModalidadImagenesTengo(hc)
    lista = []
    
    for clave, valor in imagenes.items():
        if valor and clave == 'img_sexuales_placenteras':
            lista.append('Imágenes sexuales placenteras')
        elif valor and clave == 'img_sexuales_no_placenteras':
            lista.append('Imágenes sexuales no placenteras')
        elif valor and clave == 'img_desagradables_infancia':
            lista.append('Imágenes desagradables de mi infancia')
        elif valor and clave == 'img_corporal_negativa':
            lista.append('Imágen corporal negativa')
        elif valor and clave == 'imagino_amado':
            lista.append('Me imagino siendo amado')
        elif valor and clave == 'img_soledad':
            lista.append('Imágenes de soledad')
        elif valor and clave == 'img_seduccion':
            lista.append('Imágenes de seducción')
        
    return lista


def getPensamientosQuePosee(hc):
    pensamientos = getModalidadPensamientos(hc)
    lista = []
    
    for clave, valor in pensamientos.items():
        if valor and clave == 'inteligente':
            lista.append('Inteligente')
        elif valor and clave == 'confidente':
            lista.append('Confidente')
        elif valor and clave == 'valgo_pena':
            lista.append('Que valgo la pena')
        elif valor and clave == 'ambocioso':
            lista.append('Ambicioso')
        elif valor and clave == 'sensitivo':
            lista.append('Sensitivo')
        elif valor and clave == 'leal':
            lista.append('Leal')
        elif valor and clave == 'confiable_fidedigno':
            lista.append('Confiable, fidedigno')
        elif valor and clave == 'lleno_penas':
            lista.append('Lleno de penas')
        elif valor and clave == 'indigno':
            lista.append('Indigno')
        elif valor and clave == 'don_nadie':
            lista.append('Un don nadie')
        elif valor and clave == 'inutil':
            lista.append('Inútil')
        elif valor and clave == 'malo':
            lista.append('Malo')
        elif valor and clave == 'loco':
            lista.append('Loco')
        elif valor and clave == 'estupido':
            lista.append('Estúpido')
        elif valor and clave == 'ingenuo':
            lista.append('Ingenuo')
        elif valor and clave == 'honesto':
            lista.append('Honesto')
        elif valor and clave == 'incompetente':
            lista.append('Incompetente')
        elif valor and clave == 'pensamientos_horribles':
            lista.append('Con pensamientos horribles ')
        elif valor and clave == 'con_desviaciones':
            lista.append('Con desviaciones')
        elif valor and clave == 'sin_atractivos':
            lista.append('Sin atractivos ')
        elif valor and clave == 'sin_carinio':
            lista.append('Sin cariño ')
        elif valor and clave == 'inadecuado':
            lista.append('Inadecuado')
        elif valor and clave == 'confuso':
            lista.append('Confuso')
        elif valor and clave == 'flojo':
            lista.append('Flojo')
        elif valor and clave == 'no_digno_confianza':
            lista.append('No digno de confianza')
        elif valor and clave == 'deshonesto':
            lista.append('Deshonesto')
        elif valor and clave == 'con_ideas_suicidas':
            lista.append('Con ideas suicidas')
        elif valor and clave == 'perseverante':
            lista.append('Perseverante')
        elif valor and clave == 'buen_sentido_humor':
            lista.append('Con buen sentido del humor ')
        elif valor and clave == 'trabajo_duro':
            lista.append('Que trabajo duro')
        elif valor and clave == 'indeseable':
            lista.append('Indeseable')
        elif valor and clave == 'en_conflicto':
            lista.append('En conflicto')
        elif valor and clave == 'dificultades_concentrarse':
            lista.append('Con dificultades para concentrarme')
        elif valor and clave == 'prob_memoria':
            lista.append('Con problemas de memoria ')
        elif valor and clave == 'atractivo':
            lista.append('Atractivo')
        elif valor and clave == 'no_puedo_tomar_decisiones':
            lista.append('Que no puedo tomar decisiones ')
        elif valor and clave == 'feo':
            lista.append('Feo')
        elif valor and clave == 'considerado':
            lista.append('Considerado')
        elif valor and clave == 'degenerado':
            lista.append('Degenerado')
        
    return lista


def getOpcionesCorrespondaConSuPersona(value):
    opcion = ''
    
    if value == 1:
        opcion = 'Nunca'
    elif value == 2:
        opcion = 'Rara vez'
    elif value == 3:
        opcion = 'A veces'
    elif value == 4:
        opcion = 'Con frecuencia'
    elif value == 5:
        opcion = 'Siempre'    
    
    return opcion


def createCeld(hoja, columna, valor, red_celd_format, orange_celd_format, yellow_celd_format, green_celd_format):
    if valor >= 0 and valor <= 3:
        # muy bajo - red
        hoja.write(columna, valor, red_celd_format)
    elif valor >= 4 and valor <= 7:
        # bajo - orange
        hoja.write(columna, valor, orange_celd_format)
    elif valor >= 8 and valor <= 11:
        # Moderado - yellow
        hoja.write(columna, valor, yellow_celd_format)
    elif valor >= 12 and valor <= 15:
        # alto - green
        hoja.write(columna, valor, green_celd_format)


def getDatosGraficoSolicitudesAtencion(request):
    id_user = request.GET.get('id_usuario', '')
    usuario = Usuario.objects.get(id=id_user)
    data = {}
    total_atenciones = atencion_psicologica.objects.all()
    total_profesores = 0
    total_trabajadores = 0
    total_estudiantes = 0
    total_otros = 0
    total_atenciones_usuario = atencion_psicologica.objects.filter(solicitante__usuario=usuario)
    
    if len(total_atenciones) > 0:
        for t in total_atenciones:
            if t.solicitante.tipo_persona_udg:
                if t.solicitante.tipo_persona_udg.nombre == 'Trabajador':
                    total_trabajadores+=1
                elif t.solicitante.tipo_persona_udg.nombre == 'Estudiante':
                    total_estudiantes+=1
                elif t.solicitante.tipo_persona_udg.nombre == 'Profesor':
                    total_profesores+=1
            
            if t.solicitante.tipo_persona == 'pg':
                total_otros+=1
    
    data['total'] = len(total_atenciones) if len(total_atenciones) > 0 else 0
    data['profesores'] = total_profesores
    data['estudiantes'] = total_estudiantes
    data['trabajadores'] = total_trabajadores
    data['otros'] = total_otros
    data['total_atenciones_usuario'] = len(total_atenciones_usuario)
    
    return JsonResponse({'data': data})