# Generated by Django 4.2.6 on 2024-11-19 21:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('estado_civil_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='estado_civil',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
