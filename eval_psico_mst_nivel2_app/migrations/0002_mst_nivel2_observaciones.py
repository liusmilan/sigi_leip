# Generated by Django 4.2.6 on 2024-10-25 06:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eval_psico_mst_nivel2_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='mst_nivel2',
            name='observaciones',
            field=models.TextField(blank=True, null=True),
        ),
    ]