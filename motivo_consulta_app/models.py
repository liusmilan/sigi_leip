from django.db import models
from atencion_psicologica_app.models import atencion_psicologica
# from persona_app.models import persona

# Create your models here.


class motivo_consulta(models.Model):
    pregunta_uno = models.CharField(
        'Pregunta uno', max_length=255, blank=False, null=False)
    pregunta_dos = models.CharField(
        'Pregunta dos', max_length=255, blank=False, null=False)
    pregunta_tres = models.CharField(
        'Pregunta tres', max_length=255, blank=False, null=False)
    atencion = models.ForeignKey(
        atencion_psicologica, on_delete=models.CASCADE, blank=False, null=False)
    # persona = models.ForeignKey(
    #     persona, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        verbose_name = 'motivo_consulta'
        verbose_name_plural = 'Motivo de Consulta'
        ordering = ['id']


class horario_motivo_consulta(models.Model):
    dia = models.CharField('Dia', max_length=255, blank=False, null=False)
    hora = models.CharField('Hora', max_length=255, blank=False, null=False)
    motivo_consulta = models.ForeignKey(
        motivo_consulta, on_delete=models.CASCADE, blank=True, null=False)

    class Meta:
        verbose_name = 'horario_motivo_consulta'
        verbose_name_plural = 'Horario Motivo de Consulta'
        ordering = ['motivo_consulta']

    def __str__(self) -> str:
        return self.dia
