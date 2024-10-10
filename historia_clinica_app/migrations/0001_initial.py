# Generated by Django 4.2.6 on 2024-09-29 17:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('religion_app', '0001_initial'),
        ('licenciatura_app', '0002_licenciatura_tipo_licenciatura'),
        ('estado_app', '0001_initial'),
        ('atencion_psicologica_app', '0003_atencion_diagnostico_dsm5_and_more'),
        ('estado_civil_app', '0001_initial'),
        ('vive_con_app', '0001_initial'),
        ('municipio_app', '0001_initial'),
        ('vive_en_app', '0001_initial'),
        ('persona_app', '0007_alter_persona_direccion'),
        ('grado_academico_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='historia_clinica',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('ocupacion', models.CharField(blank=True, max_length=255, null=True)),
                ('nombre_emergencia', models.CharField(blank=True, max_length=255, null=True)),
                ('tlf_emergencia', models.CharField(blank=True, max_length=255, null=True)),
                ('pasatiempos', models.TextField(blank=True, null=True)),
                ('peso', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('estatura', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('peso_varia', models.BooleanField(blank=True, null=True)),
                ('gustar_trabajo', models.BooleanField(blank=True, null=True)),
                ('que_hace_trab', models.CharField(blank=True, max_length=255, null=True)),
                ('trab_pasados', models.CharField(blank=True, max_length=255, null=True)),
                ('terapia_antes', models.BooleanField(blank=True, null=True)),
                ('ayuda_problema', models.TextField(blank=True, null=True)),
                ('medico_cabecera', models.BooleanField(blank=True, null=True)),
                ('nombre_medico_cabecera', models.CharField(blank=True, max_length=255, null=True)),
                ('tlf_medico_cabecera', models.CharField(blank=True, max_length=255, null=True)),
                ('lugar_terapia_pasada', models.TextField(blank=True, null=True)),
                ('hosp_prob_psico', models.BooleanField(blank=True, null=True)),
                ('lugar_hosp_prob_psico', models.TextField(blank=True, null=True)),
                ('hacerse_danio_suicidio', models.BooleanField(blank=True, null=True)),
                ('tiempo_forma_hacerse_danio_suicidio', models.TextField(blank=True, null=True)),
                ('familia_suicidio', models.BooleanField(blank=True, null=True)),
                ('nombre_padre', models.CharField(blank=True, max_length=255, null=True)),
                ('edad_padre', models.IntegerField(blank=True, null=True)),
                ('ocupacion_padre', models.CharField(blank=True, max_length=255, null=True)),
                ('grado_estudio_padre', models.CharField(blank=True, max_length=255, null=True)),
                ('estado_salud_padre', models.CharField(blank=True, max_length=255, null=True)),
                ('edad_murio_padre', models.IntegerField(blank=True, null=True)),
                ('causa_muerte_padre', models.CharField(blank=True, max_length=255, null=True)),
                ('edad_hijo_morir_padre', models.IntegerField(blank=True, null=True)),
                ('nombre_madre', models.CharField(blank=True, max_length=255, null=True)),
                ('edad_madre', models.IntegerField(blank=True, null=True)),
                ('ocupacion_madre', models.CharField(blank=True, max_length=255, null=True)),
                ('grado_estudio_madre', models.CharField(blank=True, max_length=255, null=True)),
                ('estado_salud_madre', models.CharField(blank=True, max_length=255, null=True)),
                ('edad_murio_madre', models.IntegerField(blank=True, null=True)),
                ('causa_muerte_madre', models.CharField(blank=True, max_length=255, null=True)),
                ('edad_hijo_morir_madre', models.IntegerField(blank=True, null=True)),
                ('cant_hermanos', models.IntegerField(blank=True, null=True)),
                ('edades_hermanos', models.CharField(blank=True, max_length=255, null=True)),
                ('detalles_padres_hermanos', models.TextField(blank=True, null=True)),
                ('con_quien_crecio', models.TextField(blank=True, null=True)),
                ('person_actitud_padre', models.TextField(blank=True, null=True)),
                ('person_actitud_madre', models.TextField(blank=True, null=True)),
                ('forma_castigado_padres', models.TextField(blank=True, null=True)),
                ('atmosfera_casa', models.TextField(blank=True, null=True)),
                ('confia_padres', models.BooleanField(blank=True, null=True)),
                ('edad_casar_padres', models.IntegerField()),
                ('siente_amor_padres', models.BooleanField(blank=True, null=True)),
                ('familia_interferir_matrimonio', models.BooleanField(blank=True, null=True)),
                ('desc_natu_prob', models.TextField(blank=True, null=True)),
                ('empezar_prob', models.TextField(blank=True, null=True)),
                ('empeora_prob', models.TextField(blank=True, null=True)),
                ('mejora_prob', models.TextField(blank=True, null=True)),
                ('desc_problema_sec3', models.IntegerField(blank=True, null=True)),
                ('satisf_vida_todo', models.IntegerField(blank=True, null=True)),
                ('nivel_tension_mes_pasado', models.IntegerField(blank=True, null=True)),
                ('piensa_espera_terapia', models.TextField(blank=True, null=True)),
                ('caract_posee_terapeuta', models.TextField(blank=True, null=True)),
                ('tiempo_terapia', models.CharField(blank=True, max_length=255, null=True)),
                ('talentos_habilidades', models.TextField(blank=True, null=True)),
                ('gustaria_dejar_hacer', models.TextField(blank=True, null=True)),
                ('gustaria_empezar_hacer', models.TextField(blank=True, null=True)),
                ('actividades_relajarse', models.TextField(blank=True, null=True)),
                ('tiempo_libre', models.TextField(blank=True, null=True)),
                ('dos_deseos', models.TextField(blank=True, null=True)),
                ('prob_relajarse', models.BooleanField(blank=True, null=True)),
                ('cinco_miedos', models.TextField(blank=True, null=True)),
                ('perder_control_sentimientos', models.TextField(blank=True, null=True)),
                ('sentimientos_positivos_recientes', models.TextField(blank=True, null=True)),
                ('situacion_calmado_relajado', models.TextField(blank=True, null=True)),
                ('sensaciones_placenteras', models.TextField(blank=True, null=True)),
                ('sensaciones_no_placenteras', models.TextField(blank=True, null=True)),
                ('img_fantasia_placentera', models.TextField(blank=True, null=True)),
                ('img_fantasia_no_placentera', models.TextField(blank=True, null=True)),
                ('img_molesta_func_cotidiano', models.TextField(blank=True, null=True)),
                ('pesadillas_seguidas', models.TextField(blank=True, null=True)),
                ('idea_mas_loca', models.TextField(blank=True, null=True)),
                ('afectar_negativamente_humor', models.TextField(blank=True, null=True)),
                ('pensamientos_vuelven_vuelve', models.BooleanField(blank=True, null=True)),
                ('no_cometer_errores', models.IntegerField(blank=True, null=True)),
                ('bueno_todo', models.IntegerField(blank=True, null=True)),
                ('no_relevar_info_pers', models.IntegerField(blank=True, null=True)),
                ('aparentar_saber', models.IntegerField(blank=True, null=True)),
                ('victima_circunstancias', models.IntegerField(blank=True, null=True)),
                ('pers_mas_felices_yo', models.IntegerField(blank=True, null=True)),
                ('complacer_otras_personas', models.IntegerField(blank=True, null=True)),
                ('no_tomar_riesgos', models.IntegerField(blank=True, null=True)),
                ('vida_controlada_fuerzas_exter', models.IntegerField(blank=True, null=True)),
                ('no_merezco_feliz', models.IntegerField(blank=True, null=True)),
                ('ignoro_problemas', models.IntegerField(blank=True, null=True)),
                ('hacer_felices_otros', models.IntegerField(blank=True, null=True)),
                ('trabajar_duro_perfeccion', models.IntegerField(blank=True, null=True)),
                ('formas_hacer_cosas', models.IntegerField(blank=True, null=True)),
                ('nunca_molesto', models.IntegerField(blank=True, null=True)),
                ('hace_amigos_facil', models.BooleanField(blank=True, null=True)),
                ('conserva_amigos', models.BooleanField(blank=True, null=True)),
                ('citas_estudiante_secundaria', models.BooleanField(blank=True, null=True)),
                ('citas_estudiante_preparatoria', models.BooleanField(blank=True, null=True)),
                ('relacion_alergias', models.TextField(blank=True, null=True)),
                ('relacion_problemas', models.TextField(blank=True, null=True)),
                ('grado_situaciones_sociales', models.IntegerField(blank=True, null=True)),
                ('tiempo_pareja_antes_casarse', models.CharField(blank=True, max_length=255, null=True)),
                ('tiempo_comprometido_antes_casarse', models.CharField(blank=True, max_length=255, null=True)),
                ('tiempo_mujer', models.CharField(blank=True, max_length=255, null=True)),
                ('edad_pareja', models.CharField(blank=True, max_length=255, null=True)),
                ('ocupacion_pareja', models.CharField(blank=True, max_length=255, null=True)),
                ('personalidad_pareja', models.CharField(blank=True, max_length=255, null=True)),
                ('mas_gusta_pareja', models.TextField(blank=True, null=True)),
                ('menos_gusta_pareja', models.TextField(blank=True, null=True)),
                ('factores_disminuyen_satisf_pareja', models.TextField(blank=True, null=True)),
                ('detalle_signif_pareja_anterior', models.TextField(blank=True, null=True)),
                ('grado_satisf_pareja', models.IntegerField(blank=True, null=True)),
                ('amigos_familiares_pareja', models.IntegerField(blank=True, null=True)),
                ('datos_hijos_tiene', models.TextField(blank=True, null=True)),
                ('hijos_con_problema', models.BooleanField(blank=True, null=True)),
                ('problemas_de_hijos', models.CharField(blank=True, max_length=255, null=True)),
                ('actitud_padres_sexo', models.TextField(blank=True, null=True)),
                ('detalle_sexo_casa', models.TextField(blank=True, null=True)),
                ('primeros_conoc_sobre_sexo', models.TextField(blank=True, null=True)),
                ('impulsos_sexuales', models.TextField(blank=True, null=True)),
                ('pena_acerca_sexo', models.BooleanField(blank=True, null=True)),
                ('detalle_pena_acerca_sexo', models.TextField(blank=True, null=True)),
                ('visa_sexual_satisf', models.BooleanField(blank=True, null=True)),
                ('detalles_visa_sexual_satisf', models.TextField(blank=True, null=True)),
                ('reaccion_relacion_homosexual', models.TextField(blank=True, null=True)),
                ('info_sexual_relevante', models.TextField(blank=True, null=True)),
                ('probl_relac_personas_trabj', models.BooleanField(blank=True, null=True)),
                ('detalles_probl_relac_personas_trabj', models.TextField(blank=True, null=True)),
                ('forma_me_lastima', models.TextField(blank=True, null=True)),
                ('pareja_describe_como', models.TextField(blank=True, null=True)),
                ('gente_no_gusta_es', models.TextField(blank=True, null=True)),
                ('alterar_alguien_haciendo', models.TextField(blank=True, null=True)),
                ('mejor_amigo_piensa_soy', models.TextField(blank=True, null=True)),
                ('prob_por_rechazo_amoroso', models.BooleanField(blank=True, null=True)),
                ('detalle_prob_por_rechazo_amoroso', models.TextField(blank=True, null=True)),
                ('prob_salud_fisica', models.BooleanField(blank=True, null=True)),
                ('detalle_prob_salud_fisica', models.TextField(blank=True, null=True)),
                ('medicamentos_actuales', models.TextField(blank=True, null=True)),
                ('dieta_balanceada_trees_veces_dia', models.BooleanField(blank=True, null=True)),
                ('prob_medicos_haya_padecido', models.TextField(blank=True, null=True)),
                ('practica_ejerc_fisico', models.BooleanField(blank=True, null=True)),
                ('tipo_frecuencia_ejerc_fisico', models.TextField(blank=True, null=True)),
                ('operado', models.BooleanField(blank=True, null=True)),
                ('tipo_fecha_cirugia', models.TextField(blank=True, null=True)),
                ('prob_medicos_familia', models.TextField(blank=True, null=True)),
                ('edad_primera_menstruacion', models.IntegerField(blank=True, null=True)),
                ('probl_menstruaciones', models.BooleanField(blank=True, null=True)),
                ('periodos_regulares', models.BooleanField(blank=True, null=True)),
                ('conoce_menstruacion', models.BooleanField(blank=True, null=True)),
                ('menstuacion_dolor', models.BooleanField(blank=True, null=True)),
                ('duracion_periodos', models.CharField(blank=True, max_length=255, null=True)),
                ('fecha_ultima_menstruacion', models.DateTimeField(blank=True, null=True)),
                ('debilidad_muscular', models.IntegerField(blank=True, null=True)),
                ('tranquilizantes', models.IntegerField(blank=True, null=True)),
                ('diureticos', models.IntegerField(blank=True, null=True)),
                ('pastillas_adelgazar', models.IntegerField(blank=True, null=True)),
                ('marihuana', models.IntegerField(blank=True, null=True)),
                ('hormonas', models.IntegerField(blank=True, null=True)),
                ('pastillas_dormir', models.IntegerField(blank=True, null=True)),
                ('aspirinas', models.IntegerField(blank=True, null=True)),
                ('cocaina', models.IntegerField(blank=True, null=True)),
                ('analgesicos', models.IntegerField(blank=True, null=True)),
                ('narcoticos', models.IntegerField(blank=True, null=True)),
                ('estimulantes', models.IntegerField(blank=True, null=True)),
                ('alucinogenos', models.IntegerField(blank=True, null=True)),
                ('laxantes', models.IntegerField(blank=True, null=True)),
                ('cigarrillos', models.IntegerField(blank=True, null=True)),
                ('tabaco', models.IntegerField(blank=True, null=True)),
                ('cafe', models.IntegerField(blank=True, null=True)),
                ('alcohol', models.IntegerField(blank=True, null=True)),
                ('anticonceptivos_orales', models.IntegerField(blank=True, null=True)),
                ('vitaminas', models.IntegerField(blank=True, null=True)),
                ('escasa_alimentacion', models.IntegerField(blank=True, null=True)),
                ('alimentacion_abundante', models.IntegerField(blank=True, null=True)),
                ('comida_chatarra', models.IntegerField(blank=True, null=True)),
                ('diarrea', models.IntegerField(blank=True, null=True)),
                ('estrenimiento', models.IntegerField(blank=True, null=True)),
                ('gases', models.IntegerField(blank=True, null=True)),
                ('indigestion', models.IntegerField(blank=True, null=True)),
                ('nauseas', models.IntegerField(blank=True, null=True)),
                ('vomitos', models.IntegerField(blank=True, null=True)),
                ('agruras', models.IntegerField(blank=True, null=True)),
                ('mareos', models.IntegerField(blank=True, null=True)),
                ('palpitaciones', models.IntegerField(blank=True, null=True)),
                ('fatiga', models.IntegerField(blank=True, null=True)),
                ('alergias', models.IntegerField(blank=True, null=True)),
                ('presion_arterial_alta', models.IntegerField(blank=True, null=True)),
                ('dolor_pecho', models.IntegerField(blank=True, null=True)),
                ('respiracion_cortada', models.IntegerField(blank=True, null=True)),
                ('insomnio', models.IntegerField(blank=True, null=True)),
                ('dormir_mas_tiempo', models.IntegerField(blank=True, null=True)),
                ('dormir_ratos', models.IntegerField(blank=True, null=True)),
                ('despertarse_temprano', models.IntegerField(blank=True, null=True)),
                ('dolor_oido', models.IntegerField(blank=True, null=True)),
                ('dolor_cabeza', models.IntegerField(blank=True, null=True)),
                ('dolor_espalda', models.IntegerField(blank=True, null=True)),
                ('moretones_sangrado', models.IntegerField(blank=True, null=True)),
                ('prob_peso', models.IntegerField(blank=True, null=True)),
                ('otros_fact_biolg', models.TextField(blank=True, null=True)),
                ('observaciones', models.TextField(blank=True, null=True)),
                ('aplicado_por', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='persona_app.persona')),
                ('atencion', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='atencion_psicologica_app.atencion_psicologica')),
                ('carrera', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='licenciatura_app.licenciatura')),
                ('estado_civil', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='estado_civil_app.estado_civil')),
                ('estado_nac', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='estado_app.estado')),
                ('grado_est', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='grado_academico_app.grado_academico')),
                ('municipio_nac', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='municipio_app.municipio')),
                ('religion', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='religion_app.religion')),
                ('vive_con', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='vive_con_app.vive_con')),
                ('vive_en', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='vive_en_app.vive_en')),
            ],
            options={
                'verbose_name': 'historia_clinica',
                'verbose_name_plural': 'Historia Clinica',
                'ordering': ['id'],
            },
        ),
    ]