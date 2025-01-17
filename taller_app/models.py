from django.db import models

# Create your models here.


class modalidad(models.Model):
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)

    class Meta:
        verbose_name = 'modalidad'
        verbose_name_plural = 'Modalidad'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre


class taller(models.Model):
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    modalidad = models.ForeignKey(
        modalidad, on_delete=models.CASCADE, blank=False, null=False)
    fecha_inicio = models.DateTimeField(
        'Fecha inicio', blank=True, null=True)
    fecha_fin = models.DateTimeField(
        'Fecha fin', blank=True, null=True)
    especialista = models.CharField(
        'Especialista', max_length=255, blank=True, null=True)
    estado = models.CharField('Estado', max_length=255, default=False)
    hora_inicio = models.CharField('Hora inicio', max_length=255, blank=True, null=True)

    class Meta:
        verbose_name = 'taller'
        verbose_name_plural = 'Taller'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
