# Generated by Django 4.2.6 on 2024-10-30 19:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('historia_clinica_app', '0008_historia_clinica_prob_emocion_mental'),
    ]

    operations = [
        migrations.AddField(
            model_name='historia_clinica',
            name='cuales_pensamto_vuelven',
            field=models.TextField(blank=True, null=True),
        ),
    ]