var historia_clinica = (function () {
  var $ = jQuery.noConflict();
  var accion = "";
  var id_municipio_actual = "";
  var id_municipio_nacimiento = "";
  var id_vive_en = "";
  var id_vive_con = "";
  var id_carrera = "";
  var id_estado_civil = "";
  var id_religion = "";
  var id_grado_academico = "";

  $(".fecha_nacimiento_seccion1_hc").datepicker({
    format: "dd/mm/yyyy",
    language: "es",
    todayHighlight: true,
  });

  $(".fecha_ultimo_periodo_menst_hc").datepicker({
    format: "dd/mm/yyyy",
    language: "es",
    todayHighlight: true,
  });

  /== evento para validar que escriban en el campo del telefono solo numeros y () - ==/;
  $(".input-number").on("input", function () {
    this.value = this.value.replace(/[^0-9 ()-]/g, "");
  });

  function initEvents() {
    /== evento para mostrar modal de hc ==/;
    $("#btn_add_historia_clinica").on("click", function () {
      var id_atencion = $("#id_atencion").val();

      $.ajax({
        url: "/historia_clinica/get_hc",
        type: "get",
        data: {id_atencion: id_atencion},
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'Ya existe una Historia Clínica registrada para esta Atención.', 'error');
          } else {
            llenarCampoAplicadoPor();
            crearSelectsFormularioHc();
            accion = 'agregar';

            getAtencion(id_atencion).done(function (data) {
              $("#nombre_persona_hc").val(
                data.atencion.solicitante.nombre +
                  (data.atencion.solicitante.segundo_nombre
                    ? " " + data.atencion.solicitante.segundo_nombre + " "
                    : " ") +
                  data.atencion.solicitante.apellido +
                  (data.atencion.solicitante.segundo_apellido
                    ? " " + data.atencion.solicitante.segundo_apellido
                    : "")
              );
              $("#fecha_nacimiento_hc").val(
                data.atencion.solicitante.fecha_nacimiento
              );
              $("#edad_hc").text(
                calcularEdad(data.atencion.solicitante.fecha_nacimiento) + " años"
              );
              $("#email_hc").val(data.atencion.solicitante.email);
              $("#telefono_persona_hc").val(
                data.atencion.solicitante.telefono_contacto
              );
              $("#direccion_actual_hc").val(data.atencion.solicitante.direccion);
              $("#nombre_contacto_hc").val(
                data.atencion.solicitante.nombre_emergencia
              );
              $("#telefono_contacto_hc").val(
                data.atencion.solicitante.telefono_emergencia
              );
              $("#parentesco_hc").val(data.atencion.solicitante.parentesco);

              if (data.atencion.solicitante.sexo == "H") {
                $("#check_sexo_hombre_hc").prop("checked", true);
              } else if (data.atencion.solicitante.sexo == "M") {
                $("#check_sexo_mujer_hc").prop("checked", true);
              }

              llenarSelectEstados(
                data.atencion.solicitante.estado,
                "#estado_actual_hc"
              );

              id_municipio_actual = data.atencion.solicitante.municipio;
              llenarSelectCarreras(data.atencion.licenciatura.id);
              llenarSelectEstados("", "#estado_nacimiento_hc");
              llenarSelectViveEn("");
              llenarSelectViveCon("");
              llenarSelectEstadoCivil("");
              llenarSelectReligion("");
              llenarSelectGradoAcademico("");
              llenarSelectsForms("#pensamiento_select_1", "", true);
              llenarSelectsForms("#pensamiento_select_2", "", true);
              llenarSelectsForms("#pensamiento_select_3", "", true);
              llenarSelectsForms("#pensamiento_select_4", "", true);
              llenarSelectsForms("#pensamiento_select_5", "", true);
              llenarSelectsForms("#pensamiento_select_6", "", true);
              llenarSelectsForms("#pensamiento_select_7", "", true);
              llenarSelectsForms("#pensamiento_select_8", "", true);
              llenarSelectsForms("#pensamiento_select_9", "", true);
              llenarSelectsForms("#pensamiento_select_10", "", true);
              llenarSelectsForms("#pensamiento_select_11", "", true);
              llenarSelectsForms("#pensamiento_select_12", "", true);
              llenarSelectsForms("#pensamiento_select_13", "", true);
              llenarSelectsForms("#pensamiento_select_14", "", true);
              llenarSelectsForms("#pensamiento_select_15", "", true);
              llenarSelectsForms("#fac_biolg_select_1", "", false);
              llenarSelectsForms("#fac_biolg_select_2", "", false);
              llenarSelectsForms("#fac_biolg_select_3", "", false);
              llenarSelectsForms("#fac_biolg_select_4", "", false);
              llenarSelectsForms("#fac_biolg_select_5", "", false);
              llenarSelectsForms("#fac_biolg_select_6", "", false);
              llenarSelectsForms("#fac_biolg_select_7", "", false);
              llenarSelectsForms("#fac_biolg_select_8", "", false);
              llenarSelectsForms("#fac_biolg_select_9", "", false);
              llenarSelectsForms("#fac_biolg_select_10", "", false);
              llenarSelectsForms("#fac_biolg_select_11", "", false);
              llenarSelectsForms("#fac_biolg_select_12", "", false);
              llenarSelectsForms("#fac_biolg_select_13", "", false);
              llenarSelectsForms("#fac_biolg_select_14", "", false);
              llenarSelectsForms("#fac_biolg_select_15", "", false);
              llenarSelectsForms("#fac_biolg_select_16", "", false);
              llenarSelectsForms("#fac_biolg_select_17", "", false);
              llenarSelectsForms("#fac_biolg_select_18", "", false);
              llenarSelectsForms("#fac_biolg_select_19", "", false);
              llenarSelectsForms("#fac_biolg_select_20", "", false);
              llenarSelectsForms("#fac_biolg_select_21", "", false);
              llenarSelectsForms("#fac_biolg_select_22", "", false);
              llenarSelectsForms("#fac_biolg_select_23", "", false);
              llenarSelectsForms("#fac_biolg_select_24", "", false);
              llenarSelectsForms("#fac_biolg_select_25", "", false);
              llenarSelectsForms("#fac_biolg_select_26", "", false);
              llenarSelectsForms("#fac_biolg_select_27", "", false);
              llenarSelectsForms("#fac_biolg_select_28", "", false);
              llenarSelectsForms("#fac_biolg_select_29", "", false);
              llenarSelectsForms("#fac_biolg_select_30", "", false);
              llenarSelectsForms("#fac_biolg_select_31", "", false);
              llenarSelectsForms("#fac_biolg_select_32", "", false);
              llenarSelectsForms("#fac_biolg_select_33", "", false);
              llenarSelectsForms("#fac_biolg_select_34", "", false);
              llenarSelectsForms("#fac_biolg_select_35", "", false);
              llenarSelectsForms("#fac_biolg_select_36", "", false);
              llenarSelectsForms("#fac_biolg_select_37", "", false);
              llenarSelectsForms("#fac_biolg_select_38", "", false);
              llenarSelectsForms("#fac_biolg_select_39", "", false);
              llenarSelectsForms("#fac_biolg_select_40", "", false);
              llenarSelectsForms("#fac_biolg_select_41", "", false);
              llenarSelectsForms("#fac_biolg_select_42", "", false);
              llenarSelectsForms("#fac_biolg_select_44", "", false);
              llenarSelectsForms("#fac_biolg_select_45", "", false);
              llenarSelectsForms("#fac_biolg_select_46", "", false);
              llenarSelectsForms("#fac_biolg_select_47", "", false);
            });

            $("#modal_hc").modal("show");
          }
        },
        error: function(response) {}
      });
    });

    /== evento para cerrar modal de hc ==/;
    $("#btn_cerrar_modal_hc").on("click", function () {
      limpiarCampos();
      $("#modal_hc").modal("hide");
      $(document).trigger('actualizar_lista_atenciones');
    });

    // /== evento para cerrar modal de hc ==/;
    // $("#btn_cancelar_modal_hc").on("click", function () {
    //   limpiarCampos();
    //   $("#modal_hc").modal("hide");
    //   $(document).trigger('actualizar_lista_atenciones');
    // });

    /== evento para calcular la edad cuando se seleccione una fecha ==/;
    $("#fecha_nacimiento_hc").on("change", function () {
      var fecha = this.value;
      $("#edad_hc").text(calcularEdad(fecha) + " años");
    });

    /== evento para cargar los municipios segun el estado que se escoja ==/;
    $("#estado_actual_hc").on("change", function () {
      var id_estado = $(this).val();
      var optionSeleccione = $("<option/>").val("sel").text("Seleccione...");
      var optionEmpty = $("<option/>").val("-").text("-----------");

      // vaciar select municipios
      $.each($("#municipio_actual_hc").find("option"), function (key, value) {
        $(value).remove();
      });

      if (id_estado == "sel") {
        $("#municipio_actual_hc")
          .find("option")
          .end()
          .append(optionEmpty.attr("selected", true));
      } else {
        $.ajax({
          url: "/municipio/get_municipios_by_estado",
          data: {
            id_estado: id_estado,
          },
          type: "get",
          dataType: "json",
          success: function (response) {
            if (response.mensaje == "success") {
              $("#municipio_actual_hc")
                .find("option")
                .end()
                .append(optionSeleccione);

              $.each(response.municipios, function (key, value) {
                var option = $("<option/>").val(value.id).text(value.nombre);

                if (id_municipio_actual != "") {
                  // llenar select municipio en modal editar
                  if (value.id == id_municipio_actual) {
                    $("#municipio_actual_hc")
                      .find("option")
                      .end()
                      .append(option.attr("selected", true));
                  } else {
                    $("#municipio_actual_hc")
                      .find("option")
                      .end()
                      .append(option);
                  }
                } else {
                  // llenar select municipio en modal agregar
                  $("#municipio_actual_hc").find("option").end().append(option);
                }
              });

              $("#municipio_actual_hc")
                .trigger("chosen:updated")
                .trigger("change");
            } else {
              $("#municipio_actual_hc")
                .find("option")
                .end()
                .append(optionEmpty.attr("selected", true));
            }
          },
          error: function (response) {},
        });
      }
    });

    /== evento para cargar los municipios segun el estado que se escoja ==/;
    $("#estado_nacimiento_hc").on("change", function () {
      var id_estado = $(this).val();
      var optionSeleccione = $("<option/>").val("sel").text("Seleccione...");
      var optionEmpty = $("<option/>").val("-").text("-----------");

      // vaciar select municipios
      $.each(
        $("#municipio_nacimiento_hc").find("option"),
        function (key, value) {
          $(value).remove();
        }
      );

      if (id_estado == "sel") {
        $("#municipio_nacimiento_hc")
          .find("option")
          .end()
          .append(optionEmpty.attr("selected", true));
      } else {
        $.ajax({
          url: "/municipio/get_municipios_by_estado",
          data: {
            id_estado: id_estado,
          },
          type: "get",
          dataType: "json",
          success: function (response) {
            if (response.mensaje == "success") {
              $("#municipio_nacimiento_hc")
                .find("option")
                .end()
                .append(optionSeleccione);

              $.each(response.municipios, function (key, value) {
                var option = $("<option/>").val(value.id).text(value.nombre);

                if (id_municipio_nacimiento != "") {
                  // llenar select municipio en modal editar
                  if (value.id == id_municipio_nacimiento) {
                    $("#municipio_nacimiento_hc")
                      .find("option")
                      .end()
                      .append(option.attr("selected", true));
                  } else {
                    $("#municipio_nacimiento_hc")
                      .find("option")
                      .end()
                      .append(option);
                  }
                } else {
                  // llenar select municipio en modal agregar
                  $("#municipio_nacimiento_hc")
                    .find("option")
                    .end()
                    .append(option);
                }
              });

              $("#municipio_nacimiento_hc")
                .trigger("chosen:updated")
                .trigger("change");
            } else {
              $("#municipio_nacimiento_hc")
                .find("option")
                .end()
                .append(optionEmpty.attr("selected", true));
            }
          },
          error: function (response) {},
        });
      }
    });

    $('input[name="inlineRadioOptionsHijosProb"]').change(function () {
      if ($('#check_hijos_con_prob_si_hc').is(":checked")) {
        $('#prob_hijo_hc').prop('disabled', false);
      } else {
        $('#prob_hijo_hc').prop('disabled', true);
        $('#prob_hijo_hc').val('');
      }
    });

    $('input[name="inlineRadioOptionsAnsiedadPenaSex"]').change(function () {
      if ($('#check_pena_sex_si_hc').is(":checked")) {
        $('#detalle_pena_sex_hc').prop('disabled', false);
      } else {
        $('#detalle_pena_sex_hc').prop('disabled', true);
        $('#detalle_pena_sex_hc').val('');
      }
    });

    $('input[name="inlineRadioOptionsVidaSexSatisf"]').change(function () {
      if ($('#check_vida_sex_satisf_no_hc').is(":checked")) {
        $('#detalle_vida_sex_satisf_hc').prop('disabled', false);
      } else {
        $('#detalle_vida_sex_satisf_hc').prop('disabled', true);
        $('#detalle_vida_sex_satisf_hc').val('');
      }
    });

    $('input[name="inlineRadioOptionsRelTrabaj"]').change(function () {
      if ($('#check_rel_trabj_si_hc').is(":checked")) {
        $('#detalle_rel_trabj_hc').prop('disabled', false);
      } else {
        $('#detalle_rel_trabj_hc').prop('disabled', true);
        $('#detalle_rel_trabj_hc').val('');
      }
    });

    $('input[name="inlineRadioOptionsRechFracAmor"]').change(function () {
      if ($('#check_rech_frac_amor_si_hc').is(":checked")) {
        $('#detalle_rech_frac_amor_hc').prop('disabled', false);
      } else {
        $('#detalle_rech_frac_amor_hc').prop('disabled', true);
        $('#detalle_rech_frac_amor_hc').val('');
      }
    });

    $('input[name="inlineRadioOptionsProbSaludFis"]').change(function () {
      if ($('#check_prob_salud_fis_si_hc').is(":checked")) {
        $('#detalle_prob_salud_fis_hc').prop('disabled', false);
      } else {
        $('#detalle_prob_salud_fis_hc').prop('disabled', true);
        $('#detalle_prob_salud_fis_hc').val('');
      }
    });

    $('input[name="inlineRadioOptionsOperado"]').change(function () {
      if ($('#check_operado_si_hc').is(":checked")) {
        $('#detalle_operado_hc').prop('disabled', false);
      } else {
        $('#detalle_operado_hc').prop('disabled', true);
        $('#detalle_operado_hc').val('');
      }
    });

    $('input[name="inlineRadioOptionsEjercFisico"]').change(function () {
      if ($('#check_ejerc_fis_si_hc').is(":checked")) {
        $('#detalle_ejerc_fis_hc').prop('disabled', false);
      } else {
        $('#detalle_ejerc_fis_hc').prop('disabled', true);
        $('#detalle_ejerc_fis_hc').val('');
      }
    });

    /== evento para agregar HC ==/
    $('#form_hc').on('submit', function(e) {
      e.preventDefault();
      var id_atencion = $('#id_atencion').val();
      var id_usuario_autenticado = $("#user_autenticado").val();
      var textOriginalBtn = '<span class="indicator-label">Guardar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      $('#btn_agregar_hc').html(loadingTextBtn);

      if (validarDatos() == true) {
        $('#btn_agregar_hc').html(textOriginalBtn);
        notificacion('Error', 'Existen campos obligatorios que no ha llenado o seleccionado', 'error');
      } else {
        var listChecksInfanciaAdoles = [];
        var listChecksConductas = [];
        var listChecksSentimientos = [];
        var listChecksSensaFisicas = [];
        var listChecksImgMeVeo = [];
        var listChecksImgTengo = [];
        var listChecksPensamientos = [];

        $('.checksInfanciaAdoles:checked').each(function() {
          listChecksInfanciaAdoles.push($(this).attr('id'));
        });
        $('.checkConductas:checked').each(function() {
          listChecksConductas.push($(this).attr('id'));
        });
        $('.checkSentimientos:checked').each(function() {
          listChecksSentimientos.push($(this).attr('id'));
        });
        $('.checkSensaFisicas:checked').each(function() {
          listChecksSensaFisicas.push($(this).attr('id'));
        });
        $('.checkImgMeVeo:checked').each(function() {
          listChecksImgMeVeo.push($(this).attr('id'));
        });
        $('.checkImgTengo:checked').each(function() {
          listChecksImgTengo.push($(this).attr('id'));
        });
        $('.checkPensamientos:checked').each(function() {
          listChecksPensamientos.push($(this).attr('id'));
        });

        var params = {
          accion: accion,
          id_usuario_autenticado: id_usuario_autenticado,
          id_atencion: id_atencion,
          datos: $(this).serializeArray(),
          detalle_prob_hijo: $('#prob_hijo_hc').val(),
          detalle_pena_sex: $('#detalle_pena_sex_hc').val(),
          detalle_vida_sex_satisf: $('#detalle_vida_sex_satisf_hc').val(),
          detalle_rel_trabj: $('#detalle_rel_trabj_hc').val(),
          detalle_rech_frac_amor: $('#detalle_rech_frac_amor_hc').val(),
          detalle_prob_salud_fis: $('#detalle_prob_salud_fis_hc').val(),
          detalle_ejerc_fis: $('#detalle_ejerc_fis_hc').val(),
          detalle_operado: $('#detalle_operado_hc').val(),
          medico_cabecera: $('#check_medico_cabecera_si_hc').is(':checked') ? true : $('#check_medico_cabecera_no_hc').is(':checked') ? false : null,
          peso_varia: $('#check_peso_varia_si_hc').is(':checked') ? true : $('#check_peso_varia_no_hc').is(':checked') ? false : null,
          gusta_trabajo: $('#check_gusta_trabajo_si_hc').is(':checked') ? true : $('#check_gusta_trabajo_no_hc').is(':checked') ? false : null,
          terapia_antes: $('#check_terapia_anterior_si_hc').is(':checked') ? true : $('#check_terapia_anterior_no_hc').is(':checked') ? false : null,
          hospitalizado: $('#check_hospitalizado_si_hc').is(':checked') ? true : $('#check_hospitalizado_no_hc').is(':checked') ? false : null,
          hacerse_danio_suicidio: $('#check_danio_suicidio_si_hc').is(':checked') ? true : $('#check_danio_suicidio_no_hc').is(':checked') ? false : null,
          familia_intento_suicidio: $('#check_intento_suicidio_si_hc').is(':checked') ? true : $('#check_intento_suicidio_no_hc').is(':checked') ? false : null,
          confia_padres: $('#check_confianza_padres_si_hc').is(':checked') ? true : $('#check_confianza_padres_no_hc').is(':checked') ? false : null,
          sentir_amor_padres: $('#check_sentir_amor_padres_si_hc').is(':checked') ? true : $('#check_sentir_amor_padres_no_hc').is(':checked') ? false : null,
          familia_interfiere_matrimonio: $('#check_interferencia_si_hc').is(':checked') ? true : $('#check_interferencia_no_hc').is(':checked') ? false : null,
          problemas_relajarse: $('#check_prob_relax_si_hc').is(':checked') ? true : $('#check_prob_relax_no_hc').is(':checked') ? false : null,
          pensamientos_vuelven_vuelven: $('#check_pensamientos_si_hc').is(':checked') ? true : $('#check_pensamientos_no_hc').is(':checked') ? false : null,
          amigos_facil: $('#check_rel_int_amigos1_si_hc').is(':checked') ? true : $('#check_rel_int_amigos1_no_hc').is(':checked') ? false : null,
          conserva_amigos: $('#check_rel_int_amigos2_si_hc').is(':checked') ? true : $('#check_rel_int_amigos2_no_hc').is(':checked') ? false : null,
          citas_secundaria: $('#check_rel_int_cita_sec_si_hc').is(':checked') ? true : $('#check_rel_int_cita_sec_no_hc').is(':checked') ? false : null,
          citas_preparatoria: $('#check_rel_int_cita_prepa_si_hc').is(':checked') ? true : $('#check_rel_int_cita_prepa_no_hc').is(':checked') ? false : null,
          hijos_con_problemas: $('#check_hijos_con_prob_si_hc').is(':checked') ? true : $('#check_hijos_con_prob_no_hc').is(':checked') ? false : null,
          pena_sexo: $('#check_pena_sex_si_hc').is(':checked') ? true : $('#check_pena_sex_no_hc').is(':checked') ? false : null,
          vida_sexual_satisf: $('#check_vida_sex_satisf_si_hc').is(':checked') ? true : $('#check_vida_sex_satisf_no_hc').is(':checked') ? false : null,
          problemas_relacion_trabajo: $('#check_rel_trabj_si_hc').is(':checked') ? true : $('#check_rel_trabj_no_hc').is(':checked') ? false : null,
          problemas_rechazo_amoroso: $('#check_rech_frac_amor_si_hc').is(':checked') ? true : $('#check_rech_frac_amor_no_hc').is(':checked') ? false : null,
          problemas_salud_fisica: $('#check_prob_salud_fis_si_hc').is(':checked') ? true : $('#check_prob_salud_fis_no_hc').is(':checked') ? false : null,
          dieta_balanceada: $('#check_dieta_bal_si_hc').is(':checked') ? true : $('#check_dieta_bal_no_hc').is(':checked') ? false : null,
          pract_ejerc_fisico: $('#check_ejerc_fis_si_hc').is(':checked') ? true : $('#check_ejerc_fis_no_hc').is(':checked') ? false : null,
          operado: $('#check_operado_si_hc').is(':checked') ? true : $('#check_operado_no_hc').is(':checked') ? false : null,
          problema_menstruaciones: $('#check_prob_menst_si_hc').is(':checked') ? true : $('#check_prob_menst_no_hc').is(':checked') ? false : null,
          periodos_regulares: $('#check_per_reg_si_hc').is(':checked') ? true : $('#check_per_reg_no_hc').is(':checked') ? false : null,
          menst_afecta_animo: $('#check_menst_afecta_animo_si_hc').is(':checked') ? true : $('#check_menst_afecta_animo_no_hc').is(':checked') ? false : null,
          menstruacion_primera_vez: $('#check_saber_menst_si_hc').is(':checked') ? true : $('#check_saber_menst_no_hc').is(':checked') ? false : null,
          menstruacion_dolor: $('#check_dolor_menst_si_hc').is(':checked') ? true : $('#check_dolor_menst_no_hc').is(':checked') ? false : null,
          problema: $('input[name="inlineRadioOptionsDescripProblemaHc"]:checked').val() ? $('input[name="inlineRadioOptionsDescripProblemaHc"]:checked').val() : null,
          satisfecho_vida: $('input[name="inlineRadioOptionsSatisConSuVidaHc"]:checked').val() ? $('input[name="inlineRadioOptionsSatisConSuVidaHc"]:checked').val() : null,
          nivel_tension: $('input[name="inlineRadioOptionsTensionHc"]:checked').val() ? $('input[name="inlineRadioOptionsTensionHc"]:checked').val() : null,
          situaciones_sociales: $('input[name="inlineRadioOptionsSituaSocHc"]:checked').val() ? $('input[name="inlineRadioOptionsSituaSocHc"]:checked').val() : null,
          satisfaccion_pareja: $('input[name="inlineRadioOptionsSatisParejaHc"]:checked').val() ? $('input[name="inlineRadioOptionsSatisParejaHc"]:checked').val() : null,
          amigo_familia_pareja: $('input[name="inlineRadioOptionsAmigosFamParejaHc"]:checked').val() ? $('input[name="inlineRadioOptionsAmigosFamParejaHc"]:checked').val() : null,
          listChecksInfanciaAdoles: listChecksInfanciaAdoles,
          listChecksConductas: listChecksConductas,
          listChecksSentimientos: listChecksSentimientos,
          listChecksSensaFisicas: listChecksSensaFisicas,
          listChecksImgMeVeo: listChecksImgMeVeo,
          listChecksImgTengo: listChecksImgTengo,
          listChecksPensamientos: listChecksPensamientos,
          infancia_adolescencia_otros: $('#otros_prob_hc').val(),
          conducta_otros: $('#otros_cond_hc').val(),
          sentimientos_otros: $('#otros_sent_hc').val(),
          sensaciones_fisicas_otros: $('#otros_sf_hc').val(),
          imag_me_veo_otros_hc : $('#otros_img_hc').val(),
          imag_tengo_otros_hc : $('#otros_img_hc1').val(),
          pensamiento_otros_hc: $('#otros_pensamiento_hc').val(),
          prob_emocion_mental: $('#check_prob_emocion_mental_si_hc').is(':checked') ? true : $('#check_prob_emocion_mental_no_hc').is(':checked') ? false : null,
        }

        console.log(params, 'params');

        $.ajax({
          type: 'POST',
          url: "/historia_clinica/agregar_editar_hc/",
          data: {
            params: JSON.stringify(params),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(), // Token CSRF necesario
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              $('#btn_agregar_hc').html(textOriginalBtn);
              limpiarCampos();
              $('#modal_hc').modal('hide');
              swal({
                title: "",
                text: response.mensaje,
                type: response.tipo_mensaje,
                showCancelButton: false,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Aceptar",
                closeOnConfirm: true
              },
              function() {
                $(document).trigger('actualizar_lista_atenciones');
              });
            } else if (response.tipo_mensaje == 'error') {
              notificacion('Error',response.mensaje, response.tipo_mensaje);
              $('#btn_agregar_hc').html(textOriginalBtn);
            }
          },
          error: function(response) {
            notificacion('Error',response.mensaje, response.tipo_mensaje);
            $('#btn_agregar_hc').html(textOriginalBtn);
          }
        });
      }
    });

    /== evento para mostrar modal HC cuando accion = editar ==/
    $('#btn_edit_historia_clinica').on('click', function() {
      var id_atencion = $('#id_atencion').val();

      $.ajax({
        url: "/historia_clinica/get_hc",
        data: {
          id_atencion: id_atencion
        },
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'no_existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'No se puede editar una Historia Clínica para esta Atención debido a que todavía no tiene ninguna registrada.', 'error');
          } else {
            $('#modal_hc').modal('show');
            accion = 'editar';
            llenarCampoAplicadoPor();
            crearSelectsFormularioHc();

            // datos de la persona
            $("#nombre_persona_hc").val(response.datos_persona.nombre + (response.datos_persona.segundo_nombre ? " " + response.datos_persona.segundo_nombre + " " : " ") + response.datos_persona.apellido + (response.datos_persona.segundo_apellido ? " " + response.datos_persona.segundo_apellido : ""));
            $("#email_hc").val(response.datos_persona.correo);
            $("#fecha_nacimiento_hc").val(response.datos_persona.fecha_nacimiento);
            $("#telefono_persona_hc").val(response.datos_persona.telefono_contacto);
            llenarSelectEstados(response.datos_persona.estado.id, "#estado_actual_hc");
            id_municipio_actual = response.datos_persona.municipio.id;
            $('#direccion_actual_hc').val(response.datos_persona.direccion);
            $('#parentesco_hc').val(response.datos_persona.parentesco);

            if (response.datos_persona.sexo == 'H') {
              $('#check_sexo_hombre_hc').prop('checked', true);
            } else if (response.sexo == 'M') {
              $('#check_sexo_femenino').prop('checked', true);
            }

            // datos HC
            // seccion 1
            console.log(response);
            llenarSelectEstados(response.estado_nac ? response.estado_nac.id : '', "#estado_nacimiento_hc");
            llenarSelectViveEn(response.vive_en ? response.vive_en.id : '');
            llenarSelectViveCon(response.vive_con ? response.vive_con.id : '');
            llenarSelectEstadoCivil(response.estado_civil ? response.estado_civil.id : '');
            llenarSelectReligion(response.religion ? response.religion.id : '');
            llenarSelectGradoAcademico(response.grado_est ? response.grado_est.id : '');
            llenarSelectCarreras(response.carrera ? response.carrera.id : '');
            id_municipio_nacimiento = response.municipio_nac ? response.municipio_nac.id : '';
            $('#ocupacion_hc').val(response.ocupacion);
            $('#nombre_contacto_hc').val(response.nombre_emergencia);
            $('#telefono_contacto_hc').val(response.tlf_emergencia);
            $('#pasatiempos_hc').val(response.pasatiempos);
            $('#peso_hc').val(response.peso != -1 ? response.peso : '');
            $('#estatura_hc').val(response.estatura != -1 ? response.estatura : '');
            $('#nombre_medico_cabecera_hc').val(response.nombre_medico_cabecera);
            $('#telefono_medico_cabecera_hc').val(response.tlf_medico_cabecera);
            $('#hace_trabajo_hc').val(response.que_hace_trab);
            $('#trabajos_pasados_hc').val(response.trab_pasados);
            $('#terapias_anteriores_hc').val(response.lugar_terapia_pasada);
            $('#hospitalizado_anterior_hc').val(response.lugar_hosp_prob_psico);
            $('#danio_afirm_hc').val(response.tiempo_forma_hacerse_danio_suicidio);
            $('#quien_lo_envia_hc').val(response.quien_lo_envia);
            $('#tipo_ayuda_hc').val(response.ayuda_problema);
            
            if (response.peso_varia != null) {
              $('#check_peso_varia_si_hc').prop('checked', response.peso_varia);
              $('#check_peso_varia_no_hc').prop('checked', !response.peso_varia);
            }

            if (response.gustar_trabajo != null) {
              $('#check_gusta_trabajo_si_hc').prop('checked', response.gustar_trabajo);
              $('#check_gusta_trabajo_no_hc').prop('checked', !response.gustar_trabajo);
            }
            
            if (response.medico_cabecera != null) {
              $('#check_medico_cabecera_si_hc').prop('checked', response.medico_cabecera);
              $('#check_medico_cabecera_no_hc').prop('checked', !response.medico_cabecera);
            }

            if (response.terapia_antes != null) {
              $('#check_terapia_anterior_si_hc').prop('checked', response.terapia_antes);
              $('#check_terapia_anterior_no_hc').prop('checked', !response.terapia_antes);
            }

            if (response.hosp_prob_psico != null) {
              $('#check_hospitalizado_si_hc').prop('checked', response.hosp_prob_psico);
              $('#check_hospitalizado_no_hc').prop('checked', !response.hosp_prob_psico);
            }
            
            if (response.hacerse_danio_suicidio != null) {
              $('#check_danio_suicidio_si_hc').prop('checked', response.hacerse_danio_suicidio);
              $('#check_danio_suicidio_no_hc').prop('checked', !response.hacerse_danio_suicidio);
            }
            
            if (response.familia_suicidio != null) {
              $('#check_intento_suicidio_si_hc').prop('checked', response.familia_suicidio);
              $('#check_intento_suicidio_no_hc').prop('checked', !response.familia_suicidio);
            }
            
            if (response.prob_emocion_mental != null) {
              $('#check_prob_emocion_mental_si_hc').prop('checked', response.prob_emocion_mental);
              $('#check_prob_emocion_mental_no_hc').prop('checked', !response.prob_emocion_mental);
            }

            // seccion 2
            $('#nombre_padre_hc').val(response.nombre_padre);
            $('#edad_padre_hc').val(response.edad_padre);
            $('#ocupacion_padre_hc').val(response.ocupacion_padre);
            $('#estudios_padre_hc').val(response.grado_estudio_padre);
            $('#estado_salud_padre_hc').val(response.estado_salud_padre);
            $('#edad_muerte_padre_hc').val(response.edad_murio_padre);
            $('#causa_muerte_padre_hc').val(response.causa_muerte_padre);
            $('#edad_usted_morir_padre_hc').val(response.edad_hijo_morir_padre);
            $('#nombre_madre_hc').val(response.nombre_madre);
            $('#edad_madre_hc').val(response.edad_madre);
            $('#ocupacion_madre_hc').val(response.ocupacion_madre);
            $('#estudios_madre_hc').val(response.grado_estudio_madre);
            $('#estado_salud_madre_hc').val(response.estado_salud_madre);
            $('#edad_muerte_madre_hc').val(response.edad_murio_madre);
            $('#causa_muerte_madre_hc').val(response.causa_muerte_madre);
            $('#edad_usted_morir_madre_hc').val(response.edad_hijo_morir_madre);
            $('#cant_hermanos_hc').val(response.cant_hermanos);
            $('#edad_hermanos_hc').val(response.edades_hermanos);
            $('#detalles_sig_hermanos_hc').val(response.detalles_padres_hermanos);
            $('#crecio_con_hc').val(response.con_quien_crecio);
            $('#pers_act_padre_hc').val(response.person_actitud_padre);
            $('#pers_act_madre_hc').val(response.person_actitud_madre);
            $('#forma_castigo_padre_hc').val(response.forma_castigado_padres);
            $('#imp_atm_casa_hc').val(response.atmosfera_casa);
            $('#padrasto_hc').val(response.edad_casar_padres);
            $('#check_infancia_feliz_hc').prop('checked', response.checksCaractInfanciaAdoles.infancia_feliz);
            $('#check_infancia_infeliz_hc').prop('checked', response.checksCaractInfanciaAdoles.infancia_infeliz);
            $('#check_prob_emoc_cond_hc').prop('checked', response.checksCaractInfanciaAdoles.prob_emoc_cond);
            $('#check_prob_leg_hc').prop('checked', response.checksCaractInfanciaAdoles.prob_leg);
            $('#check_muerte_familia_hc').prop('checked', response.checksCaractInfanciaAdoles.muerte_familia);
            $('#check_prob_med_hc').prop('checked', response.checksCaractInfanciaAdoles.prob_med);
            $('#check_ignorado_hc').prop('checked', response.checksCaractInfanciaAdoles.ignorado);
            $('#check_pocos_amigos_hc').prop('checked', response.checksCaractInfanciaAdoles.pocos_amigos);
            $('#check_prob_escuela_hc').prop('checked', response.checksCaractInfanciaAdoles.prob_escuela);
            $('#check_convicciones_religiosas_hc').prop('checked', response.checksCaractInfanciaAdoles.convicciones_religiosas);
            $('#check_uso_drogas_hc').prop('checked', response.checksCaractInfanciaAdoles.uso_drogas);
            $('#check_uso_alcohol_hc').prop('checked', response.checksCaractInfanciaAdoles.uso_alcohol);
            $('#check_castigado_sev_hc').prop('checked', response.checksCaractInfanciaAdoles.castigado_sev);
            $('#check_abusado_sex_hc').prop('checked', response.checksCaractInfanciaAdoles.abusado_sex);
            $('#check_prob_financieros_hc').prop('checked', response.checksCaractInfanciaAdoles.prob_financieros);
            $('#check_int_mol_sev_hc').prop('checked', response.checksCaractInfanciaAdoles.int_mol_sev);
            $('#check_prob_alim_hc').prop('checked', response.checksCaractInfanciaAdoles.prob_alim);
            $('#otros_prob_hc').val(response.checksCaractInfanciaAdoles.otros);
            
            if (response.confia_padres != null) {
              $('#check_confianza_padres_si_hc').prop('checked', response.confia_padres);
              $('#check_confianza_padres_no_hc').prop('checked', !response.confia_padres);
            }
            
            if (response.siente_amor_padres != null) {
              $('#check_sentir_amor_padres_si_hc').prop('checked', response.siente_amor_padres);
              $('#check_sentir_amor_padres_no_hc').prop('checked', !response.siente_amor_padres);
            }
            
            if (response.familia_interferir_matrimonio != null) {
              $('#check_interferencia_si_hc').prop('checked', response.familia_interferir_matrimonio);
              $('#check_interferencia_no_hc').prop('checked', !response.familia_interferir_matrimonio);
            }

            // seccion 3
            $('#problema_actual_hc').val(response.desc_natu_prob);
            $('#comienzo_problema_hc').val(response.empezar_prob);
            $('#empeora_problema_hc').val(response.empeora_prob);
            $('#mejora_problema_hc').val(response.mejora_prob);

            if (response.desc_problema_sec3 != null) {
              $('input[name="inlineRadioOptionsDescripProblemaHc"][value="' + response.desc_problema_sec3 + '"]').prop('checked', true);
            }

            if (response.satisf_vida_todo != null) {
              $('input[name="inlineRadioOptionsSatisConSuVidaHc"][value="' + response.satisf_vida_todo + '"]').prop('checked', true);
            }

            if (response.nivel_tension_mes_pasado != null) {
              $('input[name="inlineRadioOptionsTensionHc"][value="' + response.nivel_tension_mes_pasado + '"]').prop('checked', true);
            }

            // seccion 4
            $('#que_espera_terapia_hc').val(response.piensa_espera_terapia);
            $('#que_espera_terapia_hc').val(response.piensa_espera_terapia);
            $('#cuanto_durara_terapia_hc').val(response.tiempo_terapia);
            $('#caract_terapeuta_hc').val(response.caract_posee_terapeuta);

            // seccion 5
            //  conductas
            $('#check_cond_1').prop('checked', response.checksConductas.comer_de_mas);
            $('#check_cond_2').prop('checked', response.checksConductas.consumir_drogas);
            $('#check_cond_3').prop('checked', response.checksConductas.no_hacer_desea);
            $('#check_cond_4').prop('checked', response.checksConductas.conductas_incorrectas);
            $('#check_cond_5').prop('checked', response.checksConductas.beber_demasiado);
            $('#check_cond_6').prop('checked', response.checksConductas.trabajar_demasiado);
            $('#check_cond_7').prop('checked', response.checksConductas.demorando_algo);
            $('#check_cond_8').prop('checked', response.checksConductas.relaciones_impulsivas);
            $('#check_cond_9').prop('checked', response.checksConductas.perdida_control);
            $('#check_cond_10').prop('checked', response.checksConductas.intentos_suicidas);
            $('#check_cond_11').prop('checked', response.checksConductas.compulsiones);
            $('#check_cond_12').prop('checked', response.checksConductas.fumar);
            $('#check_cond_13').prop('checked', response.checksConductas.dejar_hacer_algo);
            $('#check_cond_14').prop('checked', response.checksConductas.tics_nerviosos);
            $('#check_cond_15').prop('checked', response.checksConductas.dificultad_concentrarse);
            $('#check_cond_16').prop('checked', response.checksConductas.trastornos_suenio);
            $('#check_cond_17').prop('checked', response.checksConductas.evitacion_fobica);
            $('#check_cond_18').prop('checked', response.checksConductas.gastar_mucho_dinero);
            $('#check_cond_19').prop('checked', response.checksConductas.no_encontrar_trabajo);
            $('#check_cond_20').prop('checked', response.checksConductas.insomnio);
            $('#check_cond_21').prop('checked', response.checksConductas.tomar_riesgos);
            $('#check_cond_22').prop('checked', response.checksConductas.perezoso);
            $('#check_cond_23').prop('checked', response.checksConductas.prob_alimentacion);
            $('#check_cond_24').prop('checked', response.checksConductas.conducta_agresiva);
            $('#check_cond_25').prop('checked', response.checksConductas.llanto);
            $('#check_cond_26').prop('checked', response.checksConductas.enojado_ocaciones);
            $('#otros_cond_hc').val(response.checksConductas.otros);
            $('#talento_cond_hc').val(response.talentos_habilidades);
            $('#emp_hacer_cond_hc').val(response.gustaria_empezar_hacer);
            $('#dejar_hacer_cond_hc').val(response.gustaria_dejar_hacer);
            $('#tiempo_libre_cond_hc').val(response.tiempo_libre);
            $('#pasatiempo_cond_hc').val(response.actividades_relajarse);
            $('#deseos_cond_hc').val(response.dos_deseos);
            
            if (response.prob_relajarse != null) {
              $('#check_prob_relax_si_hc').prop('checked', response.prob_relajarse);
              $('#check_prob_relax_no_hc').prop('checked', !response.prob_relajarse);
            }

            //  sentimientos
            $('#check_sent_1').prop('checked', response.checksSentimientos.enojado);
            $('#check_sent_2').prop('checked', response.checksSentimientos.fastidiado);
            $('#check_sent_3').prop('checked', response.checksSentimientos.triste);
            $('#check_sent_4').prop('checked', response.checksSentimientos.deprimido);
            $('#check_sent_5').prop('checked', response.checksSentimientos.envidioso);
            $('#check_sent_6').prop('checked', response.checksSentimientos.culpable);
            $('#check_sent_7').prop('checked', response.checksSentimientos.feliz);
            $('#check_sent_8').prop('checked', response.checksSentimientos.ansioso);
            $('#check_sent_9').prop('checked', response.checksSentimientos.con_miedo);
            $('#check_sent_10').prop('checked', response.checksSentimientos.con_panico);
            $('#check_sent_11').prop('checked', response.checksSentimientos.energetico);
            $('#check_sent_12').prop('checked', response.checksSentimientos.en_conflicto);
            $('#check_sent_13').prop('checked', response.checksSentimientos.avergonzado);
            $('#check_sent_14').prop('checked', response.checksSentimientos.apenado);
            $('#check_sent_15').prop('checked', response.checksSentimientos.esperanzado);
            $('#check_sent_16').prop('checked', response.checksSentimientos.desamparado);
            $('#check_sent_17').prop('checked', response.checksSentimientos.relajado);
            $('#check_sent_18').prop('checked', response.checksSentimientos.celoso);
            $('#check_sent_19').prop('checked', response.checksSentimientos.infeliz);
            $('#check_sent_20').prop('checked', response.checksSentimientos.aburrido);
            $('#check_sent_21').prop('checked', response.checksSentimientos.sin_descanso);
            $('#check_sent_22').prop('checked', response.checksSentimientos.solitario);
            $('#check_sent_23').prop('checked', response.checksSentimientos.satisfecho);
            $('#check_sent_24').prop('checked', response.checksSentimientos.excitado);
            $('#check_sent_25').prop('checked', response.checksSentimientos.optimista);
            $('#check_sent_26').prop('checked', response.checksSentimientos.tenso);
            $('#check_sent_27').prop('checked', response.checksSentimientos.sin_esperanza);
            $('#otros_sent_hc').val(response.checksSentimientos.otros);
            $('#miedos_sent_hc').val(response.cinco_miedos);
            $('#posit_sent_hc').val(response.sentimientos_positivos_recientes);
            $('#control_sent_hc').val(response.perder_control_sentimientos);
            $('#situacion_sent_hc').val(response.situacion_calmado_relajado);
            
            // sensaciones fisicas
            $('#check_sf_1').prop('checked', response.checksSensaFisicas.dolor_abdominal);
            $('#check_sf_2').prop('checked', response.checksSensaFisicas.dolor_orinar);
            $('#check_sf_3').prop('checked', response.checksSensaFisicas.dolor_menstruacion);
            $('#check_sf_4').prop('checked', response.checksSensaFisicas.mareos);
            $('#check_sf_5').prop('checked', response.checksSensaFisicas.palpitaciones);
            $('#check_sf_6').prop('checked', response.checksSensaFisicas.espasmos_musculares);
            $('#check_sf_7').prop('checked', response.checksSensaFisicas.tensiones);
            $('#check_sf_8').prop('checked', response.checksSensaFisicas.trastornos_sexuales);
            $('#check_sf_9').prop('checked', response.checksSensaFisicas.incapacidad_relajarse);
            $('#check_sf_10').prop('checked', response.checksSensaFisicas.alteraciones_intestinales);
            $('#check_sf_11').prop('checked', response.checksSensaFisicas.hormigueos);
            $('#check_sf_12').prop('checked', response.checksSensaFisicas.problemas_piel);
            $('#check_sf_13').prop('checked', response.checksSensaFisicas.boca_seca);
            $('#check_sf_14').prop('checked', response.checksSensaFisicas.sensacion_quemaduras);
            $('#check_sf_15').prop('checked', response.checksSensaFisicas.latidos_cardiacos_rapidos);
            $('#check_sf_16').prop('checked', response.checksSensaFisicas.no_ser_tocado);
            $('#check_sf_17').prop('checked', response.checksSensaFisicas.entumecimiento);
            $('#check_sf_18').prop('checked', response.checksSensaFisicas.problemas_estomacales);
            $('#check_sf_19').prop('checked', response.checksSensaFisicas.tics);
            $('#check_sf_20').prop('checked', response.checksSensaFisicas.fatiga);
            $('#check_sf_21').prop('checked', response.checksSensaFisicas.dolor_espalda);
            $('#check_sf_22').prop('checked', response.checksSensaFisicas.temblores);
            $('#check_sf_23').prop('checked', response.checksSensaFisicas.desmayos);
            $('#check_sf_24').prop('checked', response.checksSensaFisicas.escuchar_ruidos);
            $('#check_sf_25').prop('checked', response.checksSensaFisicas.ojos_llorosos);
            $('#check_sf_26').prop('checked', response.checksSensaFisicas.catarro);
            $('#check_sf_27').prop('checked', response.checksSensaFisicas.nauseas);
            $('#check_sf_28').prop('checked', response.checksSensaFisicas.vertigo);
            $('#check_sf_29').prop('checked', response.checksSensaFisicas.sudoracion_excesiva);
            $('#check_sf_30').prop('checked', response.checksSensaFisicas.alteraciones_visuales);
            $('#check_sf_31').prop('checked', response.checksSensaFisicas.problemas_audicion);
            $('#check_sf_32').prop('checked', response.checksSensaFisicas.variacion_peso);
            $('#check_sf_33').prop('checked', response.checksSensaFisicas.dolor_cabeza);
            $('#otros_sf_hc').val(response.checksSensaFisicas.otros);
            $('#posit_sent_si_hc').val(response.sensaciones_placenteras);
            $('#posit_sent_no_hc').val(response.sensaciones_no_placenteras);
            
            // imagenes
            $('#check_img_1').prop('checked', response.checksImgMeVeo.siendo_feliz);
            $('#check_img_2').prop('checked', response.checksImgMeVeo.herido_sentimientos);
            $('#check_img_3').prop('checked', response.checksImgMeVeo.incapaz_afrontar_prob);
            $('#check_img_4').prop('checked', response.checksImgMeVeo.exitoso);
            $('#check_img_5').prop('checked', response.checksImgMeVeo.perdiendo_control);
            $('#check_img_6').prop('checked', response.checksImgMeVeo.siendo_seguido);
            $('#check_img_7').prop('checked', response.checksImgMeVeo.hablan_mi);
            $('#check_img_8').prop('checked', response.checksImgMeVeo.desamparado);
            $('#check_img_9').prop('checked', response.checksImgMeVeo.lastimando_otros);
            $('#check_img_10').prop('checked', response.checksImgMeVeo.cargo_cosas);
            $('#check_img_11').prop('checked', response.checksImgMeVeo.fallando);
            $('#check_img_12').prop('checked', response.checksImgMeVeo.atrapado);
            $('#check_img_13').prop('checked', response.checksImgMeVeo.siendo_promiscuo);
            $('#check_img_14').prop('checked', response.checksImgMeVeo.siendo_agreivo);
            $('#check_img_15').prop('checked', response.checksImgTengo.img_sexuales_placenteras);
            $('#check_img_16').prop('checked', response.checksImgTengo.img_sexuales_no_placenteras);
            $('#check_img_17').prop('checked', response.checksImgTengo.img_desagradables_infancia);
            $('#check_img_18').prop('checked', response.checksImgTengo.img_corporal_negativa);
            $('#check_img_19').prop('checked', response.checksImgTengo.imagino_amado);
            $('#check_img_20').prop('checked', response.checksImgTengo.img_soledad);
            $('#check_img_21').prop('checked', response.checksImgTengo.img_seduccion);
            $('#otros_img_hc').val(response.checksImgMeVeo.otros);
            $('#otros_img_hc1').val(response.checksImgTengo.otros);
            $('#img_placentera_hc').val(response.img_fantasia_placentera);
            $('#img_nada_placentera_hc').val(response.img_fantasia_no_placentera);
            $('#img_moleste_hc').val(response.img_molesta_func_cotidiano);
            $('#img_moleste_hcimg_pesadillas_hc').val(response.pesadillas_seguidas);

            // pensamientos
            $('#check_pensamiento_1').prop('checked', response.checksPensamientos.inteligente);
            $('#check_pensamiento_2').prop('checked', response.checksPensamientos.confidente);
            $('#check_pensamiento_3').prop('checked', response.checksPensamientos.valgo_pena);
            $('#check_pensamiento_4').prop('checked', response.checksPensamientos.ambocioso);
            $('#check_pensamiento_5').prop('checked', response.checksPensamientos.sensitivo);
            $('#check_pensamiento_6').prop('checked', response.checksPensamientos.leal);
            $('#check_pensamiento_7').prop('checked', response.checksPensamientos.confiable_fidedigno);
            $('#check_pensamiento_8').prop('checked', response.checksPensamientos.lleno_penas);
            $('#check_pensamiento_9').prop('checked', response.checksPensamientos.indigno);
            $('#check_pensamiento_10').prop('checked', response.checksPensamientos.don_nadie);
            $('#check_pensamiento_11').prop('checked', response.checksPensamientos.inutil);
            $('#check_pensamiento_12').prop('checked', response.checksPensamientos.malo);
            $('#check_pensamiento_13').prop('checked', response.checksPensamientos.loco);
            $('#check_pensamiento_14').prop('checked', response.checksPensamientos.estupido);
            $('#check_pensamiento_15').prop('checked', response.checksPensamientos.ingenuo);
            $('#check_pensamiento_16').prop('checked', response.checksPensamientos.honesto);
            $('#check_pensamiento_17').prop('checked', response.checksPensamientos.incompetente);
            $('#check_pensamiento_18').prop('checked', response.checksPensamientos.pensamientos_horribles);
            $('#check_pensamiento_19').prop('checked', response.checksPensamientos.con_desviaciones);
            $('#check_pensamiento_20').prop('checked', response.checksPensamientos.sin_atractivos);
            $('#check_pensamiento_21').prop('checked', response.checksPensamientos.sin_carinio);
            $('#check_pensamiento_22').prop('checked', response.checksPensamientos.inadecuado);
            $('#check_pensamiento_23').prop('checked', response.checksPensamientos.confuso);
            $('#check_pensamiento_24').prop('checked', response.checksPensamientos.flojo);
            $('#check_pensamiento_25').prop('checked', response.checksPensamientos.no_digno_confianza);
            $('#check_pensamiento_26').prop('checked', response.checksPensamientos.deshonesto);
            $('#check_pensamiento_27').prop('checked', response.checksPensamientos.con_ideas_suicidas);
            $('#check_pensamiento_28').prop('checked', response.checksPensamientos.perseverante);
            $('#check_pensamiento_29').prop('checked', response.checksPensamientos.buen_sentido_humor);
            $('#check_pensamiento_30').prop('checked', response.checksPensamientos.trabajo_duro);
            $('#check_pensamiento_31').prop('checked', response.checksPensamientos.indeseable);
            $('#check_pensamiento_32').prop('checked', response.checksPensamientos.en_conflicto);
            $('#check_pensamiento_33').prop('checked', response.checksPensamientos.dificultades_concentrarse);
            $('#check_pensamiento_34').prop('checked', response.checksPensamientos.prob_memoria);
            $('#check_pensamiento_35').prop('checked', response.checksPensamientos.atractivo);
            $('#check_pensamiento_36').prop('checked', response.checksPensamientos.no_puedo_tomar_decisiones);
            $('#check_pensamiento_37').prop('checked', response.checksPensamientos.feo);
            $('#check_pensamiento_38').prop('checked', response.checksPensamientos.considerado);
            $('#check_pensamiento_39').prop('checked', response.checksPensamientos.degenerado);
            $('#otros_pensamiento_hc').val(response.checksPensamientos.otros);
            $('#idea_mas_loca_hc').val(response.idea_mas_loca);
            $('#afectar_negativamente_humor_hc').val(response.afectar_negativamente_humor);
            $('#cuales_pensamto_vuelven_hc').val(response.cuales_pensamto_vuelven);
            
            if (response.pensamientos_vuelven_vuelve != null) {
              $('#check_pensamientos_si_hc').prop('checked', response.pensamientos_vuelven_vuelve);
              $('#check_pensamientos_no_hc').prop('checked', !response.pensamientos_vuelven_vuelve);
            }
            
            llenarSelectsForms("#pensamiento_select_1", response.no_cometer_errores, true);
            llenarSelectsForms("#pensamiento_select_2", response.bueno_todo, true);
            llenarSelectsForms("#pensamiento_select_3", response.aparentar_saber, true);
            llenarSelectsForms("#pensamiento_select_4", response.no_relevar_info_pers, true);
            llenarSelectsForms("#pensamiento_select_5", response.victima_circunstancias, true);
            llenarSelectsForms("#pensamiento_select_6", response.vida_controlada_fuerzas_exter, true);
            llenarSelectsForms("#pensamiento_select_7", response.pers_mas_felices_yo, true);
            llenarSelectsForms("#pensamiento_select_8", response.complacer_otras_personas, true);
            llenarSelectsForms("#pensamiento_select_9", response.no_tomar_riesgos, true);
            llenarSelectsForms("#pensamiento_select_10", response.no_merezco_feliz, true);
            llenarSelectsForms("#pensamiento_select_11", response.ignoro_problemas, true);
            llenarSelectsForms("#pensamiento_select_12", response.hacer_felices_otros, true);
            llenarSelectsForms("#pensamiento_select_13", response.trabajar_duro_perfeccion, true);
            llenarSelectsForms("#pensamiento_select_14", response.formas_hacer_cosas, true);
            llenarSelectsForms("#pensamiento_select_15", response.nunca_molesto, true);

            // relaciones interpersonales
            if (response.hace_amigos_facil != null) {
              $('#check_rel_int_amigos1_si_hc').prop('checked', response.hace_amigos_facil);
              $('#check_rel_int_amigos1_no_hc').prop('checked', !response.hace_amigos_facil);
            }
            
            if (response.conserva_amigos != null) {
              $('#check_rel_int_amigos2_si_hc').prop('checked', response.conserva_amigos);
              $('#check_rel_int_amigos2_no_hc').prop('checked', !response.conserva_amigos);
            }

            if (response.citas_estudiante_secundaria != null) {
              $('#check_rel_int_cita_sec_si_hc').prop('checked', response.citas_estudiante_secundaria);
              $('#check_rel_int_cita_sec_no_hc').prop('checked', !response.citas_estudiante_secundaria);
            }
            
            if (response.citas_estudiante_preparatoria != null) {
              $('#check_rel_int_cita_prepa_si_hc').prop('checked', response.citas_estudiante_preparatoria);
              $('#check_rel_int_cita_prepa_no_hc').prop('checked', !response.citas_estudiante_preparatoria);
            }

            $('#rel_int_relacion_alergia_hc').val(response.relacion_alergias);
            $('#rel_int_relacion_problema_hc').val(response.relacion_problemas);

            if (response.grado_situaciones_sociales != null) {
              $('input[name="inlineRadioOptionsSituaSocHc"][value="' + response.grado_situaciones_sociales + '"]').prop('checked', true);
            }

            $('#rel_inte_parj_casado_hc').val(response.tiempo_pareja_antes_casarse);
            $('#rel_inte_comp_casado_hc').val(response.tiempo_comprometido_antes_casarse);
            $('#rel_inte_tiempo_mujer_hc').val(response.tiempo_mujer);
            $('#rel_inte_edad_pareja_hc').val(response.edad_pareja);
            $('#rel_inte_ocup_pareja_hc').val(response.ocupacion_pareja);
            $('#rel_inte_perso_pareja_hc').val(response.personalidad_pareja);
            $('#rel_int_gusta_pareja_hc').val(response.mas_gusta_pareja);
            $('#rel_int_gusta_pareja_menos_hc').val(response.menos_gusta_pareja);
            $('#rel_int_satisf_pareja_hc').val(response.factores_disminuyen_satisf_pareja);
            $('#rel_int_pareja_anterior_hc').val(response.detalle_signif_pareja_anterior);
            $('#prob_hijo_hc').val(response.problemas_de_hijos);
            $('#cant_hijos_hc').val(response.datos_hijos_tiene);
            
            if (response.grado_satisf_pareja != null) {
              $('input[name="inlineRadioOptionsSatisParejaHc"][value="' + response.grado_satisf_pareja + '"]').prop('checked', true);
            }
            
            if (response.amigos_familiares_pareja != null) {
              $('input[name="inlineRadioOptionsAmigosFamParejaHc"][value="' + response.amigos_familiares_pareja + '"]').prop('checked', true);
            }

            if (response.hijos_con_problema != null) {
              $('#check_hijos_con_prob_si_hc').prop('checked', response.hijos_con_problema);
              $('#check_hijos_con_prob_no_hc').prop('checked', !response.hijos_con_problema);
            }

            if (response.hijos_con_problema) {
              $('#prob_hijo_hc').prop('disabled', false);
            }

            // relaciones sexuales
            $('#act_padres_sex_hc').val(response.actitud_padres_sexo);
            $('#detalle_sex_hc').val(response.detalle_sexo_casa);
            $('#conoc_sex_hc').val(response.primeros_conoc_sobre_sexo);
            $('#impulso_sex_hc').val(response.impulsos_sexuales);
            $('#detalle_pena_sex_hc').val(response.detalle_pena_acerca_sexo);
            $('#detalle_vida_sex_satisf_hc').val(response.detalles_visa_sexual_satisf);
            $('#relac_homo_sex_hc').val(response.reaccion_relacion_homosexual);
            $('#info_extra_relev_hc').val(response.info_sexual_relevante);
            $('#detalle_rel_trabj_hc').val(response.detalles_probl_relac_personas_trabj);
            $('#gente_lastima_hc').val(response.forma_me_lastima);
            $('#describe_como_hc').val(response.pareja_describe_como);
            $('#gente_no_gusta_hc').val(response.gente_no_gusta_es);
            $('#alterar_alguien_hc').val(response.alterar_alguien_haciendo);
            $('#amigo_piensa_soy_hc').val(response.mejor_amigo_piensa_soy);
            $('#detalle_rech_frac_amor_hc').val(response.detalle_prob_por_rechazo_amoroso);
            $('#detalle_primera_exp_sexual_hc').val(response.detalle_primera_exp_sexual)

            if (response.pena_acerca_sexo != null) {
              $('#check_pena_sex_si_hc').prop('checked', response.pena_acerca_sexo);
              $('#check_pena_sex_no_hc').prop('checked', !response.pena_acerca_sexo);
            }
            
            if (response.visa_sexual_satisf != null) {
              $('#check_vida_sex_satisf_si_hc').prop('checked', response.visa_sexual_satisf);
              $('#check_vida_sex_satisf_no_hc').prop('checked', !response.visa_sexual_satisf);

              if (!response.visa_sexual_satisf) {
                $('#detalle_vida_sex_satisf_hc').prop('disabled', false);
              }
            }
            
            if (response.probl_relac_personas_trabj != null) {
              $('#check_rel_trabj_si_hc').prop('checked', response.probl_relac_personas_trabj);
              $('#check_rel_trabj_no_hc').prop('checked', !response.probl_relac_personas_trabj);
            }
            
            if (response.prob_por_rechazo_amoroso != null) {
              $('#check_rech_frac_amor_si_hc').prop('checked', response.prob_por_rechazo_amoroso);
              $('#check_rech_frac_amor_no_hc').prop('checked', !response.prob_por_rechazo_amoroso);
            }

            // factores biologicos
            if (response.prob_salud_fisica != null) {
              $('#check_prob_salud_fis_si_hc').prop('checked', response.prob_salud_fisica);
              $('#check_prob_salud_fis_no_hc').prop('checked', !response.prob_salud_fisica);
            }
            
            if (response.dieta_balanceada_trees_veces_dia != null) {
              $('#check_dieta_bal_si_hc').prop('checked', response.dieta_balanceada_trees_veces_dia);
              $('#check_dieta_bal_no_hc').prop('checked', !response.dieta_balanceada_trees_veces_dia);
            }
            
            if (response.operado != null) {
              $('#check_operado_si_hc').prop('checked', response.operado);
              $('#check_operado_no_hc').prop('checked', !response.operado);
            }
            
            if (response.practica_ejerc_fisico != null) {
              $('#check_ejerc_fis_si_hc').prop('checked', response.practica_ejerc_fisico);
              $('#check_ejerc_fis_no_hc').prop('checked', !response.practica_ejerc_fisico);
            }
            
            if (response.probl_menstruaciones != null) {
              $('#check_prob_menst_si_hc').prop('checked', response.probl_menstruaciones);
              $('#check_prob_menst_no_hc').prop('checked', !response.probl_menstruaciones);
            }
            
            if (response.periodos_regulares != null) {
              $('#check_per_reg_si_hc').prop('checked', response.periodos_regulares);
              $('#check_per_reg_no_hc').prop('checked', !response.periodos_regulares);
            }
            
            if (response.menst_afecta_animo != null) {
              $('#check_menst_afecta_animo_si_hc').prop('checked', response.menst_afecta_animo);
              $('#check_menst_afecta_animo_no_hc').prop('checked', !response.menst_afecta_animo);
            }
            
            if (response.conoce_menstruacion != null) {
              $('#check_saber_menst_si_hc').prop('checked', response.conoce_menstruacion);
              $('#check_saber_menst_no_hc').prop('checked', !response.conoce_menstruacion);
            }
            
            if (response.menstuacion_dolor != null) {
              $('#check_dolor_menst_si_hc').prop('checked', response.menstuacion_dolor);
              $('#check_dolor_menst_no_hc').prop('checked', !response.menstuacion_dolor);
            }

            $('#detalle_prob_salud_fis_hc').val(response.detalle_prob_salud_fisica);
            $('#prob_medic_hc').val(response.prob_medicos_haya_padecido);
            $('#detalle_operado_hc').val(response.tipo_fecha_cirugia);
            $('#medica_toma_hc').val(response.medicamentos_actuales);
            $('#detalle_ejerc_fis_hc').val(response.tipo_frecuencia_ejerc_fisico);
            $('#prob_med_familia_hc').val(response.prob_medicos_familia);
            $('#edad_menst_hc').val(response.edad_primera_menstruacion);
            $('#fecha_ultima_menst_hc').val(response.fecha_ultima_menstruacion);
            $('#durac_period_hc').val(response.duracion_periodos);
            $('#otros_fact_biolg_hc').val(response.otros_fact_biolg);

            llenarSelectsForms("#fac_biolg_select_1", response.debilidad_muscular, false);
            llenarSelectsForms("#fac_biolg_select_2", response.tranquilizantes, false);
            llenarSelectsForms("#fac_biolg_select_3", response.diureticos, false);
            llenarSelectsForms("#fac_biolg_select_4", response.pastillas_adelgazar, false);
            llenarSelectsForms("#fac_biolg_select_5", response.marihuana, false);
            llenarSelectsForms("#fac_biolg_select_6", response.hormonas, false);
            llenarSelectsForms("#fac_biolg_select_7", response.pastillas_dormir, false);
            llenarSelectsForms("#fac_biolg_select_8", response.aspirinas, false);
            llenarSelectsForms("#fac_biolg_select_9", response.cocaina, false);
            llenarSelectsForms("#fac_biolg_select_10", response.analgesicos, false);
            llenarSelectsForms("#fac_biolg_select_11", response.narcoticos, false);
            llenarSelectsForms("#fac_biolg_select_12", response.estimulantes, false);
            llenarSelectsForms("#fac_biolg_select_13", response.alucinogenos, false);
            llenarSelectsForms("#fac_biolg_select_14", response.laxantes, false);
            llenarSelectsForms("#fac_biolg_select_15", response.cigarrillos, false);
            llenarSelectsForms("#fac_biolg_select_16", response.tabaco, false);
            llenarSelectsForms("#fac_biolg_select_17", response.cafe, false);
            llenarSelectsForms("#fac_biolg_select_18", response.alcohol, false);
            llenarSelectsForms("#fac_biolg_select_19", response.anticonceptivos_orales, false);
            llenarSelectsForms("#fac_biolg_select_20", response.vitaminas, false);
            llenarSelectsForms("#fac_biolg_select_21", response.escasa_alimentacion, false);
            llenarSelectsForms("#fac_biolg_select_22", response.alimentacion_abundante, false);
            llenarSelectsForms("#fac_biolg_select_23", response.comida_chatarra, false);
            llenarSelectsForms("#fac_biolg_select_24", response.diarrea, false);
            llenarSelectsForms("#fac_biolg_select_25", response.estrenimiento, false);
            llenarSelectsForms("#fac_biolg_select_26", response.gases, false);
            llenarSelectsForms("#fac_biolg_select_27", response.indigestion, false);
            llenarSelectsForms("#fac_biolg_select_28", response.nauseas, false);
            llenarSelectsForms("#fac_biolg_select_29", response.vomitos, false);
            llenarSelectsForms("#fac_biolg_select_30", response.agruras, false);
            llenarSelectsForms("#fac_biolg_select_31", response.mareos, false);
            llenarSelectsForms("#fac_biolg_select_32", response.palpitaciones, false);
            llenarSelectsForms("#fac_biolg_select_33", response.fatiga, false);
            llenarSelectsForms("#fac_biolg_select_34", response.alergias, false);
            llenarSelectsForms("#fac_biolg_select_35", response.presion_arterial_alta, false);
            llenarSelectsForms("#fac_biolg_select_36", response.dolor_pecho, false);
            llenarSelectsForms("#fac_biolg_select_37", response.respiracion_cortada, false);
            llenarSelectsForms("#fac_biolg_select_38", response.insomnio, false);
            llenarSelectsForms("#fac_biolg_select_39", response.dormir_mas_tiempo, false);
            llenarSelectsForms("#fac_biolg_select_40", response.dormir_ratos, false);
            llenarSelectsForms("#fac_biolg_select_41", response.despertarse_temprano, false);
            llenarSelectsForms("#fac_biolg_select_42", response.dolor_oido, false);
            llenarSelectsForms("#fac_biolg_select_44", response.dolor_cabeza, false);
            llenarSelectsForms("#fac_biolg_select_45", response.dolor_espalda, false);
            llenarSelectsForms("#fac_biolg_select_46", response.moretones_sangrado, false);
            llenarSelectsForms("#fac_biolg_select_47", response.prob_peso, false);

            // observaciones
            $('#observaciones_hc').val(response.observaciones);
          }
        },
        error: function(response) {
          notificacion('Error','Lo siento ha ocurrido un error al cargar la Historia Clínica.', 'error');
        }
      });
    });
  }

  function calcularEdad(fechaNacimiento) {
    var anio = fechaNacimiento.split("/")[2];
    var mes = fechaNacimiento.split("/")[1];
    var dia = fechaNacimiento.split("/")[0];

    var fechaNac = new Date(anio, mes - 1, dia);
    var hoy = new Date();
    var edad = hoy.getFullYear() - fechaNac.getFullYear();
    var mesActual = hoy.getMonth() - fechaNac.getMonth();

    if (
      mesActual < 0 ||
      (mesActual == 0 && hoy.getDate() < fechaNac.getDate())
    ) {
      edad--;
    }

    return edad;
  }

  function llenarCampoAplicadoPor() {
    var id_usuario_autenticado = $("#user_autenticado").val();

    $.ajax({
      url: "/usuario/get_usuario",
      type: "get",
      data: { id: id_usuario_autenticado },
      dataType: "json",
      success: function (response) {
        var nombre_persona_autenticada =
          response.persona.nombre +
          (response.persona.segundo_nombre
            ? " " + response.persona.segundo_nombre + " "
            : " ") +
          response.persona.apellido +
          (response.persona.segundo_apellido
            ? " " + response.persona.segundo_apellido
            : "");
        $("#aplicado_por_hc").val(nombre_persona_autenticada);
      },
      error: function (response) {},
    });
  }

  function getAtencion(id_atencion) {
    return $.ajax({
      url: "/atencion_psicologica/get_atencion_by_atencion",
      type: "get",
      data: { id_atencion: id_atencion },
      dataType: "json",
    });
  }

  /== funcion para llenar el select de los estados ==/;
  function llenarSelectEstados(id_estado, id_select_estados) {
    $.ajax({
      url: "/estado/get_estados",
      type: "get",
      dataType: "json",
      success: function (response) {
        var optionSeleccione = $("<option/>").val("sel").text("Seleccione...");
        var optionEmpty = $("<option/>").val("-").text("-----------");

        if (response.mensaje == "success") {
          if (id_estado != "") {
            $(id_select_estados).find("option").end().append(optionSeleccione);
          } else {
            $(id_select_estados)
              .find("option")
              .end()
              .append(optionSeleccione.attr("selected", true));
          }

          $.each(response.estados, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (id_estado != "") {
              // llenar select estados en modal de editar
              if (value.id == id_estado) {
                $(id_select_estados)
                  .find("option")
                  .end()
                  .append(option.attr("selected", true));
              } else {
                $(id_select_estados).find("option").end().append(option);
              }
            } else {
              // llenar select estados en modal de agregar
              $(id_select_estados).find("option").end().append(option);
            }
          });

          $(id_select_estados).trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == "error") {
          $(id_select_estados)
            .find("option")
            .end()
            .append(optionEmpty.attr("selected", true));
        }
      },
      error: function (response) {},
    });
  }

  /== funcion para llenar el select de los estados ==/;
  function llenarSelectCarreras(id_carrera) {
    $.ajax({
      url: "/licenciatura/get_all_licenciatura",
      type: "get",
      dataType: "json",
      success: function (response) {
        var optionSeleccione = $("<option/>").val("sel").text("Seleccione...");
        var optionEmpty = $("<option/>").val("-").text("-----------");

        if (response.mensaje == "success") {
          if (id_carrera != "") {
            $("#carrera_cursa_hc")
              .find("option")
              .end()
              .append(optionSeleccione);
          } else {
            $("#carrera_cursa_hc")
              .find("option")
              .end()
              .append(optionSeleccione.attr("selected", true));
          }

          $.each(response.licenciaturas, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_carrera != "") {
                // llenar select carreras en modal de editar
                if (value.id == id_carrera) {
                  $("#carrera_cursa_hc")
                    .find("option")
                    .end()
                    .append(option.attr("selected", true));
                } else {
                  $("#carrera_cursa_hc").find("option").end().append(option);
                }
              } else {
                // llenar select carreras en modal de agregar
                $("#carrera_cursa_hc").find("option").end().append(option);
              }
            }
          });

          $("#carrera_cursa_hc").trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == "error") {
          $("#carrera_cursa_hc")
            .find("option")
            .end()
            .append(optionEmpty.attr("selected", true));
        }
      },
      error: function (response) {},
    });
  }

  /== funcion para llenar el select de los vive_en_hc ==/;
  function llenarSelectViveEn(id_vive_en) {
    $.ajax({
      url: "/vive_en/get_all_vive_en",
      type: "get",
      dataType: "json",
      success: function (response) {
        var optionSeleccione = $("<option/>").val("sel").text("Seleccione...");
        var optionEmpty = $("<option/>").val("-").text("-----------");

        if (response.mensaje == "success") {
          if (id_vive_en != "") {
            $("#vive_en_hc").find("option").end().append(optionSeleccione);
          } else {
            $("#vive_en_hc")
              .find("option")
              .end()
              .append(optionSeleccione.attr("selected", true));
          }

          $.each(response.vives, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_vive_en != "") {
                // llenar select vive_en en modal de editar
                if (value.id == id_vive_en) {
                  $("#vive_en_hc")
                    .find("option")
                    .end()
                    .append(option.attr("selected", true));
                } else {
                  $("#vive_en_hc").find("option").end().append(option);
                }
              } else {
                // llenar select vive_en en modal de agregar
                $("#vive_en_hc").find("option").end().append(option);
              }
            }
          });

          $("#vive_en_hc").trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == "error") {
          $("#vive_en_hc")
            .find("option")
            .end()
            .append(optionEmpty.attr("selected", true));
        }
      },
      error: function (response) {},
    });
  }

  /== funcion para llenar el select de los vive_con_hc ==/;
  function llenarSelectViveCon(id_vive_con) {
    $.ajax({
      url: "/vive_con/get_all_vive_con",
      type: "get",
      dataType: "json",
      success: function (response) {
        var optionSeleccione = $("<option/>").val("sel").text("Seleccione...");
        var optionEmpty = $("<option/>").val("-").text("-----------");

        if (response.mensaje == "success") {
          if (id_vive_con != "") {
            $("#vive_con_hc").find("option").end().append(optionSeleccione);
          } else {
            $("#vive_con_hc")
              .find("option")
              .end()
              .append(optionSeleccione.attr("selected", true));
          }

          $.each(response.vives, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_vive_con != "") {
                // llenar select vive_en en modal de editar
                if (value.id == id_vive_con) {
                  $("#vive_con_hc")
                    .find("option")
                    .end()
                    .append(option.attr("selected", true));
                } else {
                  $("#vive_con_hc").find("option").end().append(option);
                }
              } else {
                // llenar select vive_en en modal de agregar
                $("#vive_con_hc").find("option").end().append(option);
              }
            }
          });

          $("#vive_con_hc").trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == "error") {
          $("#vive_con_hc")
            .find("option")
            .end()
            .append(optionEmpty.attr("selected", true));
        }
      },
      error: function (response) {},
    });
  }

  /== funcion para llenar el select de los religion ==/;
  function llenarSelectReligion(id_religion) {
    $.ajax({
      url: "/religion/get_all_religion",
      type: "get",
      dataType: "json",
      success: function (response) {
        var optionSeleccione = $("<option/>").val("sel").text("Seleccione...");
        var optionEmpty = $("<option/>").val("-").text("-----------");

        if (response.mensaje == "success") {
          if (id_religion != "") {
            $("#religion_hc").find("option").end().append(optionSeleccione);
          } else {
            $("#religion_hc").find("option").end().append(optionSeleccione.attr("selected", true));
          }

          $.each(response.religiones, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_religion != "") {
                // llenar select religion en modal de editar
                if (value.id == id_religion) {
                  $("#religion_hc")
                    .find("option").end().append(option.attr("selected", true));
                } else {
                  $("#religion_hc").find("option").end().append(option);
                }
              } else {
                // llenar select religion en modal de agregar
                $("#religion_hc").find("option").end().append(option);
              }
            }            
          });

          $("#religion_hc").trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == "error") {
          $("#religion_hc").find("option").end().append(optionEmpty.attr("selected", true));
        }
      },
      error: function (response) {},
    });
  }

  /== funcion para llenar el select de los estado_civil ==/;
  function llenarSelectEstadoCivil(id_estado_civil) {
    $.ajax({
      url: "/estado_civil/get_all_estado_civil",
      type: "get",
      dataType: "json",
      success: function (response) {
        var optionSeleccione = $("<option/>").val("sel").text("Seleccione...");
        var optionEmpty = $("<option/>").val("-").text("-----------");

        if (response.mensaje == "success") {
          if (id_estado_civil != "") {
            $("#estado_civil_hc").find("option").end().append(optionSeleccione);
          } else {
            $("#estado_civil_hc")
              .find("option")
              .end()
              .append(optionSeleccione.attr("selected", true));
          }

          $.each(response.estados_civiles, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_estado_civil != "") {
                // llenar select estado_civil en modal de editar
                if (value.id == id_estado_civil) {
                  $("#estado_civil_hc")
                    .find("option")
                    .end()
                    .append(option.attr("selected", true));
                } else {
                  $("#estado_civil_hc").find("option").end().append(option);
                }
              } else {
                // llenar select estado_civil en modal de agregar
                $("#estado_civil_hc").find("option").end().append(option);
              }
            }            
          });

          $("#estado_civil_hc").trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == "error") {
          $("#estado_civil_hc")
            .find("option")
            .end()
            .append(optionEmpty.attr("selected", true));
        }
      },
      error: function (response) {},
    });
  }

  /== funcion para llenar el select de los grados academicos ==/;
  function llenarSelectGradoAcademico(id_grado_academico) {
    $.ajax({
      url: "/grado_academico/get_all_grado_academico",
      type: "get",
      dataType: "json",
      success: function (response) {
        var optionSeleccione = $("<option/>").val("sel").text("Seleccione...");
        var optionEmpty = $("<option/>").val("-").text("-----------");

        if (response.mensaje == "success") {
          if (id_grado_academico != "") {
            $("#grado_academico_hc").find("option").end().append(optionSeleccione);
          } else {
            $("#grado_academico_hc")
              .find("option")
              .end()
              .append(optionSeleccione.attr("selected", true));
          }

          $.each(response.grados_academicos, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_grado_academico != "") {
                // llenar select grado_academico en modal de editar
                if (value.id == id_grado_academico) {
                  $("#grado_academico_hc")
                    .find("option")
                    .end()
                    .append(option.attr("selected", true));
                } else {
                  $("#grado_academico_hc").find("option").end().append(option);
                }
              } else {
                // llenar select grado_academico en modal de agregar
                $("#grado_academico_hc").find("option").end().append(option);
              }
            }
          });

          $("#grado_academico_hc").trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == "error") {
          $("#grado_academico_hc")
            .find("option")
            .end()
            .append(optionEmpty.attr("selected", true));
        }
      },
      error: function (response) {},
    });
  }

  function llenarSelectsForms(select, id_select, valor_numerico) {
    var optionSeleccione = $("<option/>").val("-1").text("Seleccione...");
    var option1 = $("<option/>").val('1').text(valor_numerico ? '1' : 'Nunca');
    var option2 = $("<option/>").val('2').text(valor_numerico ? '2' : 'Rara vez');
    var option3 = $("<option/>").val('3').text(valor_numerico ? '3' : 'A veces');
    var option4 = $("<option/>").val('4').text(valor_numerico ? '4' : 'Con frecuencia');
    var option5 = $("<option/>").val('5').text(valor_numerico ? '5' : 'Siempre');

    if (id_select != '') {
      $(select).find("option").end().append(optionSeleccione);
    } else {
      $(select).find("option").end().append(optionSeleccione.attr('selected', true));
    }

    if (id_select != '') {
      // llenar select en modal de editar
      switch(id_select) {
        case 1:
          $(select).find("option").end().append(option1.attr('selected', true));
          $(select).find("option").end().append(option2);
          $(select).find("option").end().append(option3);
          $(select).find("option").end().append(option4);
          $(select).find("option").end().append(option5);
          break;
        case 2:
          $(select).find("option").end().append(option1);
          $(select).find("option").end().append(option2.attr('selected', true));
          $(select).find("option").end().append(option3);
          $(select).find("option").end().append(option4);
          $(select).find("option").end().append(option5);
          break;
        case 3:
          $(select).find("option").end().append(option1);
          $(select).find("option").end().append(option2);
          $(select).find("option").end().append(option3.attr('selected', true));
          $(select).find("option").end().append(option4);
          $(select).find("option").end().append(option5);
          break;
        case 4:
          $(select).find("option").end().append(option1);
          $(select).find("option").end().append(option2);
          $(select).find("option").end().append(option3);
          $(select).find("option").end().append(option4.attr('selected', true));
          $(select).find("option").end().append(option5);
          break;
        case 5:
          $(select).find("option").end().append(option1);
          $(select).find("option").end().append(option2);
          $(select).find("option").end().append(option3);
          $(select).find("option").end().append(option4);
          $(select).find("option").end().append(option5.attr('selected', true));
          break;
        default:
          $(select).find("option").end().append(option1);
          $(select).find("option").end().append(option2);
          $(select).find("option").end().append(option3);
          $(select).find("option").end().append(option4);
          $(select).find("option").end().append(option5);
      }      
    } else {
      // llenar select tipo usuario en modal de agregar
      $(select).find("option").end().append(option1);
      $(select).find("option").end().append(option2);
      $(select).find("option").end().append(option3);
      $(select).find("option").end().append(option4);
      $(select).find("option").end().append(option5);
    } 

    $(select).trigger("chosen:updated").trigger("change");
  }

  function crearSelects(select) {
    $(select).select2({
          dropdownParent: $("#modal_hc .modal-body"),
          width: "100%",
          language: {
            noResults: function () {
              return "No hay resultado";
            },
            searching: function () {
              return "Buscando..";
            },
          },
        });
  }

  function validarDatos() {
    var error = false;
    var email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (($('#nombre_persona_hc').val() == '') || ($('#nombre_persona_hc').val() == null)) {
      error = true;
    } else if (($('#fecha_nacimiento_hc').val() == '') || $('#fecha_nacimiento_hc').val() == null) {
      error = true;
    } else if ($('input[name="inlineRadioOptionsSexoHc"]:checked').length == 0) {
      error = true;
    } else if (($('#telefono_persona_hc').val() == '') || ($('#telefono_persona_hc').val() == null)) {
      error = true;
    } else if (($('#email_hc').val() == '') || ($('#email_hc').val() == null) || (!email.test($('#email_hc').val()))) {
      error = true;
    } else if (($('#estado_actual_hc').val() == 'sel') || ($('#estado_actual_hc').val() == '') || ($('#estado_actual_hc').val() == null)) {
      error = true;
    } else if (($('#municipio_actual_hc').val() == 'sel') || ($('#municipio_actual_hc').val() == '') || ($('#municipio_actual_hc').val() == null)) {
      error = true;
    } else if (($('#direccion_actual_hc').val() == '') || ($('#direccion_actual_hc').val() == null)) {
      error = true;
    } else if (($('#parentesco_hc').val() == '') || ($('#parentesco_hc').val() == null)) {
      error = true;
    }

    return error;
  }

  function crearSelectsFormularioHc() {
    crearSelects("#estado_actual_hc");
    crearSelects("#municipio_actual_hc");
    crearSelects("#carrera_cursa_hc");
    crearSelects("#estado_nacimiento_hc");
    crearSelects("#municipio_nacimiento_hc");
    crearSelects("#vive_en_hc");
    crearSelects("#vive_con_hc");
    crearSelects("#estado_civil_hc");
    crearSelects("#religion_hc");
    crearSelects("#grado_academico_hc");
    crearSelects("#pensamiento_select_1");
    crearSelects("#pensamiento_select_2");
    crearSelects("#pensamiento_select_3");
    crearSelects("#pensamiento_select_4");
    crearSelects("#pensamiento_select_5");
    crearSelects("#pensamiento_select_6");
    crearSelects("#pensamiento_select_7");
    crearSelects("#pensamiento_select_8");
    crearSelects("#pensamiento_select_9");
    crearSelects("#pensamiento_select_10");
    crearSelects("#pensamiento_select_11");
    crearSelects("#pensamiento_select_12");
    crearSelects("#pensamiento_select_13");
    crearSelects("#pensamiento_select_14");
    crearSelects("#pensamiento_select_15");
    crearSelects("#fac_biolg_select_1");
    crearSelects("#fac_biolg_select_2");
    crearSelects("#fac_biolg_select_3");
    crearSelects("#fac_biolg_select_4");
    crearSelects("#fac_biolg_select_5");
    crearSelects("#fac_biolg_select_6");
    crearSelects("#fac_biolg_select_7");
    crearSelects("#fac_biolg_select_8");
    crearSelects("#fac_biolg_select_9");
    crearSelects("#fac_biolg_select_10");
    crearSelects("#fac_biolg_select_11");
    crearSelects("#fac_biolg_select_12");
    crearSelects("#fac_biolg_select_13");
    crearSelects("#fac_biolg_select_14");
    crearSelects("#fac_biolg_select_15");
    crearSelects("#fac_biolg_select_16");
    crearSelects("#fac_biolg_select_17");
    crearSelects("#fac_biolg_select_18");
    crearSelects("#fac_biolg_select_19");
    crearSelects("#fac_biolg_select_20");
    crearSelects("#fac_biolg_select_21");
    crearSelects("#fac_biolg_select_22");
    crearSelects("#fac_biolg_select_23");
    crearSelects("#fac_biolg_select_24");
    crearSelects("#fac_biolg_select_25");
    crearSelects("#fac_biolg_select_26");
    crearSelects("#fac_biolg_select_27");
    crearSelects("#fac_biolg_select_28");
    crearSelects("#fac_biolg_select_29");
    crearSelects("#fac_biolg_select_30");
    crearSelects("#fac_biolg_select_31");
    crearSelects("#fac_biolg_select_32");
    crearSelects("#fac_biolg_select_33");
    crearSelects("#fac_biolg_select_34");
    crearSelects("#fac_biolg_select_35");
    crearSelects("#fac_biolg_select_36");
    crearSelects("#fac_biolg_select_37");
    crearSelects("#fac_biolg_select_38");
    crearSelects("#fac_biolg_select_39");
    crearSelects("#fac_biolg_select_40");
    crearSelects("#fac_biolg_select_41");
    crearSelects("#fac_biolg_select_42");
    crearSelects("#fac_biolg_select_43");
    crearSelects("#fac_biolg_select_44");
    crearSelects("#fac_biolg_select_45");
    crearSelects("#fac_biolg_select_46");
    crearSelects("#fac_biolg_select_47");
  }

  function deseleccionarFilasTabla() {
    var tabla = $('#tabla_atenciones_psicologicas').DataTable();
    tabla.rows().every(function() {
      var rowNode = this.node();

      if ($(rowNode).hasClass('selected')) {
        $(rowNode).removeClass('selected');
      }

      $('#btn_solicitar_atencion').css('display', 'block');
      $('#dropdown_acciones_atenciones_psicologicas').css('display', 'none');
      $('#id_atencion').val('');
    });
  }

  function limpiarCampos() {
    // datos HC

    // vaciar todos los selects
    $('#form_hc select').each(function() {
      $(this).find('option').remove();
    });

    // seccion 1
    // llenarSelectEstados('', "#estado_nacimiento_hc");
    // llenarSelectViveEn('');
    // llenarSelectViveCon('');
    // llenarSelectEstadoCivil('');
    // llenarSelectReligion('');
    // llenarSelectGradoAcademico('');
    // llenarSelectCarreras('');
    id_municipio_nacimiento = '';
    $('#ocupacion_hc').val('');
    $('#nombre_contacto_hc').val('');
    $('#telefono_contacto_hc').val('');
    $('#pasatiempos_hc').val('');
    $('#peso_hc').val('');
    $('#estatura_hc').val('');
    $('#nombre_medico_cabecera_hc').val('');
    $('#telefono_medico_cabecera_hc').val('');
    $('#hace_trabajo_hc').val('');
    $('#trabajos_pasados_hc').val('');
    $('#terapias_anteriores_hc').val('');
    $('#hospitalizado_anterior_hc').val('');
    $('#danio_afirm_hc').val('');
    $('#quien_lo_envia').val('');
    $("input[type='radio'][name=inlineRadioOptionsPesoVariaHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsMedicoCabeceraHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsGustaTrabajoHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsTerapiaAnteriorHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsHospitalizadoHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsDanioSuicidioHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsIntentoSuicidioHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsProbEmocionMentalHc]").prop('checked', false);

    // seccion 2
    $('#nombre_padre_hc').val('');
    $('#edad_padre_hc').val('');
    $('#ocupacion_padre_hc').val('');
    $('#estudios_padre_hc').val('');
    $('#estado_salud_padre_hc').val('');
    $('#edad_muerte_padre_hc').val('');
    $('#causa_muerte_padre_hc').val('');
    $('#edad_usted_morir_padre_hc').val('');
    $('#nombre_madre_hc').val('');
    $('#edad_madre_hc').val('');
    $('#ocupacion_madre_hc').val('');
    $('#estudios_madre_hc').val('');
    $('#estado_salud_madre_hc').val('');
    $('#edad_muerte_madre_hc').val('');
    $('#causa_muerte_madre_hc').val('');
    $('#edad_usted_morir_madre_hc').val('');
    $('#cant_hermanos_hc').val('');
    $('#edad_hermanos_hc').val('');
    $('#detalles_sig_hermanos_hc').val('');
    $('#crecio_con_hc').val('');
    $('#pers_act_padre_hc').val('');
    $('#pers_act_madre_hc').val('');
    $('#forma_castigo_padre_hc').val('');
    $('#imp_atm_casa_hc').val('');
    $('#padrasto_hc').val('');

    $('.checksInfanciaAdoles').each(function() {
          $($(this)).prop('checked', false);
    });

    $('#otros_prob_hc').val('');
    $("input[type='radio'][name=inlineRadioOptionsConfPareHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsSentirAmorPadresHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsInterferenciaHc]").prop('checked', false);

    // seccion 3
    $('#problema_actual_hc').val('');
    $('#comienzo_problema_hc').val('');
    $('#empeora_problema_hc').val('');
    $('#mejora_problema_hc').val('');
    $("input[type='radio'][name=inlineRadioOptionsDescripProblemaHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsSatisConSuVidaHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsTensionHc]").prop('checked', false);

    // seccion 4
    $('#que_espera_terapia_hc').val('');
    $('#que_espera_terapia_hc').val('');
    $('#cuanto_durara_terapia_hc').val('');
    
    // seccion 5
    // conductas
    $('.checkConductas').each(function() {
          $($(this)).prop('checked', false);
    });

    $('#otros_cond_hc').val('');
    $('#talento_cond_hc').val('');
    $('#emp_hacer_cond_hc').val('');
    $('#dejar_hacer_cond_hc').val('');
    $('#tiempo_libre_cond_hc').val('');
    $('#pasatiempo_cond_hc').val('');
    $('#deseos_cond_hc').val('');
    $("input[type='radio'][name=inlineRadioOptionsProbRelaxHc]").prop('checked', false);

    //  sentimientos
    $('.checkSentimientos').each(function() {
          $($(this)).prop('checked', false);
    });
    
    $('#otros_sent_hc').val('');
    $('#miedos_sent_hc').val('');
    $('#posit_sent_hc').val('');
    $('#control_sent_hc').val('');
    $('#situacion_sent_hc').val('');
    
    // sensaciones fisicas
    $('.checkSensaFisicas').each(function() {
          $($(this)).prop('checked', false);
    });

    $('#otros_sf_hc').val('');
    $('#posit_sent_si_hc').val('');
    $('#posit_sent_no_hc').val('');
    
    // imagenes
    $('.checkImgMeVeo').each(function() {
          $($(this)).prop('checked', false);
    });
    
    $('#otros_img_hc').val('');
    $('#otros_img_hc1').val('');
    $('#img_placentera_hc').val('');
    $('#img_nada_placentera_hc').val('');
    $('#img_moleste_hc').val('');
    $('#img_moleste_hcimg_pesadillas_hc').val('');
    
    // pensamientos
    $('.checkPensamientos').each(function() {
          $($(this)).prop('checked', false);
    });
    
    $('#otros_pensamiento_hc').val('');
    $('#idea_mas_loca_hc').val('');
    $('#afectar_negativamente_humor_hc').val('');
    $('#cuales_pensamto_vuelven_hc').val('');
    $("input[type='radio'][name=inlineRadioOptionsPensamientosVuelven]").prop('checked', false);

    // llenarSelectsForms("#pensamiento_select_1", '', true);
    // llenarSelectsForms("#pensamiento_select_2", '', true);
    // llenarSelectsForms("#pensamiento_select_3", '', true);
    // llenarSelectsForms("#pensamiento_select_4", '', true);
    // llenarSelectsForms("#pensamiento_select_5", '', true);
    // llenarSelectsForms("#pensamiento_select_6", '', true);
    // llenarSelectsForms("#pensamiento_select_7", '', true);
    // llenarSelectsForms("#pensamiento_select_8", '', true);
    // llenarSelectsForms("#pensamiento_select_9", '', true);
    // llenarSelectsForms("#pensamiento_select_10", '', true);
    // llenarSelectsForms("#pensamiento_select_11", '', true);
    // llenarSelectsForms("#pensamiento_select_12", '', true);
    // llenarSelectsForms("#pensamiento_select_13", '', true);
    // llenarSelectsForms("#pensamiento_select_14", '', true);
    // llenarSelectsForms("#pensamiento_select_15", '', true);
    
    // relaciones interpersonales
    $("input[type='radio'][name=inlineRadioOptionsRelIntAmigos1]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsRelIntAmigos2]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsRelIntCitaSec]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsRelIntCitaPrepa]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsRelIntAmigos2]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsSituaSocHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsSatisParejaHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAmigosFamParejaHc]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsHijosProb]").prop('checked', false);
    $('#rel_int_relacion_alergia_hc').val('');
    $('#rel_int_relacion_problema_hc').val('');
    $('#rel_inte_parj_casado_hc').val('');
    $('#rel_inte_comp_casado_hc').val('');
    $('#rel_inte_tiempo_mujer_hc').val('');
    $('#rel_inte_edad_pareja_hc').val('');
    $('#rel_inte_ocup_pareja_hc').val('');
    $('#rel_inte_perso_pareja_hc').val('');
    $('#rel_int_gusta_pareja_hc').val('');
    $('#rel_int_gusta_pareja_menos_hc').val('');
    $('#rel_int_satisf_pareja_hc').val('');
    $('#rel_int_pareja_anterior_hc').val('');
    $('#prob_hijo_hc').val('');
    $('#cant_hijos_hc').val('');

    // relaciones sexuales
    $('#act_padres_sex_hc').val('');
    $('#detalle_sex_hc').val('');
    $('#conoc_sex_hc').val('');
    $('#impulso_sex_hc').val('');
    $('#detalle_pena_sex_hc').val('');
    $('#detalle_vida_sex_satisf_hc').val('');
    $('#relac_homo_sex_hc').val('');
    $('#info_extra_relev_hc').val('');
    $('#detalle_rel_trabj_hc').val('');
    $('#gente_lastima_hc').val('');
    $('#describe_como_hc').val('');
    $('#gente_no_gusta_hc').val('');
    $('#alterar_alguien_hc').val('');
    $('#amigo_piensa_soy_hc').val('');
    $('#detalle_rech_frac_amor_hc').val('');
    $('#detalle_primera_exp_sexual_hc').val('');
    $("input[type='radio'][name=inlineRadioOptionsAnsiedadPenaSex]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsVidaSexSatisf]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsRelTrabaj]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsRechFracAmor]").prop('checked', false);

    // factores biologicos
    $("input[type='radio'][name=inlineRadioOptionsProbSaludFis]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsDietaBal]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsOperado]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsEjercFisico]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsProbMenst]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPeriodReg]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsSaberMenst]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsDolorMenst]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsMensAfectaAnimo]").prop('checked', false);
    $('#detalle_prob_salud_fis_hc').val('');
    $('#prob_medic_hc').val('');
    $('#detalle_operado_hc').val('');
    $('#medica_toma_hc').val('');
    $('#detalle_ejerc_fis_hc').val('');
    $('#prob_med_familia_hc').val('');
    $('#edad_menst_hc').val('');
    $('#fecha_ultima_menst_hc').val('');
    $('#durac_period_hc').val('');
    $('#otros_fact_biolg_hc').val('');
    // llenarSelectsForms("#fac_biolg_select_1", '', false);
    // llenarSelectsForms("#fac_biolg_select_2", '', false);
    // llenarSelectsForms("#fac_biolg_select_3", '', false);
    // llenarSelectsForms("#fac_biolg_select_4", '', false);
    // llenarSelectsForms("#fac_biolg_select_5", '', false);
    // llenarSelectsForms("#fac_biolg_select_6", '', false);
    // llenarSelectsForms("#fac_biolg_select_7", '', false);
    // llenarSelectsForms("#fac_biolg_select_8", '', false);
    // llenarSelectsForms("#fac_biolg_select_9", '', false);
    // llenarSelectsForms("#fac_biolg_select_10", '', false);
    // llenarSelectsForms("#fac_biolg_select_11", '', false);
    // llenarSelectsForms("#fac_biolg_select_12", '', false);
    // llenarSelectsForms("#fac_biolg_select_13", '', false);
    // llenarSelectsForms("#fac_biolg_select_14", '', false);
    // llenarSelectsForms("#fac_biolg_select_15", '', false);
    // llenarSelectsForms("#fac_biolg_select_16", '', false);
    // llenarSelectsForms("#fac_biolg_select_17", '', false);
    // llenarSelectsForms("#fac_biolg_select_18", '', false);
    // llenarSelectsForms("#fac_biolg_select_19", '', false);
    // llenarSelectsForms("#fac_biolg_select_20", '', false);
    // llenarSelectsForms("#fac_biolg_select_21", '', false);
    // llenarSelectsForms("#fac_biolg_select_22", '', false);
    // llenarSelectsForms("#fac_biolg_select_23", '', false);
    // llenarSelectsForms("#fac_biolg_select_24", '', false);
    // llenarSelectsForms("#fac_biolg_select_25", '', false);
    // llenarSelectsForms("#fac_biolg_select_26", '', false);
    // llenarSelectsForms("#fac_biolg_select_27", '', false);
    // llenarSelectsForms("#fac_biolg_select_28", '', false);
    // llenarSelectsForms("#fac_biolg_select_29", '', false);
    // llenarSelectsForms("#fac_biolg_select_30", '', false);
    // llenarSelectsForms("#fac_biolg_select_31", '', false);
    // llenarSelectsForms("#fac_biolg_select_32", '', false);
    // llenarSelectsForms("#fac_biolg_select_33", '', false);
    // llenarSelectsForms("#fac_biolg_select_34", '', false);
    // llenarSelectsForms("#fac_biolg_select_35", '', false);
    // llenarSelectsForms("#fac_biolg_select_36", '', false);
    // llenarSelectsForms("#fac_biolg_select_37", '', false);
    // llenarSelectsForms("#fac_biolg_select_38", '', false);
    // llenarSelectsForms("#fac_biolg_select_39", '', false);
    // llenarSelectsForms("#fac_biolg_select_40", '', false);
    // llenarSelectsForms("#fac_biolg_select_41", '', false);
    // llenarSelectsForms("#fac_biolg_select_42", '', false);
    // llenarSelectsForms("#fac_biolg_select_44", '', false);
    // llenarSelectsForms("#fac_biolg_select_45", '', false);
    // llenarSelectsForms("#fac_biolg_select_46", '', false);
    // llenarSelectsForms("#fac_biolg_select_47", '', false);
    // observaciones
    $('#observaciones_hc').val('');
  }

  return {
    init: function () {
      initEvents();
    },
  };
})();

jQuery(function () {
  historia_clinica.init();
});
