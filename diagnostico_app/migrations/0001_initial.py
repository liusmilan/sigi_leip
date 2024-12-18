# Generated by Django 4.2.6 on 2024-02-05 00:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('categoria_trastorno_app', '0001_initial'),
        ('grupo_trastorno_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='diagnostico',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255, verbose_name='Nombre')),
                ('estado', models.CharField(default=False, max_length=255, verbose_name='Estado')),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='categoria_trastorno_app.categoria_trastorno')),
                ('grupo', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='grupo_trastorno_app.grupo_trastorno')),
            ],
            options={
                'verbose_name': 'diagnostico',
                'verbose_name_plural': 'Diagnostico',
                'ordering': ['nombre'],
            },
        ),
    ]
