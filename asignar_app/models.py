from django.db import models
from persona_app.models import persona
from atencion_psicologica_app.models import atencion_psicologica

# Create your models here.


class asignar(models.Model):
    persona_asignada = models.ForeignKey(
        persona, on_delete=models.CASCADE, blank=False, null=False)
    fecha = models.DateTimeField('Fecha', blank=False, null=False)
    hora = models.CharField('Hora', max_length=255, blank=False, null=False)
    tipo_persona = models.CharField(
        'Tipo Persona', max_length=255, blank=False, null=False)
    atencion = models.ForeignKey(
        atencion_psicologica, on_delete=models.CASCADE, blank=False, null=False)

    class Meta:
        verbose_name = 'asinar'
        verbose_name_plural = 'Asignar'
        ordering = ['id']


# class horarios_asignados(models.Model):
#     id = models.AutoField(primary_key=True)
#     asignar = models.ForeignKey(
#         asignar, on_delete=models.CASCADE, blank=False, null=False)
#     horario = models.CharField(
#         'Horario', max_length=255, blank=False, null=False)

#     class Meta:
#         verbose_name = 'horarios_asignados'
#         verbose_name_plural = 'Horarios asignados'
#         ordering = ['id']
