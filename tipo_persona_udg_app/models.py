from django.db import models

# Create your models here.


class tipo_persona_udg(models.Model):
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    estado = models.CharField('Estado', max_length=255, default=False)

    class Meta:
        verbose_name = 'tipo_persona_udg'
        verbose_name_plural = 'Tipo de Persona UDG'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
