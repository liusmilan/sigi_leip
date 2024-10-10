import json
from typing import Any
from django import http
from django.db import models
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import CreateView, ListView, DeleteView, TemplateView
from .models import institucion


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class listadoInstituciones(ListView):
    model = institucion

    # retorna la consulta
    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        if is_ajax(request):
            lista_instituciones = []
            for i in self.get_queryset():
                data = {}
                data['id'] = i.id
                data['nombre'] = i.nombre
                data['tipo_institucion'] = i.tipo_institucion
                data['estado_institucion'] = i.estado_institucion
                data['descripcion'] = i.descripcion
                data['domicilio'] = i.domicilio
                data['contacto'] = i.contacto
                data['correo'] = i.correo
                data['sitio_web'] = i.sitio_web
                lista_instituciones.append(data)
            return HttpResponse(json.dumps(lista_instituciones), 'application/json')
        else:
            return redirect('institucion:inicio_institucion')


class agregarEditarInstitucion(CreateView):
    model = institucion

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')
        nombre = request.GET.get('nombre', '')
        tipo_institucion = request.GET.get('tipo_institucion', '')
        descripcion = request.GET.get('descripcion', '')
        domicilio = request.GET.get('domicilio', '')
        contacto = request.GET.get('contacto', '')
        correo = request.GET.get('correo', '')
        sitio_web = request.GET.get('sitio_web', '')

        if request.GET.get('estado_institucion', '') == 'true':
            estado_institucion = True
        else:
            estado_institucion = False

        if id != '':
            # se esta editando
            try:
                i = institucion.objects.get(id=id)
                i.nombre = nombre
                i.tipo_institucion = tipo_institucion
                i.estado_institucion = estado_institucion
                i.descripcion = descripcion
                i.domicilio = domicilio
                i.contacto = contacto
                i.correo = correo
                i.sitio_web = sitio_web
                i.save()
                mensaje = 'Se ha editado correctamente la Institución.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'nombre': i.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            except institucion.DoesNotExist:
                mensaje = 'Esta Institución no se encuentra registrada en la Base de Datos.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
        else:
            # se esta agregando
            try:
                institucion.objects.get(
                    nombre=nombre, tipo_institucion=tipo_institucion)
                mensaje = 'Esta Institución ya existe. Por favor agregue otro.'
                tipo_mensaje = 'error'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
                return result
            except institucion.DoesNotExist:
                obj = institucion.objects.create(
                    nombre=nombre, tipo_institucion=tipo_institucion, descripcion=descripcion, domicilio=domicilio, contacto=contacto, correo=correo, sitio_web=sitio_web, estado_institucion=estado_institucion)
                mensaje = 'Se ha agregado correctamente la Institución.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'nombre': obj.nombre, 'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result


class getInstitucion(TemplateView):
    model = institucion

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            i = institucion.objects.get(id=id)
            nombre = i.nombre
            tipo_institucion = i.tipo_institucion
            estado_institucion = i.estado_institucion
            descripcion = i.descripcion
            domicilio = i.domicilio
            contacto = i.contacto
            correo = i.correo
            sitio_web = i.sitio_web
            result = JsonResponse(
                {'nombre': nombre, 'tipo_institucion': tipo_institucion, 'estado_institucion': estado_institucion, 'descripcion': descripcion, 'domicilio': domicilio, 'contacto': contacto, 'correo': correo, 'sitio_web': sitio_web})
            return result
        except institucion.DoesNotExist:
            mensaje = 'Esta Institución no se encuentra registrada en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class eliminarInstitucion(DeleteView):
    model = institucion

    def get(self, request, *args, **kwargs):
        id = request.GET.get('id', '')

        try:
            institucion.objects.get(id=id).delete()
            mensaje = 'Se ha eliminado la Institución seleccionada correctamente.'
            tipo_mensaje = 'success'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result
        except institucion.DoesNotExist:
            mensaje = 'Esta Institución no se encuentra registrada en la Base de Datos.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


def getAllInstituciones(request):
    instituciones = institucion.objects.all()

    if len(instituciones) > 0:
        lista_inst = []
        for i in instituciones:
            data = {}
            data['id'] = i.id
            data['nombre'] = i.nombre
            data['tipo_institucion'] = i.tipo_institucion
            data['estado'] = i.estado_institucion
            data['descripcion'] = i.descripcion
            data['domicilio'] = i.domicilio
            data['contacto'] = i.contacto
            data['correo'] = i.correo
            data['sitio_web'] = i.sitio_web
            lista_inst.append(data)
        mensaje = 'success'
        return JsonResponse({'instituciones': lista_inst, 'mensaje': mensaje})
    else:
        mensaje = 'error'
        return JsonResponse({'mensaje': mensaje})
