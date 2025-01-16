from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import agregarEditarFPP, getFPP

urlpatterns = [
    path('agregar_editar_fpp/', login_required(agregarEditarFPP.as_view()),
         name='agregar_editar_fpp'),
    path('get_fpp/', login_required(getFPP.as_view()),
         name='get_fpp'),
]
