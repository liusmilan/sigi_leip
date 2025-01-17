# Generated by Django 4.2.6 on 2024-04-23 19:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('estado_atencion_app', '0001_initial'),
        ('persona_app', '0007_alter_persona_direccion'),
    ]

    operations = [
        migrations.CreateModel(
            name='seguimiento_atencion',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('fecha', models.DateTimeField(verbose_name='Fecha')),
                ('observaciones', models.CharField(max_length=255, verbose_name='Observaciones')),
                ('estado', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='estado_atencion_app.estado_atencion')),
                ('persona', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='persona_app.persona')),
            ],
            options={
                'verbose_name': 'seguimiento_atencion',
                'verbose_name_plural': 'Seguimiento de Atencion',
                'ordering': ['id'],
            },
        ),
    ]
