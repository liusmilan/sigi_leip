from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import agregarSeguimientoAtencion

urlpatterns = [
    path('agregar_seguimiento_atencion/', login_required(agregarSeguimientoAtencion.as_view()),
         name='agregar_seguimiento_atencion'),
]
