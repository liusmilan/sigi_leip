from django.contrib import admin
from .models import motivo_consulta, horario_motivo_consulta

# Register your models here.
admin.site.register(motivo_consulta)
admin.site.register(horario_motivo_consulta)
