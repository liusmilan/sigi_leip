# Generated by Django 4.2.6 on 2024-04-01 01:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuario_app', '0003_usuario_rol'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]