# Generated by Django 4.2.6 on 2024-11-19 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuario_app', '0002_remove_usuario_tipo_usuario'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]