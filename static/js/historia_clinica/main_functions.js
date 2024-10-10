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

        if (data.atencion.solicitante.sexo == "Masculino") {
          $("#check_sexo_hombre_hc").prop("checked", true);
        } else if (data.atencion.solicitante.sexo == "Femenino") {
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
        llenarSelectsForms("#fac_biolg_select_43", "", false);
        llenarSelectsForms("#fac_biolg_select_44", "", false);
        llenarSelectsForms("#fac_biolg_select_45", "", false);
        llenarSelectsForms("#fac_biolg_select_46", "", false);
        llenarSelectsForms("#fac_biolg_select_47", "", false);
      });

      $("#modal_hc").modal("show");
    });

    /== evento para cerrar modal de hc ==/;
    $("#btn_cerrar_modal_hc").on("click", function () {
      // limpiarCampos();
      $("#modal_hc").modal("hide");
      location.reload();
    });

    /== evento para cerrar modal de hc ==/;
    $("#btn_cancelar_modal_hc").on("click", function () {
      // limpiarCampos();
      $("#modal_hc").modal("hide");
      location.reload();
    });

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

    $('#form_hc').on('submit', function(e) {
      e.preventDefault();
      var id_atencion = $('#id_atencion').val();
      var id_usuario_autenticado = $("#user_autenticado").val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
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
          familia_intento_suicidio: $('#check_intento_suicidio_si_hc').is('#checked') ? true : $('#check_intento_suicidio_no_hc').is(':checked') ? false : null,
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
          pensamiento_otros_hc: $('#otros_pensamiento_hc').val()
        }

        console.info('params', params);

        $.ajax({
          url: "/historia_clinica/agregar_editar_hc",
          data: {
            params: JSON.stringify(params)
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              $('#btn_agregar_hc').html(textOriginalBtn);
              // limpiarTodosCampos();
              $('#modal_hc').modal('hide');
              swal({
                title: "",
                text: response.mensaje,
                type: response.tipo_mensaje,
                showCancelButton: false,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false
              },
              function() {
                location.reload();
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
            console.info('response edit',response);

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




  return {
    init: function () {
      initEvents();
    },
  };
})();

jQuery(function () {
  historia_clinica.init();
});
