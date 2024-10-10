from django.db import models

# Create your models here.


class estado_civil(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    estado = models.CharField('Estado', max_length=255, default=False)

    class Meta:
        verbose_name = 'estado_civil'
        verbose_name_plural = 'estado_civil'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
