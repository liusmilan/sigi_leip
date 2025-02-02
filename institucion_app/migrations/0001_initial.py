# Generated by Django 4.2.6 on 2024-01-28 20:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='institucion',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255, verbose_name='Nombre')),
                ('tipo_institucion', models.CharField(max_length=255, verbose_name='Tipo Institucion')),
                ('estado_institucion', models.BooleanField(default=True)),
                ('descripcion', models.TextField(blank=True, null=True, verbose_name='Descripcion')),
                ('domicilio', models.TextField(blank=True, null=True, verbose_name='Domicilio')),
                ('contacto', models.CharField(blank=True, max_length=255, null=True, verbose_name='Contacto')),
                ('correo', models.EmailField(blank=True, max_length=254, null=True, verbose_name='Correo electrónico')),
                ('sitio_web', models.URLField(blank=True, null=True, verbose_name='Sitio Web')),
            ],
        ),
    ]
