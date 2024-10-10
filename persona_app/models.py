from django.db import models
from estado_app.models import estado
from municipio_app.models import municipio

# Create your models here.


class persona(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    segundo_nombre = models.CharField(
        'Segundo nombre', max_length=255, blank=True, null=True)
    apellido = models.CharField('Apellido', max_length=255)
    segundo_apellido = models.CharField(
        'Segundo apellido', max_length=255, blank=True, null=True)
    email = models.EmailField('Correo electrónico',
                              blank=True, null=True)
    sexo = models.CharField('Sexo', max_length=255, blank=True, null=True)
    fecha_nacimiento = models.DateTimeField(
        'Fecha nacimiento', blank=True, null=True)
    telefono = models.CharField(
        'Telefono', max_length=255, null=True, blank=True)
    direccion = models.TextField(
        'Dirección', blank=True, null=True)
    nombre_emergencia = models.CharField(
        'Nombre emergencia', max_length=255, blank=True, null=True)
    parentesco = models.CharField(
        'Parentesco', max_length=255, blank=True, null=True)
    telefono_emergencia = models.CharField(
        'Teléfono de emergencia', max_length=255, blank=True, null=True)
    nombre_responsable = models.CharField(
        'Nombre del responsable', max_length=255, blank=True, null=True)
    tipo_persona_udg = models.CharField(
        'Tipo de persona UDG', max_length=255, blank=True, null=True)
    codigo_udg = models.CharField(
        'Código UDG', max_length=255, blank=True, null=True)
    estado = models.ForeignKey(
        estado, on_delete=models.CASCADE, null=True, blank=True)
    municipio = models.ForeignKey(
        municipio, on_delete=models.CASCADE, null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'persona'
        verbose_name_plural = 'Personas'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
