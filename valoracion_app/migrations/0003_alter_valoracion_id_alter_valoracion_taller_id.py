# Generated by Django 4.2.6 on 2024-11-19 21:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('valoracion_app', '0002_alter_valoracion_institucion_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='valoracion',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='valoracion_taller',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
