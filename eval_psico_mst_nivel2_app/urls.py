from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import agregarEditarMstNivel2, getMstNivel2

urlpatterns = [
    path('agregar_editar_mst_nivel2/', login_required(agregarEditarMstNivel2.as_view()),
         name='agregar_editar_mst_nivel2'),
    path('get_mst_nivel2/', login_required(getMstNivel2.as_view()),
         name='get_mst_nivel2'),
]
