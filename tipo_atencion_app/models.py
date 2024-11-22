from django.db import models

# Create your models here.


class tipo_atencion(models.Model):
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    derivar = models.BooleanField(null=True, blank=True)
    taller = models.BooleanField(null=True, blank=True)
    consulta = models.BooleanField(null=True, blank=True)
    estado = models.CharField('Estado', max_length=255, default=False)

    class Meta:
        verbose_name = 'tipo_atencion'
        verbose_name_plural = 'Tipo de Atencion'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
