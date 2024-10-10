var fpp = function() {
  var $ = jQuery.noConflict();
  var accion = '';

  
  function initEvents() {
    /== evento para mostrar modal de fpp ==/
    $('#btn_add_fpp').on('click', function() {
      var id_atencion = $('#id_atencion').val();
    
      $.ajax({
        url: "/fpp/get_fpp",
        type: "get",
        data: {id_atencion: id_atencion},
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'Ya existe una Evaluación psicológica (FPP) registrada para esta Atención.', 'error');
          } else {
            $('#modal_fpp').modal('show');
            $('#modal_fpp').find('.modal-title').text('Evaluación Psicológica (FPP)');
            accion = 'agregar';
          }
        },
        error: function(response) {}
      });
    });

    /== evento para cerrar modal de fpp ==/
    $('#btn_cerrar_modal_fpp').on('click', function() {
      limpiarCampos();
      $('#modal_fpp').modal('hide');
      location.reload();
    });
    
    /== evento para cerrar modal de fpp ==/
    $('#btn_cancelar_modal_fpp').on('click', function() {
      limpiarCampos();
      $('#modal_fpp').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un fpp ==/
    $('#btn_agregar_fpp').on('click', function() {
      var id_atencion = $('#id_atencion').val();
      var valor_pregunta1 = devolverValorPregunta('#fpp_check_pregunta_uno_uno', '#fpp_check_pregunta_uno_dos', '#fpp_check_pregunta_uno_tres', '#fpp_check_pregunta_uno_cuatro', '#fpp_check_pregunta_uno_cinco');
      var valor_pregunta2 = devolverValorPregunta('#fpp_check_pregunta_dos_uno', 'fpp_#check_pregunta_dos_dos', '#fpp_check_pregunta_dos_tres', '#fpp_check_pregunta_dos_cuatro', '#fpp_check_pregunta_dos_cinco');
      var valor_pregunta3 = devolverValorPregunta('#fpp_check_pregunta_tres_uno', '#fpp_check_pregunta_tres_dos', '#fpp_check_pregunta_tres_tres', '#fpp_check_pregunta_tres_cuatro', '#fpp_check_pregunta_tres_cinco');
      var valor_pregunta4 = devolverValorPregunta('#fpp_check_pregunta_cuatro_uno', '#fpp_check_pregunta_cuatro_dos', '#fpp_check_pregunta_cuatro_tres', '#fpp_check_pregunta_cuatro_cuatro', '#fpp_check_pregunta_cuatro_cinco');
      var valor_pregunta5 = devolverValorPregunta('#fpp_check_pregunta_cinco_uno', '#fpp_check_pregunta_cinco_dos', '#fpp_check_pregunta_cinco_tres', '#fpp_check_pregunta_cinco_cuatro', '#fpp_check_pregunta_cinco_cinco');
      var valor_pregunta6 = devolverValorPregunta('#fpp_check_pregunta_seis_uno', '#fpp_check_pregunta_seis_dos', '#fpp_check_pregunta_seis_tres', '#fpp_check_pregunta_seis_cuatro', '#fpp_check_pregunta_seis_cinco');
      var valor_pregunta7 = devolverValorPregunta('#fpp_check_pregunta_siete_uno', '#fpp_check_pregunta_siete_dos', '#fpp_check_pregunta_siete_tres', '#fpp_check_pregunta_siete_cuatro', '#fpp_check_pregunta_siete_cinco');
      var valor_pregunta8 = devolverValorPregunta('#fpp_check_pregunta_ocho_uno', '#fpp_check_pregunta_ocho_dos', '#fpp_check_pregunta_ocho_tres', '#fpp_check_pregunta_ocho_cuatro', '#fpp_check_pregunta_ocho_cinco');
      var valor_pregunta9 = devolverValorPregunta('#fpp_check_pregunta_nueve_uno', '#fpp_check_pregunta_nueve_dos', '#fpp_check_pregunta_nueve_tres', '#fpp_check_pregunta_nueve_cuatro', '#fpp_check_pregunta_nueve_cinco');
      var valor_pregunta10 = devolverValorPregunta('#fpp_check_pregunta_diez_uno', '#fpp_check_pregunta_diez_dos', '#fpp_check_pregunta_diez_tres', '#fpp_check_pregunta_diez_cuatro', '#fpp_check_pregunta_diez_cinco');
      var valor_pregunta11 = devolverValorPregunta('#fpp_check_pregunta_once_uno', '#fpp_check_pregunta_once_dos', '#fpp_check_pregunta_once_tres', '#fpp_check_pregunta_once_cuatro', '#fpp_check_pregunta_once_cinco');
      var valor_pregunta12 = devolverValorPregunta('#fpp_check_pregunta_doce_uno', '#fpp_check_pregunta_doce_dos', '#fpp_check_pregunta_doce_tres', '#fpp_check_pregunta_doce_cuatro', '#fpp_check_pregunta_doce_cinco');
      var valor_pregunta13 = devolverValorPregunta('#fpp_check_pregunta_trece_uno', '#fpp_check_pregunta_trece_dos', '#fpp_check_pregunta_trece_tres', '#fpp_check_pregunta_trece_cuatro', '#fpp_check_pregunta_trece_cinco');
      var valor_pregunta14 = devolverValorPregunta('#fpp_check_pregunta_catorce_uno', '#fpp_check_pregunta_catorce_dos', '#fpp_check_pregunta_catorce_tres', '#fpp_check_pregunta_catorce_cuatro', '#fpp_check_pregunta_catorce_cinco');
      var valor_pregunta15 = devolverValorPregunta('#fpp_check_pregunta_quince_uno', '#fpp_check_pregunta_quince_dos', '#fpp_check_pregunta_quince_tres', '#fpp_check_pregunta_quince_cuatro', '#fpp_check_pregunta_quince_cinco');
      var valor_pregunta16 = devolverValorPregunta('#fpp_check_pregunta_dieciseis_uno', '#fpp_check_pregunta_dieciseis_dos', '#fpp_check_pregunta_dieciseis_tres', '#fpp_check_pregunta_dieciseis_cuatro', '#fpp_check_pregunta_dieciseis_cinco');
      var valor_pregunta17 = devolverValorPregunta('#fpp_check_pregunta_diecisiete_uno', '#fpp_check_pregunta_diecisiete_dos', '#fpp_check_pregunta_diecisiete_tres', '#fpp_check_pregunta_diecisiete_cuatro', '#fpp_check_pregunta_diecisiete_cinco');
      var valor_pregunta18 = devolverValorPregunta('#fpp_check_pregunta_dieciocho_uno', '#fpp_check_pregunta_dieciocho_dos', '#fpp_check_pregunta_dieciocho_tres', '#fpp_check_pregunta_dieciocho_cuatro', '#fpp_check_pregunta_dieciocho_cinco');
      var valor_pregunta19 = devolverValorPregunta('#fpp_check_pregunta_diecinueve_uno', '#fpp_check_pregunta_diecinueve_dos', '#fpp_check_pregunta_diecinueve_tres', '#fpp_check_pregunta_diecinueve_cuatro', '#fpp_check_pregunta_diecinueve_cinco');
      var valor_pregunta20 = devolverValorPregunta('#fpp_check_pregunta_veinte_uno', '#fpp_check_pregunta_veinte_dos', '#fpp_check_pregunta_veinte_tres', '#fpp_check_pregunta_veinte_cuatro', '#fpp_check_pregunta_veinte_cinco');
      var valor_pregunta21 = devolverValorPregunta('#fpp_check_pregunta_veintiuno_uno', '#fpp_check_pregunta_veintiuno_dos', '#fpp_check_pregunta_veintiuno_tres', '#fpp_check_pregunta_veintiuno_cuatro', '#fpp_check_pregunta_veintiuno_cinco');
      var valor_pregunta22 = devolverValorPregunta('#fpp_check_pregunta_veintidos_uno', '#fpp_check_pregunta_veintidos_dos', '#fpp_check_pregunta_veintidos_tres', '#fpp_check_pregunta_veintidos_cuatro', '#fpp_check_pregunta_veintidos_cinco');
      var valor_pregunta23 = devolverValorPregunta('#fpp_check_pregunta_veintitres_uno', '#fpp_check_pregunta_veintitres_dos', '#fpp_check_pregunta_veintitres_tres', '#fpp_check_pregunta_veintitres_cuatro', '#fpp_check_pregunta_veintitres_cinco');
      var valor_pregunta24 = devolverValorPregunta('#fpp_check_pregunta_veinticuatro_uno', '#fpp_check_pregunta_veinticuatro_dos', '#fpp_check_pregunta_veinticuatro_tres', '#fpp_check_pregunta_veinticuatro_cuatro', '#fpp_check_pregunta_veinticuatro_cinco');
      var valor_pregunta25 = devolverValorPregunta('#fpp_check_pregunta_veinticinco_uno', '#fpp_check_pregunta_veinticinco_dos', '#fpp_check_pregunta_veinticinco_tres', '#fpp_check_pregunta_veinticinco_cuatro', '#fpp_check_pregunta_veinticinco_cinco');
      var valor_pregunta26 = devolverValorPregunta('#fpp_check_pregunta_veintiseis_uno', '#fpp_check_pregunta_veintiseis_dos', '#fpp_check_pregunta_veintiseis_tres', '#fpp_check_pregunta_veintiseis_cuatro', '#fpp_check_pregunta_veintiseis_cinco');
      var valor_pregunta27 = devolverValorPregunta('#fpp_check_pregunta_veintisiete_uno', '#fpp_check_pregunta_veintisiete_dos', '#fpp_check_pregunta_veintisiete_tres', '#fpp_check_pregunta_veintisiete_cuatro', '#fpp_check_pregunta_veintisiete_cinco');
      var valor_pregunta28 = devolverValorPregunta('#fpp_check_pregunta_veintiocho_uno', '#fpp_check_pregunta_veintiocho_dos', '#fpp_check_pregunta_veintiocho_tres', '#fpp_check_pregunta_veintiocho_cuatro', '#fpp_check_pregunta_veintiocho_cinco');
      var valor_pregunta29 = devolverValorPregunta('#fpp_check_pregunta_veintinueve_uno', '#fpp_check_pregunta_veintinueve_dos', '#fpp_check_pregunta_veintinueve_tres', '#fpp_check_pregunta_veintinueve_cuatro', '#fpp_check_pregunta_veintinueve_cinco');
      var valor_pregunta30 = devolverValorPregunta('#fpp_check_pregunta_treinta_uno', '#fpp_check_pregunta_treinta_dos', '#fpp_check_pregunta_treinta_tres', '#fpp_check_pregunta_treinta_cuatro', '#fpp_check_pregunta_treinta_cinco');
      var valor_pregunta31 = devolverValorPregunta('#fpp_check_pregunta_treintauno_uno', '#fpp_check_pregunta_treintauno_dos', '#fpp_check_pregunta_treintauno_tres', '#fpp_check_pregunta_treintauno_cuatro', '#fpp_check_pregunta_treintauno_cinco');
      var valor_pregunta32 = devolverValorPregunta('#fpp_check_pregunta_treintados_uno', '#fpp_check_pregunta_treintados_dos', '#fpp_check_pregunta_treintados_tres', '#fpp_check_pregunta_treintados_cuatro', '#fpp_check_pregunta_treintados_cinco');
      var valor_pregunta33 = devolverValorPregunta('#fpp_check_pregunta_treintatres_uno', '#fpp_check_pregunta_treintatres_dos', '#fpp_check_pregunta_treintatres_tres', '#fpp_check_pregunta_treintatres_cuatro', '#fpp_check_pregunta_treintatres_cinco');

      var total = valor_pregunta1 + valor_pregunta2 + valor_pregunta3 + valor_pregunta4 + valor_pregunta5 + valor_pregunta6 + valor_pregunta7 + valor_pregunta8 + valor_pregunta9 + valor_pregunta10 + valor_pregunta11 + valor_pregunta12 + valor_pregunta13 + valor_pregunta14 + valor_pregunta15 + valor_pregunta16 + valor_pregunta17 + valor_pregunta18 + valor_pregunta19 + valor_pregunta20 + valor_pregunta21 + valor_pregunta22 + valor_pregunta23 + valor_pregunta24 + valor_pregunta25 + valor_pregunta26 + valor_pregunta27 + valor_pregunta28 + valor_pregunta29 + valor_pregunta30 + valor_pregunta31 + valor_pregunta32 + valor_pregunta33;
      var nivel = devolverNivel(total);
      var color = devolverColor(nivel);
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (valor_pregunta1 == -1 || valor_pregunta2 == -1 || valor_pregunta3 == -1 || valor_pregunta4 == -1 || valor_pregunta5 == -1 || valor_pregunta6 == -1 || valor_pregunta7 == -1 || valor_pregunta8 == -1 || valor_pregunta9 == -1 || valor_pregunta10 == -1 || valor_pregunta11 == -1 || valor_pregunta12 == -1 || valor_pregunta13 == -1 || valor_pregunta14 == -1 || valor_pregunta15 == -1 || valor_pregunta16 == -1 || valor_pregunta17 == -1 || valor_pregunta18 == -1 || valor_pregunta19 == -1 || valor_pregunta20 == -1 || valor_pregunta21 == -1 || valor_pregunta22 == -1 || valor_pregunta23 == -1 || valor_pregunta24 == -1 || valor_pregunta25 == -1 || valor_pregunta26 == -1 || valor_pregunta27 == -1 || valor_pregunta28 == -1 || valor_pregunta29 == -1 || valor_pregunta30 == -1 || valor_pregunta31 == -1 || valor_pregunta32 == -1 || valor_pregunta33 == -1) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Existen preguntas que no ha respondido', 'error');
      } else {
        $.ajax({
          url: "/fpp/agregar_editar_fpp",
          data: {
            id_atencion: id_atencion,
            accion: accion,
            total: total,
            nivel: nivel,
            color: color,
            pregunta1: valor_pregunta1,
            pregunta2: valor_pregunta2,
            pregunta3: valor_pregunta3,
            pregunta4: valor_pregunta4,
            pregunta5: valor_pregunta5,
            pregunta6: valor_pregunta6,
            pregunta7: valor_pregunta7,
            pregunta8: valor_pregunta8,
            pregunta9: valor_pregunta9,
            pregunta10: valor_pregunta10,
            pregunta11: valor_pregunta11,
            pregunta12: valor_pregunta12,
            pregunta13: valor_pregunta13,
            pregunta14: valor_pregunta14,
            pregunta15: valor_pregunta15,
            pregunta16: valor_pregunta16,
            pregunta17: valor_pregunta17,
            pregunta18: valor_pregunta18,
            pregunta19: valor_pregunta19,
            pregunta20: valor_pregunta20,
            pregunta21: valor_pregunta21,
            pregunta22: valor_pregunta22,
            pregunta23: valor_pregunta23,
            pregunta24: valor_pregunta24,
            pregunta25: valor_pregunta25,
            pregunta26: valor_pregunta26,
            pregunta27: valor_pregunta27,
            pregunta28: valor_pregunta28,
            pregunta29: valor_pregunta29,
            pregunta30: valor_pregunta30,
            pregunta31: valor_pregunta31,
            pregunta32: valor_pregunta32,
            pregunta33: valor_pregunta33
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              btn.html(textOriginalBtn);
              limpiarCampos();
              $('#modal_fpp').modal('hide');

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
              btn.html(textOriginalBtn);
            }
          },
          error: function(response) {
            btn.html(textOriginalBtn);
          }
        });
      }
    });

    /== evento para mostrar modal editar fpp ==/
    $('#btn_edit_fpp').on('click', function() {
      var id_atencion = $('#id_atencion').val();

      $.ajax({
        url: "/fpp/get_fpp",
        data: {
          id_atencion: id_atencion
        },
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'no_existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'No se puede editar una Evaluación psicológica (FPP) para esta Atención debido a que todavía no tiene ninguna registrada.', 'error');
          } else {
            $('#modal_fpp').modal('show');
            $('#modal_fpp').find('.modal-title').text('Evaluación Psicológica (FPP)');
            accion = 'editar';
            
            if (response.pregunta1) {
              marcarPreguntas('uno', response.pregunta1);
            }
            if (response.pregunta2) {
              marcarPreguntas('dos', response.pregunta2);
            }
            if (response.pregunta3) {
              marcarPreguntas('tres', response.pregunta3);
            }
            if (response.pregunta4) {
              marcarPreguntas('cuatro', response.pregunta4);
            }
            if (response.pregunta5) {
              marcarPreguntas('cinco', response.pregunta5);
            }
            if (response.pregunta6) {
              marcarPreguntas('seis', response.pregunta6);
            }
            if (response.pregunta7) {
              marcarPreguntas('siete', response.pregunta7);
            }
            if (response.pregunta8) {
              marcarPreguntas('ocho', response.pregunta8);
            }
            if (response.pregunta9) {
              marcarPreguntas('nueve', response.pregunta9);
            }
            if (response.pregunta10) {
              marcarPreguntas('diez', response.pregunta10);
            }
            if (response.pregunta11) {
              marcarPreguntas('once', response.pregunta11);
            }
            if (response.pregunta12) {
              marcarPreguntas('doce', response.pregunta12);
            }
            if (response.pregunta13) {
              marcarPreguntas('trece', response.pregunta13);
            }
            if (response.pregunta14) {
              marcarPreguntas('catorce', response.pregunta14);
            }
            if (response.pregunta15) {
              marcarPreguntas('quince', response.pregunta15);
            }
            if (response.pregunta16) {
              marcarPreguntas('dieciseis', response.pregunta16);
            }
            if (response.pregunta17) {
              marcarPreguntas('diecisiete', response.pregunta17);
            }
            if (response.pregunta18) {
              marcarPreguntas('dieciocho', response.pregunta18);
            }
            if (response.pregunta19) {
              marcarPreguntas('diecinueve', response.pregunta19);
            }
            if (response.pregunta20) {
              marcarPreguntas('veinte', response.pregunta20);
            }
            if (response.pregunta21) {
              marcarPreguntas('veintiuno', response.pregunta21);
            }
            if (response.pregunta22) {
              marcarPreguntas('veintidos', response.pregunta22);
            }
            if (response.pregunta23) {
              marcarPreguntas('veintitres', response.pregunta23);
            }
            if (response.pregunta24) {
              marcarPreguntas('veinticuatro', response.pregunta24);
            }
            if (response.pregunta25) {
              marcarPreguntas('veinticinco', response.pregunta25);
            }
            if (response.pregunta26) {
              marcarPreguntas('veintiseis', response.pregunta26);
            }
            if (response.pregunta27) {
              marcarPreguntas('veintisiete', response.pregunta27);
            }
            if (response.pregunta28) {
              marcarPreguntas('veintiocho', response.pregunta28);
            }
            if (response.pregunta29) {
              marcarPreguntas('veintinueve', response.pregunta29);
            }
            if (response.pregunta30) {
              marcarPreguntas('treinta', response.pregunta30);
            }
            if (response.pregunta31) {
              marcarPreguntas('treintauno', response.pregunta31);
            }
            if (response.pregunta32) {
              marcarPreguntas('treintados', response.pregunta32);
            }
            if (response.pregunta33) {
              marcarPreguntas('treintatres', response.pregunta33);
            }
          }
        },
        error: function(response) {}
      });
    });

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
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta1]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta2]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta3]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta4]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta5]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta6]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta7]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta8]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta9]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta10]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta11]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta12]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta13]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta14]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta15]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta16]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta17]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta18]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta19]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta20]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta21]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta22]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta23]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta24]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta25]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta26]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta27]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta28]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta29]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta30]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta31]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta32]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsFPPPregunta33]").prop('checked', false);
    accion = '';
  }

  /== funcion para devolver el valor de la pregunta seleccionada ==/
  function devolverValorPregunta(check1, check2, check3, check4, check5) {
    var is_check1 = $(check1).is(":checked");
    var is_check2 = $(check2).is(":checked");
    var is_check3 = $(check3).is(":checked");
    var is_check4 = $(check4).is(":checked");
    var is_check5 = $(check5).is(":checked");
    var valor = -1;

    if (is_check1 == true) {
      valor = 1;
    } else if (is_check2 == true) {
      valor = 2;
    } else if (is_check3 == true) {
      valor = 3;
    } else if (is_check4 == true) {
      valor = 4;
    } else if (is_check5 == true) {
      valor = 5;
    }

    return valor;
  }

  function marcarPreguntas(pregunta, valor) {
    var check_uno = '#fpp_check_pregunta_' + pregunta + '_uno';
    var check_dos = '#fpp_check_pregunta_' + pregunta + '_dos';
    var check_tres = '#fpp_check_pregunta_' + pregunta + '_tres';
    var check_cuatro = '#fpp_check_pregunta_' + pregunta + '_cuatro';
    var check_cinco = '#fpp_check_pregunta_' + pregunta + '_cinco';

    switch (valor) {
      case 1:
        $(check_uno).prop('checked', true);
        break;
      case 2:
        $(check_dos).prop('checked', true);
        break;
      case 3:
        $(check_tres).prop('checked', true);
        break;
      case 4:
        $(check_cuatro).prop('checked', true);
        break;
      case 5:
        $(check_cinco).prop('checked', true);
        break;
    }
  }

  function devolverNivel(valor) {
    var nivel = '';

    if ((valor >= 0) && (valor <= 16)) {
      nivel = 'Muy bajo';
    } else if ((valor >= 17) && (valor <= 33)) {
      nivel = 'Bajo';
    } else if ((valor >= 34) && (valor <= 50)) {
      nivel = 'Moderado';
    } else if (valor > 50) {
      nivel = 'Alto';
    }

    return nivel;
  }

  function devolverColor(nivel) {
    var color = '';
    var verde = '#7ceda7';
    var amarillo = '#faf032';
    var naranja = '#eb870e';
    var rojo = '#eb150e';

    if (nivel == 'Muy bajo') {
      color = rojo;
    } else if (nivel == 'Bajo') {
      color = naranja;
    } else if (nivel == 'Moderado') {
      color = amarillo;
    } else if (nivel == 'Alto') {
      color = verde;
    }

    return color;
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  fpp.init();
});