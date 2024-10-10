from django.db import models

# Create your models here.


class categoria_trastorno(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    estado = models.CharField('Estado', max_length=255, default=False)

    class Meta:
        verbose_name = 'categoria_trastorno'
        verbose_name_plural = 'Categoria de Trastorno'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
