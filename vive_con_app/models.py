from django.db import models

# Create your models here.


class vive_con(models.Model):
    vive_con = models.CharField(
        'Vive con', max_length=255, blank=False, null=False)
    estado = models.CharField('Estado', max_length=255)

    class Meta:
        verbose_name = 'vive_con'
        verbose_name_plural = 'Vive con'
        ordering = ['vive_con']

    def __str__(self) -> str:
        return self.vive_con
