from django.contrib import admin
from .models import atencion_psicologica, atencion_diagnostico_dsm5

# Register your models here.
admin.site.register(atencion_psicologica)
admin.site.register(atencion_diagnostico_dsm5)
