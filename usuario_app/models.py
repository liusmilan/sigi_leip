from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from rol_app.models import rol
from persona_app.models import persona

# Create your models here.


class UsuarioManager(BaseUserManager):
    def create_user(self, username, password=None):
        usuario = self.model(
            username=username
        )

        usuario.set_password(password)
        usuario.save(using=self.db)
        return usuario

    def create_superuser(self, username, password):
        usuario = self.create_user(
            username=username,
            password=password
        )

        usuario.usuario_administrador = True
        usuario.save()
        return usuario


class Usuario(AbstractBaseUser):
    username = models.CharField(
        'Nombre de usuario', unique=True, max_length=255)
    trabajador_ley = models.BooleanField(default=False)
    persona = models.ForeignKey(
        persona, on_delete=models.CASCADE, blank=True, null=True)
    usuario_activo = models.BooleanField(default=True)
    usuario_administrador = models.BooleanField(default=False)
    rol = models.ManyToManyField(rol, through='UsuarioRol')
    objects = UsuarioManager()

    USERNAME_FIELD = 'username'

    class Meta:
        verbose_name = 'usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['username']

    def __str__(self) -> str:
        return self.username

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.usuario_administrador


class UsuarioRol(models.Model):
    rol = models.ForeignKey(
        rol, on_delete=models.CASCADE, blank=True, null=True)
    usuario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        verbose_name = 'usuario_rol'
        verbose_name_plural = 'Usuarios_Roles'
        ordering = ['usuario']
