from django.db import models

# Create your models here.


class licenciatura(models.Model):
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    estado = models.CharField('Estado', max_length=255, default=False)
    tipo_licenciatura = models.CharField(
        'Tipo de Licenciatura', max_length=255, blank=True, null=True)

    class Meta:
        verbose_name = 'licenciatura'
        verbose_name_plural = 'Licenciaturas'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
