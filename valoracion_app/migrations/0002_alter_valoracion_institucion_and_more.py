# Generated by Django 4.2.6 on 2024-07-05 15:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('institucion_app', '0001_initial'),
        ('valoracion_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='valoracion',
            name='institucion',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='institucion_app.institucion'),
        ),
        migrations.AlterField(
            model_name='valoracion',
            name='tipo_institucion',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Tipo institucion'),
        ),
    ]
