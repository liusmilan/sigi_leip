from django.db import models

# Create your models here.


class institucion(models.Model):
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)
    tipo_institucion = models.CharField(
        'Tipo Institucion', max_length=255, blank=False, null=False)
    estado_institucion = models.BooleanField(default=True)
    descripcion = models.TextField('Descripcion', blank=True, null=True)
    domicilio = models.TextField('Domicilio', blank=True, null=True)
    contacto = models.CharField(
        'Contacto', max_length=255, blank=True, null=True)
    correo = models.EmailField('Correo electrónico', blank=True, null=True)
    sitio_web = models.URLField('Sitio Web', blank=True, null=True)
