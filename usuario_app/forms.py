from typing import Any
from django.contrib.auth.forms import AuthenticationForm


class formularioLogin(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super(formularioLogin, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs['class'] = 'form-control'
        self.fields['username'].widget.attrs['placeholder'] = 'Nombre de usuario'
        self.fields['password'].widget.attrs['class'] = 'form-control'
        self.fields['password'].widget.attrs['placeholder'] = 'Contraseña'
