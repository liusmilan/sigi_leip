from django.db import models
from atencion_psicologica_app.models import atencion_psicologica


# Create your models here.
class mst_nivel2(models.Model):
    depresion_pregunta1 = models.IntegerField(blank=False, null=False)
    depresion_pregunta2 = models.IntegerField(blank=False, null=False)
    depresion_pregunta3 = models.IntegerField(blank=False, null=False)
    depresion_pregunta4 = models.IntegerField(blank=False, null=False)
    depresion_pregunta5 = models.IntegerField(blank=False, null=False)
    depresion_pregunta6 = models.IntegerField(blank=False, null=False)
    depresion_pregunta7 = models.IntegerField(blank=False, null=False)
    depresion_pregunta8 = models.IntegerField(blank=False, null=False)
    evaluacion_depresion = models.IntegerField(blank=False, null=False)
    color_evaluacion_depresion = models.CharField(
        max_length=255, blank=True, null=True)
    nivel_evaluacion_depresion = models.CharField(
        max_length=255, blank=True, null=True)

    ira_pregunta1 = models.IntegerField(blank=False, null=False)
    ira_pregunta2 = models.IntegerField(blank=False, null=False)
    ira_pregunta3 = models.IntegerField(blank=False, null=False)
    ira_pregunta4 = models.IntegerField(blank=False, null=False)
    ira_pregunta5 = models.IntegerField(blank=False, null=False)
    evaluacion_ira = models.IntegerField(blank=False, null=False)
    color_evaluacion_ira = models.CharField(
        max_length=255, blank=True, null=True)
    nivel_evaluacion_ira = models.CharField(
        max_length=255, blank=True, null=True)

    mania_pregunta1 = models.IntegerField(blank=False, null=False)
    mania_pregunta2 = models.IntegerField(blank=False, null=False)
    mania_pregunta3 = models.IntegerField(blank=False, null=False)
    mania_pregunta4 = models.IntegerField(blank=False, null=False)
    mania_pregunta5 = models.IntegerField(blank=False, null=False)
    evaluacion_mania = models.IntegerField(blank=False, null=False)
    color_evaluacion_mania = models.CharField(
        max_length=255, blank=True, null=True)
    nivel_evaluacion_mania = models.CharField(
        max_length=255, blank=True, null=True)

    ansiedad_pregunta1 = models.IntegerField(blank=False, null=False)
    ansiedad_pregunta2 = models.IntegerField(blank=False, null=False)
    ansiedad_pregunta3 = models.IntegerField(blank=False, null=False)
    ansiedad_pregunta4 = models.IntegerField(blank=False, null=False)
    ansiedad_pregunta5 = models.IntegerField(blank=False, null=False)
    ansiedad_pregunta6 = models.IntegerField(blank=False, null=False)
    ansiedad_pregunta7 = models.IntegerField(blank=False, null=False)
    evaluacion_ansiedad = models.IntegerField(blank=False, null=False)
    color_evaluacion_ansiedad = models.CharField(
        max_length=255, blank=True, null=True)
    nivel_evaluacion_ansiedad = models.CharField(
        max_length=255, blank=True, null=True)

    somaticos_pregunta1 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta2 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta3 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta4 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta5 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta6 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta7 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta8 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta9 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta10 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta11 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta12 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta13 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta14 = models.IntegerField(blank=False, null=False)
    somaticos_pregunta15 = models.IntegerField(blank=False, null=False)
    evaluacion_somaticos = models.IntegerField(blank=False, null=False)
    color_evaluacion_somaticos = models.CharField(
        max_length=255, blank=True, null=True)
    nivel_evaluacion_somaticos = models.CharField(
        max_length=255, blank=True, null=True)

    suenno_pregunta1 = models.IntegerField(blank=False, null=False)
    suenno_pregunta2 = models.IntegerField(blank=False, null=False)
    suenno_pregunta3 = models.IntegerField(blank=False, null=False)
    suenno_pregunta4 = models.IntegerField(blank=False, null=False)
    suenno_pregunta5 = models.IntegerField(blank=False, null=False)
    suenno_pregunta6 = models.IntegerField(blank=False, null=False)
    suenno_pregunta7 = models.IntegerField(blank=False, null=False)
    suenno_pregunta8 = models.IntegerField(blank=False, null=False)
    evaluacion_suenno = models.IntegerField(blank=False, null=False)
    color_evaluacion_suenno = models.CharField(
        max_length=255, blank=True, null=True)
    nivel_evaluacion_suenno = models.CharField(
        max_length=255, blank=True, null=True)

    repetitivo_pregunta1 = models.IntegerField(blank=False, null=False)
    repetitivo_pregunta2 = models.IntegerField(blank=False, null=False)
    repetitivo_pregunta3 = models.IntegerField(blank=False, null=False)
    repetitivo_pregunta4 = models.IntegerField(blank=False, null=False)
    repetitivo_pregunta5 = models.IntegerField(blank=False, null=False)
    evaluacion_repetitivo = models.IntegerField(blank=False, null=False)
    color_evaluacion_repetitivo = models.CharField(
        max_length=255, blank=True, null=True)
    nivel_evaluacion_repetitivo = models.CharField(
        max_length=255, blank=True, null=True)

    sustancia_pregunta1 = models.IntegerField(blank=False, null=False)
    sustancia_pregunta2 = models.IntegerField(blank=False, null=False)
    sustancia_pregunta3 = models.IntegerField(blank=False, null=False)
    sustancia_pregunta4 = models.IntegerField(blank=False, null=False)
    sustancia_pregunta5 = models.IntegerField(blank=False, null=False)
    sustancia_pregunta6 = models.IntegerField(blank=False, null=False)
    sustancia_pregunta7 = models.IntegerField(blank=False, null=False)
    sustancia_pregunta8 = models.IntegerField(blank=False, null=False)
    sustancia_pregunta9 = models.IntegerField(blank=False, null=False)
    sustancia_pregunta10 = models.IntegerField(blank=False, null=False)
    evaluacion_sustancia = models.IntegerField(blank=False, null=False)
    color_evaluacion_sustancia = models.CharField(
        max_length=255, blank=True, null=True)
    nivel_evaluacion_sustancia = models.CharField(
        max_length=255, blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)

    atencion = models.ForeignKey(
        atencion_psicologica, on_delete=models.CASCADE, blank=False, null=False)

    class Meta:
        verbose_name = 'mst_nivel2'
        verbose_name_plural = 'mst nivel 2'
        ordering = ['id']
