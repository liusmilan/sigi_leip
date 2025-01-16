from django.db import models


# Create your models here.
class horario(models.Model):
    dia = models.CharField(
        'Dia', max_length=255, blank=True, null=True)
    hora = models.CharField(
        'Hora', max_length=255, blank=True, null=True)
    tipo_horario = models.CharField(
        'Tipo Horario', max_length=255, blank=True, null=True)

    class Meta:
        verbose_name = 'horario'
        verbose_name_plural = 'Horario'
        ordering = ['dia']

    def __str__(self) -> str:
        return self.dia
