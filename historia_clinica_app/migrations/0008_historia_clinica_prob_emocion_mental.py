# Generated by Django 4.2.6 on 2024-10-30 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('historia_clinica_app', '0007_historia_clinica_quien_lo_envia'),
    ]

    operations = [
        migrations.AddField(
            model_name='historia_clinica',
            name='prob_emocion_mental',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]
