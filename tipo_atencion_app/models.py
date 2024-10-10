from django.db import models

# Create your models here.


class tipo_atencion(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    categoria = models.CharField(
        'Categoria', max_length=255, blank=True, null=True)
    estado = models.CharField('Estado', max_length=255, default=False)

    class Meta:
        verbose_name = 'tipo_atencion'
        verbose_name_plural = 'Tipo de Atencion'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
