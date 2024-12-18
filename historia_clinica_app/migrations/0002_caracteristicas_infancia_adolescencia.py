# Generated by Django 4.2.6 on 2024-09-29 17:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('historia_clinica_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='caracteristicas_infancia_adolescencia',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('infancia_feliz', models.BooleanField(blank=True, null=True)),
                ('infancia_infeliz', models.BooleanField(blank=True, null=True)),
                ('prob_emoc_cond', models.BooleanField(blank=True, null=True)),
                ('prob_leg', models.BooleanField(blank=True, null=True)),
                ('muerte_familia', models.BooleanField(blank=True, null=True)),
                ('prob_med', models.BooleanField(blank=True, null=True)),
                ('ignorado', models.BooleanField(blank=True, null=True)),
                ('pocos_amigos', models.BooleanField(blank=True, null=True)),
                ('prob_escuela', models.BooleanField(blank=True, null=True)),
                ('convicciones_religiosas', models.BooleanField(blank=True, null=True)),
                ('uso_drogas', models.BooleanField(blank=True, null=True)),
                ('uso_alcohol', models.BooleanField(blank=True, null=True)),
                ('castigado_sev', models.BooleanField(blank=True, null=True)),
                ('abusado_sex', models.BooleanField(blank=True, null=True)),
                ('prob_financieros', models.BooleanField(blank=True, null=True)),
                ('int_mol_sev', models.BooleanField(blank=True, null=True)),
                ('prob_alim', models.BooleanField(blank=True, null=True)),
                ('otros', models.TextField(blank=True, null=True)),
                ('hc', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='historia_clinica_app.historia_clinica')),
            ],
            options={
                'verbose_name': 'caracteristicas_infancia_adolescencia',
                'verbose_name_plural': 'caracteristicas_infancia_adolescencia',
                'ordering': ['id'],
            },
        ),
    ]
