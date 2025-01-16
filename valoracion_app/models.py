from django.db import models
from persona_app.models import persona
from tipo_atencion_app.models import tipo_atencion
from institucion_app.models import institucion
from atencion_psicologica_app.models import atencion_psicologica
from taller_app.models import taller

# Create your models here.


class valoracion(models.Model):
    fecha_valoracion = models.DateTimeField(
        'Fecha valoracion', blank=True, null=True)
    valorado_por = models.ForeignKey(
        persona, on_delete=models.CASCADE, blank=True, null=False)
    tipo_atencion = models.ForeignKey(
        tipo_atencion, on_delete=models.CASCADE, blank=True, null=False)
    tipo_institucion = models.CharField(
        'Tipo institucion', max_length=255, blank=True, null=True)
    institucion = models.ForeignKey(
        institucion, on_delete=models.CASCADE, blank=True, null=True)
    atencion = models.ForeignKey(
        atencion_psicologica, on_delete=models.CASCADE, blank=True, null=False)
    taller = models.ManyToManyField(
        taller, through='valoracion_taller')

    class Meta:
        verbose_name = 'valoracion'
        verbose_name_plural = 'Valoracion'
        ordering = ['fecha_valoracion']


class valoracion_taller(models.Model):
    valoracion = models.ForeignKey(
        valoracion, on_delete=models.CASCADE, blank=True, null=True)
    taller = models.ForeignKey(
        taller, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        verbose_name = 'valoracion_taller'
        verbose_name_plural = 'valoracion_taller'
        ordering = ['valoracion']
