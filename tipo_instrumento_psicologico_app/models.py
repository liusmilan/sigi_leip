from django.db import models

# Create your models here.


class tipo_instrumento_psicologico(models.Model):
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    estado = models.CharField('Estado', max_length=255, default=False)

    class Meta:
        verbose_name = 'tipo_instrumento_psicologico'
        verbose_name_plural = 'Tipo de Instrumento Psicologico'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
