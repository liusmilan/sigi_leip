from django.db import models
from estado_app.models import estado

# Create your models here.


class municipio(models.Model):
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    estado = models.ForeignKey(
        estado, on_delete=models.CASCADE, blank=True, null=False)

    class Meta:
        verbose_name = 'municipio'
        verbose_name_plural = 'Municipios'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
