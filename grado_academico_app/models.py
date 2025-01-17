from django.db import models

# Create your models here.


class grado_academico(models.Model):
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    estado = models.CharField('Estado', max_length=255, default=False)

    class Meta:
        verbose_name = 'grado_academico'
        verbose_name_plural = 'Grado Academico'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
