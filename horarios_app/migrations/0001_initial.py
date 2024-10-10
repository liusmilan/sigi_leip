# Generated by Django 4.2.6 on 2024-03-07 23:27

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='horario',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('dia', models.CharField(blank=True, max_length=255, null=True, verbose_name='Dia')),
                ('hora', models.CharField(blank=True, max_length=255, null=True, verbose_name='Hora')),
                ('tipo_horario', models.CharField(blank=True, max_length=255, null=True, verbose_name='Tipo Horario')),
            ],
            options={
                'verbose_name': 'horario',
                'verbose_name_plural': 'Horario',
                'ordering': ['dia'],
            },
        ),
    ]