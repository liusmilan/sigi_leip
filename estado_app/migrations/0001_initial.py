# Generated by Django 4.2.6 on 2023-11-27 19:51

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='estado',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255, verbose_name='Nombre')),
            ],
            options={
                'verbose_name': 'estado',
                'verbose_name_plural': 'Estados',
                'ordering': ['nombre'],
            },
        ),
    ]
