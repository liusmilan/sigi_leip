from django.db import models
from estado_app.models import estado
from municipio_app.models import municipio
from atencion_psicologica_app.models import atencion_psicologica
from estado_civil_app.models import estado_civil
from licenciatura_app.models import licenciatura
from vive_en_app.models import vive_en
from vive_con_app.models import vive_con
from religion_app.models import religion
from grado_academico_app.models import grado_academico
from persona_app.models import persona


# Create your models here.
class historia_clinica(models.Model):
    # seccion 1
    estado_nac = models.ForeignKey(
        estado, on_delete=models.CASCADE, blank=True, null=True)
    municipio_nac = models.ForeignKey(
        municipio, on_delete=models.CASCADE, blank=True, null=True)
    estado_civil = models.ForeignKey(
        estado_civil, on_delete=models.CASCADE, blank=True, null=True)
    ocupacion = models.CharField(max_length=255, blank=True, null=True)
    carrera = models.ForeignKey(
        licenciatura, on_delete=models.CASCADE, blank=True, null=True)
    vive_en = models.ForeignKey(
        vive_en, on_delete=models.CASCADE, blank=True, null=True)
    vive_con = models.ForeignKey(
        vive_con, on_delete=models.CASCADE, blank=True, null=True)
    religion = models.ForeignKey(
        religion, on_delete=models.CASCADE, blank=True, null=True)
    grado_est = models.ForeignKey(
        grado_academico, on_delete=models.CASCADE, blank=True, null=True)
    nombre_emergencia = models.CharField(max_length=255, blank=True, null=True)
    tlf_emergencia = models.CharField(max_length=255, blank=True, null=True)
    pasatiempos = models.TextField(blank=True, null=True)
    peso = models.DecimalField(
        blank=True, null=True, decimal_places=2, max_digits=5)
    estatura = models.DecimalField(
        blank=True, null=True, decimal_places=2, max_digits=5)
    peso_varia = models.BooleanField(null=True, blank=True)
    gustar_trabajo = models.BooleanField(null=True, blank=True)
    que_hace_trab = models.CharField(max_length=255, blank=True, null=True)
    trab_pasados = models.CharField(max_length=255, blank=True, null=True)
    terapia_antes = models.BooleanField(null=True, blank=True)
    ayuda_problema = models.TextField(blank=True, null=True)
    medico_cabecera = models.BooleanField(null=True, blank=True)
    nombre_medico_cabecera = models.CharField(
        max_length=255, blank=True, null=True)
    tlf_medico_cabecera = models.CharField(
        max_length=255, blank=True, null=True)
    lugar_terapia_pasada = models.TextField(blank=True, null=True)
    hosp_prob_psico = models.BooleanField(null=True, blank=True)
    lugar_hosp_prob_psico = models.TextField(blank=True, null=True)
    hacerse_danio_suicidio = models.BooleanField(null=True, blank=True)
    tiempo_forma_hacerse_danio_suicidio = models.TextField(
        blank=True, null=True)
    familia_suicidio = models.BooleanField(null=True, blank=True)
    quien_lo_envia = models.CharField(null=True, blank=True, max_length=255)
    prob_emocion_mental = models.BooleanField(null=True, blank=True)
    # seccion 2
    nombre_padre = models.CharField(max_length=255, blank=True, null=True)
    edad_padre = models.IntegerField(blank=True, null=True)
    ocupacion_padre = models.CharField(max_length=255, blank=True, null=True)
    grado_estudio_padre = models.CharField(
        max_length=255, blank=True, null=True)
    estado_salud_padre = models.CharField(
        max_length=255, blank=True, null=True)
    edad_murio_padre = models.IntegerField(blank=True, null=True)
    causa_muerte_padre = models.CharField(
        max_length=255, blank=True, null=True)
    edad_hijo_morir_padre = models.IntegerField(blank=True, null=True)
    nombre_madre = models.CharField(max_length=255, blank=True, null=True)
    edad_madre = models.IntegerField(blank=True, null=True)
    ocupacion_madre = models.CharField(max_length=255, blank=True, null=True)
    grado_estudio_madre = models.CharField(
        max_length=255, blank=True, null=True)
    estado_salud_madre = models.CharField(
        max_length=255, blank=True, null=True)
    edad_murio_madre = models.IntegerField(blank=True, null=True)
    causa_muerte_madre = models.CharField(
        max_length=255, blank=True, null=True)
    edad_hijo_morir_madre = models.IntegerField(blank=True, null=True)
    cant_hermanos = models.IntegerField(blank=True, null=True)
    edades_hermanos = models.CharField(max_length=255, blank=True, null=True)
    detalles_padres_hermanos = models.TextField(blank=True, null=True)
    con_quien_crecio = models.TextField(blank=True, null=True)
    person_actitud_padre = models.TextField(blank=True, null=True)
    person_actitud_madre = models.TextField(blank=True, null=True)
    forma_castigado_padres = models.TextField(blank=True, null=True)
    atmosfera_casa = models.TextField(blank=True, null=True)
    confia_padres = models.BooleanField(null=True, blank=True)
    edad_casar_padres = models.IntegerField(blank=True, null=True)
    siente_amor_padres = models.BooleanField(null=True, blank=True)
    familia_interferir_matrimonio = models.BooleanField(null=True, blank=True)
    # seccion 3
    desc_natu_prob = models.TextField(blank=True, null=True)
    empezar_prob = models.TextField(blank=True, null=True)
    empeora_prob = models.TextField(blank=True, null=True)
    mejora_prob = models.TextField(blank=True, null=True)
    desc_problema_sec3 = models.IntegerField(blank=True, null=True)
    satisf_vida_todo = models.IntegerField(blank=True, null=True)
    nivel_tension_mes_pasado = models.IntegerField(blank=True, null=True)
    # seccion 4
    piensa_espera_terapia = models.TextField(blank=True, null=True)
    caract_posee_terapeuta = models.TextField(blank=True, null=True)
    tiempo_terapia = models.CharField(max_length=255, blank=True, null=True)
    # Conductas
    talentos_habilidades = models.TextField(blank=True, null=True)
    gustaria_dejar_hacer = models.TextField(blank=True, null=True)
    gustaria_empezar_hacer = models.TextField(blank=True, null=True)
    actividades_relajarse = models.TextField(blank=True, null=True)
    tiempo_libre = models.TextField(blank=True, null=True)
    dos_deseos = models.TextField(blank=True, null=True)
    prob_relajarse = models.BooleanField(null=True, blank=True)
    # sentimientos
    cinco_miedos = models.TextField(blank=True, null=True)
    perder_control_sentimientos = models.TextField(blank=True, null=True)
    sentimientos_positivos_recientes = models.TextField(blank=True, null=True)
    situacion_calmado_relajado = models.TextField(blank=True, null=True)
    # sensaciones fisicas
    sensaciones_placenteras = models.TextField(blank=True, null=True)
    sensaciones_no_placenteras = models.TextField(blank=True, null=True)
    # imagenes
    img_fantasia_placentera = models.TextField(blank=True, null=True)
    img_fantasia_no_placentera = models.TextField(blank=True, null=True)
    img_molesta_func_cotidiano = models.TextField(blank=True, null=True)
    pesadillas_seguidas = models.TextField(blank=True, null=True)
    # pensamientos
    idea_mas_loca = models.TextField(blank=True, null=True)
    afectar_negativamente_humor = models.TextField(blank=True, null=True)
    pensamientos_vuelven_vuelve = models.BooleanField(null=True, blank=True)
    cuales_pensamto_vuelven = models.TextField(blank=True, null=True)
    no_cometer_errores = models.IntegerField(blank=True, null=True)
    bueno_todo = models.IntegerField(blank=True, null=True)
    no_relevar_info_pers = models.IntegerField(blank=True, null=True)
    aparentar_saber = models.IntegerField(blank=True, null=True)
    victima_circunstancias = models.IntegerField(blank=True, null=True)
    pers_mas_felices_yo = models.IntegerField(blank=True, null=True)
    complacer_otras_personas = models.IntegerField(blank=True, null=True)
    no_tomar_riesgos = models.IntegerField(blank=True, null=True)
    vida_controlada_fuerzas_exter = models.IntegerField(blank=True, null=True)
    no_merezco_feliz = models.IntegerField(blank=True, null=True)
    ignoro_problemas = models.IntegerField(blank=True, null=True)
    hacer_felices_otros = models.IntegerField(blank=True, null=True)
    trabajar_duro_perfeccion = models.IntegerField(blank=True, null=True)
    formas_hacer_cosas = models.IntegerField(blank=True, null=True)
    nunca_molesto = models.IntegerField(blank=True, null=True)
    # relaciones interpersonales
    hace_amigos_facil = models.BooleanField(null=True, blank=True)
    conserva_amigos = models.BooleanField(null=True, blank=True)
    citas_estudiante_secundaria = models.BooleanField(null=True, blank=True)
    citas_estudiante_preparatoria = models.BooleanField(null=True, blank=True)
    relacion_alergias = models.TextField(blank=True, null=True)
    relacion_problemas = models.TextField(blank=True, null=True)
    grado_situaciones_sociales = models.IntegerField(blank=True, null=True)
    tiempo_pareja_antes_casarse = models.CharField(
        max_length=255, blank=True, null=True)
    tiempo_comprometido_antes_casarse = models.CharField(
        max_length=255, blank=True, null=True)
    tiempo_mujer = models.CharField(max_length=255, blank=True, null=True)
    edad_pareja = models.CharField(max_length=255, blank=True, null=True)
    ocupacion_pareja = models.CharField(max_length=255, blank=True, null=True)
    personalidad_pareja = models.CharField(
        max_length=255, blank=True, null=True)
    mas_gusta_pareja = models.TextField(blank=True, null=True)
    menos_gusta_pareja = models.TextField(blank=True, null=True)
    factores_disminuyen_satisf_pareja = models.TextField(blank=True, null=True)
    detalle_signif_pareja_anterior = models.TextField(blank=True, null=True)
    grado_satisf_pareja = models.IntegerField(blank=True, null=True)
    amigos_familiares_pareja = models.IntegerField(blank=True, null=True)
    datos_hijos_tiene = models.TextField(blank=True, null=True)
    hijos_con_problema = models.BooleanField(null=True, blank=True)
    problemas_de_hijos = models.CharField(
        max_length=255, blank=True, null=True)
    # relaciones sexuales
    actitud_padres_sexo = models.TextField(blank=True, null=True)
    detalle_sexo_casa = models.TextField(blank=True, null=True)
    primeros_conoc_sobre_sexo = models.TextField(blank=True, null=True)
    impulsos_sexuales = models.TextField(blank=True, null=True)
    pena_acerca_sexo = models.BooleanField(null=True, blank=True)
    detalle_pena_acerca_sexo = models.TextField(blank=True, null=True)
    visa_sexual_satisf = models.BooleanField(null=True, blank=True)
    detalles_visa_sexual_satisf = models.TextField(blank=True, null=True)
    reaccion_relacion_homosexual = models.TextField(blank=True, null=True)
    info_sexual_relevante = models.TextField(blank=True, null=True)
    probl_relac_personas_trabj = models.BooleanField(null=True, blank=True)
    detalles_probl_relac_personas_trabj = models.TextField(
        blank=True, null=True)
    forma_me_lastima = models.TextField(blank=True, null=True)
    pareja_describe_como = models.TextField(blank=True, null=True)
    gente_no_gusta_es = models.TextField(blank=True, null=True)
    alterar_alguien_haciendo = models.TextField(blank=True, null=True)
    mejor_amigo_piensa_soy = models.TextField(blank=True, null=True)
    prob_por_rechazo_amoroso = models.BooleanField(null=True, blank=True)
    detalle_prob_por_rechazo_amoroso = models.TextField(blank=True, null=True)
    detalle_primera_exp_sexual = models.TextField(blank=True, null=True)
    # factores biologicos
    prob_salud_fisica = models.BooleanField(null=True, blank=True)
    detalle_prob_salud_fisica = models.TextField(blank=True, null=True)
    medicamentos_actuales = models.TextField(blank=True, null=True)
    dieta_balanceada_trees_veces_dia = models.BooleanField(
        null=True, blank=True)
    prob_medicos_haya_padecido = models.TextField(blank=True, null=True)
    practica_ejerc_fisico = models.BooleanField(null=True, blank=True)
    tipo_frecuencia_ejerc_fisico = models.TextField(blank=True, null=True)
    operado = models.BooleanField(null=True, blank=True)
    tipo_fecha_cirugia = models.TextField(blank=True, null=True)
    prob_medicos_familia = models.TextField(blank=True, null=True)
    edad_primera_menstruacion = models.IntegerField(blank=True, null=True)
    probl_menstruaciones = models.BooleanField(null=True, blank=True)
    periodos_regulares = models.BooleanField(null=True, blank=True)
    conoce_menstruacion = models.BooleanField(null=True, blank=True)
    menstuacion_dolor = models.BooleanField(null=True, blank=True)
    duracion_periodos = models.CharField(max_length=255, blank=True, null=True)
    fecha_ultima_menstruacion = models.DateTimeField(blank=True, null=True)
    debilidad_muscular = models.IntegerField(blank=True, null=True)
    tranquilizantes = models.IntegerField(blank=True, null=True)
    diureticos = models.IntegerField(blank=True, null=True)
    pastillas_adelgazar = models.IntegerField(blank=True, null=True)
    marihuana = models.IntegerField(blank=True, null=True)
    hormonas = models.IntegerField(blank=True, null=True)
    pastillas_dormir = models.IntegerField(blank=True, null=True)
    aspirinas = models.IntegerField(blank=True, null=True)
    cocaina = models.IntegerField(blank=True, null=True)
    analgesicos = models.IntegerField(blank=True, null=True)
    narcoticos = models.IntegerField(blank=True, null=True)
    estimulantes = models.IntegerField(blank=True, null=True)
    alucinogenos = models.IntegerField(blank=True, null=True)
    laxantes = models.IntegerField(blank=True, null=True)
    cigarrillos = models.IntegerField(blank=True, null=True)
    tabaco = models.IntegerField(blank=True, null=True)
    cafe = models.IntegerField(blank=True, null=True)
    alcohol = models.IntegerField(blank=True, null=True)
    anticonceptivos_orales = models.IntegerField(blank=True, null=True)
    vitaminas = models.IntegerField(blank=True, null=True)
    escasa_alimentacion = models.IntegerField(blank=True, null=True)
    alimentacion_abundante = models.IntegerField(blank=True, null=True)
    comida_chatarra = models.IntegerField(blank=True, null=True)
    diarrea = models.IntegerField(blank=True, null=True)
    estrenimiento = models.IntegerField(blank=True, null=True)
    gases = models.IntegerField(blank=True, null=True)
    indigestion = models.IntegerField(blank=True, null=True)
    nauseas = models.IntegerField(blank=True, null=True)
    vomitos = models.IntegerField(blank=True, null=True)
    agruras = models.IntegerField(blank=True, null=True)
    mareos = models.IntegerField(blank=True, null=True)
    palpitaciones = models.IntegerField(blank=True, null=True)
    fatiga = models.IntegerField(blank=True, null=True)
    alergias = models.IntegerField(blank=True, null=True)
    presion_arterial_alta = models.IntegerField(blank=True, null=True)
    dolor_pecho = models.IntegerField(blank=True, null=True)
    respiracion_cortada = models.IntegerField(blank=True, null=True)
    insomnio = models.IntegerField(blank=True, null=True)
    dormir_mas_tiempo = models.IntegerField(blank=True, null=True)
    dormir_ratos = models.IntegerField(blank=True, null=True)
    despertarse_temprano = models.IntegerField(blank=True, null=True)
    dolor_oido = models.IntegerField(blank=True, null=True)
    dolor_cabeza = models.IntegerField(blank=True, null=True)
    dolor_espalda = models.IntegerField(blank=True, null=True)
    moretones_sangrado = models.IntegerField(blank=True, null=True)
    prob_peso = models.IntegerField(blank=True, null=True)
    menst_afecta_animo = models.BooleanField(null=True, blank=True)
    otros_fact_biolg = models.TextField(blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)
    aplicado_por = models.ForeignKey(
        persona, on_delete=models.CASCADE, blank=True, null=True)
    atencion = models.OneToOneField(
        atencion_psicologica, on_delete=models.CASCADE, blank=False, null=False)

    class Meta:
        verbose_name = 'historia_clinica'
        verbose_name_plural = 'Historia Clinica'
        ordering = ['id']


class caracteristicas_infancia_adolescencia(models.Model):
    infancia_feliz = models.BooleanField(null=True, blank=True)
    infancia_infeliz = models.BooleanField(null=True, blank=True)
    prob_emoc_cond = models.BooleanField(null=True, blank=True)
    prob_leg = models.BooleanField(null=True, blank=True)
    muerte_familia = models.BooleanField(null=True, blank=True)
    prob_med = models.BooleanField(null=True, blank=True)
    ignorado = models.BooleanField(null=True, blank=True)
    pocos_amigos = models.BooleanField(null=True, blank=True)
    prob_escuela = models.BooleanField(null=True, blank=True)
    convicciones_religiosas = models.BooleanField(null=True, blank=True)
    uso_drogas = models.BooleanField(null=True, blank=True)
    uso_alcohol = models.BooleanField(null=True, blank=True)
    castigado_sev = models.BooleanField(null=True, blank=True)
    abusado_sex = models.BooleanField(null=True, blank=True)
    prob_financieros = models.BooleanField(null=True, blank=True)
    int_mol_sev = models.BooleanField(null=True, blank=True)
    prob_alim = models.BooleanField(null=True, blank=True)
    otros = models.TextField(blank=True, null=True)
    hc = models.ForeignKey(
        historia_clinica, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        verbose_name = 'caracteristicas_infancia_adolescencia'
        verbose_name_plural = 'caracteristicas_infancia_adolescencia'
        ordering = ['id']


class modalidad_conductas(models.Model):
    comer_de_mas = models.BooleanField(null=True, blank=True)
    consumir_drogas = models.BooleanField(null=True, blank=True)
    no_hacer_desea = models.BooleanField(null=True, blank=True)
    conductas_incorrectas = models.BooleanField(null=True, blank=True)
    beber_demasiado = models.BooleanField(null=True, blank=True)
    trabajar_demasiado = models.BooleanField(null=True, blank=True)
    demorando_algo = models.BooleanField(null=True, blank=True)
    relaciones_impulsivas = models.BooleanField(null=True, blank=True)
    perdida_control = models.BooleanField(null=True, blank=True)
    intentos_suicidas = models.BooleanField(null=True, blank=True)
    compulsiones = models.BooleanField(null=True, blank=True)
    fumar = models.BooleanField(null=True, blank=True)
    dejar_hacer_algo = models.BooleanField(null=True, blank=True)
    tics_nerviosos = models.BooleanField(null=True, blank=True)
    dificultad_concentrarse = models.BooleanField(null=True, blank=True)
    trastornos_suenio = models.BooleanField(null=True, blank=True)
    evitacion_fobica = models.BooleanField(null=True, blank=True)
    gastar_mucho_dinero = models.BooleanField(null=True, blank=True)
    no_encontrar_trabajo = models.BooleanField(null=True, blank=True)
    insomnio = models.BooleanField(null=True, blank=True)
    tomar_riesgos = models.BooleanField(null=True, blank=True)
    perezoso = models.BooleanField(null=True, blank=True)
    prob_alimentacion = models.BooleanField(null=True, blank=True)
    conducta_agresiva = models.BooleanField(null=True, blank=True)
    llanto = models.BooleanField(null=True, blank=True)
    enojado_ocaciones = models.BooleanField(null=True, blank=True)
    otros = models.TextField(blank=True, null=True)
    hc = models.ForeignKey(
        historia_clinica, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        verbose_name = 'modalidad_conductas'
        verbose_name_plural = 'modalidad_conductas'
        ordering = ['id']


class modalidad_sentimientos(models.Model):
    enojado = models.BooleanField(null=True, blank=True)
    fastidiado = models.BooleanField(null=True, blank=True)
    triste = models.BooleanField(null=True, blank=True)
    deprimido = models.BooleanField(null=True, blank=True)
    envidioso = models.BooleanField(null=True, blank=True)
    culpable = models.BooleanField(null=True, blank=True)
    feliz = models.BooleanField(null=True, blank=True)
    ansioso = models.BooleanField(null=True, blank=True)
    con_miedo = models.BooleanField(null=True, blank=True)
    con_panico = models.BooleanField(null=True, blank=True)
    energetico = models.BooleanField(null=True, blank=True)
    en_conflicto = models.BooleanField(null=True, blank=True)
    avergonzado = models.BooleanField(null=True, blank=True)
    apenado = models.BooleanField(null=True, blank=True)
    esperanzado = models.BooleanField(null=True, blank=True)
    desamparado = models.BooleanField(null=True, blank=True)
    relajado = models.BooleanField(null=True, blank=True)
    celoso = models.BooleanField(null=True, blank=True)
    infeliz = models.BooleanField(null=True, blank=True)
    aburrido = models.BooleanField(null=True, blank=True)
    sin_descanso = models.BooleanField(null=True, blank=True)
    solitario = models.BooleanField(null=True, blank=True)
    satisfecho = models.BooleanField(null=True, blank=True)
    excitado = models.BooleanField(null=True, blank=True)
    optimista = models.BooleanField(null=True, blank=True)
    tenso = models.BooleanField(null=True, blank=True)
    sin_esperanza = models.BooleanField(null=True, blank=True)
    otros = models.TextField(blank=True, null=True)
    hc = models.ForeignKey(historia_clinica, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        verbose_name = 'modalidad_sentimientos'
        verbose_name_plural = 'modalidad_sentimientos'
        ordering = ['id']


class modalidad_sensaciones_fisicas(models.Model):
    dolor_abdominal = models.BooleanField(null=True, blank=True)
    dolor_orinar = models.BooleanField(null=True, blank=True)
    dolor_menstruacion = models.BooleanField(null=True, blank=True)
    dolor_cabeza = models.BooleanField(null=True, blank=True)
    mareos = models.BooleanField(null=True, blank=True)
    palpitaciones = models.BooleanField(null=True, blank=True)
    espasmos_musculares = models.BooleanField(null=True, blank=True)
    tensiones = models.BooleanField(null=True, blank=True)
    trastornos_sexuales = models.BooleanField(null=True, blank=True)
    incapacidad_relajarse = models.BooleanField(null=True, blank=True)
    alteraciones_intestinales = models.BooleanField(null=True, blank=True)
    hormigueos = models.BooleanField(null=True, blank=True)
    problemas_piel = models.BooleanField(null=True, blank=True)
    boca_seca = models.BooleanField(null=True, blank=True)
    sensacion_quemaduras = models.BooleanField(null=True, blank=True)
    latidos_cardiacos_rapidos = models.BooleanField(null=True, blank=True)
    no_ser_tocado = models.BooleanField(null=True, blank=True)
    entumecimiento = models.BooleanField(null=True, blank=True)
    problemas_estomacales = models.BooleanField(null=True, blank=True)
    tics = models.BooleanField(null=True, blank=True)
    fatiga = models.BooleanField(null=True, blank=True)
    dolor_espalda = models.BooleanField(null=True, blank=True)
    temblores = models.BooleanField(null=True, blank=True)
    desmayos = models.BooleanField(null=True, blank=True)
    escuchar_ruidos = models.BooleanField(null=True, blank=True)
    ojos_llorosos = models.BooleanField(null=True, blank=True)
    catarro = models.BooleanField(null=True, blank=True)
    nauseas = models.BooleanField(null=True, blank=True)
    vertigo = models.BooleanField(null=True, blank=True)
    sudoracion_excesiva = models.BooleanField(null=True, blank=True)
    alteraciones_visuales = models.BooleanField(null=True, blank=True)
    problemas_audicion = models.BooleanField(null=True, blank=True)
    variacion_peso = models.BooleanField(null=True, blank=True)
    otros = models.TextField(blank=True, null=True)
    hc = models.ForeignKey(
        historia_clinica, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        verbose_name = 'modalidad_sensaciones_fisicas'
        verbose_name_plural = 'modalidad_sensaciones_fisicas'
        ordering = ['id']


class modalidad_imagenes_me_veo(models.Model):
    siendo_feliz = models.BooleanField(null=True, blank=True)
    herido_sentimientos = models.BooleanField(null=True, blank=True)
    incapaz_afrontar_prob = models.BooleanField(null=True, blank=True)
    exitoso = models.BooleanField(null=True, blank=True)
    perdiendo_control = models.BooleanField(null=True, blank=True)
    siendo_seguido = models.BooleanField(null=True, blank=True)
    hablan_mi = models.BooleanField(null=True, blank=True)
    desamparado = models.BooleanField(null=True, blank=True)
    lastimando_otros = models.BooleanField(null=True, blank=True)
    cargo_cosas = models.BooleanField(null=True, blank=True)
    fallando = models.BooleanField(null=True, blank=True)
    atrapado = models.BooleanField(null=True, blank=True)
    siendo_promiscuo = models.BooleanField(null=True, blank=True)
    siendo_agreivo = models.BooleanField(null=True, blank=True)
    otros = models.TextField(blank=True, null=True)
    hc = models.ForeignKey(
        historia_clinica, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        verbose_name = 'modalidad_imagenes_me_veo'
        verbose_name_plural = 'modalidad_imagenes_me_veo'
        ordering = ['id']


class modalidad_imagenes_tengo(models.Model):
    img_sexuales_placenteras = models.BooleanField(null=True, blank=True)
    img_sexuales_no_placenteras = models.BooleanField(null=True, blank=True)
    img_desagradables_infancia = models.BooleanField(null=True, blank=True)
    img_corporal_negativa = models.BooleanField(null=True, blank=True)
    imagino_amado = models.BooleanField(null=True, blank=True)
    img_soledad = models.BooleanField(null=True, blank=True)
    img_seduccion = models.BooleanField(null=True, blank=True)
    otros = models.TextField(blank=True, null=True)
    hc = models.ForeignKey(
        historia_clinica, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        verbose_name = 'modalidad_imagenes_tengo'
        verbose_name_plural = 'modalidad_imagenes_tengo'
        ordering = ['id']


class modalidad_pensamientos(models.Model):
    inteligente = models.BooleanField(null=True, blank=True)
    confidente = models.BooleanField(null=True, blank=True)
    valgo_pena = models.BooleanField(null=True, blank=True)
    ambocioso = models.BooleanField(null=True, blank=True)
    sensitivo = models.BooleanField(null=True, blank=True)
    leal = models.BooleanField(null=True, blank=True)
    confiable_fidedigno = models.BooleanField(null=True, blank=True)
    lleno_penas = models.BooleanField(null=True, blank=True)
    indigno = models.BooleanField(null=True, blank=True)
    don_nadie = models.BooleanField(null=True, blank=True)
    inutil = models.BooleanField(null=True, blank=True)
    malo = models.BooleanField(null=True, blank=True)
    loco = models.BooleanField(null=True, blank=True)
    estupido = models.BooleanField(null=True, blank=True)
    ingenuo = models.BooleanField(null=True, blank=True)
    honesto = models.BooleanField(null=True, blank=True)
    incompetente = models.BooleanField(null=True, blank=True)
    pensamientos_horribles = models.BooleanField(null=True, blank=True)
    con_desviaciones = models.BooleanField(null=True, blank=True)
    sin_atractivos = models.BooleanField(null=True, blank=True)
    sin_carinio = models.BooleanField(null=True, blank=True)
    inadecuado = models.BooleanField(null=True, blank=True)
    confuso = models.BooleanField(null=True, blank=True)
    flojo = models.BooleanField(null=True, blank=True)
    no_digno_confianza = models.BooleanField(null=True, blank=True)
    deshonesto = models.BooleanField(null=True, blank=True)
    con_ideas_suicidas = models.BooleanField(null=True, blank=True)
    perseverante = models.BooleanField(null=True, blank=True)
    buen_sentido_humor = models.BooleanField(null=True, blank=True)
    trabajo_duro = models.BooleanField(null=True, blank=True)
    indeseable = models.BooleanField(null=True, blank=True)
    en_conflicto = models.BooleanField(null=True, blank=True)
    dificultades_concentrarse = models.BooleanField(null=True, blank=True)
    prob_memoria = models.BooleanField(null=True, blank=True)
    atractivo = models.BooleanField(null=True, blank=True)
    no_puedo_tomar_decisiones = models.BooleanField(null=True, blank=True)
    feo = models.BooleanField(null=True, blank=True)
    considerado = models.BooleanField(null=True, blank=True)
    degenerado = models.BooleanField(null=True, blank=True)
    otros = models.TextField(blank=True, null=True)
    hc = models.ForeignKey(
        historia_clinica, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        verbose_name = 'modalidad_pensamientos'
        verbose_name_plural = 'modalidad_pensamientos'
        ordering = ['id']
