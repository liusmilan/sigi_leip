# Generated by Django 4.2.6 on 2024-11-19 21:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('licenciatura_app', '0002_licenciatura_tipo_licenciatura'),
    ]

    operations = [
        migrations.AlterField(
            model_name='licenciatura',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]