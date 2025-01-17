from django.db import models
from estado_app.models import estado
from municipio_app.models import municipio
from persona_app.models import persona
from licenciatura_app.models import licenciatura
from semestre_app.models import semestre
from ingreso_familiar_app.models import ingreso_familiar
from vive_con_app.models import vive_con
from grado_academico_app.models import grado_academico
from diagnostico_app.models import diagnostico


# Create your models here.
class atencion_psicologica(models.Model):
    fecha_atencion = models.DateTimeField(
        'Fecha atencion', blank=True, null=True)
    hijos = models.BooleanField(default=True)
    trabaja = models.BooleanField(default=True)
    beca_apoyo_economico = models.BooleanField(default=True)
    direccion = models.TextField(
        'Dirección', blank=True, null=True)
    vive_con_otro = models.CharField(max_length=255, blank=True, null=True)
    grado_academico_otro = models.CharField(
        max_length=255, blank=True, null=True)
    estado = models.ForeignKey(
        estado, on_delete=models.CASCADE, blank=True, null=False)
    municipio = models.ForeignKey(
        municipio, on_delete=models.CASCADE, blank=True, null=False)
    solicitante = models.ForeignKey(
        persona, on_delete=models.CASCADE, blank=True, null=False)
    licenciatura = models.ForeignKey(
        licenciatura, on_delete=models.CASCADE, blank=True, null=False)
    semestre = models.ForeignKey(
        semestre, on_delete=models.CASCADE, blank=True, null=False)
    vive_con = models.ForeignKey(
        vive_con, on_delete=models.CASCADE, blank=True, null=True)
    ingreso_familiar = models.ForeignKey(
        ingreso_familiar, on_delete=models.CASCADE, blank=True, null=False)
    grado_academico = models.ForeignKey(
        grado_academico, on_delete=models.CASCADE, blank=True, null=True)
    diagnostico = models.ManyToManyField(
        diagnostico, through='atencion_diagnostico_dsm5')
    observaciones = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'atencion_psicologica'
        verbose_name_plural = 'Atención Psicologica'
        ordering = ['fecha_atencion']


class atencion_diagnostico_dsm5(models.Model):
    atencion = models.ForeignKey(
        atencion_psicologica, on_delete=models.CASCADE, blank=True, null=True)
    diagnostico = models.ForeignKey(
        diagnostico, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        verbose_name = 'atencion_diagnostico_dsm5'
        verbose_name_plural = 'atencion_diagnostico_dsm5'
        ordering = ['atencion']
