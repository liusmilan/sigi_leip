from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import agregarSeguimientoAtencion, getAllSeguimientos, eliminarSeguimiento

urlpatterns = [
    path('agregar_seguimiento_atencion/', login_required(agregarSeguimientoAtencion.as_view()),
         name='agregar_seguimiento_atencion'),
    path('get_all_seguimiento/', getAllSeguimientos,
         name='get_all_seguimiento'),
    path('eliminar_seguimiento/', eliminarSeguimiento,
         name='eliminar_seguimiento'),
]
