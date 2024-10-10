from django.db import models

# Create your models here.


class rol(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(
        'Nombre', max_length=255, blank=False, null=False)

    class Meta:
        verbose_name = 'rol'
        verbose_name_plural = 'Roles'
        ordering = ['nombre']

    def __str__(self) -> str:
        return self.nombre
