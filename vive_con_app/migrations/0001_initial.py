# Generated by Django 4.2.6 on 2024-01-29 20:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='vive_con',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('vive_con', models.CharField(max_length=255, verbose_name='Vive con')),
                ('estado', models.CharField(default=False, max_length=255, verbose_name='Estado')),
            ],
            options={
                'verbose_name': 'vive_con',
                'verbose_name_plural': 'Vive con',
                'ordering': ['vive_con'],
            },
        ),
    ]
