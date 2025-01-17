from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import agregarEditarMstNivel1, getMstNivel1

urlpatterns = [
    path('agregar_editar_mst_nivel1/', login_required(agregarEditarMstNivel1.as_view()),
         name='agregar_editar_mst_nivel1'),
    path('get_mst_nivel1/', login_required(getMstNivel1.as_view()),
         name='get_mst_nivel1'),
]
