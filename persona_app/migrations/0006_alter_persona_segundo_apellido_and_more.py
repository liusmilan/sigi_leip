# Generated by Django 4.2.6 on 2023-12-26 03:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('persona_app', '0005_alter_persona_fecha_nacimiento'),
    ]

    operations = [
        migrations.AlterField(
            model_name='persona',
            name='segundo_apellido',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Segundo apellido'),
        ),
        migrations.AlterField(
            model_name='persona',
            name='segundo_nombre',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Segundo nombre'),
        ),
    ]
