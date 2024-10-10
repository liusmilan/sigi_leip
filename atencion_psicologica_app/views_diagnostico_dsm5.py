import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import atencion_diagnostico_dsm5, atencion_psicologica, diagnostico


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class agregarEditarDiagnosticoDSM5(CreateView):
    model = atencion_diagnostico_dsm5

    def get(self, request, *args, **kwargs):
        accion = request.GET.get('accion', '')
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        datosDiagnosticoDSM5 = request.GET.getlist('diagnosticos[]', '')

        if accion == 'editar':
            # eliminar los diagnosticos de la atencion en la tabla atencion_diagnostico_dsm5
            eliminarDiagnosticos(atencion_obj)

        listaDiagnosticos = json.loads(datosDiagnosticoDSM5[0])
        for d in listaDiagnosticos:
            diagnostico_obj = diagnostico.objects.get(id=int(d))
            atencion_diagnostico_dsm5.objects.create(
                diagnostico=diagnostico_obj, atencion=atencion_obj)
        mensaje = 'Se ha guardado correctamente el Diagnóstico DSM5.'
        tipo_mensaje = 'success'
        result = JsonResponse(
            {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
        return result


class getAllDiagnosticosDSM5(TemplateView):
    model = atencion_diagnostico_dsm5

    def get(self, request, *args, **kwargs):
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        data_atencion = {'id': atencion_obj.id}
        diag = atencion_diagnostico_dsm5.objects.filter(atencion=atencion_obj)

        if len(diag) > 0:
            lista_diagnosticos = []
            for d in diag:
                data = {}
                data_categoria = {'id': d.diagnostico.categoria.id,
                                  'nombre': d.diagnostico.categoria.nombre}
                if d.diagnostico.grupo != None:
                    data_grupo = {'id': d.diagnostico.grupo.id,
                                  'nombre': d.diagnostico.grupo.nombre}
                else:
                    data_grupo = None

                data_diagnostico = {'id': d.diagnostico.id,
                                    'nombre': d.diagnostico.nombre,
                                    'estado': d.diagnostico.estado,
                                    'categoria': data_categoria,
                                    'grupo': data_grupo}
                data['diagnostico'] = data_diagnostico
                lista_diagnosticos.append(data)
            mensaje = 'success'
            return JsonResponse({'diagnosticos': lista_diagnosticos, 'atencion': data_atencion, 'mensaje': mensaje})
        else:
            mensaje = 'error'
            return JsonResponse({'mensaje': mensaje})


def eliminarDiagnosticos(atencion):
    for d in atencion_diagnostico_dsm5.objects.filter(atencion=atencion):
        d.delete()
