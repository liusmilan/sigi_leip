from django.db import models

# Create your models here.


class estado(models.Model):
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)

    class Meta:
        verbose_name = 'estado'
        verbose_name_plural = 'Estados'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
