from django.db import models
from estado_atencion_app.models import estado_atencion
from persona_app.models import persona
from atencion_psicologica_app.models import atencion_psicologica


# Create your models here.
class seguimiento_atencion(models.Model):
    fecha = models.DateTimeField('Fecha', blank=False, null=False)
    persona = models.ForeignKey(
        persona, on_delete=models.CASCADE, blank=False, null=False)
    estado = models.ForeignKey(
        estado_atencion, on_delete=models.CASCADE, blank=False, null=False)
    atencion = models.ForeignKey(
        atencion_psicologica, on_delete=models.CASCADE, blank=True, null=True)
    observaciones = models.CharField(
        'Observaciones', max_length=255, blank=False, null=False)

    class Meta:
        verbose_name = 'seguimiento_atencion'
        verbose_name_plural = 'Seguimiento de Atencion'
        ordering = ['id']
