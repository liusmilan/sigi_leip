# Generated by Django 4.2.6 on 2024-01-27 22:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('licenciatura_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='licenciatura',
            name='tipo_licenciatura',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Tipo de Licenciatura'),
        ),
    ]