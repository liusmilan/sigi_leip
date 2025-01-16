# Generated by Django 4.2.6 on 2024-05-07 19:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('atencion_psicologica_app', '0002_alter_atencion_psicologica_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='fpp',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('pregunta1', models.IntegerField()),
                ('pregunta2', models.IntegerField()),
                ('pregunta3', models.IntegerField()),
                ('pregunta4', models.IntegerField()),
                ('pregunta5', models.IntegerField()),
                ('pregunta6', models.IntegerField()),
                ('pregunta7', models.IntegerField()),
                ('pregunta8', models.IntegerField()),
                ('pregunta9', models.IntegerField()),
                ('pregunta10', models.IntegerField()),
                ('pregunta11', models.IntegerField()),
                ('pregunta12', models.IntegerField()),
                ('pregunta13', models.IntegerField()),
                ('pregunta14', models.IntegerField()),
                ('pregunta15', models.IntegerField()),
                ('pregunta16', models.IntegerField()),
                ('pregunta17', models.IntegerField()),
                ('pregunta18', models.IntegerField()),
                ('pregunta19', models.IntegerField()),
                ('pregunta20', models.IntegerField()),
                ('pregunta21', models.IntegerField()),
                ('pregunta22', models.IntegerField()),
                ('pregunta23', models.IntegerField()),
                ('pregunta24', models.IntegerField()),
                ('pregunta25', models.IntegerField()),
                ('pregunta26', models.IntegerField()),
                ('pregunta27', models.IntegerField()),
                ('pregunta28', models.IntegerField()),
                ('pregunta29', models.IntegerField()),
                ('pregunta30', models.IntegerField()),
                ('pregunta31', models.IntegerField()),
                ('pregunta32', models.IntegerField()),
                ('pregunta33', models.IntegerField()),
                ('total', models.IntegerField(blank=True, null=True)),
                ('color', models.CharField(blank=True, max_length=255, null=True)),
                ('nivel', models.CharField(blank=True, max_length=255, null=True)),
                ('atencion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='atencion_psicologica_app.atencion_psicologica')),
            ],
            options={
                'verbose_name': 'fpp',
                'verbose_name_plural': 'fpp',
                'ordering': ['id'],
            },
        ),
    ]
