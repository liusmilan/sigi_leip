# Generated by Django 4.2.6 on 2024-11-18 19:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vive_con_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vive_con',
            name='estado',
            field=models.CharField(max_length=255, verbose_name='Estado'),
        ),
    ]