# Generated by Django 4.2.6 on 2024-11-18 20:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vive_en_app', '0003_rename_vive_en_vive_en_model'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vive_en_model',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
