# Generated by Django 4.2.6 on 2024-02-22 21:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('atencion_psicologica_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='atencion_psicologica',
            options={'ordering': ['fecha_atencion'], 'verbose_name': 'atencion_psicologica', 'verbose_name_plural': 'Atención Psicologica'},
        ),
    ]
