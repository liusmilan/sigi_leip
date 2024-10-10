var mst_nivel1 = function() {
  var $ = jQuery.noConflict();
  var accion = '';


  function initEvents() {
    /== evento para mostrar modal de mst_nivel1 ==/
    $('#btn_add_mst_n1').on('click', function() {
      var id_atencion = $('#id_atencion').val();
    
      $.ajax({
        url: "/mst_nivel1/get_mst_nivel1",
        type: "get",
        data: {id_atencion: id_atencion},
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'Ya existe una Evaluación psicológica (MST Nivel 1) registrada para esta Atención.', 'error');
          } else {
            $('#modal_mst_nivel1').modal('show');
            $('#modal_mst_nivel1').find('.modal-title').text('Evaluación Psicológica (MST Nivel 1)');
            accion = 'agregar';
          }
        },
        error: function(response) {}
      });
    });

    /== evento para cerrar modal de mst_nivel1 ==/
    $('#btn_cerrar_modal_mst_nivel1').on('click', function() {
      limpiarCampos();
      $('#modal_mst_nivel1').modal('hide');
      location.reload();
    });
    
    /== evento para cerrar modal de mst_nivel1 ==/
    $('#btn_cancelar_modal_mst_nivel1').on('click', function() {
      limpiarCampos();
      $('#modal_mst_nivel1').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un mst_nivel1 ==/
    $('#btn_agregar_mst_nivel1').on('click', function() {
      var id_atencion = $('#id_atencion').val();
      var valor_pregunta1 = devolverValorPregunta('#check_pregunta_uno_cero', '#check_pregunta_uno_uno', '#check_pregunta_uno_dos', '#check_pregunta_uno_tres', '#check_pregunta_uno_cuatro');
      var valor_pregunta2 = devolverValorPregunta('#check_pregunta_dos_cero', '#check_pregunta_dos_uno', '#check_pregunta_dos_dos', '#check_pregunta_dos_tres', '#check_pregunta_dos_cuatro');
      var valor_pregunta3 = devolverValorPregunta('#check_pregunta_tres_cero', '#check_pregunta_tres_uno', '#check_pregunta_tres_dos', '#check_pregunta_tres_tres', '#check_pregunta_tres_cuatro');
      var valor_pregunta4 = devolverValorPregunta('#check_pregunta_cuatro_cero', '#check_pregunta_cuatro_uno', '#check_pregunta_cuatro_dos', '#check_pregunta_cuatro_tres', '#check_pregunta_cuatro_cuatro');
      var valor_pregunta5 = devolverValorPregunta('#check_pregunta_cinco_cero', '#check_pregunta_cinco_uno', '#check_pregunta_cinco_dos', '#check_pregunta_cinco_tres', '#check_pregunta_cinco_cuatro');
      var valor_pregunta6 = devolverValorPregunta('#check_pregunta_seis_cero', '#check_pregunta_seis_uno', '#check_pregunta_seis_dos', '#check_pregunta_seis_tres', '#check_pregunta_seis_cuatro');
      var valor_pregunta7 = devolverValorPregunta('#check_pregunta_siete_cero', '#check_pregunta_siete_uno', '#check_pregunta_siete_dos', '#check_pregunta_siete_tres', '#check_pregunta_siete_cuatro');
      var valor_pregunta8 = devolverValorPregunta('#check_pregunta_ocho_cero', '#check_pregunta_ocho_uno', '#check_pregunta_ocho_dos', '#check_pregunta_ocho_tres', '#check_pregunta_ocho_cuatro');
      var valor_pregunta9 = devolverValorPregunta('#check_pregunta_nueve_cero', '#check_pregunta_nueve_uno', '#check_pregunta_nueve_dos', '#check_pregunta_nueve_tres', '#check_pregunta_nueve_cuatro');
      var valor_pregunta10 = devolverValorPregunta('#check_pregunta_diez_cero', '#check_pregunta_diez_uno', '#check_pregunta_diez_dos', '#check_pregunta_diez_tres', '#check_pregunta_diez_cuatro');
      var valor_pregunta11 = devolverValorPregunta('#check_pregunta_once_cero', '#check_pregunta_once_uno', '#check_pregunta_once_dos', '#check_pregunta_once_tres', '#check_pregunta_once_cuatro');
      var valor_pregunta12 = devolverValorPregunta('#check_pregunta_doce_cero', '#check_pregunta_doce_uno', '#check_pregunta_doce_dos', '#check_pregunta_doce_tres', '#check_pregunta_doce_cuatro');
      var valor_pregunta13 = devolverValorPregunta('#check_pregunta_trece_cero', '#check_pregunta_trece_uno', '#check_pregunta_trece_dos', '#check_pregunta_trece_tres', '#check_pregunta_trece_cuatro');
      var valor_pregunta14 = devolverValorPregunta('#check_pregunta_catorce_cero', '#check_pregunta_catorce_uno', '#check_pregunta_catorce_dos', '#check_pregunta_catorce_tres', '#check_pregunta_catorce_cuatro');
      var valor_pregunta15 = devolverValorPregunta('#check_pregunta_quince_cero', '#check_pregunta_quince_uno', '#check_pregunta_quince_dos', '#check_pregunta_quince_tres', '#check_pregunta_quince_cuatro');
      var valor_pregunta16 = devolverValorPregunta('#check_pregunta_dieciseis_cero', '#check_pregunta_dieciseis_uno', '#check_pregunta_dieciseis_dos', '#check_pregunta_dieciseis_tres', '#check_pregunta_dieciseis_cuatro');
      var valor_pregunta17 = devolverValorPregunta('#check_pregunta_diecisiete_cero', '#check_pregunta_diecisiete_uno', '#check_pregunta_diecisiete_dos', '#check_pregunta_diecisiete_tres', '#check_pregunta_diecisiete_cuatro');
      var valor_pregunta18 = devolverValorPregunta('#check_pregunta_dieciocho_cero', '#check_pregunta_dieciocho_uno', '#check_pregunta_dieciocho_dos', '#check_pregunta_dieciocho_tres', '#check_pregunta_dieciocho_cuatro');
      var valor_pregunta19 = devolverValorPregunta('#check_pregunta_diecinueve_cero', '#check_pregunta_diecinueve_uno', '#check_pregunta_diecinueve_dos', '#check_pregunta_diecinueve_tres', '#check_pregunta_diecinueve_cuatro');
      var valor_pregunta20 = devolverValorPregunta('#check_pregunta_veinte_cero', '#check_pregunta_veinte_uno', '#check_pregunta_veinte_dos', '#check_pregunta_veinte_tres', '#check_pregunta_veinte_cuatro');
      var valor_pregunta21 = devolverValorPregunta('#check_pregunta_veintiuno_cero', '#check_pregunta_veintiuno_uno', '#check_pregunta_veintiuno_dos', '#check_pregunta_veintiuno_tres', '#check_pregunta_veintiuno_cuatro');
      var valor_pregunta22 = devolverValorPregunta('#check_pregunta_veintidos_cero', '#check_pregunta_veintidos_uno', '#check_pregunta_veintidos_dos', '#check_pregunta_veintidos_tres', '#check_pregunta_veintidos_cuatro');
      var valor_pregunta23 = devolverValorPregunta('#check_pregunta_veintitres_cero', '#check_pregunta_veintitres_uno', '#check_pregunta_veintitres_dos', '#check_pregunta_veintitres_tres', '#check_pregunta_veintitres_cuatro');

      var total = valor_pregunta1 + valor_pregunta2 + valor_pregunta3 + valor_pregunta4 + valor_pregunta5 + valor_pregunta6 + valor_pregunta7 + valor_pregunta8 + valor_pregunta9 + valor_pregunta10 + valor_pregunta11 + valor_pregunta12 + valor_pregunta13 + valor_pregunta14 + valor_pregunta15 + valor_pregunta16 + valor_pregunta17 + valor_pregunta18 + valor_pregunta19 + valor_pregunta20 + valor_pregunta21 + valor_pregunta22 + valor_pregunta23;
      var nivel = devolverNivel(total);
      var color = devolverColor(nivel);
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (valor_pregunta1 == -1 || valor_pregunta2 == -1 || valor_pregunta3 == -1 || valor_pregunta4 == -1 || valor_pregunta5 == -1 || valor_pregunta6 == -1 || valor_pregunta7 == -1 || valor_pregunta8 == -1 || valor_pregunta9 == -1 || valor_pregunta10 == -1 || valor_pregunta11 == -1 || valor_pregunta12 == -1 || valor_pregunta13 == -1 || valor_pregunta14 == -1 || valor_pregunta15 == -1 || valor_pregunta16 == -1 || valor_pregunta17 == -1 || valor_pregunta18 == -1 || valor_pregunta19 == -1 || valor_pregunta20 == -1 || valor_pregunta21 == -1 || valor_pregunta22 == -1 || valor_pregunta23 == -1) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Existen preguntas que no ha respondido', 'error');
      } else {
        $.ajax({
          url: "/mst_nivel1/agregar_editar_mst_nivel1",
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
            pregunta23: valor_pregunta23
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              btn.html(textOriginalBtn);
              limpiarCampos();
              $('#modal_mst_nivel1').modal('hide');

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

    /== evento para mostrar modal editar mst_nivel1 ==/
    $('#btn_edit_mst_n1').on('click', function() {
      var id_atencion = $('#id_atencion').val();

      $.ajax({
        url: "/mst_nivel1/get_mst_nivel1",
        data: {
          id_atencion: id_atencion
        },
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'no_existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'No se puede editar una Evaluación psicológica (MST Nivel 1) para esta Atención debido a que todavía no tiene ninguna registrada.', 'error');
          } else {
            $('#modal_mst_nivel1').modal('show');
            $('#modal_mst_nivel1').find('.modal-title').text('Evaluación Psicológica (MST Nivel 1)');
            accion = 'editar';

            marcarPreguntas('uno', response.pregunta1);
            marcarPreguntas('dos', response.pregunta2);
            marcarPreguntas('tres', response.pregunta3);
            marcarPreguntas('cuatro', response.pregunta4);
            marcarPreguntas('cinco', response.pregunta5);
            marcarPreguntas('seis', response.pregunta6);
            marcarPreguntas('siete', response.pregunta7);
            marcarPreguntas('ocho', response.pregunta8);
            marcarPreguntas('nueve', response.pregunta9);
            marcarPreguntas('diez', response.pregunta10);
            marcarPreguntas('once', response.pregunta11);
            marcarPreguntas('doce', response.pregunta12);
            marcarPreguntas('trece', response.pregunta13);
            marcarPreguntas('catorce', response.pregunta14);
            marcarPreguntas('quince', response.pregunta15);
            marcarPreguntas('dieciseis', response.pregunta16);
            marcarPreguntas('diecisiete', response.pregunta17);
            marcarPreguntas('dieciocho', response.pregunta18);
            marcarPreguntas('diecinueve', response.pregunta19);
            marcarPreguntas('veinte', response.pregunta20);
            marcarPreguntas('veintiuno', response.pregunta21);
            marcarPreguntas('veintidos', response.pregunta22);
            marcarPreguntas('veintitres', response.pregunta23);
          }
        },
        error: function(response) {}
      });
    });
  }

  function limpiarCampos() {
    $("input[type='radio'][name=inlineRadioOptionsPregunta1]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta2]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta3]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta4]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta5]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta6]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta7]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta8]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta9]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta10]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta11]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta12]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta13]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta14]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta15]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta16]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta17]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta18]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta19]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta20]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta21]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta22]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPregunta23]").prop('checked', false);
    accion = '';
  }

  /== funcion para devolver el valor de la pregunta seleccionada ==/
  function devolverValorPregunta(check0, check1, check2, check3, check4) {
    var is_check0 = $(check0).is(":checked");
    var is_check1 = $(check1).is(":checked");
    var is_check2 = $(check2).is(":checked");
    var is_check3 = $(check3).is(":checked");
    var is_check4 = $(check4).is(":checked");
    var valor = -1;

    if (is_check0 == true) {
      valor = 0;
    } else if (is_check1 == true) {
      valor = 1;
    } else if (is_check2 == true) {
      valor = 2;
    } else if (is_check3 == true) {
      valor = 3;
    } else if (is_check4 == true) {
      valor = 4;
    }

    return valor;
  }

  function marcarPreguntas(pregunta, valor) {
    var check_cero = '#check_pregunta_' + pregunta + '_cero';
    var check_uno = '#check_pregunta_' + pregunta + '_uno';
    var check_dos = '#check_pregunta_' + pregunta + '_dos';
    var check_tres = '#check_pregunta_' + pregunta + '_tres';
    var check_cuatro = '#check_pregunta_' + pregunta + '_cuatro';

    switch (valor) {
      case 0:
        $(check_cero).prop('checked', true);
        break;
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
      color = verde;
    } else if (nivel == 'Bajo') {
      color = amarillo;
    } else if (nivel == 'Moderado') {
      color = naranja;
    } else if (nivel == 'Alto') {
      color = rojo;
    }

    return color;
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
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  mst_nivel1.init();
});