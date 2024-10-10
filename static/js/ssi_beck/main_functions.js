var ssi_beck = function() {
  var $ = jQuery.noConflict();
  var accion = '';


  function initEvents() {
    /== evento para mostrar modal de ssi_beck ==/
    $('#btn_add_ssi_beck').on('click', function() {
      var id_atencion = $('#id_atencion').val();
    
      $.ajax({
        url: "/ssi_beck/get_ssi_beck",
        type: "get",
        data: {id_atencion: id_atencion},
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'Ya existe una Escala de Ideación Suicida de Beck (SSI BECK) registrada para esta Atención.', 'error');
          } else {
            $('#modal_ssi_beck').modal('show');
            $('#modal_ssi_beck').find('.modal-title').text('Escala de Ideación Suicida de Beck (SSI BECK)');
            accion = 'agregar';
          }
        },
        error: function(response) {}
      });
    });

    /== evento para cerrar modal de ssi_beck ==/
    $('#btn_cerrar_modal_ssi_beck').on('click', function() {
      limpiarCampos();
      $('#modal_ssi_beck').modal('hide');
      location.reload();
    });
    
    /== evento para cerrar modal de ssi_beck ==/
    $('#btn_cancelar_modal_ssi_beck').on('click', function() {
      limpiarCampos();
      $('#modal_ssi_beck').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un ssi_beck ==/
    $('#btn_agregar_ssi_beck').on('click', function() {
      var id_atencion = $('#id_atencion').val();
      var valor_pregunta1 = devolverValorPregunta('#beck_check_pregunta_uno_cero', '#beck_check_pregunta_uno_uno', '#beck_check_pregunta_uno_dos', '');
      var valor_pregunta2 = devolverValorPregunta('#beck_check_pregunta_dos_cero', '#beck_check_pregunta_dos_uno', '#beck_check_pregunta_dos_dos', '');
      var valor_pregunta3 = devolverValorPregunta('#beck_check_pregunta_tres_cero', '#beck_check_pregunta_tres_uno', '#beck_check_pregunta_tres_dos', '');
      var valor_pregunta4 = devolverValorPregunta('#beck_check_pregunta_cuatro_cero', '#beck_check_pregunta_cuatro_uno', '#beck_check_pregunta_cuatro_dos', '');
      var valor_pregunta5 = devolverValorPregunta('#beck_check_pregunta_cinco_cero', '#beck_check_pregunta_cinco_uno', '#beck_check_pregunta_cinco_dos', '');
      var valor_pregunta6 = devolverValorPregunta('#beck_check_pregunta_seis_cero', '#beck_check_pregunta_seis_uno', '#beck_check_pregunta_seis_dos', '');
      var valor_pregunta7 = devolverValorPregunta('#beck_check_pregunta_siete_cero', '#beck_check_pregunta_siete_uno', '#beck_check_pregunta_siete_dos', '');
      var valor_pregunta8 = devolverValorPregunta('#beck_check_pregunta_ocho_cero', '#beck_check_pregunta_ocho_uno', '#beck_check_pregunta_ocho_dos', '');
      var valor_pregunta9 = devolverValorPregunta('#beck_check_pregunta_nueve_cero', '#beck_check_pregunta_nueve_uno', '#beck_check_pregunta_nueve_dos', '');
      var valor_pregunta10 = devolverValorPregunta('#beck_check_pregunta_diez_cero', '#beck_check_pregunta_diez_uno', '#beck_check_pregunta_diez_dos', '');
      var valor_pregunta11 = devolverValorPregunta('#beck_check_pregunta_once_cero', '#beck_check_pregunta_once_uno', '#beck_check_pregunta_once_dos', '');
      var valor_pregunta12 = devolverValorPregunta('#beck_check_pregunta_doce_cero', '#beck_check_pregunta_doce_uno', '#beck_check_pregunta_doce_dos', '');
      var valor_pregunta13 = devolverValorPregunta('#beck_check_pregunta_trece_cero', '#beck_check_pregunta_trece_uno', '#beck_check_pregunta_trece_dos', '#beck_check_pregunta_trece_tres');
      var valor_pregunta14 = devolverValorPregunta('#beck_check_pregunta_catorce_cero', '#beck_check_pregunta_catorce_uno', '#beck_check_pregunta_catorce_dos', '');
      var valor_pregunta15 = devolverValorPregunta('#beck_check_pregunta_quince_cero', '#beck_check_pregunta_quince_uno', '#beck_check_pregunta_quince_dos', '');
      var valor_pregunta16 = devolverValorPregunta('#beck_check_pregunta_dieciseis_cero', '#beck_check_pregunta_dieciseis_uno', '#beck_check_pregunta_dieciseis_dos', '');
      var valor_pregunta17 = devolverValorPregunta('#beck_check_pregunta_diecisiete_cero', '#beck_check_pregunta_diecisiete_uno', '#beck_check_pregunta_diecisiete_dos', '');
      var valor_pregunta18 = devolverValorPregunta('#beck_check_pregunta_dieciocho_cero', '#beck_check_pregunta_dieciocho_uno', '#beck_check_pregunta_dieciocho_dos', '');
      var valor_pregunta19 = devolverValorPregunta('#beck_check_pregunta_diecinueve_cero', '#beck_check_pregunta_diecinueve_uno', '#beck_check_pregunta_diecinueve_dos', '');
      var total = valor_pregunta1 + valor_pregunta2 + valor_pregunta3 + valor_pregunta4 + valor_pregunta5 + valor_pregunta6 + valor_pregunta7 + valor_pregunta8 + valor_pregunta9 + valor_pregunta10 + valor_pregunta11 + valor_pregunta12 + valor_pregunta13 + valor_pregunta14 + valor_pregunta15 + valor_pregunta16 + valor_pregunta17 + valor_pregunta18 + valor_pregunta19;
      var nivel = devolverNivel(total);
      var color = devolverColor(nivel);
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (valor_pregunta1 == -1 || valor_pregunta2 == -1 || valor_pregunta3 == -1 || valor_pregunta4 == -1 || valor_pregunta5 == -1 || valor_pregunta6 == -1 || valor_pregunta7 == -1 || valor_pregunta8 == -1 || valor_pregunta9 == -1 || valor_pregunta10 == -1 || valor_pregunta11 == -1 || valor_pregunta12 == -1 || valor_pregunta13 == -1 || valor_pregunta14 == -1 || valor_pregunta15 == -1 || valor_pregunta16 == -1 || valor_pregunta17 == -1 || valor_pregunta18 == -1 || valor_pregunta19 == -1) {
        console.info(valor_pregunta1 == -1, valor_pregunta2 == -1, valor_pregunta3 == -1, valor_pregunta4 == -1, valor_pregunta5 == -1, valor_pregunta6 == -1, valor_pregunta7 == -1, valor_pregunta8 == -1, valor_pregunta9 == -1, valor_pregunta10 == -1, valor_pregunta11 == -1, valor_pregunta12 == -1, valor_pregunta13 == -1, valor_pregunta14 == -1, valor_pregunta15 == -1, valor_pregunta16 == -1, valor_pregunta17 == -1, valor_pregunta18 == -1, valor_pregunta19 == -1);
        btn.html(textOriginalBtn);
        notificacion('Error', 'Existen preguntas que no ha respondido', 'error');
      } else {
        $.ajax({
          url: "/ssi_beck/agregar_editar_ssi_beck",
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
            pregunta19: valor_pregunta19
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              btn.html(textOriginalBtn);
              limpiarCampos();
              $('#modal_ssi_beck').modal('hide');

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

    /== evento para mostrar modal editar ssi_beck ==/
    $('#btn_edit_ssi_beck').on('click', function() {
      var id_atencion = $('#id_atencion').val();

      $.ajax({
        url: "/ssi_beck/get_ssi_beck",
        data: {
          id_atencion: id_atencion
        },
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'no_existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'No se puede editar una Escala de Ideación Suicida de Beck (SSI BECK) para esta Atención debido a que todavía no tiene ninguna registrada.', 'error');
          } else {
            $('#modal_ssi_beck').modal('show');
            $('#modal_ssi_beck').find('.modal-title').text('Escala de Ideación Suicida de Beck (SSI BECK)');
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
          }
        },
        error: function(response) {}
      });
    });
  }

  function limpiarCampos() {
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta1]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta2]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta3]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta4]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta5]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta6]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta7]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta8]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta9]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta10]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta11]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta12]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta13]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta14]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta15]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta16]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta17]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta18]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeckPregunta19]").prop('checked', false);
    accion = '';
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

  /== funcion para devolver el valor de la pregunta seleccionada ==/
  function devolverValorPregunta(check0, check1, check2, check3) {
    var is_check0 = check0 != '' ? $(check0).is(":checked") : false;
    var is_check1 = check1 != '' ? $(check1).is(":checked") : false;
    var is_check2 = check2 != '' ? $(check2).is(":checked") : false;
    var is_check3 = check3 != '' ? $(check3).is(":checked") : false;
    var valor = -1;

    if (is_check0 == true) {
      valor = 0;
    } else if (is_check1 == true) {
      valor = 1;
    } else if (is_check2 == true) {
      valor = 2;
    } else if (is_check3 == true) {
      valor = 3;
    }

    return valor;
  }

  function marcarPreguntas(pregunta, valor) {
    var check_cero = '#beck_check_pregunta_' + pregunta + '_cero';
    var check_uno = '#beck_check_pregunta_' + pregunta + '_uno';
    var check_dos = '#beck_check_pregunta_' + pregunta + '_dos';
    var check_tres = '#beck_check_pregunta_' + pregunta + '_tres';

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

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  ssi_beck.init();
});