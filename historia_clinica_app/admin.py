from django.contrib import admin
from .models import historia_clinica, caracteristicas_infancia_adolescencia, modalidad_conductas, modalidad_sentimientos, modalidad_sensaciones_fisicas, modalidad_imagenes_me_veo, modalidad_imagenes_tengo, modalidad_pensamientos

# Register your models here.
admin.site.register(historia_clinica)
admin.site.register(caracteristicas_infancia_adolescencia)
admin.site.register(modalidad_conductas)
admin.site.register(modalidad_sentimientos)
admin.site.register(modalidad_sensaciones_fisicas)
admin.site.register(modalidad_imagenes_me_veo)
admin.site.register(modalidad_imagenes_tengo)
admin.site.register(modalidad_pensamientos)
