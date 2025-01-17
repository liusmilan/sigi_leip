from django.db import models

# Create your models here.


class estado_atencion(models.Model):
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    estado = models.CharField('Estado', max_length=255, default=False)

    class Meta:
        verbose_name = 'estado_atencion'
        verbose_name_plural = 'Estado de Atencion'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
