# Generated by Django 4.2.6 on 2024-11-03 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tipo_atencion_app', '0005_tipo_atencion_categoria'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tipo_atencion',
            name='categoria',
        ),
        migrations.AddField(
            model_name='tipo_atencion',
            name='consulta',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='tipo_atencion',
            name='derivar',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='tipo_atencion',
            name='taller',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]