# Generated by Django 4.2.6 on 2024-10-30 13:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('historia_clinica_app', '0006_alter_historia_clinica_edad_casar_padres'),
    ]

    operations = [
        migrations.AddField(
            model_name='historia_clinica',
            name='quien_lo_envia',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
