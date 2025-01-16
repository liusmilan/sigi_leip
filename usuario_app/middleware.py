import datetime
from django.conf import settings
from django.utils import timezone
from django.contrib.auth import logout
from django.contrib import messages


class closeSession:
  def __init__(self, get_response):
        self.get_response = get_response

  def __call__(self, request):
    # Verificar si el usuario está autenticado
    if request.user.is_authenticated:
      # Obtener la última actividad del usuario
      last_activity = request.session.get('last_activity')
      now = timezone.now()

      # Si no hay actividad registrada, establecerla
      if last_activity is None:
          request.session['last_activity'] = now.isoformat()
      else:
          last_activity = datetime.datetime.fromisoformat(last_activity)

          # Calcular la diferencia de tiempo
          inactive_time = now - last_activity

          # Si el tiempo de inactividad supera el límite, cerrar sesión
          if inactive_time.total_seconds() > settings.AUTO_LOGOUT_TIME * 60:
            messages.info(request, 'Su sesión a expirado')
            logout(request)
            return self.get_response(request)

      # Actualizar la última actividad
      request.session['last_activity'] = now.isoformat()

    response = self.get_response(request)
    return response