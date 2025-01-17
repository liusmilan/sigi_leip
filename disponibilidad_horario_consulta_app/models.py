from django.db import models
from atencion_psicologica_app.models import atencion_psicologica

# Create your models here.


class disponibilidad_horario_consulta(models.Model):
    atencion = models.ForeignKey(
        atencion_psicologica, on_delete=models.CASCADE, blank=False, null=False)
    dia = models.CharField('Dia', max_length=255, blank=False, null=False)
    hora = models.CharField('Hora', max_length=255, blank=False, null=False)

    class Meta:
        verbose_name = 'disponibilidad_horario_consulta'
        verbose_name_plural = 'Disponibilidad Horario Consulta'
        ordering = ['id']

    def __str__(self) -> str:
        return self.dia
