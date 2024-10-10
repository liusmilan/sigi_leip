# Generated by Django 4.2.6 on 2024-01-09 01:56

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rol_app', '0001_initial'),
        ('usuario_app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usuario',
            name='rol',
        ),
        migrations.AddField(
            model_name='usuario',
            name='tipo_usuario',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Tipo de Usuario'),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='trabajador_ley',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='usuario_administrador',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='UsuarioRol',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('rol', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='rol_app.rol')),
                ('usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'usuario_rol',
                'verbose_name_plural': 'Usuarios_Roles',
                'ordering': ['usuario'],
            },
        ),
    ]
