# Generated by Django 4.2.6 on 2024-11-02 21:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taller_app', '0003_alter_taller_especialista'),
    ]

    operations = [
        migrations.AddField(
            model_name='taller',
            name='hora_inicio',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Hora inicio'),
        ),
    ]
