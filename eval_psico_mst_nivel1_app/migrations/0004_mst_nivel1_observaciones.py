# Generated by Django 4.2.6 on 2024-10-27 06:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eval_psico_mst_nivel1_app', '0003_mst_nivel1_nivel'),
    ]

    operations = [
        migrations.AddField(
            model_name='mst_nivel1',
            name='observaciones',
            field=models.TextField(blank=True, null=True),
        ),
    ]
