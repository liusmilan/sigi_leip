from django.db import models
from atencion_psicologica_app.models import atencion_psicologica


# Create your models here.
class fpp(models.Model):
    id = models.AutoField(primary_key=True)
    pregunta1 = models.IntegerField(blank=False, null=False)
    pregunta2 = models.IntegerField(blank=False, null=False)
    pregunta3 = models.IntegerField(blank=False, null=False)
    pregunta4 = models.IntegerField(blank=False, null=False)
    pregunta5 = models.IntegerField(blank=False, null=False)
    pregunta6 = models.IntegerField(blank=False, null=False)
    pregunta7 = models.IntegerField(blank=False, null=False)
    pregunta8 = models.IntegerField(blank=False, null=False)
    pregunta9 = models.IntegerField(blank=False, null=False)
    pregunta10 = models.IntegerField(blank=False, null=False)
    pregunta11 = models.IntegerField(blank=False, null=False)
    pregunta12 = models.IntegerField(blank=False, null=False)
    pregunta13 = models.IntegerField(blank=False, null=False)
    pregunta14 = models.IntegerField(blank=False, null=False)
    pregunta15 = models.IntegerField(blank=False, null=False)
    pregunta16 = models.IntegerField(blank=False, null=False)
    pregunta17 = models.IntegerField(blank=False, null=False)
    pregunta18 = models.IntegerField(blank=False, null=False)
    pregunta19 = models.IntegerField(blank=False, null=False)
    pregunta20 = models.IntegerField(blank=False, null=False)
    pregunta21 = models.IntegerField(blank=False, null=False)
    pregunta22 = models.IntegerField(blank=False, null=False)
    pregunta23 = models.IntegerField(blank=False, null=False)
    pregunta24 = models.IntegerField(blank=False, null=False)
    pregunta25 = models.IntegerField(blank=False, null=False)
    pregunta26 = models.IntegerField(blank=False, null=False)
    pregunta27 = models.IntegerField(blank=False, null=False)
    pregunta28 = models.IntegerField(blank=False, null=False)
    pregunta29 = models.IntegerField(blank=False, null=False)
    pregunta30 = models.IntegerField(blank=False, null=False)
    pregunta31 = models.IntegerField(blank=False, null=False)
    pregunta32 = models.IntegerField(blank=False, null=False)
    pregunta33 = models.IntegerField(blank=False, null=False)
    total = models.IntegerField(blank=True, null=True)
    color = models.CharField(max_length=255, blank=True, null=True)
    nivel = models.CharField(max_length=255, blank=True, null=True)
    atencion = models.ForeignKey(
        atencion_psicologica, on_delete=models.CASCADE, blank=False, null=False)

    class Meta:
        verbose_name = 'fpp'
        verbose_name_plural = 'fpp'
        ordering = ['id']
