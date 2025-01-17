from django.db import models

# Create your models here.


class ingreso_familiar(models.Model):
    ingreso = models.CharField(
        'Ingresos Familiares Mensuales', max_length=255, blank=False, null=True)
    nivel = models.CharField('Nivel', max_length=255, blank=False, null=False)
    color = models.CharField(
        'Color definido', max_length=255, blank=False, null=False)
    estado = models.CharField(
        'Estado', max_length=255, blank=False, null=False)

    class Meta:
        verbose_name = 'ingreso_familiar'
        verbose_name_plural = 'Ingresos familiares'
        ordering = ['ingreso']

    def __str__(self) -> str:
        return self.ingreso
