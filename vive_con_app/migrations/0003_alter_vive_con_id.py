# Generated by Django 4.2.6 on 2024-11-18 21:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vive_con_app', '0002_alter_vive_con_estado'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vive_con',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
