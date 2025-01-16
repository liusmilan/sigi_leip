from django.db import models
from categoria_trastorno_app.models import categoria_trastorno

# Create your models here.


class grupo_trastorno(models.Model):
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    categoria = models.ForeignKey(
        categoria_trastorno, on_delete=models.CASCADE, blank=True, null=False)
    estado = models.CharField('Estado', max_length=255, default=False)

    class Meta:
        verbose_name = 'grupo_trastorno'
        verbose_name_plural = 'Grupo de Trastornos'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
