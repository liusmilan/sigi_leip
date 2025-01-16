var auto_eva_psico = function() {
  var $ = jQuery.noConflict();
  var accion = '';


  function initEvents() {
    /== evento para mostrar modal de auto_eva_psico ==/
    $('#btn_add_autoevaluacion_psicologica').on('click', function() {
      var id_atencion = $('#id_atencion').val();
    
      $.ajax({
        url: "/auto_eva_psico/get_auto_eva_psico",
        type: "get",
        data: {id_atencion: id_atencion},
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'Ya existe una Autoevaluación psicológica registrada para esta Atención.', 'error');
          } else {
            $('#modal_auto_eva_psico').modal('show');
            $('#modal_auto_eva_psico').find('.modal-title').text('Autoevaluación Psicológica');
            accion = 'agregar';
          }
        },
        error: function(response) {}
      });
    });

    /== evento para cerrar modal de auto_eva_psico ==/
    $('#btn_cerrar_modal_auto_eva_psico').on('click', function() {
      limpiarCampos();
      $('#modal_auto_eva_psico').modal('hide');
      $(document).trigger('actualizar_lista_atenciones');
    });
    
    /== evento para cerrar modal de auto_eva_psico ==/
    $('#btn_cancelar_modal_auto_eva_psico').on('click', function() {
      limpiarCampos();
      $('#modal_auto_eva_psico').modal('hide');
      $(document).trigger('actualizar_lista_atenciones');
    });

    /== evento para agregar o editar un auto_eva_psico ==/
    $('#btn_agregar_auto_eva_psico').on('click', function() {
      var id_atencion = $('#id_atencion').val();
      var valor_pregunta1 = devolverValorPregunta('#auto_eva_psico_check_pregunta_uno_uno', '#auto_eva_psico_check_pregunta_uno_dos', '#auto_eva_psico_check_pregunta_uno_tres', '#auto_eva_psico_check_pregunta_uno_cuatro');
      var valor_pregunta2 = devolverValorPregunta('#auto_eva_psico_check_pregunta_dos_uno', '#auto_eva_psico_check_pregunta_dos_dos', '#auto_eva_psico_check_pregunta_dos_tres', '#auto_eva_psico_check_pregunta_dos_cuatro');
      var valor_pregunta3 = devolverValorPregunta('#auto_eva_psico_check_pregunta_tres_uno', '#auto_eva_psico_check_pregunta_tres_dos', '#auto_eva_psico_check_pregunta_tres_tres', '#auto_eva_psico_check_pregunta_tres_cuatro');
      var valor_pregunta4 = devolverValorPregunta('#auto_eva_psico_check_pregunta_cuatro_uno', '#auto_eva_psico_check_pregunta_cuatro_dos', '#auto_eva_psico_check_pregunta_cuatro_tres', '#auto_eva_psico_check_pregunta_cuatro_cuatro');
      var valor_pregunta5 = devolverValorPregunta('#auto_eva_psico_check_pregunta_cinco_uno', '#auto_eva_psico_check_pregunta_cinco_dos', '#auto_eva_psico_check_pregunta_cinco_tres', '#auto_eva_psico_check_pregunta_cinco_cuatro', '#auto_eva_psico_check_pregunta_cinco_cinco');
      var valor_pregunta6 = devolverValorPregunta('#auto_eva_psico_check_pregunta_seis_uno', '#auto_eva_psico_check_pregunta_seis_dos', '#auto_eva_psico_check_pregunta_seis_tres', '#auto_eva_psico_check_pregunta_seis_cuatro');
      var valor_pregunta7 = devolverValorPregunta('#auto_eva_psico_check_pregunta_siete_uno', '#auto_eva_psico_check_pregunta_siete_dos', '#auto_eva_psico_check_pregunta_siete_tres', '#auto_eva_psico_check_pregunta_siete_cuatro');
      var valor_pregunta8 = devolverValorPregunta('#auto_eva_psico_check_pregunta_ocho_uno', '#auto_eva_psico_check_pregunta_ocho_dos', '#auto_eva_psico_check_pregunta_ocho_tres', '#auto_eva_psico_check_pregunta_ocho_cuatro');
      var valor_pregunta9 = devolverValorPregunta('#auto_eva_psico_check_pregunta_nueve_uno', '#auto_eva_psico_check_pregunta_nueve_dos', '#auto_eva_psico_check_pregunta_nueve_tres', '#auto_eva_psico_check_pregunta_nueve_cuatro');
      var valor_pregunta10 = devolverValorPregunta('#auto_eva_psico_check_pregunta_diez_uno', '#auto_eva_psico_check_pregunta_diez_dos', '#auto_eva_psico_check_pregunta_diez_tres', '#auto_eva_psico_check_pregunta_diez_cuatro');
      var valor_pregunta11 = devolverValorPregunta('#auto_eva_psico_check_pregunta_once_uno', '#auto_eva_psico_check_pregunta_once_dos', '#auto_eva_psico_check_pregunta_once_tres', '#auto_eva_psico_check_pregunta_once_cuatro');
      var valor_pregunta12 = devolverValorPregunta('#auto_eva_psico_check_pregunta_doce_uno', '#auto_eva_psico_check_pregunta_doce_dos', '#auto_eva_psico_check_pregunta_doce_tres', '#auto_eva_psico_check_pregunta_doce_cuatro');
      var valor_pregunta13 = devolverValorPregunta('#auto_eva_psico_check_pregunta_trece_uno', '#auto_eva_psico_check_pregunta_trece_dos', '#auto_eva_psico_check_pregunta_trece_tres', '#auto_eva_psico_check_pregunta_trece_cuatro');
      var valor_pregunta14 = devolverValorPregunta('#auto_eva_psico_check_pregunta_catorce_uno', '#auto_eva_psico_check_pregunta_catorce_dos', '#auto_eva_psico_check_pregunta_catorce_tres', '#auto_eva_psico_check_pregunta_catorce_cuatro');
      var valor_pregunta15 = devolverValorPregunta('#auto_eva_psico_check_pregunta_quince_uno', '#auto_eva_psico_check_pregunta_quince_dos', '#auto_eva_psico_check_pregunta_quince_tres', '#auto_eva_psico_check_pregunta_quince_cuatro');
      var valor_pregunta16 = devolverValorPregunta('#auto_eva_psico_check_pregunta_dieciseis_uno', '#auto_eva_psico_check_pregunta_dieciseis_dos', '#auto_eva_psico_check_pregunta_dieciseis_tres', '#auto_eva_psico_check_pregunta_dieciseis_cuatro');
      var valor_pregunta17 = devolverValorPregunta('#auto_eva_psico_check_pregunta_diecisiete_uno', '#auto_eva_psico_check_pregunta_diecisiete_dos', '#auto_eva_psico_check_pregunta_diecisiete_tres', '#auto_eva_psico_check_pregunta_diecisiete_cuatro');
      var valor_pregunta18 = devolverValorPregunta('#auto_eva_psico_check_pregunta_dieciocho_uno', '#auto_eva_psico_check_pregunta_dieciocho_dos', '#auto_eva_psico_check_pregunta_dieciocho_tres', '#auto_eva_psico_check_pregunta_dieciocho_cuatro');
      var valor_pregunta19 = devolverValorPregunta('#auto_eva_psico_check_pregunta_diecinueve_uno', '#auto_eva_psico_check_pregunta_diecinueve_dos', '#auto_eva_psico_check_pregunta_diecinueve_tres', '#auto_eva_psico_check_pregunta_diecinueve_cuatro');
      var valor_pregunta20 = devolverValorPregunta('#auto_eva_psico_check_pregunta_veinte_uno', '#auto_eva_psico_check_pregunta_veinte_dos', '#auto_eva_psico_check_pregunta_veinte_tres', '#auto_eva_psico_check_pregunta_veinte_cuatro');
      var valor_pregunta21 = devolverValorPregunta('#auto_eva_psico_check_pregunta_veintiuno_uno', '#auto_eva_psico_check_pregunta_veintiuno_dos', '#auto_eva_psico_check_pregunta_veintiuno_tres', '#auto_eva_psico_check_pregunta_veintiuno_cuatro');
      var valor_pregunta22 = devolverValorPregunta('#auto_eva_psico_check_pregunta_veintidos_uno', '#auto_eva_psico_check_pregunta_veintidos_dos', '#auto_eva_psico_check_pregunta_veintidos_tres', '#auto_eva_psico_check_pregunta_veintidos_cuatro');
      var valor_pregunta23 = devolverValorPregunta('#auto_eva_psico_check_pregunta_veintitres_uno', '#auto_eva_psico_check_pregunta_veintitres_dos', '#auto_eva_psico_check_pregunta_veintitres_tres', '#auto_eva_psico_check_pregunta_veintitres_cuatro');
      var valor_pregunta24 = devolverValorPregunta('#auto_eva_psico_check_pregunta_veinticuatro_uno', '#auto_eva_psico_check_pregunta_veinticuatro_dos', '#auto_eva_psico_check_pregunta_veinticuatro_tres', '#auto_eva_psico_check_pregunta_veinticuatro_cuatro');
      var valor_pregunta25 = devolverValorPregunta('#auto_eva_psico_check_pregunta_veinticinco_uno', '#auto_eva_psico_check_pregunta_veinticinco_dos', '#auto_eva_psico_check_pregunta_veinticinco_tres', '#auto_eva_psico_check_pregunta_veinticinco_cuatro');
      var valor_pregunta26 = devolverValorPregunta('#auto_eva_psico_check_pregunta_veintiseis_uno', '#auto_eva_psico_check_pregunta_veintiseis_dos', '#auto_eva_psico_check_pregunta_veintiseis_tres', '#auto_eva_psico_check_pregunta_veintiseis_cuatro');
      var valor_pregunta27 = devolverValorPregunta('#auto_eva_psico_check_pregunta_veintisiete_uno', '#auto_eva_psico_check_pregunta_veintisiete_dos', '#auto_eva_psico_check_pregunta_veintisiete_tres', '#auto_eva_psico_check_pregunta_veintisiete_cuatro');
      var valor_pregunta28 = devolverValorPregunta('#auto_eva_psico_check_pregunta_veintiocho_uno', '#auto_eva_psico_check_pregunta_veintiocho_dos', '#auto_eva_psico_check_pregunta_veintiocho_tres', '#auto_eva_psico_check_pregunta_veintiocho_cuatro');
      var valor_pregunta29 = devolverValorPregunta('#auto_eva_psico_check_pregunta_veintinueve_uno', '#auto_eva_psico_check_pregunta_veintinueve_dos', '#auto_eva_psico_check_pregunta_veintinueve_tres', '#auto_eva_psico_check_pregunta_veintinueve_cuatro');
      var valor_pregunta30 = devolverValorPregunta('#auto_eva_psico_check_pregunta_treinta_uno', '#auto_eva_psico_check_pregunta_treinta_dos', '#auto_eva_psico_check_pregunta_treinta_tres', '#auto_eva_psico_check_pregunta_treinta_cuatro');
      var valor_pregunta31 = devolverValorPregunta('#auto_eva_psico_check_pregunta_treintauno_uno', '#auto_eva_psico_check_pregunta_treintauno_dos', '#auto_eva_psico_check_pregunta_treintauno_tres', '#auto_eva_psico_check_pregunta_treintauno_cuatro');
      var valor_pregunta32 = devolverValorPregunta('#auto_eva_psico_check_pregunta_treintados_uno', '#auto_eva_psico_check_pregunta_treintados_dos', '#auto_eva_psico_check_pregunta_treintados_tres', '#auto_eva_psico_check_pregunta_treintados_cuatro');
      var valor_pregunta33 = devolverValorPregunta('#auto_eva_psico_check_pregunta_treintatres_uno', '#auto_eva_psico_check_pregunta_treintatres_dos', '#auto_eva_psico_check_pregunta_treintatres_tres', '#auto_eva_psico_check_pregunta_treintatres_cuatro');

      var total = (valor_pregunta1) + (valor_pregunta2) + (valor_pregunta3) + (valor_pregunta4) + (valor_pregunta5) + (valor_pregunta6) + (valor_pregunta7) + (valor_pregunta8) + (valor_pregunta9) + (valor_pregunta10) + (valor_pregunta11) + (valor_pregunta12) + (valor_pregunta13) + (valor_pregunta14) + (valor_pregunta15) + (valor_pregunta16) + (valor_pregunta17) + (valor_pregunta18) + (valor_pregunta19) + (valor_pregunta20) + (valor_pregunta21) + (valor_pregunta22) + (valor_pregunta23) + (valor_pregunta24) + (valor_pregunta25) + (valor_pregunta26) + (valor_pregunta27) + (valor_pregunta28) + (valor_pregunta29) + (valor_pregunta30) + (valor_pregunta31) + (valor_pregunta32) + (valor_pregunta33);
      var nivel = devolverNivel(total);
      var color = devolverColor(nivel);
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (valor_pregunta1 == '' || valor_pregunta2 == '' || valor_pregunta3 == '' || valor_pregunta4 == '' || valor_pregunta5 == '' || valor_pregunta6 == '' || valor_pregunta7 == '' || valor_pregunta8 == '' || valor_pregunta9 == '' || valor_pregunta10 == '' || valor_pregunta11 == '' || valor_pregunta12 == '' || valor_pregunta13 == '' || valor_pregunta14 == '' || valor_pregunta15 == '' || valor_pregunta16 == '' || valor_pregunta17 == '' || valor_pregunta18 == '' || valor_pregunta19 == '' || valor_pregunta20 == '' || valor_pregunta21 == '' || valor_pregunta22 == '' || valor_pregunta23 == '' || valor_pregunta24 == '' || valor_pregunta25 == '' || valor_pregunta26 == '' || valor_pregunta27 == '' || valor_pregunta28 == '' || valor_pregunta29 == '' || valor_pregunta30 == '' || valor_pregunta31 == '' || valor_pregunta32 == '' || valor_pregunta33 == '') {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Existen preguntas que no ha respondido', 'error');
      } else {
        $.ajax({
          url: "/auto_eva_psico/agregar_editar_auto_eva_psico",
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
              $('#modal_auto_eva_psico').modal('hide');

              var mensaje = 'Tu calificación final es de ' + total + 'puntos.' ;

              switch (nivel) {
                case 'Alto':
                  mensaje += ' Te felicito.';
                  break;
                case 'Moderado':
                  mensaje += ' Hay algunos aspectos importantes de tu vida que es necesario cambiar por ti mismo.';
                  break;
                case 'Bajo':
                  mensaje += ' Es conveniente que acudas a un psicoterapeuta para recibir orientación y motivación profesional.';
                  break;
                case 'Muy bajo':
                  mensaje += ' Es urgente que recibas atención psicológica.';
                  break;
              }

              mensaje += ' Por los aspectos que calificaste con B o R Reflexiona y concéntrate en superar los que hayas calificado con P o N.';

              swal({
                title: "",
                text: mensaje,
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
              btn.html(textOriginalBtn);
            }
          },
          error: function(response) {
            btn.html(textOriginalBtn);
          }
        });
      }
    });

    /== evento para mostrar modal editar auto_eva_psico ==/
    $('#btn_edit_autoevaluacion_psicologica').on('click', function() {
      var id_atencion = $('#id_atencion').val();

      $.ajax({
        url: "/auto_eva_psico/get_auto_eva_psico",
        data: {
          id_atencion: id_atencion
        },
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'no_existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'No se puede editar una Autoevaluación psicológica para esta Atención debido a que todavía no tiene ninguna registrada.', 'error');
          } else {
            $('#modal_auto_eva_psico').modal('show');
            $('#modal_auto_eva_psico').find('.modal-title').text('Autoevaluación Psicológica');
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
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta1]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta2]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta3]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta4]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta5]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta6]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta7]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta8]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta9]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta10]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta11]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta12]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta13]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta14]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta15]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta16]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta17]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta18]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta19]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta20]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta21]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta22]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta23]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta24]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta25]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta26]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta27]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta28]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta29]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta30]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta31]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta32]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsAutoEvaPsicoPregunta33]").prop('checked', false);
    accion = '';
  }

  /== funcion para devolver el valor de la pregunta seleccionada ==/
  function devolverValorPregunta(check1, check2, check3, check4) {
    var is_check1 = $(check1).is(":checked");
    var is_check2 = $(check2).is(":checked");
    var is_check3 = $(check3).is(":checked");
    var is_check4 = $(check4).is(":checked");
    var valor = '';

    if (is_check1 == true) {
      valor = parseInt(2);
    } else if (is_check2 == true) {
      valor = parseInt(1);
    } else if (is_check3 == true) {
      valor = parseInt(-1);
    } else if (is_check4 == true) {
      valor = parseInt(-2);
    }

    return valor;
  }

  function marcarPreguntas(pregunta, valor) {
    var check_uno = '#auto_eva_psico_check_pregunta_' + pregunta + '_uno';
    var check_dos = '#auto_eva_psico_check_pregunta_' + pregunta + '_dos';
    var check_tres = '#auto_eva_psico_check_pregunta_' + pregunta + '_tres';
    var check_cuatro = '#auto_eva_psico_check_pregunta_' + pregunta + '_cuatro';

    switch (valor) {
      case 2:
        $(check_uno).prop('checked', true);
        break;
      case 1:
        $(check_dos).prop('checked', true);
        break;
      case -1:
        $(check_tres).prop('checked', true);
        break;
      case -2:
        $(check_cuatro).prop('checked', true);
        break;
    }
  }

  function devolverNivel(valor) {
    var nivel = '';

    if (valor < 18) {
      nivel = 'Muy bajo';
    } else if ((valor >= 18) && (valor <= 33)) {
      nivel = 'Bajo';
    } else if ((valor >= 34) && (valor <= 49)) {
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
  auto_eva_psico.init();
});