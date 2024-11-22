import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from datetime import datetime
from decimal import Decimal
from django.views.generic import CreateView, TemplateView
from .models import historia_clinica, atencion_psicologica, caracteristicas_infancia_adolescencia, estado, estado_civil, grado_academico, licenciatura, modalidad_conductas, modalidad_imagenes_me_veo, modalidad_imagenes_tengo, modalidad_pensamientos, modalidad_sensaciones_fisicas, modalidad_sentimientos, municipio, persona, religion, vive_con, vive_en
from usuario_app.models import Usuario
from persona_app.views import editarPersona


# Create your views here.
# redefiniendo metodo is_ajax()
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class agregarEditarHistoriaClinica(CreateView):
    model = historia_clinica

    def get(self, request, *args, **kwargs):
        dataDic = {}
        dataPersonaDic = {}
        params = request.GET.get('params', '')
        datos_hc = json.loads(params)
        accion = datos_hc.get('accion')
        id_atencion = datos_hc.get('id_atencion')
        id_usuario_autenticado = datos_hc.get(
            'id_usuario_autenticado')  # actualizar la persona
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)

        # listas checkBoxs
        listChecksInfanciaAdoles = datos_hc.get('listChecksInfanciaAdoles')
        listChecksConductas = datos_hc.get('listChecksConductas')
        listChecksSentimientos = datos_hc.get('listChecksSentimientos')
        listChecksSensaFisicas = datos_hc.get('listChecksSensaFisicas')
        listChecksImgMeVeo = datos_hc.get('listChecksImgMeVeo')
        listChecksImgTengo = datos_hc.get('listChecksImgTengo')
        listChecksPensamientos = datos_hc.get('listChecksPensamientos')
        # campos otros de las listas checkBoxs
        infancia_adolescencia_otros = datos_hc.get('infancia_adolescencia_otros')
        conducta_otros = datos_hc.get('conducta_otros')
        sentimientos_otros = datos_hc.get('sentimientos_otros')
        sensaciones_fisicas_otros = datos_hc.get('sensaciones_fisicas_otros')
        imag_me_veo_otros_hc = datos_hc.get('imag_me_veo_otros_hc')
        imag_tengo_otros_hc = datos_hc.get('imag_tengo_otros_hc')
        pensamiento_otros_hc = datos_hc.get('pensamiento_otros_hc')
        # datos del formulario
        lista_datos_hc = datos_hc.get('datos')

        for item in lista_datos_hc:
          dataDic[item['name']] = item['value']

        id_estado_nac = dataDic['estado_nacimiento_hc']
        id_municipio_nac = dataDic['municipio_nacimiento_hc']
        id_licenciatura = dataDic['carrera_cursa_hc']
        carrera = licenciatura.objects.get(id=id_licenciatura)
        fecha_nacimiento_persona = datetime.strptime(
            dataDic['fecha_nacimiento_hc'], '%d/%m/%Y')
        id_vive_en = dataDic['vive_en_hc']
        id_vive_con = dataDic['vive_con_hc']
        id_religion = dataDic['religion_hc']
        id_grado_academico = dataDic['grado_academico_hc']
        id_estado_civil = dataDic['estado_civil_hc']
        estado_obj = None if id_estado_nac == 'sel' or id_estado_nac == '-' else estado.objects.get(
            id=id_estado_nac)
        municipio_obj = None if id_municipio_nac == 'sel' or id_municipio_nac == '-' else municipio.objects.get(
            id=id_municipio_nac)
        vive_en_obj = None if id_vive_en == 'sel' or id_vive_en == '-' else vive_en.objects.get(
            id=id_vive_en)
        vive_con_obj = None if id_vive_con == 'sel' or id_vive_con == '-' else vive_con.objects.get(
            id=id_vive_con)
        religion_obj = None if id_religion == 'sel' or id_religion == '-' else religion.objects.get(
            id=id_religion)
        grado_academico_obj = None if id_grado_academico == 'sel' or id_grado_academico == '-' else grado_academico.objects.get(
            id=id_grado_academico)
        estado_civil_obj = None if id_estado_civil == 'sel' or id_estado_civil == '-' else estado_civil.objects.get(
            id=id_estado_civil)
        fecha_ultima_menstruacion = datetime.strptime(dataDic['fecha_ultima_menst_hc'], '%d/%m/%Y') if dataDic['fecha_ultima_menst_hc'] != '' else None
        peso = Decimal(dataDic['peso_hc']) if dataDic['peso_hc'] != '' else -1
        estatura = Decimal(dataDic['estatura_hc']) if dataDic['estatura_hc'] != '' else -1
        edad_padre = dataDic['edad_padre_hc'] if dataDic['edad_padre_hc'] != '' else None
        edad_murio_padre = dataDic['edad_muerte_padre_hc'] if dataDic['edad_muerte_padre_hc'] != '' else None
        edad_hijo_morir_padre = dataDic['edad_usted_morir_padre_hc'] if dataDic['edad_usted_morir_padre_hc'] != '' else None
        edad_madre = dataDic['edad_madre_hc'] if dataDic['edad_madre_hc'] != '' else None
        edad_hijo_morir_madre = dataDic['edad_usted_morir_madre_hc'] if dataDic['edad_usted_morir_madre_hc'] != '' else None
        edad_murio_madre = dataDic['edad_muerte_madre_hc'] if dataDic['edad_muerte_madre_hc'] != '' else None
        cant_hermanos = dataDic['cant_hermanos_hc'] if dataDic['cant_hermanos_hc'] != '' else None
        edad_casar_padres = dataDic['padrasto_hc'] if dataDic['padrasto_hc'] != '' else None
        edad_primera_menstruacion = dataDic['edad_menst_hc'] if dataDic['edad_menst_hc'] != '' else None

        try:
            # guardar HC
            if accion == 'agregar':
                # se esta agregando
                obj = historia_clinica.objects.create(
                    estado_nac=estado_obj, municipio_nac=municipio_obj, estado_civil=estado_civil_obj, ocupacion=dataDic['ocupacion_hc'], carrera=carrera, vive_en=vive_en_obj, vive_con=vive_con_obj,
                    religion=religion_obj, grado_est=grado_academico_obj, nombre_emergencia=dataDic['nombre_contacto_hc'], tlf_emergencia=dataDic['telefono_contacto_hc'], pasatiempos=dataDic['pasatiempos_hc'],
                    peso=peso, estatura=estatura, peso_varia=datos_hc.get('peso_varia'), gustar_trabajo=datos_hc.get('gusta_trabajo'), que_hace_trab=dataDic['hace_trabajo_hc'], trab_pasados=dataDic['trabajos_pasados_hc'],
                    terapia_antes=datos_hc.get('terapia_antes'), ayuda_problema=dataDic['tipo_ayuda_hc'], medico_cabecera=datos_hc.get('medico_cabecera'), nombre_medico_cabecera=dataDic['nombre_medico_cabecera_hc'], tlf_medico_cabecera=dataDic['telefono_medico_cabecera_hc'],
                    lugar_terapia_pasada=dataDic['terapias_anteriores_hc'], hosp_prob_psico=datos_hc.get('hospitalizado'), lugar_hosp_prob_psico=dataDic['hospitalizado_anterior_hc'], hacerse_danio_suicidio=datos_hc.get('hacerse_danio_suicidio'),
                    tiempo_forma_hacerse_danio_suicidio=dataDic['danio_afirm_hc'], familia_suicidio=datos_hc.get('familia_intento_suicidio'), nombre_padre=dataDic['nombre_padre_hc'], edad_padre=edad_padre,
                    ocupacion_padre=dataDic['ocupacion_padre_hc'], grado_estudio_padre=dataDic['estudios_padre_hc'], estado_salud_padre=dataDic['estado_salud_padre_hc'], edad_murio_padre=edad_murio_padre,
                    causa_muerte_padre=dataDic['causa_muerte_padre_hc'], edad_hijo_morir_padre=edad_hijo_morir_padre, nombre_madre=dataDic['nombre_madre_hc'], edad_madre=edad_madre,
                    ocupacion_madre=dataDic['ocupacion_madre_hc'], grado_estudio_madre=dataDic['estudios_madre_hc'], estado_salud_madre=dataDic['estado_salud_madre_hc'], edad_murio_madre=edad_murio_madre,
                    causa_muerte_madre=dataDic['causa_muerte_madre_hc'], edad_hijo_morir_madre=edad_hijo_morir_madre, cant_hermanos=cant_hermanos, edades_hermanos=dataDic['edad_hermanos_hc'],
                    detalles_padres_hermanos=dataDic['detalles_sig_hermanos_hc'], con_quien_crecio=dataDic['crecio_con_hc'], person_actitud_padre=dataDic['pers_act_padre_hc'], person_actitud_madre=dataDic['pers_act_madre_hc'],
                    forma_castigado_padres=dataDic['forma_castigo_padre_hc'], atmosfera_casa=dataDic['imp_atm_casa_hc'], confia_padres=datos_hc.get('confia_padres'), edad_casar_padres=edad_casar_padres,
                    siente_amor_padres=datos_hc.get('sentir_amor_padres'), familia_interferir_matrimonio=datos_hc.get('familia_interfiere_matrimonio'), desc_natu_prob=dataDic['problema_actual_hc'], empezar_prob=dataDic['comienzo_problema_hc'], empeora_prob=dataDic['empeora_problema_hc'],
                    mejora_prob=dataDic['mejora_problema_hc'], desc_problema_sec3=datos_hc.get('problema'), satisf_vida_todo=datos_hc.get('satisfecho_vida'), nivel_tension_mes_pasado=datos_hc.get('nivel_tension'), piensa_espera_terapia=dataDic['que_espera_terapia_hc'],
                    caract_posee_terapeuta=dataDic['caract_terapeuta_hc'], tiempo_terapia=dataDic[
                        'cuanto_durara_terapia_hc'], talentos_habilidades=dataDic['talento_cond_hc'], gustaria_dejar_hacer=dataDic['dejar_hacer_cond_hc'],
                    gustaria_empezar_hacer=dataDic['emp_hacer_cond_hc'], actividades_relajarse=dataDic[
                        'pasatiempo_cond_hc'], tiempo_libre=dataDic['tiempo_libre_cond_hc'], dos_deseos=dataDic['deseos_cond_hc'],
                    prob_relajarse=datos_hc.get('problemas_relajarse'), cinco_miedos=dataDic['miedos_sent_hc'], perder_control_sentimientos=dataDic['control_sent_hc'], sentimientos_positivos_recientes=dataDic['posit_sent_hc'],
                    situacion_calmado_relajado=dataDic['situacion_sent_hc'], sensaciones_placenteras=dataDic[
                        'posit_sent_si_hc'], sensaciones_no_placenteras=dataDic['posit_sent_no_hc'],
                    img_fantasia_placentera=dataDic['img_placentera_hc'], img_fantasia_no_placentera=dataDic[
                        'img_nada_placentera_hc'], img_molesta_func_cotidiano=dataDic['img_moleste_hc'],
                    pesadillas_seguidas=dataDic['img_pesadillas_hc'], idea_mas_loca=dataDic[
                        'idea_mas_loca_hc'], afectar_negativamente_humor=dataDic['afectar_negativamente_humor_hc'],
                    pensamientos_vuelven_vuelve=datos_hc.get('pensamientos_vuelven_vuelven'), no_cometer_errores=dataDic['pensamiento_select_1'], bueno_todo=dataDic['pensamiento_select_2'], no_relevar_info_pers=dataDic['pensamiento_select_4'],
                    aparentar_saber=dataDic['pensamiento_select_3'], victima_circunstancias=dataDic['pensamiento_select_5'], pers_mas_felices_yo=dataDic[
                        'pensamiento_select_7'], complacer_otras_personas=dataDic['pensamiento_select_8'],
                    no_tomar_riesgos=dataDic['pensamiento_select_9'], vida_controlada_fuerzas_exter=dataDic[
                        'pensamiento_select_6'], no_merezco_feliz=dataDic['pensamiento_select_10'],
                    ignoro_problemas=dataDic['pensamiento_select_11'], hacer_felices_otros=dataDic[
                        'pensamiento_select_12'], trabajar_duro_perfeccion=dataDic['pensamiento_select_13'],
                    formas_hacer_cosas=dataDic['pensamiento_select_14'], nunca_molesto=dataDic['pensamiento_select_15'], hace_amigos_facil=datos_hc.get('amigos_facil'), conserva_amigos=datos_hc.get('conserva_amigos'), citas_estudiante_secundaria=datos_hc.get('citas_secundaria'), citas_estudiante_preparatoria=datos_hc.get('citas_preparatoria'),
                    relacion_alergias=dataDic['rel_int_relacion_alergia_hc'], relacion_problemas=dataDic['rel_int_relacion_problema_hc'], grado_situaciones_sociales=datos_hc.get('situaciones_sociales'), tiempo_pareja_antes_casarse=dataDic['rel_inte_parj_casado_hc'],
                    tiempo_comprometido_antes_casarse=dataDic['rel_inte_comp_casado_hc'], tiempo_mujer=dataDic[
                        'rel_inte_tiempo_mujer_hc'], edad_pareja=dataDic['rel_inte_edad_pareja_hc'], ocupacion_pareja=dataDic['rel_inte_ocup_pareja_hc'],
                    personalidad_pareja=dataDic['rel_inte_perso_pareja_hc'], mas_gusta_pareja=dataDic[
                        'rel_int_gusta_pareja_hc'], menos_gusta_pareja=dataDic['rel_int_gusta_pareja_menos_hc'],
                    factores_disminuyen_satisf_pareja=dataDic['rel_int_satisf_pareja_hc'], detalle_signif_pareja_anterior=dataDic['rel_int_pareja_anterior_hc'], grado_satisf_pareja=datos_hc.get('satisfaccion_pareja'), amigos_familiares_pareja=datos_hc.get('amigo_familia_pareja'),
                    datos_hijos_tiene=dataDic['cant_hijos_hc'], hijos_con_problema=datos_hc.get('hijos_con_problemas'), actitud_padres_sexo=dataDic['act_padres_sex_hc'], detalle_sexo_casa=dataDic['detalle_sex_hc'], primeros_conoc_sobre_sexo=dataDic['conoc_sex_hc'],
                    impulsos_sexuales=dataDic['impulso_sex_hc'], pena_acerca_sexo=datos_hc.get('pena_sexo'), visa_sexual_satisf=datos_hc.get('vida_sexual_satisf'), reaccion_relacion_homosexual=dataDic['relac_homo_sex_hc'], info_sexual_relevante=dataDic['info_extra_relev_hc'],
                    probl_relac_personas_trabj=datos_hc.get('problemas_relacion_trabajo'), forma_me_lastima=dataDic['gente_lastima_hc'], pareja_describe_como=dataDic['describe_como_hc'], gente_no_gusta_es=dataDic['gente_no_gusta_hc'],
                    alterar_alguien_haciendo=dataDic['alterar_alguien_hc'], mejor_amigo_piensa_soy=dataDic['amigo_piensa_soy_hc'], prob_por_rechazo_amoroso=datos_hc.get('problemas_rechazo_amoroso'), prob_salud_fisica=datos_hc.get('problemas_salud_fisica'), medicamentos_actuales=dataDic['medica_toma_hc'],
                    dieta_balanceada_trees_veces_dia=datos_hc.get('dieta_balanceada'), prob_medicos_haya_padecido=dataDic['prob_medic_hc'], practica_ejerc_fisico=datos_hc.get('pract_ejerc_fisico'), operado=datos_hc.get('operado'), prob_medicos_familia=dataDic['prob_med_familia_hc'],
                    edad_primera_menstruacion=edad_primera_menstruacion, probl_menstruaciones=datos_hc.get('problema_menstruaciones'), periodos_regulares=datos_hc.get('periodos_regulares'), conoce_menstruacion=datos_hc.get('menstruacion_primera_vez'), menstuacion_dolor=datos_hc.get('menstruacion_dolor'), duracion_periodos=dataDic['durac_period_hc'],
                    fecha_ultima_menstruacion=fecha_ultima_menstruacion, debilidad_muscular=dataDic[
                        'fac_biolg_select_1'], tranquilizantes=dataDic['fac_biolg_select_2'], diureticos=dataDic['fac_biolg_select_3'],
                    pastillas_adelgazar=dataDic['fac_biolg_select_4'], marihuana=dataDic['fac_biolg_select_5'], hormonas=dataDic[
                        'fac_biolg_select_6'], pastillas_dormir=dataDic['fac_biolg_select_7'],
                    aspirinas=dataDic['fac_biolg_select_8'], cocaina=dataDic['fac_biolg_select_9'], analgesicos=dataDic[
                        'fac_biolg_select_10'], narcoticos=dataDic['fac_biolg_select_11'],
                    estimulantes=dataDic['fac_biolg_select_12'], alucinogenos=dataDic['fac_biolg_select_13'], laxantes=dataDic[
                        'fac_biolg_select_14'], cigarrillos=dataDic['fac_biolg_select_15'], tabaco=dataDic['fac_biolg_select_16'],
                    cafe=dataDic['fac_biolg_select_17'], alcohol=dataDic['fac_biolg_select_18'], anticonceptivos_orales=dataDic[
                        'fac_biolg_select_19'], vitaminas=dataDic['fac_biolg_select_20'],
                    escasa_alimentacion=dataDic['fac_biolg_select_21'], alimentacion_abundante=dataDic[
                        'fac_biolg_select_22'], comida_chatarra=dataDic['fac_biolg_select_23'], diarrea=dataDic['fac_biolg_select_24'],
                    estrenimiento=dataDic['fac_biolg_select_25'], gases=dataDic['fac_biolg_select_26'], indigestion=dataDic[
                        'fac_biolg_select_27'], nauseas=dataDic['fac_biolg_select_28'],
                    vomitos=dataDic['fac_biolg_select_29'], agruras=dataDic['fac_biolg_select_30'], mareos=dataDic[
                        'fac_biolg_select_31'], palpitaciones=dataDic['fac_biolg_select_32'], fatiga=dataDic['fac_biolg_select_33'],
                    alergias=dataDic['fac_biolg_select_34'], presion_arterial_alta=dataDic['fac_biolg_select_35'], dolor_pecho=dataDic[
                        'fac_biolg_select_36'], respiracion_cortada=dataDic['fac_biolg_select_37'],
                    insomnio=dataDic['fac_biolg_select_38'], dormir_mas_tiempo=dataDic['fac_biolg_select_39'], dormir_ratos=dataDic[
                        'fac_biolg_select_40'], despertarse_temprano=dataDic['fac_biolg_select_40'],
                    dolor_oido=dataDic['fac_biolg_select_42'], dolor_cabeza=dataDic['fac_biolg_select_44'], dolor_espalda=dataDic[
                        'fac_biolg_select_45'], moretones_sangrado=dataDic['fac_biolg_select_46'], menst_afecta_animo=datos_hc.get('menst_afecta_animo'),
                    prob_peso=dataDic['fac_biolg_select_47'], otros_fact_biolg=dataDic[
                        'otros_fact_biolg_hc'], observaciones=dataDic['observaciones_hc'], detalle_primera_exp_sexual=dataDic['detalle_primera_exp_sexual_hc'],
                    problemas_de_hijos=datos_hc.get('detalle_prob_hijo'), detalles_probl_relac_personas_trabj=datos_hc.get('detalle_rel_trabj'), detalle_pena_acerca_sexo=datos_hc.get('detalle_pena_sex'), detalles_visa_sexual_satisf=datos_hc.get('detalle_vida_sex_satisf'),
                    detalle_prob_por_rechazo_amoroso=datos_hc.get('detalle_rech_frac_amor'), detalle_prob_salud_fisica=datos_hc.get('detalle_prob_salud_fis'), tipo_frecuencia_ejerc_fisico=datos_hc.get('detalle_ejerc_fis'),
                    tipo_fecha_cirugia=datos_hc.get('detalle_operado'), aplicado_por=Usuario.objects.get(id=id_usuario_autenticado).persona, atencion=atencion_obj, quien_lo_envia=dataDic['quien_lo_envia_hc'], prob_emocion_mental=datos_hc.get('prob_emocion_mental'), cuales_pensamto_vuelven=dataDic['cuales_pensamto_vuelven_hc'])

                agregarCaracteristicaInfanciaAdolescencia(listChecksInfanciaAdoles, obj, infancia_adolescencia_otros)
                agregarModalidadConductas(listChecksConductas, obj, conducta_otros)
                agregarModalidadImagenesMeVeo(listChecksImgMeVeo, obj, imag_me_veo_otros_hc)
                agregarModalidadImagenesTengo(listChecksImgTengo, obj, imag_tengo_otros_hc)
                agregarModalidadPensamientos(listChecksPensamientos, obj, pensamiento_otros_hc)
                agregarModalidadSensacionesFisicas(listChecksSensaFisicas, obj, sensaciones_fisicas_otros)
                agregarModalidadSentimientos(listChecksSentimientos, obj, sentimientos_otros)

                mensaje = 'Se ha guardado correctamente la Historia Clínica.'
                tipo_mensaje = 'success'
                accion = 'agregar'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result
            elif accion == 'editar':
                # se esta editando
                hc = historia_clinica.objects.get(atencion=atencion_obj)
                hc.estado_nac=estado_obj
                hc.municipio_nac=municipio_obj
                hc.estado_civil=estado_civil_obj
                hc.ocupacion=dataDic['ocupacion_hc']
                hc.carrera=carrera
                hc.vive_en=vive_en_obj
                hc.vive_con=vive_con_obj
                hc.religion=religion_obj
                hc.grado_est=grado_academico_obj
                hc.nombre_emergencia=dataDic['nombre_contacto_hc']
                hc.tlf_emergencia=dataDic['telefono_contacto_hc']
                hc.pasatiempos=dataDic['pasatiempos_hc']
                hc.peso=peso
                hc.estatura=estatura
                hc.peso_varia=datos_hc.get('peso_varia')
                hc.gustar_trabajo=datos_hc.get('gusta_trabajo')
                hc.que_hace_trab=dataDic['hace_trabajo_hc']
                hc.trab_pasados=dataDic['trabajos_pasados_hc']
                hc.terapia_antes=datos_hc.get('terapia_antes')
                hc.ayuda_problema=dataDic['tipo_ayuda_hc']
                hc.medico_cabecera=datos_hc.get('medico_cabecera')
                hc.nombre_medico_cabecera=dataDic['nombre_medico_cabecera_hc']
                hc.tlf_medico_cabecera=dataDic['telefono_medico_cabecera_hc']
                hc.lugar_terapia_pasada=dataDic['terapias_anteriores_hc']
                hc.hosp_prob_psico=datos_hc.get('hospitalizado')
                hc.lugar_hosp_prob_psico=dataDic['hospitalizado_anterior_hc']
                hc.hacerse_danio_suicidio=datos_hc.get('hacerse_danio_suicidio')
                hc.tiempo_forma_hacerse_danio_suicidio=dataDic['danio_afirm_hc']
                hc.familia_suicidio=datos_hc.get('familia_intento_suicidio')
                hc.nombre_padre=dataDic['nombre_padre_hc']
                hc.edad_padre=edad_padre
                hc.ocupacion_padre=dataDic['ocupacion_padre_hc']
                hc.grado_estudio_padre=dataDic['estudios_padre_hc']
                hc.estado_salud_padre=dataDic['estado_salud_padre_hc']
                hc.edad_murio_padre=edad_murio_padre
                hc.causa_muerte_padre=dataDic['causa_muerte_padre_hc']
                hc.edad_hijo_morir_padre=edad_hijo_morir_padre
                hc.nombre_madre=dataDic['nombre_madre_hc'] 
                hc.edad_madre=edad_madre
                hc.ocupacion_madre=dataDic['ocupacion_madre_hc']
                hc.grado_estudio_madre=dataDic['estudios_madre_hc']
                hc.estado_salud_madre=dataDic['estado_salud_madre_hc']
                hc.edad_murio_madre=edad_murio_madre
                hc.causa_muerte_madre=dataDic['causa_muerte_madre_hc']
                hc.edad_hijo_morir_madre=edad_hijo_morir_madre
                hc.cant_hermanos=cant_hermanos
                hc.edades_hermanos=dataDic['edad_hermanos_hc']
                hc.detalles_padres_hermanos=dataDic['detalles_sig_hermanos_hc']
                hc.con_quien_crecio=dataDic['crecio_con_hc']
                hc.person_actitud_padre=dataDic['pers_act_padre_hc']
                hc.person_actitud_madre=dataDic['pers_act_madre_hc']
                hc.forma_castigado_padres=dataDic['forma_castigo_padre_hc']
                hc.atmosfera_casa=dataDic['imp_atm_casa_hc']
                hc.confia_padres=datos_hc.get('confia_padres')
                hc.edad_casar_padres=edad_casar_padres
                hc.siente_amor_padres=datos_hc.get('sentir_amor_padres')
                hc.familia_interferir_matrimonio=datos_hc.get('familia_interfiere_matrimonio')
                hc.desc_natu_prob=dataDic['problema_actual_hc']
                hc.empezar_prob=dataDic['comienzo_problema_hc']
                hc.empeora_prob=dataDic['empeora_problema_hc']
                hc.mejora_prob=dataDic['mejora_problema_hc']
                hc.desc_problema_sec3=datos_hc.get('problema')
                hc.satisf_vida_todo=datos_hc.get('satisfecho_vida')
                hc.nivel_tension_mes_pasado=datos_hc.get('nivel_tension')
                hc.piensa_espera_terapia=dataDic['que_espera_terapia_hc']
                hc.caract_posee_terapeuta=dataDic['caract_terapeuta_hc']
                hc.tiempo_terapia=dataDic['cuanto_durara_terapia_hc']
                hc.talentos_habilidades=dataDic['talento_cond_hc']
                hc.gustaria_dejar_hacer=dataDic['dejar_hacer_cond_hc']
                hc.gustaria_empezar_hacer=dataDic['emp_hacer_cond_hc']
                hc.actividades_relajarse=dataDic['pasatiempo_cond_hc']
                hc.tiempo_libre=dataDic['tiempo_libre_cond_hc']
                hc.dos_deseos=dataDic['deseos_cond_hc']
                hc.prob_relajarse=datos_hc.get('problemas_relajarse')
                hc.cinco_miedos=dataDic['miedos_sent_hc']
                hc.perder_control_sentimientos=dataDic['control_sent_hc']
                hc.sentimientos_positivos_recientes=dataDic['posit_sent_hc']
                hc.situacion_calmado_relajado=dataDic['situacion_sent_hc']
                hc.sensaciones_placenteras=dataDic['posit_sent_si_hc']
                hc.sensaciones_no_placenteras=dataDic['posit_sent_no_hc']
                hc.img_fantasia_placentera=dataDic['img_placentera_hc']
                hc.img_fantasia_no_placentera=dataDic['img_nada_placentera_hc']
                hc.img_molesta_func_cotidiano=dataDic['img_moleste_hc']
                hc.pesadillas_seguidas=dataDic['img_pesadillas_hc']
                hc.idea_mas_loca=dataDic['idea_mas_loca_hc']
                hc.afectar_negativamente_humor=dataDic['afectar_negativamente_humor_hc']
                hc.pensamientos_vuelven_vuelve=datos_hc.get('pensamientos_vuelven_vuelven')
                hc.no_cometer_errores=dataDic['pensamiento_select_1']
                hc.bueno_todo=dataDic['pensamiento_select_2']
                hc.no_relevar_info_pers=dataDic['pensamiento_select_4']
                hc.aparentar_saber=dataDic['pensamiento_select_3']
                hc.victima_circunstancias=dataDic['pensamiento_select_5']
                hc.pers_mas_felices_yo=dataDic['pensamiento_select_7']
                hc.complacer_otras_personas=dataDic['pensamiento_select_8']
                hc.no_tomar_riesgos=dataDic['pensamiento_select_9']
                hc.vida_controlada_fuerzas_exter=dataDic['pensamiento_select_6']
                hc.no_merezco_feliz=dataDic['pensamiento_select_10']
                hc.ignoro_problemas=dataDic['pensamiento_select_11']
                hc.hacer_felices_otros=dataDic['pensamiento_select_12']
                hc.trabajar_duro_perfeccion=dataDic['pensamiento_select_13']
                hc.formas_hacer_cosas=dataDic['pensamiento_select_14']
                hc.nunca_molesto=dataDic['pensamiento_select_15']
                hc.hace_amigos_facil=datos_hc.get('amigos_facil')
                hc.conserva_amigos=datos_hc.get('conserva_amigos')
                hc.citas_estudiante_secundaria=datos_hc.get('citas_secundaria')
                hc.citas_estudiante_preparatoria=datos_hc.get('citas_preparatoria')
                hc.relacion_alergias=dataDic['rel_int_relacion_alergia_hc']
                hc.relacion_problemas=dataDic['rel_int_relacion_problema_hc']
                hc.grado_situaciones_sociales=datos_hc.get('situaciones_sociales')
                hc.tiempo_pareja_antes_casarse=dataDic['rel_inte_parj_casado_hc']
                hc.tiempo_comprometido_antes_casarse=dataDic['rel_inte_comp_casado_hc']
                hc.tiempo_mujer=dataDic['rel_inte_tiempo_mujer_hc']
                hc.edad_pareja=dataDic['rel_inte_edad_pareja_hc']
                hc.ocupacion_pareja=dataDic['rel_inte_ocup_pareja_hc']
                hc.personalidad_pareja=dataDic['rel_inte_perso_pareja_hc']
                hc.mas_gusta_pareja=dataDic['rel_int_gusta_pareja_hc']
                hc.menos_gusta_pareja=dataDic['rel_int_gusta_pareja_menos_hc']
                hc.factores_disminuyen_satisf_pareja=dataDic['rel_int_satisf_pareja_hc']
                hc.detalle_signif_pareja_anterior=dataDic['rel_int_pareja_anterior_hc']
                hc.grado_satisf_pareja=datos_hc.get('satisfaccion_pareja')
                hc.amigos_familiares_pareja=datos_hc.get('amigo_familia_pareja')
                hc.datos_hijos_tiene=dataDic['cant_hijos_hc']
                hc.hijos_con_problema=datos_hc.get('hijos_con_problemas')
                hc.actitud_padres_sexo=dataDic['act_padres_sex_hc']
                hc.detalle_sexo_casa=dataDic['detalle_sex_hc']
                hc.primeros_conoc_sobre_sexo=dataDic['conoc_sex_hc']
                hc.impulsos_sexuales=dataDic['impulso_sex_hc']
                hc.pena_acerca_sexo=datos_hc.get('pena_sexo')
                hc.visa_sexual_satisf=datos_hc.get('vida_sexual_satisf')
                hc.reaccion_relacion_homosexual=dataDic['relac_homo_sex_hc']
                hc.info_sexual_relevante=dataDic['info_extra_relev_hc']
                hc.probl_relac_personas_trabj=datos_hc.get('problemas_relacion_trabajo')
                hc.forma_me_lastima=dataDic['gente_lastima_hc']
                hc.pareja_describe_como=dataDic['describe_como_hc']
                hc.gente_no_gusta_es=dataDic['gente_no_gusta_hc']
                hc.alterar_alguien_haciendo=dataDic['alterar_alguien_hc']
                hc.mejor_amigo_piensa_soy=dataDic['amigo_piensa_soy_hc']
                hc.prob_por_rechazo_amoroso=datos_hc.get('problemas_rechazo_amoroso')
                hc.prob_salud_fisica=datos_hc.get('problemas_salud_fisica')
                hc.medicamentos_actuales=dataDic['medica_toma_hc']
                hc.dieta_balanceada_trees_veces_dia=datos_hc.get('dieta_balanceada')
                hc.prob_medicos_haya_padecido=dataDic['prob_medic_hc']
                hc.practica_ejerc_fisico=datos_hc.get('pract_ejerc_fisico')
                hc.operado=datos_hc.get('operado')
                hc.prob_medicos_familia=dataDic['prob_med_familia_hc']
                hc.edad_primera_menstruacion=edad_primera_menstruacion
                hc.probl_menstruaciones=datos_hc.get('problema_menstruaciones')
                hc.periodos_regulares=datos_hc.get('periodos_regulares')
                hc.menst_afecta_animo=datos_hc.get('menst_afecta_animo')
                hc.conoce_menstruacion=datos_hc.get('menstruacion_primera_vez')
                hc.menstuacion_dolor=datos_hc.get('menstruacion_dolor')
                hc.duracion_periodos=dataDic['durac_period_hc']
                hc.fecha_ultima_menstruacion=fecha_ultima_menstruacion
                hc.debilidad_muscular=dataDic['fac_biolg_select_1']
                hc.tranquilizantes=dataDic['fac_biolg_select_2']
                hc.diureticos=dataDic['fac_biolg_select_3']
                hc.pastillas_adelgazar=dataDic['fac_biolg_select_4']
                hc.marihuana=dataDic['fac_biolg_select_5']
                hc.hormonas=dataDic['fac_biolg_select_6']
                hc.pastillas_dormir=dataDic['fac_biolg_select_7']
                hc.aspirinas=dataDic['fac_biolg_select_8']
                hc.cocaina=dataDic['fac_biolg_select_9']
                hc.analgesicos=dataDic['fac_biolg_select_10']
                hc.narcoticos=dataDic['fac_biolg_select_11']
                hc.estimulantes=dataDic['fac_biolg_select_12']
                hc.alucinogenos=dataDic['fac_biolg_select_13']
                hc.laxantes=dataDic['fac_biolg_select_14']
                hc.cigarrillos=dataDic['fac_biolg_select_15']
                hc.tabaco=dataDic['fac_biolg_select_16']
                hc.cafe=dataDic['fac_biolg_select_17']
                hc.alcohol=dataDic['fac_biolg_select_18']
                hc.anticonceptivos_orales=dataDic['fac_biolg_select_19']
                hc.vitaminas=dataDic['fac_biolg_select_20']
                hc.escasa_alimentacion=dataDic['fac_biolg_select_21']
                hc.alimentacion_abundante=dataDic['fac_biolg_select_22']
                hc.comida_chatarra=dataDic['fac_biolg_select_23']
                hc.diarrea=dataDic['fac_biolg_select_24']
                hc.estrenimiento=dataDic['fac_biolg_select_25']
                hc.gases=dataDic['fac_biolg_select_26']
                hc.indigestion=dataDic['fac_biolg_select_27']
                hc.nauseas=dataDic['fac_biolg_select_28']
                hc.vomitos=dataDic['fac_biolg_select_29']
                hc.agruras=dataDic['fac_biolg_select_30']
                hc.mareos=dataDic['fac_biolg_select_31']
                hc.palpitaciones=dataDic['fac_biolg_select_32']
                hc.fatiga=dataDic['fac_biolg_select_33']
                hc.alergias=dataDic['fac_biolg_select_34']
                hc.presion_arterial_alta=dataDic['fac_biolg_select_35']
                hc.dolor_pecho=dataDic['fac_biolg_select_36']
                hc.respiracion_cortada=dataDic['fac_biolg_select_37']
                hc.insomnio=dataDic['fac_biolg_select_38']
                hc.dormir_mas_tiempo=dataDic['fac_biolg_select_39']
                hc.dormir_ratos=dataDic['fac_biolg_select_40']
                hc.despertarse_temprano=dataDic['fac_biolg_select_40']
                hc.dolor_oido=dataDic['fac_biolg_select_42']
                hc.dolor_cabeza=dataDic['fac_biolg_select_44']
                hc.dolor_espalda=dataDic['fac_biolg_select_45']
                hc.moretones_sangrado=dataDic['fac_biolg_select_46']
                hc.prob_peso=dataDic['fac_biolg_select_47']
                hc.otros_fact_biolg=dataDic['otros_fact_biolg_hc']
                hc.observaciones=dataDic['observaciones_hc']
                hc.problemas_de_hijos=datos_hc.get('prob_hijo_hc')
                hc.detalles_probl_relac_personas_trabj=datos_hc.get('detalle_rel_trabj')
                hc.detalle_pena_acerca_sexo=datos_hc.get('detalle_pena_sex')
                hc.detalles_visa_sexual_satisf=datos_hc.get('detalle_vida_sex_satisf')
                hc.detalle_prob_por_rechazo_amoroso=datos_hc.get('detalle_rech_frac_amor')
                hc.detalle_prob_salud_fisica=datos_hc.get('detalle_prob_salud_fis')
                hc.tipo_frecuencia_ejerc_fisico=datos_hc.get('detalle_ejerc_fis')
                hc.tipo_fecha_cirugia=datos_hc.get('detalle_operado')
                hc.aplicado_por=Usuario.objects.get(id=id_usuario_autenticado).persona
                hc.quien_lo_envia = dataDic['quien_lo_envia_hc']
                hc.prob_emocion_mental = datos_hc.get('prob_emocion_mental')
                hc.cuales_pensamto_vuelven = dataDic['cuales_pensamto_vuelven_hc']
                hc.problemas_de_hijos=datos_hc.get('detalle_prob_hijo')
                hc.detalle_primera_exp_sexual=dataDic['detalle_primera_exp_sexual_hc']
                hc.save()
                
                # eliminar datos de las relaciones
                caracteristicas_infancia_adolescencia.objects.get(hc=hc).delete()
                modalidad_conductas.objects.get(hc=hc).delete()
                modalidad_imagenes_me_veo.objects.get(hc=hc).delete()
                modalidad_imagenes_tengo.objects.get(hc=hc).delete()
                modalidad_pensamientos.objects.get(hc=hc).delete()
                modalidad_sensaciones_fisicas.objects.get(hc=hc).delete()
                modalidad_sentimientos.objects.get(hc=hc).delete()
                agregarCaracteristicaInfanciaAdolescencia(listChecksInfanciaAdoles, hc, infancia_adolescencia_otros)
                agregarModalidadConductas(listChecksConductas, hc, conducta_otros)
                agregarModalidadImagenesMeVeo(listChecksImgMeVeo, hc, imag_me_veo_otros_hc)
                agregarModalidadImagenesTengo(listChecksImgTengo, hc, imag_tengo_otros_hc)
                agregarModalidadPensamientos(listChecksPensamientos, hc, pensamiento_otros_hc)
                agregarModalidadSensacionesFisicas(listChecksSensaFisicas, hc, sensaciones_fisicas_otros)
                agregarModalidadSentimientos(listChecksSentimientos, hc, sentimientos_otros)

                mensaje = 'Se ha editado correctamente la Historia Clínica.'
                tipo_mensaje = 'success'
                accion = 'editar'
                result = JsonResponse(
                    {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje, 'accion': accion})
                return result

            # modificar persona
            dataPersonaDic['id'] = Usuario.objects.get(id=id_usuario_autenticado).persona.id
            dataPersonaDic['email'] = dataDic['email_hc']
            dataPersonaDic['sexo'] = dataDic['inlineRadioOptionsSexoHc']
            dataPersonaDic['fecha_nacimiento'] = fecha_nacimiento_persona
            dataPersonaDic['telefono'] = dataDic['telefono_persona_hc']
            dataPersonaDic['estado'] = dataDic['estado_actual_hc']
            dataPersonaDic['municipio'] = dataDic['municipio_actual_hc']
            dataPersonaDic['direccion'] = dataDic['direccion_actual_hc']
            dataPersonaDic['parentesco'] = dataDic['parentesco_hc']
            editarPersona(dataPersonaDic)

        except Exception as e:
            print(e)
            mensaje = 'Lo siento ha ocurrido un error al guardar la Historia Clínica.'
            tipo_mensaje = 'error'
            result = JsonResponse(
                {'mensaje': mensaje, 'tipo_mensaje': tipo_mensaje})
            return result


class getHistoriaClinica(TemplateView):
    model = historia_clinica
    
    def get(self, request, *args, **kwargs):
        id_atencion = request.GET.get('id_atencion', '')
        atencion_obj = atencion_psicologica.objects.get(id=id_atencion)
        data = {}
        
        try:
            hc = historia_clinica.objects.get(atencion=atencion_obj)
            carrera = {'id': hc.carrera.id, 'nombre': hc.carrera.nombre} if hc.carrera != None else None
            estado_nac = {'id': hc.estado_nac.id, 'nombre': hc.estado_nac.nombre} if hc.estado_nac != None else None
            municipio_nac = {'id': hc.municipio_nac.id, 'nombre': hc.municipio_nac.nombre} if hc.municipio_nac != None else None
            estado_civil = {'id': hc.estado_civil.id, 'nombre': hc.estado_civil.nombre} if hc.estado_civil != None else None
            vive_en = {'id': hc.vive_en.id, 'nombre': hc.vive_en.vive_en} if hc.vive_en != None else None
            vive_con = {'id': hc.vive_con.id, 'nombre': hc.vive_con.vive_con} if hc.vive_con != None else None
            religion = {'id': hc.religion.id, 'nombre': hc.religion.nombre} if hc.religion != None else None
            grado_est = {'id': hc.grado_est.id, 'nombre': hc.grado_est.nombre} if hc.grado_est != None else None
            datos_persona = {
                'nombre': atencion_obj.solicitante.nombre,
                'segundo_nombre': atencion_obj.solicitante.segundo_nombre if atencion_obj.solicitante.segundo_nombre != None else None,
                'apellido': atencion_obj.solicitante.apellido,
                'segundo_apellido': atencion_obj.solicitante.segundo_apellido if atencion_obj.solicitante.segundo_apellido != None else None,
                'correo': atencion_obj.solicitante.email,
                'fecha_nacimiento': datetime.strftime(atencion_obj.solicitante.fecha_nacimiento, '%d/%m/%Y'),
                'telefono_contacto': atencion_obj.solicitante.telefono,
                'sexo': atencion_obj.solicitante.sexo,
                'estado': {
                    'id': atencion_obj.solicitante.estado.id,
                    'nombre': atencion_obj.solicitante.estado.nombre
                },
                'municipio': {
                    'id': atencion_obj.solicitante.municipio.id,
                    'nombre': atencion_obj.solicitante.municipio.nombre
                },
                'direccion': atencion_obj.solicitante.direccion,
                'parentesco': atencion_obj.solicitante.parentesco
            }
           
            data['estado_nac'] = estado_nac
            data['municipio_nac'] = municipio_nac
            data['estado_civil'] = estado_civil
            data['ocupacion'] = hc.ocupacion
            data['carrera'] = carrera
            data['vive_en'] = vive_en
            data['vive_con'] = vive_con
            data['religion'] = religion
            data['grado_est'] = grado_est
            data['nombre_emergencia'] = hc.nombre_emergencia
            data['tlf_emergencia'] = hc.tlf_emergencia
            data['pasatiempos'] = hc.pasatiempos
            data['peso'] = hc.peso
            data['estatura'] = hc.estatura
            data['peso_varia'] = hc.peso_varia
            data['gustar_trabajo'] = hc.gustar_trabajo
            data['que_hace_trab'] = hc.que_hace_trab
            data['trab_pasados'] = hc.trab_pasados
            data['terapia_antes'] = hc.terapia_antes
            data['ayuda_problema'] = hc.ayuda_problema
            data['medico_cabecera'] = hc.medico_cabecera
            data['nombre_medico_cabecera'] = hc.nombre_medico_cabecera
            data['tlf_medico_cabecera'] = hc.tlf_medico_cabecera
            data['lugar_terapia_pasada'] = hc.lugar_terapia_pasada
            data['hosp_prob_psico'] = hc.hosp_prob_psico
            data['lugar_hosp_prob_psico'] = hc.lugar_hosp_prob_psico
            data['hacerse_danio_suicidio'] = hc.hacerse_danio_suicidio
            data['tiempo_forma_hacerse_danio_suicidio'] = hc.tiempo_forma_hacerse_danio_suicidio
            data['familia_suicidio'] = hc.familia_suicidio
            data['nombre_padre'] = hc.nombre_padre
            data['edad_padre'] = hc.edad_padre
            data['ocupacion_padre'] = hc.ocupacion_padre
            data['grado_estudio_padre'] = hc.grado_estudio_padre
            data['estado_salud_padre'] = hc.estado_salud_padre
            data['edad_murio_padre'] = hc.edad_murio_padre
            data['causa_muerte_padre'] = hc.causa_muerte_padre
            data['edad_hijo_morir_padre'] = hc.edad_hijo_morir_padre
            data['nombre_madre'] = hc.nombre_madre
            data['edad_madre'] = hc.edad_madre
            data['ocupacion_madre'] = hc.ocupacion_madre
            data['grado_estudio_madre'] = hc.grado_estudio_madre
            data['estado_salud_madre'] = hc.estado_salud_madre
            data['edad_murio_madre'] = hc.edad_murio_madre
            data['causa_muerte_madre'] = hc.causa_muerte_madre
            data['edad_hijo_morir_madre'] = hc.edad_hijo_morir_madre
            data['cant_hermanos'] = hc.cant_hermanos
            data['edades_hermanos'] = hc.edades_hermanos
            data['detalles_padres_hermanos'] = hc.detalles_padres_hermanos
            data['con_quien_crecio'] = hc.con_quien_crecio
            data['person_actitud_padre'] = hc.person_actitud_padre
            data['person_actitud_madre'] = hc.person_actitud_madre
            data['forma_castigado_padres'] = hc.forma_castigado_padres
            data['atmosfera_casa'] = hc.atmosfera_casa
            data['confia_padres'] = hc.confia_padres
            data['edad_casar_padres'] = hc.edad_casar_padres
            data['siente_amor_padres'] = hc.siente_amor_padres
            data['familia_interferir_matrimonio'] = hc.familia_interferir_matrimonio
            data['desc_natu_prob'] = hc.desc_natu_prob
            data['empezar_prob'] = hc.empezar_prob
            data['empeora_prob'] = hc.empeora_prob
            data['mejora_prob'] = hc.mejora_prob
            data['desc_problema_sec3'] = hc.desc_problema_sec3
            data['satisf_vida_todo'] = hc.satisf_vida_todo
            data['nivel_tension_mes_pasado'] = hc.nivel_tension_mes_pasado
            data['piensa_espera_terapia'] = hc.piensa_espera_terapia
            data['caract_posee_terapeuta'] = hc.caract_posee_terapeuta
            data['tiempo_terapia'] = hc.tiempo_terapia
            data['talentos_habilidades'] = hc.talentos_habilidades
            data['gustaria_dejar_hacer'] = hc.gustaria_dejar_hacer
            data['gustaria_empezar_hacer'] = hc.gustaria_empezar_hacer
            data['actividades_relajarse'] = hc.actividades_relajarse
            data['tiempo_libre'] = hc.tiempo_libre
            data['dos_deseos'] = hc.dos_deseos
            data['prob_relajarse'] = hc.prob_relajarse
            data['cinco_miedos'] = hc.cinco_miedos
            data['perder_control_sentimientos'] = hc.perder_control_sentimientos
            data['sentimientos_positivos_recientes'] = hc.sentimientos_positivos_recientes
            data['situacion_calmado_relajado'] = hc.situacion_calmado_relajado
            data['sensaciones_placenteras'] = hc.sensaciones_placenteras
            data['sensaciones_no_placenteras'] = hc.sensaciones_no_placenteras
            data['img_fantasia_placentera'] = hc.img_fantasia_placentera
            data['img_fantasia_no_placentera'] = hc.img_fantasia_no_placentera
            data['img_molesta_func_cotidiano'] = hc.img_molesta_func_cotidiano
            data['pesadillas_seguidas'] = hc.pesadillas_seguidas
            data['idea_mas_loca'] = hc.idea_mas_loca
            data['afectar_negativamente_humor'] = hc.afectar_negativamente_humor
            data['pensamientos_vuelven_vuelve'] = hc.pensamientos_vuelven_vuelve
            data['no_cometer_errores'] = hc.no_cometer_errores
            data['bueno_todo'] = hc.bueno_todo
            data['no_relevar_info_pers'] = hc.no_relevar_info_pers
            data['aparentar_saber'] = hc.aparentar_saber
            data['victima_circunstancias'] = hc.victima_circunstancias
            data['pers_mas_felices_yo'] = hc.pers_mas_felices_yo
            data['complacer_otras_personas'] = hc.complacer_otras_personas
            data['no_tomar_riesgos'] = hc.no_tomar_riesgos
            data['vida_controlada_fuerzas_exter'] = hc.vida_controlada_fuerzas_exter
            data['no_merezco_feliz'] = hc.no_merezco_feliz
            data['ignoro_problemas'] = hc.ignoro_problemas
            data['hacer_felices_otros'] = hc.hacer_felices_otros
            data['trabajar_duro_perfeccion'] = hc.trabajar_duro_perfeccion
            data['formas_hacer_cosas'] = hc.formas_hacer_cosas
            data['nunca_molesto'] = hc.nunca_molesto
            data['hace_amigos_facil'] = hc.hace_amigos_facil
            data['conserva_amigos'] = hc.conserva_amigos
            data['citas_estudiante_secundaria'] = hc.citas_estudiante_secundaria
            data['citas_estudiante_preparatoria'] = hc.citas_estudiante_preparatoria
            data['relacion_alergias'] = hc.relacion_alergias
            data['relacion_problemas'] = hc.relacion_problemas
            data['grado_situaciones_sociales'] = hc.grado_situaciones_sociales
            data['tiempo_pareja_antes_casarse'] = hc.tiempo_pareja_antes_casarse
            data['tiempo_comprometido_antes_casarse'] = hc.tiempo_comprometido_antes_casarse
            data['tiempo_mujer'] = hc.tiempo_mujer
            data['edad_pareja'] = hc.edad_pareja
            data['ocupacion_pareja'] = hc.ocupacion_pareja
            data['personalidad_pareja'] = hc.personalidad_pareja
            data['mas_gusta_pareja'] = hc.mas_gusta_pareja
            data['menos_gusta_pareja'] = hc.menos_gusta_pareja
            data['factores_disminuyen_satisf_pareja'] = hc.factores_disminuyen_satisf_pareja
            data['detalle_signif_pareja_anterior'] = hc.detalle_signif_pareja_anterior
            data['grado_satisf_pareja'] = hc.grado_satisf_pareja
            data['amigos_familiares_pareja'] = hc.amigos_familiares_pareja
            data['datos_hijos_tiene'] = hc.datos_hijos_tiene
            data['hijos_con_problema'] = hc.hijos_con_problema
            data['actitud_padres_sexo'] = hc.actitud_padres_sexo
            data['detalle_sexo_casa'] = hc.detalle_sexo_casa
            data['primeros_conoc_sobre_sexo'] = hc.primeros_conoc_sobre_sexo
            data['impulsos_sexuales'] = hc.impulsos_sexuales
            data['pena_acerca_sexo'] = hc.pena_acerca_sexo
            data['visa_sexual_satisf'] = hc.visa_sexual_satisf
            data['reaccion_relacion_homosexual'] = hc.reaccion_relacion_homosexual
            data['info_sexual_relevante'] = hc.info_sexual_relevante
            data['probl_relac_personas_trabj'] = hc.probl_relac_personas_trabj
            data['forma_me_lastima'] = hc.forma_me_lastima
            data['pareja_describe_como'] = hc.pareja_describe_como
            data['gente_no_gusta_es'] = hc.gente_no_gusta_es
            data['alterar_alguien_haciendo'] = hc.alterar_alguien_haciendo
            data['mejor_amigo_piensa_soy'] = hc.mejor_amigo_piensa_soy
            data['prob_por_rechazo_amoroso'] = hc.prob_por_rechazo_amoroso
            data['prob_salud_fisica'] = hc.prob_salud_fisica
            data['medicamentos_actuales'] = hc.medicamentos_actuales
            data['dieta_balanceada_trees_veces_dia'] = hc.dieta_balanceada_trees_veces_dia
            data['prob_medicos_haya_padecido'] = hc.prob_medicos_haya_padecido
            data['practica_ejerc_fisico'] = hc.practica_ejerc_fisico
            data['operado'] = hc.operado
            data['prob_medicos_familia'] = hc.prob_medicos_familia
            data['edad_primera_menstruacion'] = hc.edad_primera_menstruacion
            data['probl_menstruaciones'] = hc.probl_menstruaciones
            data['periodos_regulares'] = hc.periodos_regulares
            data['conoce_menstruacion'] = hc.conoce_menstruacion
            data['menstuacion_dolor'] = hc.menstuacion_dolor
            data['duracion_periodos'] = hc.duracion_periodos
            data['fecha_ultima_menstruacion'] = datetime.strftime(hc.fecha_ultima_menstruacion, '%d/%m/%Y') if hc.fecha_ultima_menstruacion else None
            data['debilidad_muscular'] = hc.debilidad_muscular
            data['tranquilizantes'] = hc.tranquilizantes
            data['diureticos'] = hc.diureticos
            data['pastillas_adelgazar'] = hc.pastillas_adelgazar
            data['marihuana'] = hc.marihuana
            data['hormonas'] = hc.hormonas
            data['pastillas_dormir'] = hc.pastillas_dormir
            data['aspirinas'] = hc.aspirinas
            data['cocaina'] = hc.cocaina
            data['analgesicos'] = hc.analgesicos
            data['narcoticos'] = hc.narcoticos
            data['estimulantes'] = hc.estimulantes
            data['alucinogenos'] = hc.alucinogenos
            data['laxantes'] = hc.laxantes
            data['cigarrillos'] = hc.cigarrillos
            data['tabaco'] = hc.tabaco
            data['cafe'] = hc.cafe
            data['alcohol'] = hc.alcohol
            data['anticonceptivos_orales'] = hc.anticonceptivos_orales
            data['vitaminas'] = hc.vitaminas
            data['escasa_alimentacion'] = hc.escasa_alimentacion
            data['alimentacion_abundante'] = hc.alimentacion_abundante
            data['comida_chatarra'] = hc.comida_chatarra
            data['diarrea'] = hc.diarrea
            data['estrenimiento'] = hc.estrenimiento
            data['gases'] = hc.gases
            data['indigestion'] = hc.indigestion
            data['nauseas'] = hc.nauseas
            data['vomitos'] = hc.vomitos
            data['agruras'] = hc.agruras
            data['mareos'] = hc.mareos
            data['palpitaciones'] = hc.palpitaciones
            data['fatiga'] = hc.fatiga
            data['alergias'] = hc.alergias
            data['presion_arterial_alta'] = hc.presion_arterial_alta
            data['dolor_pecho'] = hc.dolor_pecho
            data['respiracion_cortada'] = hc.respiracion_cortada
            data['insomnio'] = hc.insomnio
            data['dormir_mas_tiempo'] = hc.dormir_mas_tiempo
            data['dormir_ratos'] = hc.dormir_ratos
            data['despertarse_temprano'] = hc.despertarse_temprano
            data['dolor_oido'] = hc.dolor_oido
            data['dolor_cabeza'] = hc.dolor_cabeza
            data['dolor_espalda'] = hc.dolor_espalda
            data['moretones_sangrado'] = hc.moretones_sangrado
            data['prob_peso'] = hc.prob_peso
            data['otros_fact_biolg'] = hc.otros_fact_biolg
            data['observaciones'] = hc.observaciones
            data['problemas_de_hijos'] = hc.problemas_de_hijos
            data['detalles_probl_relac_personas_trabj'] = hc.detalles_probl_relac_personas_trabj
            data['detalle_pena_acerca_sexo'] = hc.detalle_pena_acerca_sexo
            data['detalles_visa_sexual_satisf'] = hc.detalles_visa_sexual_satisf
            data['detalle_prob_por_rechazo_amoroso'] = hc.detalle_prob_por_rechazo_amoroso
            data['detalle_prob_salud_fisica'] = hc.detalle_prob_salud_fisica
            data['tipo_frecuencia_ejerc_fisico'] = hc.tipo_frecuencia_ejerc_fisico
            data['tipo_fecha_cirugia'] = hc.tipo_fecha_cirugia
            data['quien_lo_envia'] = hc.quien_lo_envia
            data['prob_emocion_mental'] = hc.prob_emocion_mental
            data['cuales_pensamto_vuelven'] = hc.cuales_pensamto_vuelven
            data['detalle_primera_exp_sexual'] = hc.detalle_primera_exp_sexual
            data['menst_afecta_animo'] = hc.menst_afecta_animo
            data['checksCaractInfanciaAdoles'] = getCaracteristicasInfanciaAdolescencia(hc)
            data['checksConductas'] = getModalidadConductas(hc)
            data['checksImgMeVeo'] = getModalidadImagenesMeVeo(hc)
            data['checksImgTengo'] = getModalidadImagenesTengo(hc)
            data['checksPensamientos'] = getModalidadPensamientos(hc)
            data['checksSensaFisicas'] = getModalidadSensacionesFisicas(hc)
            data['checksSentimientos'] = getModalidadSentimientos(hc)
            data['datos_persona'] = datos_persona
            data['mensaje'] = 'existe'
            return JsonResponse(data)
        except historia_clinica.DoesNotExist:
            data['mensaje'] = 'no_existe'
            return JsonResponse(data)
        

def agregarCaracteristicaInfanciaAdolescencia(lista, hc, otros):
    infancia_feliz = False
    infancia_infeliz = False
    prob_emoc_cond = False
    prob_leg = False
    muerte_familia = False
    prob_med = False
    ignorado = False
    pocos_amigos = False
    prob_escuela = False
    convicciones_religiosas = False
    uso_drogas = False
    uso_alcohol = False
    castigado_sev = False
    abusado_sex = False
    prob_financieros = False
    int_mol_sev = False
    prob_alim = False

    if lista != None:
        if 'check_infancia_feliz_hc' in lista:
            infancia_feliz = True
        if 'check_infancia_infeliz_hc' in lista:
          infancia_infeliz = True
        if 'check_prob_emoc_cond_hc' in lista:
          prob_emoc_cond = True
        if 'check_prob_leg_hc' in lista:
          prob_leg = True
        if 'check_muerte_familia_hc' in lista:
          muerte_familia = True
        if 'check_prob_med_hc' in lista:
          prob_med = True
        if 'check_ignorado_hc' in lista:
          ignorado = True
        if 'check_pocos_amigos_hc' in lista:
          pocos_amigos = True
        if 'check_prob_escuela_hc' in lista:
          prob_escuela = True
        if 'check_convicciones_religiosas_hc' in lista:
          convicciones_religiosas = True
        if 'check_uso_drogas_hc' in lista:
          uso_drogas = True
        if 'check_uso_alcohol_hc' in lista:
          uso_alcohol = True
        if 'check_castigado_sev_hc' in lista:
          castigado_sev = True
        if 'check_abusado_sex_hc' in lista:
          abusado_sex = True
        if 'check_prob_financieros_hc' in lista:
          prob_financieros = True
        if 'check_int_mol_sev_hc' in lista:
          int_mol_sev = True
        if 'check_prob_alim_hc' in lista:
          prob_alim = True

    obj = caracteristicas_infancia_adolescencia.objects.create(
        infancia_feliz=infancia_feliz, infancia_infeliz=infancia_infeliz, prob_emoc_cond=prob_emoc_cond, prob_leg=prob_leg, muerte_familia=muerte_familia, prob_med=prob_med, ignorado=ignorado, pocos_amigos=pocos_amigos, prob_escuela=prob_escuela, convicciones_religiosas=convicciones_religiosas, uso_drogas=uso_drogas, uso_alcohol=uso_alcohol, castigado_sev=castigado_sev, abusado_sex=abusado_sex, prob_financieros=prob_financieros, int_mol_sev=int_mol_sev, prob_alim=prob_alim, otros=otros, hc=hc)


def agregarModalidadConductas(lista, hc, otros):
    comer_de_mas = False
    consumir_drogas = False
    no_hacer_desea = False
    conductas_incorrectas = False
    beber_demasiado = False
    trabajar_demasiado = False
    demorando_algo = False
    relaciones_impulsivas = False
    perdida_control = False
    intentos_suicidas = False
    compulsiones = False
    fumar = False
    dejar_hacer_algo = False
    tics_nerviosos = False
    dificultad_concentrarse = False
    trastornos_suenio = False
    evitacion_fobica = False
    gastar_mucho_dinero = False
    no_encontrar_trabajo = False
    insomnio = False
    tomar_riesgos = False
    perezoso = False
    prob_alimentacion = False
    conducta_agresiva = False
    llanto = False
    enojado_ocaciones = False

    if lista != None:
        if 'check_cond_1' in lista:
            comer_de_mas = True
        if 'check_cond_2' in lista:
            consumir_drogas = True
        if 'check_cond_3' in lista:
            no_hacer_desea = True
        if 'check_cond_4' in lista:
            conductas_incorrectas = True
        if 'check_cond_5' in lista:
            beber_demasiado = True
        if 'check_cond_6' in lista:
            trabajar_demasiado = True
        if 'check_cond_7' in lista:
            demorando_algo = True
        if 'check_cond_8' in lista:
            relaciones_impulsivas = True
        if 'check_cond_9' in lista:
            perdida_control = True
        if 'check_cond_10' in lista:
            intentos_suicidas = True
        if 'check_cond_11' in lista:
            compulsiones = True
        if 'check_cond_12' in lista:
            fumar = True
        if 'check_cond_13' in lista:
            dejar_hacer_algo = True
        if 'check_cond_14' in lista:
            tics_nerviosos = True
        if 'check_cond_15' in lista:
            dificultad_concentrarse = True
        if 'check_cond_16' in lista:
            trastornos_suenio = True
        if 'check_cond_17' in lista:
            evitacion_fobica = True
        if 'check_cond_18' in lista:
            gastar_mucho_dinero = True
        if 'check_cond_19' in lista:
            no_encontrar_trabajo = True
        if 'check_cond_20' in lista:
            insomnio = True
        if 'check_cond_21' in lista:
            tomar_riesgos = True
        if 'check_cond_22' in lista:
            perezoso = True
        if 'check_cond_23' in lista:
            prob_alimentacion = True
        if 'check_cond_24' in lista:
            conducta_agresiva = True
        if 'check_cond_25' in lista:
            llanto = True
        if 'check_cond_26' in lista:
            enojado_ocaciones = True

    obj = modalidad_conductas.objects.create(
        comer_de_mas=comer_de_mas, consumir_drogas=consumir_drogas, no_hacer_desea=no_hacer_desea, conductas_incorrectas=conductas_incorrectas, beber_demasiado=beber_demasiado, trabajar_demasiado=trabajar_demasiado, demorando_algo=demorando_algo, relaciones_impulsivas=relaciones_impulsivas, perdida_control=perdida_control, intentos_suicidas=intentos_suicidas, compulsiones=compulsiones, fumar=fumar, dejar_hacer_algo=dejar_hacer_algo, tics_nerviosos=tics_nerviosos, dificultad_concentrarse=dificultad_concentrarse, trastornos_suenio=trastornos_suenio, evitacion_fobica=evitacion_fobica, gastar_mucho_dinero=gastar_mucho_dinero, no_encontrar_trabajo=no_encontrar_trabajo, insomnio=insomnio, tomar_riesgos=tomar_riesgos, perezoso=perezoso, prob_alimentacion=prob_alimentacion, conducta_agresiva=conducta_agresiva, llanto=llanto, enojado_ocaciones=enojado_ocaciones, otros=otros, hc=hc)


def agregarModalidadSentimientos(lista, hc, otros):
    enojado = False
    fastidiado = False
    triste = False
    deprimido = False
    envidioso = False
    culpable = False
    feliz = False
    ansioso = False
    con_miedo = False
    con_panico = False
    energetico = False
    en_conflicto = False
    avergonzado = False
    apenado = False
    esperanzado = False
    desamparado = False
    relajado = False
    celoso = False
    infeliz = False
    aburrido = False
    sin_descanso = False
    solitario = False
    satisfecho = False
    excitado = False
    optimista = False
    tenso = False
    sin_esperanza = False

    if lista != None:
        if 'check_sent_1' in lista:
            enojado = True
        if 'check_sent_2' in lista:
            fastidiado = True
        if 'check_sent_3' in lista:
            triste = True
        if 'check_sent_4' in lista:
            deprimido = True
        if 'check_sent_5' in lista:
            envidioso = True
        if 'check_sent_6' in lista:
            culpable = True
        if 'check_sent_7' in lista:
            feliz = True
        if 'check_sent_8' in lista:
            ansioso = True
        if 'check_sent_9' in lista:
            con_miedo = True
        if 'check_sent_10' in lista:
            con_panico = True
        if 'check_sent_11' in lista:
            energetico = True
        if 'check_sent_12' in lista:
            en_conflicto = True
        if 'check_sent_13' in lista:
            avergonzado = True
        if 'check_sent_14' in lista:
            apenado = True
        if 'check_sent_15' in lista:
            esperanzado = True
        if 'check_sent_16' in lista:
            desamparado = True
        if 'check_sent_17' in lista:
            relajado = True
        if 'check_sent_18' in lista:
            celoso = True
        if 'check_sent_19' in lista:
            infeliz = True
        if 'check_sent_20' in lista:
            aburrido = True
        if 'check_sent_21' in lista:
            sin_descanso = True
        if 'check_sent_22' in lista:
            solitario = True
        if 'check_sent_23' in lista:
            satisfecho = True
        if 'check_sent_24' in lista:
            excitado = True
        if 'check_sent_25' in lista:
            optimista = True
        if 'check_sent_26' in lista:
            tenso = True
        if 'check_sent_27' in lista:
            sin_esperanza = True

    obj = modalidad_sentimientos.objects.create(enojado=enojado, fastidiado=fastidiado, triste=triste, deprimido=deprimido, envidioso=envidioso, culpable=culpable, feliz=feliz, ansioso=ansioso, con_miedo=con_miedo, con_panico=con_panico, energetico=energetico, en_conflicto=en_conflicto, avergonzado=avergonzado,
                                                apenado=apenado, esperanzado=esperanzado, desamparado=desamparado, relajado=relajado, celoso=celoso, infeliz=infeliz, aburrido=aburrido, sin_descanso=sin_descanso, solitario=solitario, satisfecho=satisfecho, excitado=excitado, optimista=optimista, tenso=tenso, sin_esperanza=sin_esperanza, otros=otros, hc=hc)


def agregarModalidadSensacionesFisicas(lista, hc, otros):
    dolor_abdominal = False
    dolor_orinar = False
    dolor_menstruacion = False
    dolor_cabeza = False
    mareos = False
    palpitaciones = False
    espasmos_musculares = False
    tensiones = False
    trastornos_sexuales = False
    incapacidad_relajarse = False
    alteraciones_intestinales = False
    hormigueos = False
    problemas_piel = False
    boca_seca = False
    sensacion_quemaduras = False
    latidos_cardiacos_rapidos = False
    no_ser_tocado = False
    entumecimiento = False
    problemas_estomacales = False
    tics = False
    fatiga = False
    dolor_espalda = False
    temblores = False
    desmayos = False
    escuchar_ruidos = False
    ojos_llorosos = False
    catarro = False
    nauseas = False
    vertigo = False
    sudoracion_excesiva = False
    alteraciones_visuales = False
    problemas_audicion = False
    variacion_peso = False

    if lista != None:
        if 'check_sf_1' in lista:
            dolor_abdominal = True
        if 'check_sf_2' in lista:
            dolor_orinar = True
        if 'check_sf_3' in lista:
            dolor_menstruacion = True
        if 'check_sf_33' in lista:
            dolor_cabeza = True
        if 'check_sf_4' in lista:
            mareos = True
        if 'check_sf_5' in lista:
            palpitaciones = True
        if 'check_sf_6' in lista:
            espasmos_musculares = True
        if 'check_sf_7' in lista:
            tensiones = True
        if 'check_sf_8' in lista:
            trastornos_sexuales = True
        if 'check_sf_9' in lista:
            incapacidad_relajarse = True
        if 'check_sf_10' in lista:
            alteraciones_intestinales = True
        if 'check_sf_11' in lista:
            hormigueos = True
        if 'check_sf_12' in lista:
            problemas_piel = True
        if 'check_sf_13' in lista:
            boca_seca = True
        if 'check_sf_14' in lista:
            sensacion_quemaduras = True
        if 'check_sf_15' in lista:
            latidos_cardiacos_rapidos = True
        if 'check_sf_16' in lista:
            no_ser_tocado = True
        if 'check_sf_17' in lista:
            entumecimiento = True
        if 'check_sf_18' in lista:
            problemas_estomacales = True
        if 'check_sf_19' in lista:
            tics = True
        if 'check_sf_20' in lista:
            fatiga = True
        if 'check_sf_21' in lista:
            dolor_espalda = True
        if 'check_sf_22' in lista:
            temblores = True
        if 'check_sf_23' in lista:
            desmayos = True
        if 'check_sf_24' in lista:
            escuchar_ruidos = True
        if 'check_sf_25' in lista:
            ojos_llorosos = True
        if 'check_sf_26' in lista:
            catarro = True
        if 'check_sf_27' in lista:
            nauseas = True
        if 'check_sf_28' in lista:
            vertigo = True
        if 'check_sf_29' in lista:
            sudoracion_excesiva = True
        if 'check_sf_30' in lista:
            alteraciones_visuales = True
        if 'check_sf_31' in lista:
            problemas_audicion = True
        if 'check_sf_32' in lista:
            variacion_peso = True

    obj = modalidad_sensaciones_fisicas.objects.create(
        dolor_abdominal=dolor_abdominal, dolor_orinar=dolor_orinar, dolor_menstruacion=dolor_menstruacion, dolor_cabeza=dolor_cabeza, mareos=mareos, palpitaciones=palpitaciones, espasmos_musculares=espasmos_musculares, tensiones=tensiones, trastornos_sexuales=trastornos_sexuales, incapacidad_relajarse=incapacidad_relajarse, alteraciones_intestinales=alteraciones_intestinales, hormigueos=hormigueos, problemas_piel=problemas_piel, boca_seca=boca_seca, sensacion_quemaduras=sensacion_quemaduras, latidos_cardiacos_rapidos=latidos_cardiacos_rapidos, no_ser_tocado=no_ser_tocado, entumecimiento=entumecimiento, problemas_estomacales=problemas_estomacales, tics=tics, fatiga=fatiga, dolor_espalda=dolor_espalda, temblores=temblores, desmayos=desmayos, escuchar_ruidos=escuchar_ruidos, ojos_llorosos=ojos_llorosos, catarro=catarro, nauseas=nauseas, vertigo=vertigo, sudoracion_excesiva=sudoracion_excesiva, alteraciones_visuales=alteraciones_visuales, problemas_audicion=problemas_audicion, variacion_peso=variacion_peso, otros=otros, hc=hc)


def agregarModalidadImagenesMeVeo(lista, hc, otros):
    siendo_feliz = False
    herido_sentimientos = False
    incapaz_afrontar_prob = False
    exitoso = False
    perdiendo_control = False
    siendo_seguido = False
    hablan_mi = False
    desamparado = False
    lastimando_otros = False
    cargo_cosas = False
    fallando = False
    atrapado = False
    siendo_promiscuo = False
    siendo_agreivo = False

    if lista != None:
        if 'check_img_1' in lista:
            siendo_feliz = True
        if 'check_img_2' in lista:
            herido_sentimientos = True
        if 'check_img_3' in lista:
            incapaz_afrontar_prob = True
        if 'check_img_4' in lista:
            exitoso = True
        if 'check_img_5' in lista:
            perdiendo_control = True
        if 'check_img_6' in lista:
            siendo_seguido = True
        if 'check_img_7' in lista:
            hablan_mi = True
        if 'check_img_8' in lista:
            desamparado = True
        if 'check_img_9' in lista:
            lastimando_otros = True
        if 'check_img_10' in lista:
            cargo_cosas = True
        if 'check_img_11' in lista:
            fallando = True
        if 'check_img_12' in lista:
            atrapado = True
        if 'check_img_13' in lista:
            siendo_promiscuo = True
        if 'check_img_14' in lista:
            siendo_agreivo = True

    obj = modalidad_imagenes_me_veo.objects.create(
        siendo_feliz=siendo_feliz, herido_sentimientos=herido_sentimientos, incapaz_afrontar_prob=incapaz_afrontar_prob, exitoso=exitoso, perdiendo_control=perdiendo_control, siendo_seguido=siendo_seguido, hablan_mi=hablan_mi, desamparado=desamparado, lastimando_otros=lastimando_otros, cargo_cosas=cargo_cosas, fallando=fallando, atrapado=atrapado, siendo_promiscuo=siendo_promiscuo, siendo_agreivo=siendo_agreivo, otros=otros, hc=hc)


def agregarModalidadImagenesTengo(lista, hc, otros):
    img_sexuales_placenteras = False
    img_sexuales_no_placenteras = False
    img_desagradables_infancia = False
    img_corporal_negativa = False
    imagino_amado = False
    img_soledad = False
    img_seduccion = False

    if lista != None:
        if 'check_img_15' in lista:
            img_sexuales_placenteras = True
        if 'check_img_16' in lista:
            img_desagradables_infancia = True
        if 'check_img_17' in lista:
            img_corporal_negativa = True
        if 'check_img_18' in lista:
            imagino_amado = True
        if 'check_img_19' in lista:
            img_sexuales_no_placenteras = True
        if 'check_img_20' in lista:
            img_soledad = True
        if 'check_img_21' in lista:
            img_seduccion = True

    obj = modalidad_imagenes_tengo.objects.create(
        img_sexuales_placenteras=img_sexuales_placenteras, img_desagradables_infancia=img_desagradables_infancia, img_corporal_negativa=img_corporal_negativa, imagino_amado=imagino_amado, img_sexuales_no_placenteras=img_sexuales_no_placenteras, img_soledad=img_soledad, img_seduccion=img_seduccion, otros=otros, hc=hc)


def agregarModalidadPensamientos(lista, hc, otros):
    inteligente = False
    confidente = False
    valgo_pena = False
    ambocioso = False
    sensitivo = False
    leal = False
    confiable_fidedigno = False
    lleno_penas = False
    indigno = False
    don_nadie = False
    inutil = False
    malo = False
    loco = False
    estupido = False
    ingenuo = False
    honesto = False
    incompetente = False
    pensamientos_horribles = False
    con_desviaciones = False
    sin_atractivos = False
    sin_carinio = False
    inadecuado = False
    confuso = False
    flojo = False
    no_digno_confianza = False
    deshonesto = False
    con_ideas_suicidas = False
    perseverante = False
    buen_sentido_humor = False
    trabajo_duro = False
    indeseable = False
    en_conflicto = False
    dificultades_concentrarse = False
    prob_memoria = False
    atractivo = False
    no_puedo_tomar_decisiones = False
    feo = False
    considerado = False
    degenerado = False

    if lista != None:
        if 'check_pensamiento_1' in lista:
            inteligente = True
        if 'check_pensamiento_2' in lista:
            confidente = True
        if 'check_pensamiento_3' in lista:
            valgo_pena = True
        if 'check_pensamiento_4' in lista:
            ambocioso = True
        if 'check_pensamiento_5' in lista:
            sensitivo = True
        if 'check_pensamiento_6' in lista:
            leal = True
        if 'check_pensamiento_7' in lista:
            confiable_fidedigno = True
        if 'check_pensamiento_8' in lista:
            lleno_penas = True
        if 'check_pensamiento_9' in lista:
            indigno = True
        if 'check_pensamiento_10' in lista:
            don_nadie = True
        if 'check_pensamiento_11' in lista:
            inutil = True
        if 'check_pensamiento_12' in lista:
            malo = True
        if 'check_pensamiento_13' in lista:
            loco = True
        if 'check_pensamiento_14' in lista:
            estupido = True
        if 'check_pensamiento_15' in lista:
            ingenuo = True
        if 'check_pensamiento_16' in lista:
            honesto = True
        if 'check_pensamiento_17' in lista:
            incompetente = True
        if 'check_pensamiento_18' in lista:
            pensamientos_horribles = True
        if 'check_pensamiento_19' in lista:
            con_desviaciones = True
        if 'check_pensamiento_20' in lista:
            sin_atractivos = True
        if 'check_pensamiento_21' in lista:
            sin_carinio = True
        if 'check_pensamiento_22' in lista:
            inadecuado = True
        if 'check_pensamiento_23' in lista:
            confuso = True
        if 'check_pensamiento_24' in lista:
            flojo = True
        if 'check_pensamiento_25' in lista:
            no_digno_confianza = True
        if 'check_pensamiento_26' in lista:
            deshonesto = True
        if 'check_pensamiento_27' in lista:
            con_ideas_suicidas = True
        if 'check_pensamiento_28' in lista:
            perseverante = True
        if 'check_pensamiento_29' in lista:
            buen_sentido_humor = True
        if 'check_pensamiento_30' in lista:
            trabajo_duro = True
        if 'check_pensamiento_31' in lista:
            indeseable = True
        if 'check_pensamiento_32' in lista:
            en_conflicto = True
        if 'check_pensamiento_33' in lista:
            dificultades_concentrarse = True
        if 'check_pensamiento_34' in lista:
            prob_memoria = True
        if 'check_pensamiento_35' in lista:
            atractivo = True
        if 'check_pensamiento_36' in lista:
            no_puedo_tomar_decisiones = True
        if 'check_pensamiento_37' in lista:
            feo = True
        if 'check_pensamiento_38' in lista:
            considerado = True
        if 'check_pensamiento_39' in lista:
            degenerado = True

    obj = modalidad_pensamientos.objects.create(inteligente=inteligente, confidente=confidente, valgo_pena=valgo_pena, ambocioso=ambocioso, sensitivo=sensitivo, leal=leal, confiable_fidedigno=confiable_fidedigno, lleno_penas=lleno_penas, indigno=indigno, don_nadie=don_nadie, inutil=inutil, malo=malo, loco=loco, estupido=estupido, ingenuo=ingenuo, honesto=honesto, incompetente=incompetente, pensamientos_horribles=pensamientos_horribles, con_desviaciones=con_desviaciones, sin_atractivos=sin_atractivos, sin_carinio=sin_carinio,
                                                inadecuado=inadecuado, confuso=confuso, flojo=flojo, no_digno_confianza=no_digno_confianza, deshonesto=deshonesto, con_ideas_suicidas=con_ideas_suicidas, perseverante=perseverante, buen_sentido_humor=buen_sentido_humor, trabajo_duro=trabajo_duro, indeseable=indeseable, en_conflicto=en_conflicto, dificultades_concentrarse=dificultades_concentrarse, prob_memoria=prob_memoria, atractivo=atractivo, no_puedo_tomar_decisiones=no_puedo_tomar_decisiones, feo=feo, considerado=considerado, degenerado=degenerado, otros=otros, hc=hc)


def getCaracteristicasInfanciaAdolescencia(hc):
    resultado = {}
    datos_hc = caracteristicas_infancia_adolescencia.objects.get(hc=hc)
    resultado = {'id': datos_hc.id,
                'infancia_feliz': datos_hc.infancia_feliz,
                'infancia_infeliz': datos_hc.infancia_infeliz,
                'prob_emoc_cond': datos_hc.prob_emoc_cond,
                'prob_leg': datos_hc.prob_leg,
                'muerte_familia': datos_hc.muerte_familia,
                'prob_med': datos_hc.prob_med,
                'ignorado': datos_hc.ignorado,
                'pocos_amigos': datos_hc.pocos_amigos,
                'prob_escuela': datos_hc.prob_escuela,
                'convicciones_religiosas': datos_hc.convicciones_religiosas,
                'uso_drogas': datos_hc.uso_drogas,
                'uso_alcohol': datos_hc.uso_alcohol,
                'castigado_sev': datos_hc.castigado_sev,
                'abusado_sex': datos_hc.abusado_sex,
                'prob_financieros': datos_hc.prob_financieros,
                'int_mol_sev': datos_hc.int_mol_sev,
                'prob_alim': datos_hc.prob_alim,
                'otros': datos_hc.otros}

    return resultado


def getModalidadConductas(hc):
    resultado = {}
    datos_conductas = modalidad_conductas.objects.get(hc=hc)
    resultado = {'id': datos_conductas.id,
                'comer_de_mas': datos_conductas.comer_de_mas,
                'consumir_drogas': datos_conductas.consumir_drogas,
                'no_hacer_desea': datos_conductas.no_hacer_desea,
                'conductas_incorrectas': datos_conductas.conductas_incorrectas,
                'beber_demasiado': datos_conductas.beber_demasiado,
                'trabajar_demasiado': datos_conductas.trabajar_demasiado,
                'demorando_algo': datos_conductas.demorando_algo,
                'relaciones_impulsivas': datos_conductas.relaciones_impulsivas,
                'perdida_control': datos_conductas.perdida_control,
                'intentos_suicidas': datos_conductas.intentos_suicidas,
                'compulsiones': datos_conductas.compulsiones,
                'fumar': datos_conductas.fumar,
                'dejar_hacer_algo': datos_conductas.dejar_hacer_algo,
                'tics_nerviosos': datos_conductas.tics_nerviosos,
                'dificultad_concentrarse': datos_conductas.dificultad_concentrarse,
                'trastornos_suenio': datos_conductas.trastornos_suenio,
                'evitacion_fobica': datos_conductas.evitacion_fobica,
                'gastar_mucho_dinero': datos_conductas.gastar_mucho_dinero,
                'no_encontrar_trabajo': datos_conductas.no_encontrar_trabajo,
                'insomnio': datos_conductas.insomnio,
                'tomar_riesgos': datos_conductas.tomar_riesgos,
                'perezoso': datos_conductas.perezoso,
                'prob_alimentacion': datos_conductas.prob_alimentacion,
                'conducta_agresiva': datos_conductas.conducta_agresiva,
                'llanto': datos_conductas.llanto,
                'enojado_ocaciones': datos_conductas.enojado_ocaciones,
                'otros': datos_conductas.otros}
    
    return resultado


def getModalidadSentimientos(hc):
    resultado = {}
    datos_sentimientos = modalidad_sentimientos.objects.get(hc=hc)
    resultado = {'id': datos_sentimientos.id,
            'enojado': datos_sentimientos.enojado,
            'fastidiado': datos_sentimientos.fastidiado,
            'triste': datos_sentimientos.triste,
            'deprimido': datos_sentimientos.deprimido,
            'envidioso': datos_sentimientos.envidioso,
            'culpable': datos_sentimientos.culpable,
            'feliz': datos_sentimientos.feliz,
            'ansioso': datos_sentimientos.ansioso,
            'con_miedo': datos_sentimientos.con_miedo,
            'con_panico': datos_sentimientos.con_panico,
            'energetico': datos_sentimientos.energetico,
            'en_conflicto': datos_sentimientos.en_conflicto,
            'avergonzado': datos_sentimientos.avergonzado,
            'apenado': datos_sentimientos.apenado,
            'esperanzado': datos_sentimientos.esperanzado,
            'desamparado': datos_sentimientos.desamparado,
            'relajado': datos_sentimientos.relajado,
            'celoso': datos_sentimientos.celoso,
            'infeliz': datos_sentimientos.infeliz,
            'aburrido': datos_sentimientos.aburrido,
            'sin_descanso': datos_sentimientos.sin_descanso,
            'solitario': datos_sentimientos.solitario,
            'satisfecho': datos_sentimientos.satisfecho,
            'excitado': datos_sentimientos.excitado,
            'optimista': datos_sentimientos.optimista,
            'tenso': datos_sentimientos.tenso,
            'sin_esperanza': datos_sentimientos.sin_esperanza,
            'otros': datos_sentimientos.otros
    }
  
    return resultado


def getModalidadSensacionesFisicas(hc):
    resultado = {}
    datos_sen_fis = modalidad_sensaciones_fisicas.objects.get(hc=hc)
    resultado = {'id': datos_sen_fis.id,
            'dolor_abdominal': datos_sen_fis.dolor_abdominal,
            'dolor_orinar': datos_sen_fis.dolor_orinar,
            'dolor_menstruacion': datos_sen_fis.dolor_menstruacion,
            'dolor_cabeza': datos_sen_fis.dolor_cabeza,
            'mareos': datos_sen_fis.mareos,
            'palpitaciones': datos_sen_fis.palpitaciones,
            'espasmos_musculares': datos_sen_fis.espasmos_musculares,
            'tensiones': datos_sen_fis.tensiones,
            'trastornos_sexuales': datos_sen_fis.trastornos_sexuales,
            'incapacidad_relajarse': datos_sen_fis.incapacidad_relajarse,
            'alteraciones_intestinales': datos_sen_fis.alteraciones_intestinales,
            'hormigueos': datos_sen_fis.hormigueos,
            'problemas_piel': datos_sen_fis.problemas_piel,
            'boca_seca': datos_sen_fis.boca_seca,
            'sensacion_quemaduras': datos_sen_fis.sensacion_quemaduras,
            'latidos_cardiacos_rapidos': datos_sen_fis.latidos_cardiacos_rapidos,
            'no_ser_tocado': datos_sen_fis.no_ser_tocado,
            'entumecimiento': datos_sen_fis.entumecimiento,
            'problemas_estomacales': datos_sen_fis.problemas_estomacales,
            'tics': datos_sen_fis.tics,
            'fatiga': datos_sen_fis.fatiga,
            'dolor_espalda': datos_sen_fis.dolor_espalda,
            'temblores': datos_sen_fis.temblores,
            'desmayos': datos_sen_fis.desmayos,
            'escuchar_ruidos': datos_sen_fis.escuchar_ruidos,
            'ojos_llorosos': datos_sen_fis.ojos_llorosos,
            'catarro': datos_sen_fis.catarro,
            'nauseas': datos_sen_fis.nauseas,
            'vertigo': datos_sen_fis.vertigo,
            'sudoracion_excesiva': datos_sen_fis.sudoracion_excesiva,
            'alteraciones_visuales': datos_sen_fis.alteraciones_visuales,
            'problemas_audicion': datos_sen_fis.problemas_audicion,
            'variacion_peso': datos_sen_fis.variacion_peso,
            'otros': datos_sen_fis.otros
            }

    return resultado


def getModalidadImagenesMeVeo(hc):
    resultado = {}
    datos_img_veo = modalidad_imagenes_me_veo.objects.get(hc=hc)
    resultado = {
        'id': datos_img_veo.id,
        'siendo_feliz': datos_img_veo.siendo_feliz,
        'herido_sentimientos': datos_img_veo.herido_sentimientos,
        'incapaz_afrontar_prob': datos_img_veo.incapaz_afrontar_prob,
        'exitoso': datos_img_veo.exitoso,
        'perdiendo_control': datos_img_veo.perdiendo_control,
        'siendo_seguido': datos_img_veo.siendo_seguido,
        'hablan_mi': datos_img_veo.hablan_mi,
        'desamparado': datos_img_veo.desamparado,
        'lastimando_otros': datos_img_veo.lastimando_otros,
        'cargo_cosas': datos_img_veo.cargo_cosas,
        'fallando': datos_img_veo.fallando,
        'atrapado': datos_img_veo.atrapado,
        'siendo_promiscuo': datos_img_veo.siendo_promiscuo,
        'siendo_agreivo': datos_img_veo.siendo_agreivo,
        'otros': datos_img_veo.otros
    }
        
    return resultado
        

def getModalidadImagenesTengo(hc):
    resultado = {}
    
    datos_img_tengo = modalidad_imagenes_tengo.objects.get(hc=hc)
    resultado = {
        'id': datos_img_tengo.id,
        'img_sexuales_placenteras': datos_img_tengo.img_sexuales_placenteras,
        'img_sexuales_no_placenteras': datos_img_tengo.img_sexuales_no_placenteras,
        'img_desagradables_infancia': datos_img_tengo.img_desagradables_infancia,
        'img_corporal_negativa': datos_img_tengo.img_corporal_negativa,
        'imagino_amado': datos_img_tengo.imagino_amado,
        'img_soledad': datos_img_tengo.img_soledad,
        'img_seduccion': datos_img_tengo.img_seduccion,
        'otros': datos_img_tengo.otros
    }

    return resultado


def getModalidadPensamientos(hc):
    resultado = {}
    datos_pensamientos = modalidad_pensamientos.objects.get(hc=hc)
    resultado = {
        'id': datos_pensamientos.id,
        'inteligente': datos_pensamientos.inteligente,
        'confidente': datos_pensamientos.confidente,
        'valgo_pena': datos_pensamientos.valgo_pena,
        'ambocioso': datos_pensamientos.ambocioso,
        'sensitivo': datos_pensamientos.sensitivo,
        'leal': datos_pensamientos.leal,
        'confiable_fidedigno': datos_pensamientos.confiable_fidedigno,
        'lleno_penas': datos_pensamientos.lleno_penas,
        'indigno': datos_pensamientos.indigno,
        'don_nadie': datos_pensamientos.don_nadie,
        'inutil': datos_pensamientos.inutil,
        'malo': datos_pensamientos.malo,
        'loco': datos_pensamientos.loco,
        'estupido': datos_pensamientos.estupido,
        'ingenuo': datos_pensamientos.ingenuo,
        'honesto': datos_pensamientos.honesto,
        'incompetente': datos_pensamientos.incompetente,
        'pensamientos_horribles': datos_pensamientos.pensamientos_horribles,
        'con_desviaciones': datos_pensamientos.con_desviaciones,
        'sin_atractivos': datos_pensamientos.sin_atractivos,
        'sin_carinio': datos_pensamientos.sin_carinio,
        'inadecuado': datos_pensamientos.inadecuado,
        'confuso': datos_pensamientos.confuso,
        'flojo': datos_pensamientos.flojo,
        'no_digno_confianza': datos_pensamientos.no_digno_confianza,
        'deshonesto': datos_pensamientos.deshonesto,
        'con_ideas_suicidas': datos_pensamientos.con_ideas_suicidas,
        'perseverante': datos_pensamientos.perseverante,
        'buen_sentido_humor': datos_pensamientos.buen_sentido_humor,
        'trabajo_duro': datos_pensamientos.trabajo_duro,
        'indeseable': datos_pensamientos.indeseable,
        'en_conflicto': datos_pensamientos.en_conflicto,
        'dificultades_concentrarse': datos_pensamientos.dificultades_concentrarse,
        'prob_memoria': datos_pensamientos.prob_memoria,
        'atractivo': datos_pensamientos.atractivo,
        'no_puedo_tomar_decisiones': datos_pensamientos.no_puedo_tomar_decisiones,
        'feo': datos_pensamientos.feo,
        'considerado': datos_pensamientos.considerado,
        'degenerado': datos_pensamientos.degenerado,
        'otros': datos_pensamientos.otros
    }
        
    return resultado
