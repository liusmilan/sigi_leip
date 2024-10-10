from django.db import models

# Create your models here.


class vive_en(models.Model):
    id = models.AutoField(primary_key=True)
    vive_en = models.CharField(
        'Vive en', max_length=255, blank=False, null=False)
    estado = models.CharField('Estado', max_length=255, default=False)

    class Meta:
        verbose_name = 'vive_en'
        verbose_name_plural = 'Vive en'
        ordering = ['vive_en']

    def __str__(self) -> str:
        return self.vive_en