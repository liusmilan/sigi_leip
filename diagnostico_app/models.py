from django.db import models
from categoria_trastorno_app.models import categoria_trastorno
from grupo_trastorno_app.models import grupo_trastorno

# Create your models here.


class diagnostico(models.Model):
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    categoria = models.ForeignKey(
        categoria_trastorno, on_delete=models.CASCADE, blank=False, null=False)
    grupo = models.ForeignKey(
        grupo_trastorno, on_delete=models.CASCADE, blank=True, null=True)
    estado = models.CharField('Estado', max_length=255, default=False)

    class Meta:
        verbose_name = 'diagnostico'
        verbose_name_plural = 'Diagnostico'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
