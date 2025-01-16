from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import agregarEditarAutoEvaPsico, getAutoEvaPisco

urlpatterns = [
    path('agregar_editar_auto_eva_psico/', login_required(agregarEditarAutoEvaPsico.as_view()),
         name='agregar_editar_auto_eva_psico'),
    path('get_auto_eva_psico/', login_required(getAutoEvaPisco.as_view()),
         name='get_auto_eva_psico'),
]
