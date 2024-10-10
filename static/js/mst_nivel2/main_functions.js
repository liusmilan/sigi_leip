var mst_nivel2 = function() {
  var $ = jQuery.noConflict();
  var accion = '';


  function initEvents() {
    /== evento para mostrar modal de mst_nivel2 ==/
    $('#btn_add_mst_n2').on('click', function() {
      var id_atencion = $('#id_atencion').val();

      $.ajax({
        url: "/mst_nivel2/get_mst_nivel2",
        type: "get",
        data: {id_atencion: id_atencion},
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'Ya existe una Evaluación psicológica (MST Nivel 2) registrada para esta Atención.', 'error');
          } else {
            $('#modal_mst_nivel2').modal('show');
            $('#modal_mst_nivel2').find('.modal-title').text('Evaluación Psicológica (MST Nivel 2)');
            limpiarTodosCampos();
            accion = 'agregar';
          }
        },
        error: function(response) {}
      });
    });

    /== evento para cerrar modal de mst_nivel2 ==/
    $('#btn_cerrar_modal_mst_nivel2').on('click', function() {
      limpiarTodosCampos();
      $('#modal_mst_nivel2').modal('hide');
      location.reload();
    });
    
    /== evento para cerrar modal de mst_nivel2 ==/
    $('#btn_cancelar_modal_mst_nivel2').on('click', function() {
      limpiarTodosCampos();
      $('#modal_mst_nivel2').modal('hide');
      location.reload();
    });

    /== evento del check no aplica de depresion ==/
    $('#mst2_depresion_no_aplica').on('click', function() {
      if ($(this).is(':checked')) {
        $('#btn_valorar_depresion').prop('disabled', true);
        $('#valoracion_depresion').text('0%');
        $('#valoracion_depresion').addClass('badge bg-badge-gray');
        limpiarBoxDepresion();
        desabilitarAllChecksDepresion(true);
      } else {
        $('#btn_valorar_depresion').prop('disabled', false);
        desabilitarAllChecksDepresion(false);
      }
    });

    /== evento del check no aplica de ira ==/
    $('#mst2_ira_no_aplica').on('click', function() {
      if ($(this).is(':checked')) {
        $('#btn_valorar_ira').prop('disabled', true);
        $('#valoracion_ira').text('0%');
        $('#valoracion_ira').addClass('badge bg-badge-gray');
        limpiarBoxIra();
        desabilitarAllChecksIra(true);
      } else {
        $('#btn_valorar_ira').prop('disabled', false);
        desabilitarAllChecksIra(false);
      }
    });

    /== evento del check no aplica de mania ==/
    $('#mst2_mania_no_aplica').on('click', function() {
      if ($(this).is(':checked')) {
        $('#btn_valorar_mania').prop('disabled', true);
        $('#valoracion_mania').text('0%');
        $('#valoracion_mania').addClass('badge bg-badge-gray');
        limpiarBoxMania();
        desabilitarAllChecksMania(true);
      } else {
        $('#btn_valorar_mania').prop('disabled', false);
        desabilitarAllChecksMania(false);
      }
    });

    /== evento del check no aplica de ansiedad ==/
    $('#mst2_ansiedad_no_aplica').on('click', function() {
      if ($(this).is(':checked')) {
        $('#btn_valorar_ansiedad').prop('disabled', true);
        $('#valoracion_ansiedad').text('0%');
        $('#valoracion_ansiedad').addClass('badge bg-badge-gray');
        limpiarBoxAndisedad();
        desabilitarAllChecksAnsiedad(true);
      } else {
        $('#btn_valorar_ansiedad').prop('disabled', false);
        desabilitarAllChecksAnsiedad(false);
      }
    });

    /== evento del check no aplica de somatico ==/
    $('#mst2_somatico_no_aplica').on('click', function() {
      if ($(this).is(':checked')) {
        $('#btn_valorar_somatico').prop('disabled', true);
        $('#valoracion_somatico').text('0%');
        $('#valoracion_somatico').addClass('badge bg-badge-gray');
        limpiarBoxSomatico();
        desabilitarAllChecksSomaticos(true);
      } else {
        $('#btn_valorar_somatico').prop('disabled', false);
        desabilitarAllChecksSomaticos(false);
      }
    });

    /== evento del check no aplica de sueño ==/
    $('#mst2_suenno_no_aplica').on('click', function() {
      if ($(this).is(':checked')) {
        $('#btn_valorar_suenno').prop('disabled', true);
        $('#valoracion_suenno').text('0%');
        $('#valoracion_suenno').addClass('badge bg-badge-gray');
        limpiarBoxSuenno();
        desabilitarAllChecksSuenno(true);
      } else {
        $('#btn_valorar_suenno').prop('disabled', false);
        desabilitarAllChecksSuenno(false);
      }
    });

    /== evento del check no aplica de repetitivo ==/
    $('#mst2_repetitivo_no_aplica').on('click', function() {
      if ($(this).is(':checked')) {
        $('#btn_valorar_repetitivo').prop('disabled', true);
        $('#valoracion_repetitivo').text('0%');
        $('#valoracion_repetitivo').addClass('badge bg-badge-gray');
        limpiarBoxRepetitivo();
        desabilitarAllChecksRepetitivo(true);
      } else {
        $('#btn_valorar_repetitivo').prop('disabled', false);
        desabilitarAllChecksRepetitivo(false);
      }
    });

    /== evento del check no aplica de sustancias ==/
    $('#mst2_sustancias_no_aplica').on('click', function() {
      if ($(this).is(':checked')) {
        $('#btn_valorar_sustancias').prop('disabled', true);
        $('#valoracion_sustancias').text('0%');
        $('#valoracion_sustancias').addClass('badge bg-badge-gray');
        limpiarBoxSustancia();
        desabilitarAllChecksSustancias(true);
      } else {
        $('#btn_valorar_sustancias').prop('disabled', false);
        desabilitarAllChecksSustancias(false);
      }
    });

    /== calcular valor depresion ==/
    $('#btn_valorar_depresion').on('click', function() {
      var evaluacion = calcularValorDepresion();
      var valores_depresion = devolverValoresDepresion(evaluacion.evaluacion);

      if (evaluacion.evaluacion == -1) {
        notificacion('Error', 'Existen preguntas que no ha respondido', 'error');
      } else {
        var clase_span = $('#valoracion_depresion').attr('class');
        $('#valoracion_depresion').removeClass(clase_span);
  
        $('#valoracion_depresion').text(evaluacion.evaluacion + '% - ' + valores_depresion.nivel);
        $('#valoracion_depresion').addClass('badge bg-badge-' + valores_depresion.color);
      }
    });

    /== calcular valor ira ==/
    $('#btn_valorar_ira').on('click', function() {
      var evaluacion = calcularValorIra();
      var valores_ira = devolverValoresIra(evaluacion.evaluacion);

      if (evaluacion.evaluacion == -1) {
        notificacion('Error', 'Existen preguntas que no ha respondido', 'error');
      } else {
        var clase_span = $('#valoracion_ira').attr('class');
        $('#valoracion_ira').removeClass(clase_span);
  
        $('#valoracion_ira').text(evaluacion.evaluacion + '% - ' + valores_ira.nivel);
        $('#valoracion_ira').addClass('badge bg-badge-' + valores_ira.color);
      }
    });

    /== calcular valor mania ==/
    $('#btn_valorar_mania').on('click', function() {
      var evaluacion = calcularValorMania();
      var valores_mania = devolverValoresMania(evaluacion.evaluacion);

      if (evaluacion.evaluacion == -1) {
        notificacion('Error', 'Existen preguntas que no ha respondido', 'error');
      } else {
        var clase_span = $('#valoracion_mania').attr('class');
        $('#valoracion_mania').removeClass(clase_span);
  
        $('#valoracion_mania').text(evaluacion.evaluacion + '% - ' + valores_mania.nivel);
        $('#valoracion_mania').addClass('badge bg-badge-' + valores_mania.color);
      }
    });

    /== calcular valor ansiedad ==/
    $('#btn_valorar_ansiedad').on('click', function() {
      var evaluacion = calcularValorAnsiedad();
      var valores_ansiedad = devolverValoresAnsiedad(evaluacion.evaluacion);

      if (evaluacion.evaluacion == -1) {
        notificacion('Error', 'Existen preguntas que no ha respondido', 'error');
      } else {
        var clase_span = $('#valoracion_ansiedad').attr('class');
        $('#valoracion_ansiedad').removeClass(clase_span);
  
        $('#valoracion_ansiedad').text(evaluacion.evaluacion + '% - ' + valores_ansiedad.nivel);
        $('#valoracion_ansiedad').addClass('badge bg-badge-' + valores_ansiedad.color);
      }
    });

    /== calcular valor somatico ==/
    $('#btn_valorar_somatico').on('click', function() {
      var evaluacion = calcularValorSomatico();
      var valores_somaticos = devolverValoresSomaticos(evaluacion.evaluacion);

      if (evaluacion.evaluacion == -1) {
        notificacion('Error', 'Existen preguntas que no ha respondido', 'error');
      } else {
        var clase_span = $('#valoracion_somatico').attr('class');
        $('#valoracion_somatico').removeClass(clase_span);
  
        $('#valoracion_somatico').text(evaluacion.evaluacion + '% - ' + valores_somaticos.nivel);
        $('#valoracion_somatico').addClass('badge bg-badge-' + valores_somaticos.color);
      }
    });

    /== calcular valor sueño ==/
    $('#btn_valorar_suenno').on('click', function() {
      var evaluacion = calcularValorSuenno();
      var valores_suenno = devolverValoresSuenno(evaluacion.evaluacion);

      if (evaluacion.evaluacion == -1) {
        notificacion('Error', 'Existen preguntas que no ha respondido', 'error');
      } else {
        var clase_span = $('#valoracion_suenno').attr('class');
        $('#valoracion_suenno').removeClass(clase_span);
  
        $('#valoracion_suenno').text(evaluacion.evaluacion + '% - ' + valores_suenno.nivel);
        $('#valoracion_suenno').addClass('badge bg-badge-' + valores_suenno.color);
      }
    });

    /== calcular valor repetitivo ==/
    $('#btn_valorar_repetitivo').on('click', function() {
      var evaluacion = calcularValorRepetitivo();
      var valores_repetitivo = devolverValoresRepetitivos(evaluacion.evaluacion)

      if (evaluacion.evaluacion == -1) {
        notificacion('Error', 'Existen preguntas que no ha respondido', 'error');
      } else {
        var clase_span = $('#valoracion_repetitivo').attr('class');
        $('#valoracion_repetitivo').removeClass(clase_span);
  
        $('#valoracion_repetitivo').text(evaluacion.evaluacion + '% - ' + valores_repetitivo.nivel);
        $('#valoracion_repetitivo').addClass('badge bg-badge-' + valores_repetitivo.color);
      }
    });

    /== calcular valor sustancias ==/
    $('#btn_valorar_sustancias').on('click', function() {
      var evaluacion = calcularValorSustancias();
      var valores_sustancias = devolverValoresSustancias(evaluacion.evaluacion);

      if (evaluacion.evaluacion == -1) {
        notificacion('Error', 'Existen preguntas que no ha respondido', 'error');
      } else {
        var clase_span = $('#valoracion_sustancias').attr('class');
        $('#valoracion_sustancias').removeClass(clase_span);
  
        $('#valoracion_sustancias').text(evaluacion.evaluacion + '% - ' + valores_sustancias.nivel);
        $('#valoracion_sustancias').addClass('badge bg-badge-' + valores_sustancias.color);
      }
    });

    /== evento para agregar o editar un mst_nivel2 ==/
    $('#btn_agregar_mst_nivel2').on('click', function() {
      var id_atencion = $('#id_atencion').val();
      var depresion = calcularValorDepresion();
      var valores_depresion = devolverValoresDepresion(depresion.evaluacion);
      var ira = calcularValorIra();
      var valores_ira = devolverValoresIra(ira.evaluacion);
      var mania = calcularValorMania();
      var valores_mania = devolverValoresMania(mania.evaluacion);
      var ansiedad = calcularValorAnsiedad();
      var valores_ansiedad = devolverValoresAnsiedad(ansiedad.evaluacion);
      var somaticos = calcularValorSomatico();
      var valores_somaticos = devolverValoresSomaticos(somaticos.evaluacion);
      var suenno = calcularValorSuenno();
      var valores_suenno = devolverValoresSuenno(suenno.evaluacion);
      var repetitivo = calcularValorRepetitivo();
      var valores_repetitivos = devolverValoresRepetitivos(repetitivo.evaluacion);
      var sustancia = calcularValorSustancias();
      var valores_sustancias = devolverValoresSustancias(sustancia.evaluacion);
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (depresion.evaluacion == -1 || ira.evaluacion == -1 || mania.evaluacion == -1 || ansiedad.evaluacion == -1 || somaticos.evaluacion == -1 || suenno.evaluacion == -1 || repetitivo.evaluacion == -1 || sustancia.evaluacion == -1) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Existen preguntas que no ha respondido', 'error');
      } else {
        var params = {
          accion: accion,
          id_atencion: id_atencion,
          depresion_pregunta1: depresion.valor_pregunta1,
          depresion_pregunta2: depresion.valor_pregunta2,
          depresion_pregunta3: depresion.valor_pregunta3,
          depresion_pregunta4: depresion.valor_pregunta4,
          depresion_pregunta5: depresion.valor_pregunta5,
          depresion_pregunta6: depresion.valor_pregunta6,
          depresion_pregunta7: depresion.valor_pregunta7,
          depresion_pregunta8: depresion.valor_pregunta8,
          evaluacion_depresion: depresion.evaluacion,
          color_evaluacion_depresion: valores_depresion.color,
          nivel_evaluacion_depresion: valores_depresion.nivel,
          ira_pregunta1: ira.valor_pregunta1,
          ira_pregunta2: ira.valor_pregunta2,
          ira_pregunta3: ira.valor_pregunta3,
          ira_pregunta4: ira.valor_pregunta4,
          ira_pregunta5: ira.valor_pregunta5,
          evaluacion_ira: ira.evaluacion,
          color_evaluacion_ira: valores_ira.color,
          nivel_evaluacion_ira: valores_ira.nivel,
          mania_pregunta1: mania.valor_pregunta1,
          mania_pregunta2: mania.valor_pregunta2,
          mania_pregunta3: mania.valor_pregunta3,
          mania_pregunta4: mania.valor_pregunta4,
          mania_pregunta5: mania.valor_pregunta5,
          evaluacion_mania: mania.evaluacion,
          color_evaluacion_mania: valores_mania.color,
          nivel_evaluacion_mania: valores_mania.nivel,
          ansiedad_pregunta1: ansiedad.valor_pregunta1,
          ansiedad_pregunta2: ansiedad.valor_pregunta2,
          ansiedad_pregunta3: ansiedad.valor_pregunta3,
          ansiedad_pregunta4: ansiedad.valor_pregunta4,
          ansiedad_pregunta5: ansiedad.valor_pregunta5,
          ansiedad_pregunta6: ansiedad.valor_pregunta6,
          ansiedad_pregunta7: ansiedad.valor_pregunta7,
          evaluacion_ansiedad: ansiedad.evaluacion,
          color_evaluacion_ansiedad: valores_ansiedad.color,
          nivel_evaluacion_ansiedad: valores_ansiedad.nivel,
          somaticos_pregunta1: somaticos.valor_pregunta1,
          somaticos_pregunta2: somaticos.valor_pregunta2,
          somaticos_pregunta3: somaticos.valor_pregunta3,
          somaticos_pregunta4: somaticos.valor_pregunta4,
          somaticos_pregunta5: somaticos.valor_pregunta5,
          somaticos_pregunta6: somaticos.valor_pregunta6,
          somaticos_pregunta7: somaticos.valor_pregunta7,
          somaticos_pregunta8: somaticos.valor_pregunta8,
          somaticos_pregunta9: somaticos.valor_pregunta9,
          somaticos_pregunta10: somaticos.valor_pregunta10,
          somaticos_pregunta11: somaticos.valor_pregunta11,
          somaticos_pregunta12: somaticos.valor_pregunta12,
          somaticos_pregunta13: somaticos.valor_pregunta13,
          somaticos_pregunta14: somaticos.valor_pregunta14,
          somaticos_pregunta15: somaticos.valor_pregunta15,
          evaluacion_somatico: somaticos.evaluacion,
          color_evaluacion_somatico: valores_somaticos.color,
          nivel_evaluacion_somatico: valores_somaticos.nivel,
          suenno_pregunta1: suenno.valor_pregunta1,
          suenno_pregunta2: suenno.valor_pregunta2,
          suenno_pregunta3: suenno.valor_pregunta3,
          suenno_pregunta4: suenno.valor_pregunta4,
          suenno_pregunta5: suenno.valor_pregunta5,
          suenno_pregunta6: suenno.valor_pregunta6,
          suenno_pregunta7: suenno.valor_pregunta7,
          suenno_pregunta8: suenno.valor_pregunta8,
          evaluacion_suenno: suenno.evaluacion,
          color_evaluacion_suenno: valores_suenno.color,
          nivel_evaluacion_suenno: valores_suenno.nivel,
          repetitivo_pregunta1: repetitivo.valor_pregunta1,
          repetitivo_pregunta2: repetitivo.valor_pregunta2,
          repetitivo_pregunta3: repetitivo.valor_pregunta3,
          repetitivo_pregunta4: repetitivo.valor_pregunta4,
          repetitivo_pregunta5: repetitivo.valor_pregunta5,
          evaluacion_repetitivo: repetitivo.evaluacion,
          color_evaluacion_repetitivo: valores_repetitivos.color,
          nivel_evaluacion_repetitivo: valores_repetitivos.nivel,
          sustancia_pregunta1: sustancia.valor_pregunta1,
          sustancia_pregunta2: sustancia.valor_pregunta2,
          sustancia_pregunta3: sustancia.valor_pregunta3,
          sustancia_pregunta4: sustancia.valor_pregunta4,
          sustancia_pregunta5: sustancia.valor_pregunta5,
          sustancia_pregunta6: sustancia.valor_pregunta6,
          sustancia_pregunta7: sustancia.valor_pregunta7,
          sustancia_pregunta8: sustancia.valor_pregunta8,
          sustancia_pregunta9: sustancia.valor_pregunta9,
          sustancia_pregunta10: sustancia.valor_pregunta10,
          evaluacion_sustancia: sustancia.evaluacion,
          color_evaluacion_sustancia: valores_sustancias.color,
          nivel_evaluacion_sustancia: valores_sustancias.nivel
        };

        $.ajax({
          url: "/mst_nivel2/agregar_editar_mst_nivel2",
          data: {
            params: JSON.stringify(params)
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              btn.html(textOriginalBtn);
              limpiarTodosCampos();
              $('#modal_mst_nivel2').modal('hide');
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
    $('#btn_edit_mst_n2').on('click', function() {
      var id_atencion = $('#id_atencion').val();
    
      $.ajax({
        url: "/mst_nivel2/get_mst_nivel2",
        data: {
          id_atencion: id_atencion
        },
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'no_existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'No se puede editar una Evaluación psicológica (MST Nivel 2) para esta Atención debido a que todavía no tiene ninguna registrada.', 'error');
          } else {
            $('#modal_mst_nivel2').modal('show');
            $('#modal_mst_nivel2').find('.modal-title').text('Evaluación Psicológica (MST Nivel 2)');
            accion = 'editar';

            if (response.evaluacion_depresion == 0) {
              marcarPreguntas('depresion', 'uno', response.depresion_pregunta1, response.evaluacion_depresion, response.color_evaluacion_depresion, response.nivel_evaluacion_depresion, false);
            } else {
              marcarPreguntas('depresion', 'uno', response.depresion_pregunta1, response.evaluacion_depresion, response.color_evaluacion_depresion, response.nivel_evaluacion_depresion, false);
              marcarPreguntas('depresion', 'dos', response.depresion_pregunta2, response.evaluacion_depresion, response.color_evaluacion_depresion, response.nivel_evaluacion_depresion, false);
              marcarPreguntas('depresion', 'tres', response.depresion_pregunta3, response.evaluacion_depresion, response.color_evaluacion_depresion, response.nivel_evaluacion_depresion, false);
              marcarPreguntas('depresion', 'cuatro', response.depresion_pregunta4, response.evaluacion_depresion, response.color_evaluacion_depresion, response.nivel_evaluacion_depresion, false);
              marcarPreguntas('depresion', 'cinco', response.depresion_pregunta5, response.evaluacion_depresion, response.color_evaluacion_depresion, response.nivel_evaluacion_depresion, false);
              marcarPreguntas('depresion', 'seis', response.depresion_pregunta6, response.evaluacion_depresion, response.color_evaluacion_depresion, response.nivel_evaluacion_depresion, false);
              marcarPreguntas('depresion', 'siete', response.depresion_pregunta7, response.evaluacion_depresion, response.color_evaluacion_depresion, response.nivel_evaluacion_depresion, false);
              marcarPreguntas('depresion', 'ocho', response.depresion_pregunta8, response.evaluacion_depresion, response.color_evaluacion_depresion, response.nivel_evaluacion_depresion, false);
            }

            if (response.evaluacion_ira == 0) {
              marcarPreguntas('ira', 'uno', response.ira_pregunta1, response.evaluacion_ira, response.color_evaluacion_ira, response.nivel_evaluacion_ira, false);
            } else {
              marcarPreguntas('ira', 'uno', response.ira_pregunta1, response.evaluacion_ira, response.color_evaluacion_ira, response.nivel_evaluacion_ira, false);
              marcarPreguntas('ira', 'dos', response.ira_pregunta2, response.evaluacion_ira, response.color_evaluacion_ira, response.nivel_evaluacion_ira, false);
              marcarPreguntas('ira', 'tres', response.ira_pregunta3, response.evaluacion_ira, response.color_evaluacion_ira, response.nivel_evaluacion_ira, false);
              marcarPreguntas('ira', 'cuatro', response.ira_pregunta4, response.evaluacion_ira, response.color_evaluacion_ira, response.nivel_evaluacion_ira, false);
              marcarPreguntas('ira', 'cinco', response.ira_pregunta5, response.evaluacion_ira, response.color_evaluacion_ira, response.nivel_evaluacion_ira, false);
            }

            if (response.evaluacion_mania == 0) {
              marcarPreguntas('mania', 'uno', response.mania_pregunta1, response.evaluacion_mania, response.color_evaluacion_mania, response.nivel_evaluacion_mania, false);
            } else {
              marcarPreguntas('mania', 'uno', response.mania_pregunta1, response.evaluacion_mania, response.color_evaluacion_mania, response.nivel_evaluacion_mania, false);
              marcarPreguntas('mania', 'dos', response.mania_pregunta2, response.evaluacion_mania, response.color_evaluacion_mania, response.nivel_evaluacion_mania, false);
              marcarPreguntas('mania', 'tres', response.mania_pregunta3, response.evaluacion_mania, response.color_evaluacion_mania, response.nivel_evaluacion_mania, false);
              marcarPreguntas('mania', 'cuatro', response.mania_pregunta4, response.evaluacion_mania, response.color_evaluacion_mania, response.nivel_evaluacion_mania, false);
              marcarPreguntas('mania', 'cinco', response.mania_pregunta5, response.evaluacion_mania, response.color_evaluacion_mania, response.nivel_evaluacion_mania, false);
            }

            if (response.evaluacion_ansiedad == 0) {
              marcarPreguntas('ansiedad', 'uno', response.ansiedad_pregunta1, response.evaluacion_ansiedad, response.color_evaluacion_ansiedad, response.nivel_evaluacion_ansiedad, false);
            } else {
              marcarPreguntas('ansiedad', 'uno', response.ansiedad_pregunta1, response.evaluacion_ansiedad, response.color_evaluacion_ansiedad, response.nivel_evaluacion_ansiedad, false);
              marcarPreguntas('ansiedad', 'dos', response.ansiedad_pregunta2, response.evaluacion_ansiedad, response.color_evaluacion_ansiedad, response.nivel_evaluacion_ansiedad, false);
              marcarPreguntas('ansiedad', 'tres', response.ansiedad_pregunta3, response.evaluacion_ansiedad, response.color_evaluacion_ansiedad, response.nivel_evaluacion_ansiedad, false);
              marcarPreguntas('ansiedad', 'cuatro', response.ansiedad_pregunta4, response.evaluacion_ansiedad, response.color_evaluacion_ansiedad, response.nivel_evaluacion_ansiedad, false);
              marcarPreguntas('ansiedad', 'cinco', response.ansiedad_pregunta5, response.evaluacion_ansiedad, response.color_evaluacion_ansiedad, response.nivel_evaluacion_ansiedad, false);
              marcarPreguntas('ansiedad', 'seis', response.ansiedad_pregunta6, response.evaluacion_ansiedad, response.color_evaluacion_ansiedad, response.nivel_evaluacion_ansiedad, false);
              marcarPreguntas('ansiedad', 'siete', response.ansiedad_pregunta7, response.evaluacion_ansiedad, response.color_evaluacion_ansiedad, response.nivel_evaluacion_ansiedad, false);
            }

            if (response.evaluacion_suenno == 0) {
              marcarPreguntas('suenno', 'uno', response.suenno_pregunta1, response.evaluacion_suenno, response.color_evaluacion_suenno, response.nivel_evaluacion_suenno, false);
            } else {
              marcarPreguntas('suenno', 'uno', response.suenno_pregunta1, response.evaluacion_suenno, response.color_evaluacion_suenno, response.nivel_evaluacion_suenno, false);
              marcarPreguntas('suenno', 'dos', response.suenno_pregunta2, response.evaluacion_suenno, response.color_evaluacion_suenno, response.nivel_evaluacion_suenno, false);
              marcarPreguntas('suenno', 'tres', response.suenno_pregunta3, response.evaluacion_suenno, response.color_evaluacion_suenno, response.nivel_evaluacion_suenno, false);
              marcarPreguntas('suenno', 'cuatro', response.suenno_pregunta4, response.evaluacion_suenno, response.color_evaluacion_suenno, response.nivel_evaluacion_suenno, false);
              marcarPreguntas('suenno', 'cinco', response.suenno_pregunta5, response.evaluacion_suenno, response.color_evaluacion_suenno, response.nivel_evaluacion_suenno, false);
              marcarPreguntas('suenno', 'seis', response.suenno_pregunta6, response.evaluacion_suenno, response.color_evaluacion_suenno, response.nivel_evaluacion_suenno, false);
              marcarPreguntas('suenno', 'siete', response.suenno_pregunta7, response.evaluacion_suenno, response.color_evaluacion_suenno, response.nivel_evaluacion_suenno, false);
              marcarPreguntas('suenno', 'ocho', response.suenno_pregunta8, response.evaluacion_suenno, response.color_evaluacion_suenno, response.nivel_evaluacion_suenno, false);
            }

            if (response.evaluacion_somaticos == 0 && response.somaticos_pregunta1 == -1) {
              marcarPreguntasSomaticos('uno', response.somaticos_pregunta1, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
            } else {
              marcarPreguntasSomaticos('uno', response.somaticos_pregunta1, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('dos', response.somaticos_pregunta2, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('tres', response.somaticos_pregunta3, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('cuatro', response.somaticos_pregunta4, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('cinco', response.somaticos_pregunta5, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('seis', response.somaticos_pregunta6, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('siete', response.somaticos_pregunta7, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('ocho', response.somaticos_pregunta8, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('nueve', response.somaticos_pregunta9, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('diez', response.somaticos_pregunta10, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('once', response.somaticos_pregunta11, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('doce', response.somaticos_pregunta12, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('trece', response.somaticos_pregunta13, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('catorce', response.somaticos_pregunta14, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
              marcarPreguntasSomaticos('quince', response.somaticos_pregunta15, response.evaluacion_somaticos, response.color_evaluacion_somaticos, response.nivel_evaluacion_somaticos);
            }

            if (response.evaluacion_repetitivo == 0 && response.repetitivo_pregunta1 == -1) {
              marcarPreguntas('repetitivo', 'uno', response.repetitivo_pregunta1, response.evaluacion_repetitivo, response.color_evaluacion_repetitivo, response.nivel_evaluacion_repetitivo, true);
            } else {
              marcarPreguntas('repetitivo', 'uno', response.repetitivo_pregunta1, response.evaluacion_repetitivo, response.color_evaluacion_repetitivo, response.nivel_evaluacion_repetitivo, true);
              marcarPreguntas('repetitivo', 'dos', response.repetitivo_pregunta2, response.evaluacion_repetitivo, response.color_evaluacion_repetitivo, response.nivel_evaluacion_repetitivo, true);
              marcarPreguntas('repetitivo', 'tres', response.repetitivo_pregunta3, response.evaluacion_repetitivo, response.color_evaluacion_repetitivo, response.nivel_evaluacion_repetitivo, true);
              marcarPreguntas('repetitivo', 'cuatro', response.repetitivo_pregunta4, response.evaluacion_repetitivo, response.color_evaluacion_repetitivo, response.nivel_evaluacion_repetitivo, true);
              marcarPreguntas('repetitivo', 'cinco', response.repetitivo_pregunta5, response.evaluacion_repetitivo, response.color_evaluacion_repetitivo, response.nivel_evaluacion_repetitivo, true);
            }

            if (response.evaluacion_sustancia == 0 && response.sustancia_pregunta1 == -1) {
              marcarPreguntas('sustancias', 'uno', response.sustancia_pregunta1, response.evaluacion_sustancia, response.color_evaluacion_sustancia, response.nivel_evaluacion_sustancia, true);
            } else {
              marcarPreguntas('sustancias', 'uno', response.sustancia_pregunta1, response.evaluacion_sustancia, response.color_evaluacion_sustancia, response.nivel_evaluacion_sustancia, true);
              marcarPreguntas('sustancias', 'dos', response.sustancia_pregunta2, response.evaluacion_sustancia, response.color_evaluacion_sustancia, response.nivel_evaluacion_sustancia, true);
              marcarPreguntas('sustancias', 'tres', response.sustancia_pregunta3, response.evaluacion_sustancia, response.color_evaluacion_sustancia, response.nivel_evaluacion_sustancia, true);
              marcarPreguntas('sustancias', 'cuatro', response.sustancia_pregunta4, response.evaluacion_sustancia, response.color_evaluacion_sustancia, response.nivel_evaluacion_sustancia, true);
              marcarPreguntas('sustancias', 'cinco', response.sustancia_pregunta5, response.evaluacion_sustancia, response.color_evaluacion_sustancia, response.nivel_evaluacion_sustancia, true);
              marcarPreguntas('sustancias', 'seis', response.sustancia_pregunta6, response.evaluacion_sustancia, response.color_evaluacion_sustancia, response.nivel_evaluacion_sustancia, true);
              marcarPreguntas('sustancias', 'siete', response.sustancia_pregunta7, response.evaluacion_sustancia, response.color_evaluacion_sustancia, response.nivel_evaluacion_sustancia, true);
              marcarPreguntas('sustancias', 'ocho', response.sustancia_pregunta8, response.evaluacion_sustancia, response.color_evaluacion_sustancia, response.nivel_evaluacion_sustancia, true);
              marcarPreguntas('sustancias', 'nueve', response.sustancia_pregunta9, response.evaluacion_sustancia, response.color_evaluacion_sustancia, response.nivel_evaluacion_sustancia, true);
              marcarPreguntas('sustancias', 'diez', response.sustancia_pregunta10, response.evaluacion_sustancia, response.color_evaluacion_sustancia, response.nivel_evaluacion_sustancia, true);
            }            
          }
        },
        error: function(response) {}
      });
    });
  }

  function marcarPreguntas(sintoma, pregunta, valor, evaluacion, color, nivel, cero) {
    var id_check = '#mst2_' + sintoma + '_no_aplica';
    var id_valoraciom = '#valoracion_' + sintoma;

    if (evaluacion == 0 && valor == -1) {
      $(id_check).click();
    } else {
      var clase_span = $(id_valoraciom).attr('class');
      $(id_valoraciom).removeClass(clase_span);
  
      $(id_valoraciom).text(evaluacion + '% - ' + nivel);
      $(id_valoraciom).addClass('badge bg-badge-' + color);

      var check_uno = '#check_' + sintoma + '_pregunta_' + pregunta + '_uno';
      var check_dos = '#check_' + sintoma + '_pregunta_' + pregunta + '_dos';
      var check_tres = '#check_' + sintoma + '_pregunta_' + pregunta + '_tres';
      var check_cuatro = '#check_' + sintoma + '_pregunta_' + pregunta + '_cuatro';
      var check_cinco = '#check_' + sintoma + '_pregunta_' + pregunta + '_cinco';

      if (cero == true) {
        switch (valor) {
          case 0:
            $(check_uno).prop('checked', true);
            break;
          case 1:
            $(check_dos).prop('checked', true);
            break;
          case 2:
            $(check_tres).prop('checked', true);
            break;
          case 3:
            $(check_cuatro).prop('checked', true);
            break;
          case 4:
            $(check_cinco).prop('checked', true);
            break;
        }
      } else {
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
    } 
  }

  function marcarPreguntasSomaticos(pregunta, valor, evaluacion, color, nivel) {
    if (evaluacion == 0 && valor == -1) {
      $('#mst2_somatico_no_aplica').click();
    } else {
      var clase_span = $('#valoracion_somatico').attr('class');
      $('#valoracion_somatico').removeClass(clase_span);
  
      $('#valoracion_somatico').text(evaluacion + '% - ' + nivel);
      $('#valoracion_somatico').addClass('badge bg-badge-' + color);

      var check_uno = '#check_somatico_pregunta_' + pregunta + '_uno';
      var check_dos = '#check_somatico_pregunta_' + pregunta + '_dos';
      var check_tres = '#check_somatico_pregunta_' + pregunta + '_tres';

      switch (valor) {
        case 0:
          $(check_uno).prop('checked', true);
          break;
        case 1:
          $(check_dos).prop('checked', true);
          break;
        case 2:
          $(check_tres).prop('checked', true);
          break;
      }
    } 
  }

  /== funcion para calcular el valor de la depresion ==/
  function calcularValorDepresion() {
    var evaluacion = 0;
    var valor_pregunta1 = -1;
    var valor_pregunta2 = -1;
    var valor_pregunta3 = -1;
    var valor_pregunta4 = -1;
    var valor_pregunta5 = -1;
    var valor_pregunta6 = -1;
    var valor_pregunta7 = -1;
    var valor_pregunta8 = -1;

    if ($('#mst2_depresion_no_aplica').is(":checked") == false) {
      valor_pregunta1 = devolverValorPregunta('#check_depresion_pregunta_uno_uno', '#check_depresion_pregunta_uno_dos', '#check_depresion_pregunta_uno_tres', '#check_depresion_pregunta_uno_cuatro', '#check_depresion_pregunta_uno_cinco', false);
      valor_pregunta2 = devolverValorPregunta('#check_depresion_pregunta_dos_uno', '#check_depresion_pregunta_dos_dos', '#check_depresion_pregunta_dos_tres', '#check_depresion_pregunta_dos_cuatro', '#check_depresion_pregunta_dos_cinco', false);
      valor_pregunta3 = devolverValorPregunta('#check_depresion_pregunta_tres_uno', '#check_depresion_pregunta_tres_dos', '#check_depresion_pregunta_tres_tres', '#check_depresion_pregunta_tres_cuatro', '#check_depresion_pregunta_tres_cinco', false);
      valor_pregunta4 = devolverValorPregunta('#check_depresion_pregunta_cuatro_uno', '#check_depresion_pregunta_cuatro_dos', '#check_depresion_pregunta_cuatro_tres', '#check_depresion_pregunta_cuatro_cuatro', '#check_depresion_pregunta_cuatro_cinco', false);
      valor_pregunta5 = devolverValorPregunta('#check_depresion_pregunta_cinco_uno', '#check_depresion_pregunta_cinco_dos', '#check_depresion_pregunta_cinco_tres', '#check_depresion_pregunta_cinco_cuatro', '#check_depresion_pregunta_cinco_cinco', false);
      valor_pregunta6 = devolverValorPregunta('#check_depresion_pregunta_seis_uno', '#check_depresion_pregunta_seis_dos', '#check_depresion_pregunta_seis_tres', '#check_depresion_pregunta_seis_cuatro', '#check_depresion_pregunta_seis_cinco', false);
      valor_pregunta7 = devolverValorPregunta('#check_depresion_pregunta_siete_uno', '#check_depresion_pregunta_siete_dos', '#check_depresion_pregunta_siete_tres', '#check_depresion_pregunta_siete_cuatro', '#check_depresion_pregunta_siete_cinco', false);
      valor_pregunta8 = devolverValorPregunta('#check_depresion_pregunta_ocho_uno', '#check_depresion_pregunta_ocho_dos', '#check_depresion_pregunta_ocho_tres', '#check_depresion_pregunta_ocho_cuatro', '#check_depresion_pregunta_ocho_cinco', false);
      
      if (valor_pregunta1 == -1 || valor_pregunta2 == -1 || valor_pregunta3 == -1 || valor_pregunta4 == -1 || valor_pregunta5 == -1 || valor_pregunta6 == -1 || valor_pregunta7 == -1 || valor_pregunta8 == -1) {
        evaluacion = -1;
      } else {
        var evaluacion_total = valor_pregunta1 + valor_pregunta2 + valor_pregunta3 + valor_pregunta4 + valor_pregunta5 + valor_pregunta6 + valor_pregunta7 + valor_pregunta8;
        evaluacion = (evaluacion_total/40)*100;
      }
    }

    var resultado = {
      valor_pregunta1: valor_pregunta1,
      valor_pregunta2: valor_pregunta2,
      valor_pregunta3: valor_pregunta3,
      valor_pregunta4: valor_pregunta4,
      valor_pregunta5: valor_pregunta5,
      valor_pregunta6: valor_pregunta6,
      valor_pregunta7: valor_pregunta7,
      valor_pregunta8: valor_pregunta8,
      evaluacion: evaluacion
    };

    return resultado;
  }

  /== funcion para calcular el valor de la ira ==/
  function calcularValorIra() {
    var evaluacion = 0;
    var valor_pregunta1 = -1;
    var valor_pregunta2 = -1;
    var valor_pregunta3 = -1;
    var valor_pregunta4 = -1;
    var valor_pregunta5 = -1;

    if ($('#mst2_ira_no_aplica').is(":checked") == false) {
      valor_pregunta1 = devolverValorPregunta('#check_ira_pregunta_uno_uno', '#check_ira_pregunta_uno_dos', '#check_ira_pregunta_uno_tres', '#check_ira_pregunta_uno_cuatro', '#check_ira_pregunta_uno_cinco', false);
      valor_pregunta2 = devolverValorPregunta('#check_ira_pregunta_dos_uno', '#check_ira_pregunta_dos_dos', '#check_ira_pregunta_dos_tres', '#check_ira_pregunta_dos_cuatro', '#check_ira_pregunta_dos_cinco', false);
      valor_pregunta3 = devolverValorPregunta('#check_ira_pregunta_tres_uno', '#check_ira_pregunta_tres_dos', '#check_ira_pregunta_tres_tres', '#check_ira_pregunta_tres_cuatro', '#check_ira_pregunta_tres_cinco', false);
      valor_pregunta4 = devolverValorPregunta('#check_ira_pregunta_cuatro_uno', '#check_ira_pregunta_cuatro_dos', '#check_ira_pregunta_cuatro_tres', '#check_ira_pregunta_cuatro_cuatro', '#check_ira_pregunta_cuatro_cinco', false);
      valor_pregunta5 = devolverValorPregunta('#check_ira_pregunta_cinco_uno', '#check_ira_pregunta_cinco_dos', '#check_ira_pregunta_cinco_tres', '#check_ira_pregunta_cinco_cuatro', '#check_ira_pregunta_cinco_cinco', false);
    
      if (valor_pregunta1 == -1 || valor_pregunta2 == -1 || valor_pregunta3 == -1 || valor_pregunta4 == -1 || valor_pregunta5 == -1) {
        evaluacion = -1;
      } else {
        var evaluacion_total = valor_pregunta1 + valor_pregunta2 + valor_pregunta3 + valor_pregunta4 + valor_pregunta5;
        evaluacion = (evaluacion_total/25)*100;
      }
    }  

    var resultado = {
      valor_pregunta1: valor_pregunta1,
      valor_pregunta2: valor_pregunta2,
      valor_pregunta3: valor_pregunta3,
      valor_pregunta4: valor_pregunta4,
      valor_pregunta5: valor_pregunta5,
      evaluacion: evaluacion
    };

    return resultado;
  }

  /== funcion para calcular el valor de la mania ==/
  function calcularValorMania() {
    var evaluacion = 0;
    var valor_pregunta1 = -1;
    var valor_pregunta2 = -1;
    var valor_pregunta3 = -1;
    var valor_pregunta4 = -1;
    var valor_pregunta5 = -1;
    
    if ($('#mst2_mania_no_aplica').is(":checked") == false) {
      valor_pregunta1 = devolverValorPregunta('#check_mania_pregunta_uno_uno', '#check_mania_pregunta_uno_dos', '#check_mania_pregunta_uno_tres', '#check_mania_pregunta_uno_cuatro', '#check_mania_pregunta_uno_cinco', false);
      valor_pregunta2 = devolverValorPregunta('#check_mania_pregunta_dos_uno', '#check_mania_pregunta_dos_dos', '#check_mania_pregunta_dos_tres', '#check_mania_pregunta_dos_cuatro', '#check_mania_pregunta_dos_cinco', false);
      valor_pregunta3 = devolverValorPregunta('#check_mania_pregunta_tres_uno', '#check_mania_pregunta_tres_dos', '#check_mania_pregunta_tres_tres', '#check_mania_pregunta_tres_cuatro', '#check_mania_pregunta_tres_cinco', false);
      valor_pregunta4 = devolverValorPregunta('#check_mania_pregunta_cuatro_uno', '#check_mania_pregunta_cuatro_dos', '#check_mania_pregunta_cuatro_tres', '#check_mania_pregunta_cuatro_cuatro', '#check_mania_pregunta_cuatro_cinco', false);
      valor_pregunta5 = devolverValorPregunta('#check_mania_pregunta_cinco_uno', '#check_mania_pregunta_cinco_dos', '#check_mania_pregunta_cinco_tres', '#check_mania_pregunta_cinco_cuatro', '#check_mania_pregunta_cinco_cinco', false);

      if (valor_pregunta1 == -1 || valor_pregunta2 == -1 || valor_pregunta3 == -1 || valor_pregunta4 == -1 || valor_pregunta5 == -1) {
        evaluacion = -1;
      } else {
        evaluacion = valor_pregunta1 + valor_pregunta2 + valor_pregunta3 + valor_pregunta4 + valor_pregunta5;
      }
    }

    var resultado = {
      valor_pregunta1: valor_pregunta1,
      valor_pregunta2: valor_pregunta2,
      valor_pregunta3: valor_pregunta3,
      valor_pregunta4: valor_pregunta4,
      valor_pregunta5: valor_pregunta5,
      evaluacion: evaluacion
    };

    return resultado;
  }

  /== funcion para calcular el valor de la ansiedad ==/
  function calcularValorAnsiedad() {
    var evaluacion = 0;
    var valor_pregunta1 = -1;
    var valor_pregunta2 = -1;
    var valor_pregunta3 = -1;
    var valor_pregunta4 = -1;
    var valor_pregunta5 = -1;
    var valor_pregunta6 = -1;
    var valor_pregunta7 = -1;
    
    if ($('#mst2_ansiedad_no_aplica').is(":checked") == false) {
      valor_pregunta1 = devolverValorPregunta('#check_ansiedad_pregunta_uno_uno', '#check_ansiedad_pregunta_uno_dos', '#check_ansiedad_pregunta_uno_tres', '#check_ansiedad_pregunta_uno_cuatro', '#check_ansiedad_pregunta_uno_cinco', false);
      valor_pregunta2 = devolverValorPregunta('#check_ansiedad_pregunta_dos_uno', '#check_ansiedad_pregunta_dos_dos', '#check_ansiedad_pregunta_dos_tres', '#check_ansiedad_pregunta_dos_cuatro', '#check_ansiedad_pregunta_dos_cinco', false);
      valor_pregunta3 = devolverValorPregunta('#check_ansiedad_pregunta_tres_uno', '#check_ansiedad_pregunta_tres_dos', '#check_ansiedad_pregunta_tres_tres', '#check_ansiedad_pregunta_tres_cuatro', '#check_ansiedad_pregunta_tres_cinco', false);
      valor_pregunta4 = devolverValorPregunta('#check_ansiedad_pregunta_cuatro_uno', '#check_ansiedad_pregunta_cuatro_dos', '#check_ansiedad_pregunta_cuatro_tres', '#check_ansiedad_pregunta_cuatro_cuatro', '#check_ansiedad_pregunta_cuatro_cinco', false);
      valor_pregunta5 = devolverValorPregunta('#check_ansiedad_pregunta_cinco_uno', '#check_ansiedad_pregunta_cinco_dos', '#check_ansiedad_pregunta_cinco_tres', '#check_ansiedad_pregunta_cinco_cuatro', '#check_ansiedad_pregunta_cinco_cinco', false);
      valor_pregunta6 = devolverValorPregunta('#check_ansiedad_pregunta_seis_uno', '#check_ansiedad_pregunta_seis_dos', '#check_ansiedad_pregunta_seis_tres', '#check_ansiedad_pregunta_seis_cuatro', '#check_ansiedad_pregunta_seis_cinco', false);
      valor_pregunta7 = devolverValorPregunta('#check_ansiedad_pregunta_siete_uno', '#check_ansiedad_pregunta_siete_dos', '#check_ansiedad_pregunta_siete_tres', '#check_ansiedad_pregunta_siete_cuatro', '#check_ansiedad_pregunta_siete_cinco', false);
      
      if (valor_pregunta1 == -1 || valor_pregunta2 == -1 || valor_pregunta3 == -1 || valor_pregunta4 == -1 || valor_pregunta5 == -1 || valor_pregunta6 == -1 || valor_pregunta7 == -1) {
        evaluacion = -1;
      } else {
        var evaluacion_total = valor_pregunta1 + valor_pregunta2 + valor_pregunta3 + valor_pregunta4 + valor_pregunta5 + valor_pregunta6 + valor_pregunta7;
        evaluacion = (evaluacion_total/35)*100;
      }
    }

    var resultado = {
      valor_pregunta1: valor_pregunta1,
      valor_pregunta2: valor_pregunta2,
      valor_pregunta3: valor_pregunta3,
      valor_pregunta4: valor_pregunta4,
      valor_pregunta5: valor_pregunta5,
      valor_pregunta6: valor_pregunta6,
      valor_pregunta7: valor_pregunta7,
      evaluacion: evaluacion
    };

    return resultado;
  }

  /== funcion para calcular el valor de la somatico ==/
  function calcularValorSomatico() {
    var evaluacion = 0;
    var valor_pregunta1 = -1;
    var valor_pregunta2 = -1;
    var valor_pregunta3 = -1;
    var valor_pregunta4 = -1;
    var valor_pregunta5 = -1;
    var valor_pregunta6 = -1;
    var valor_pregunta7 = -1;
    var valor_pregunta8 = -1;
    var valor_pregunta9 = -1;
    var valor_pregunta10 = -1;
    var valor_pregunta11 = -1;
    var valor_pregunta12 = -1;
    var valor_pregunta13 = -1;
    var valor_pregunta14 = -1;
    var valor_pregunta15 = -1;

    if ($('#mst2_somatico_no_aplica').is(":checked") == false) {
      valor_pregunta1 = devolverValorPregunta('#check_somatico_pregunta_uno_uno', '#check_somatico_pregunta_uno_dos', '#check_somatico_pregunta_uno_tres', null, null, true);
      valor_pregunta2 = devolverValorPregunta('#check_somatico_pregunta_dos_uno', '#check_somatico_pregunta_dos_dos', '#check_somatico_pregunta_dos_tres', null, null, true);
      valor_pregunta3 = devolverValorPregunta('#check_somatico_pregunta_tres_uno', '#check_somatico_pregunta_tres_dos', '#check_somatico_pregunta_tres_tres', null, null, true);
      valor_pregunta4 = devolverValorPregunta('#check_somatico_pregunta_cuatro_uno', '#check_somatico_pregunta_cuatro_dos', '#check_somatico_pregunta_cuatro_tres', null, null, true);
      valor_pregunta5 = devolverValorPregunta('#check_somatico_pregunta_cinco_uno', '#check_somatico_pregunta_cinco_dos', '#check_somatico_pregunta_cinco_tres', null, null, true);
      valor_pregunta6 = devolverValorPregunta('#check_somatico_pregunta_seis_uno', '#check_somatico_pregunta_seis_dos', '#check_somatico_pregunta_seis_tres', null, null, true);
      valor_pregunta7 = devolverValorPregunta('#check_somatico_pregunta_siete_uno', '#check_somatico_pregunta_siete_dos', '#check_somatico_pregunta_siete_tres', null, null, true);
      valor_pregunta8 = devolverValorPregunta('#check_somatico_pregunta_ocho_uno', '#check_somatico_pregunta_ocho_dos', '#check_somatico_pregunta_ocho_tres', null, null, true);
      valor_pregunta9 = devolverValorPregunta('#check_somatico_pregunta_nueve_uno', '#check_somatico_pregunta_nueve_dos', '#check_somatico_pregunta_nueve_tres', null, null, true);
      valor_pregunta10 = devolverValorPregunta('#check_somatico_pregunta_diez_uno', '#check_somatico_pregunta_diez_dos', '#check_somatico_pregunta_diez_tres', null, null, true);
      valor_pregunta11 = devolverValorPregunta('#check_somatico_pregunta_once_uno', '#check_somatico_pregunta_once_dos', '#check_somatico_pregunta_once_tres', null, null, true);
      valor_pregunta12 = devolverValorPregunta('#check_somatico_pregunta_doce_uno', '#check_somatico_pregunta_doce_dos', '#check_somatico_pregunta_doce_tres', null, null, true);
      valor_pregunta13 = devolverValorPregunta('#check_somatico_pregunta_trece_uno', '#check_somatico_pregunta_trece_dos', '#check_somatico_pregunta_trece_tres', null, null, true);
      valor_pregunta14 = devolverValorPregunta('#check_somatico_pregunta_catorce_uno', '#check_somatico_pregunta_catorce_dos', '#check_somatico_pregunta_catorce_tres', null, null, true);
      valor_pregunta15 = devolverValorPregunta('#check_somatico_pregunta_quince_uno', '#check_somatico_pregunta_quince_dos', '#check_somatico_pregunta_quince_tres', null, null, true);
      
      if (valor_pregunta1 == -1 || valor_pregunta2 == -1 || valor_pregunta3 == -1 || valor_pregunta4 == -1 || valor_pregunta5 == -1 || valor_pregunta6 == -1 || valor_pregunta7 == -1 || valor_pregunta8 == -1 || valor_pregunta9 == -1 || valor_pregunta10 == -1 || valor_pregunta11 == -1 || valor_pregunta12 == -1 || valor_pregunta13 == -1 || valor_pregunta14 == -1 || valor_pregunta15 == -1) {
        evaluacion = -1;
      } else {
        evaluacion = valor_pregunta1 + valor_pregunta2 + valor_pregunta3 + valor_pregunta4 + valor_pregunta5 + valor_pregunta6 + valor_pregunta7 + valor_pregunta8 + valor_pregunta9 + valor_pregunta10 + valor_pregunta11 + valor_pregunta12 + valor_pregunta13 + valor_pregunta14 + valor_pregunta15;
      }
    }

    var resultado = {
      valor_pregunta1: valor_pregunta1,
      valor_pregunta2: valor_pregunta2,
      valor_pregunta3: valor_pregunta3,
      valor_pregunta4: valor_pregunta4,
      valor_pregunta5: valor_pregunta5,
      valor_pregunta6: valor_pregunta6,
      valor_pregunta7: valor_pregunta7,
      valor_pregunta8: valor_pregunta8,
      valor_pregunta9: valor_pregunta9,
      valor_pregunta10: valor_pregunta10,
      valor_pregunta11: valor_pregunta11,
      valor_pregunta12: valor_pregunta12,
      valor_pregunta13: valor_pregunta13,
      valor_pregunta14: valor_pregunta14,
      valor_pregunta15: valor_pregunta15,
      evaluacion: evaluacion
    };

    return resultado;
  }

  /== funcion para calcular el valor de la suenno ==/
  function calcularValorSuenno() {
    var evaluacion = 0;
    var valor_pregunta1 = -1;
    var valor_pregunta2 = -1;
    var valor_pregunta3 = -1;
    var valor_pregunta4 = -1;
    var valor_pregunta5 = -1;
    var valor_pregunta6 = -1;
    var valor_pregunta7 = -1;
    var valor_pregunta8 = -1;
    
    if ($('#mst2_suenno_no_aplica').is(":checked") == false) {
      valor_pregunta1 = devolverValorPregunta('#check_suenno_pregunta_uno_uno', '#check_suenno_pregunta_uno_dos', '#check_suenno_pregunta_uno_tres', '#check_suenno_pregunta_uno_cuatro', '#check_suenno_pregunta_uno_cinco', false);
      valor_pregunta2 = devolverValorPregunta('#check_suenno_pregunta_dos_uno', '#check_suenno_pregunta_dos_dos', '#check_suenno_pregunta_dos_tres', '#check_suenno_pregunta_dos_cuatro', '#check_suenno_pregunta_dos_cinco', false);
      valor_pregunta3 = devolverValorPregunta('#check_suenno_pregunta_tres_uno', '#check_suenno_pregunta_tres_dos', '#check_suenno_pregunta_tres_tres', '#check_suenno_pregunta_tres_cuatro', '#check_suenno_pregunta_tres_cinco', false);
      valor_pregunta4 = devolverValorPregunta('#check_suenno_pregunta_cuatro_uno', '#check_suenno_pregunta_cuatro_dos', '#check_suenno_pregunta_cuatro_tres', '#check_suenno_pregunta_cuatro_cuatro', '#check_suenno_pregunta_cuatro_cinco', false);
      valor_pregunta5 = devolverValorPregunta('#check_suenno_pregunta_cinco_uno', '#check_suenno_pregunta_cinco_dos', '#check_suenno_pregunta_cinco_tres', '#check_suenno_pregunta_cinco_cuatro', '#check_suenno_pregunta_cinco_cinco', false);
      valor_pregunta6 = devolverValorPregunta('#check_suenno_pregunta_seis_uno', '#check_suenno_pregunta_seis_dos', '#check_suenno_pregunta_seis_tres', '#check_suenno_pregunta_seis_cuatro', '#check_suenno_pregunta_seis_cinco', false);
      valor_pregunta7 = devolverValorPregunta('#check_suenno_pregunta_siete_uno', '#check_suenno_pregunta_siete_dos', '#check_suenno_pregunta_siete_tres', '#check_suenno_pregunta_siete_cuatro', '#check_suenno_pregunta_siete_cinco', false);
      valor_pregunta8 = devolverValorPregunta('#check_suenno_pregunta_ocho_uno', '#check_suenno_pregunta_ocho_dos', '#check_suenno_pregunta_ocho_tres', '#check_suenno_pregunta_ocho_cuatro', '#check_suenno_pregunta_ocho_cinco', false);
      
      if (valor_pregunta1 == -1 || valor_pregunta2 == -1 || valor_pregunta3 == -1 || valor_pregunta4 == -1 || valor_pregunta5 == -1 || valor_pregunta6 == -1 || valor_pregunta7 == -1 || valor_pregunta8 == -1) {
        evaluacion = -1;
      } else {
        var evaluacion_total = valor_pregunta1 + valor_pregunta2 + valor_pregunta3 + valor_pregunta4 + valor_pregunta5 + valor_pregunta6 + valor_pregunta7 + valor_pregunta8;
        evaluacion = (evaluacion_total/40)*100;
      }
    }

    var resultado = {
      valor_pregunta1: valor_pregunta1,
      valor_pregunta2: valor_pregunta2,
      valor_pregunta3: valor_pregunta3,
      valor_pregunta4: valor_pregunta4,
      valor_pregunta5: valor_pregunta5,
      valor_pregunta6: valor_pregunta6,
      valor_pregunta7: valor_pregunta7,
      valor_pregunta8: valor_pregunta8,
      evaluacion: evaluacion
    };

    return resultado;
  }

  /== funcion para calcular el valor de la repetitivo ==/
  function calcularValorRepetitivo() {
    var evaluacion = 0;
    var valor_pregunta1 = -1;
    var valor_pregunta2 = -1;
    var valor_pregunta3 = -1;
    var valor_pregunta4 = -1;
    var valor_pregunta5 = -1;
    
    if ($('#mst2_repetitivo_no_aplica').is(":checked") == false) {
      valor_pregunta1 = devolverValorPregunta('#check_repetitivo_pregunta_uno_uno', '#check_repetitivo_pregunta_uno_dos', '#check_repetitivo_pregunta_uno_tres', '#check_repetitivo_pregunta_uno_cuatro', '#check_repetitivo_pregunta_uno_cinco', true);
      valor_pregunta2 = devolverValorPregunta('#check_repetitivo_pregunta_dos_uno', '#check_repetitivo_pregunta_dos_dos', '#check_repetitivo_pregunta_dos_tres', '#check_repetitivo_pregunta_dos_cuatro', '#check_repetitivo_pregunta_dos_cinco', true);
      valor_pregunta3 = devolverValorPregunta('#check_repetitivo_pregunta_tres_uno', '#check_repetitivo_pregunta_tres_dos', '#check_repetitivo_pregunta_tres_tres', '#check_repetitivo_pregunta_tres_cuatro', '#check_repetitivo_pregunta_tres_cinco', true);
      valor_pregunta4 = devolverValorPregunta('#check_repetitivo_pregunta_cuatro_uno', '#check_repetitivo_pregunta_cuatro_dos', '#check_repetitivo_pregunta_cuatro_tres', '#check_repetitivo_pregunta_cuatro_cuatro', '#check_repetitivo_pregunta_cuatro_cinco', true);
      valor_pregunta5 = devolverValorPregunta('#check_repetitivo_pregunta_cinco_uno', '#check_repetitivo_pregunta_cinco_dos', '#check_srepetitivo_pregunta_cinco_tres', '#check_repetitivo_pregunta_cinco_cuatro', '#check_repetitivo_pregunta_cinco_cinco', true);
      
      if (valor_pregunta1 == -1 || valor_pregunta2 == -1 || valor_pregunta3 == -1 || valor_pregunta4 == -1 || valor_pregunta5 == -1) {
        evaluacion = -1;
      } else {
        var evaluacion_total = valor_pregunta1 + valor_pregunta2 + valor_pregunta3 + valor_pregunta4 + valor_pregunta5;
        evaluacion = (evaluacion_total/20)*100;
      }
    }

    var resultado = {
      valor_pregunta1: valor_pregunta1,
      valor_pregunta2: valor_pregunta2,
      valor_pregunta3: valor_pregunta3,
      valor_pregunta4: valor_pregunta4,
      valor_pregunta5: valor_pregunta5,
      evaluacion: evaluacion
    };

    return resultado;
  }

  /== funcion para calcular el valor de la sustancias ==/
  function calcularValorSustancias() {
    var evaluacion = 0;
    var valor_pregunta1 = -1;
    var valor_pregunta2 = -1;
    var valor_pregunta3 = -1;
    var valor_pregunta4 = -1;
    var valor_pregunta5 = -1;
    var valor_pregunta6 = -1;
    var valor_pregunta7 = -1;
    var valor_pregunta8 = -1;
    var valor_pregunta9 = -1;
    var valor_pregunta10 = -1;
    
    if ($('#mst2_sustancias_no_aplica').is(":checked") == false) {
      valor_pregunta1 = devolverValorPregunta('#check_sustancias_pregunta_uno_uno', '#check_sustancias_pregunta_uno_dos', '#check_sustancias_pregunta_uno_tres', '#check_sustancias_pregunta_uno_cuatro', '#check_sustancias_pregunta_uno_cinco', true);
      valor_pregunta2 = devolverValorPregunta('#check_sustancias_pregunta_dos_uno', '#check_sustancias_pregunta_dos_dos', '#check_sustancias_pregunta_dos_tres', '#check_sustancias_pregunta_dos_cuatro', '#check_sustancias_pregunta_dos_cinco', true);
      valor_pregunta3 = devolverValorPregunta('#check_sustancias_pregunta_tres_uno', '#check_sustancias_pregunta_tres_dos', '#check_sustancias_pregunta_tres_tres', '#check_sustancias_pregunta_tres_cuatro', '#check_sustancias_pregunta_tres_cinco', true);
      valor_pregunta4 = devolverValorPregunta('#check_sustancias_pregunta_cuatro_uno', '#check_sustancias_pregunta_cuatro_dos', '#check_sustancias_pregunta_cuatro_tres', '#check_sustancias_pregunta_cuatro_cuatro', '#check_sustancias_pregunta_cuatro_cinco', true);
      valor_pregunta5 = devolverValorPregunta('#check_sustancias_pregunta_cinco_uno', '#check_sustancias_pregunta_cinco_dos', '#check_sustancias_pregunta_cinco_tres', '#check_sustancias_pregunta_cinco_cuatro', '#check_sustancias_pregunta_cinco_cinco', true);
      valor_pregunta6 = devolverValorPregunta('#check_sustancias_pregunta_seis_uno', '#check_sustancias_pregunta_seis_dos', '#check_sustancias_pregunta_seis_tres', '#check_sustancias_pregunta_seis_cuatro', '#check_sustancias_pregunta_seis_cinco', true);
      valor_pregunta7 = devolverValorPregunta('#check_sustancias_pregunta_siete_uno', '#check_sustancias_pregunta_siete_dos', '#check_sustancias_pregunta_siete_tres', '#check_sustancias_pregunta_siete_cuatro', '#check_sustancias_pregunta_siete_cinco', true);
      valor_pregunta8 = devolverValorPregunta('#check_sustancias_pregunta_ocho_uno', '#check_sustancias_pregunta_ocho_dos', '#check_sustancias_pregunta_ocho_tres', '#check_sustancias_pregunta_ocho_cuatro', '#check_sustancias_pregunta_ocho_cinco', true);
      valor_pregunta9 = devolverValorPregunta('#check_sustancias_pregunta_nueve_uno', '#check_sustancias_pregunta_nueve_dos', '#check_sustancias_pregunta_nueve_tres', '#check_sustancias_pregunta_nueve_cuatro', '#check_sustancias_pregunta_nueve_cinco', true);
      valor_pregunta10 = devolverValorPregunta('#check_sustancias_pregunta_diez_uno', '#check_sustancias_pregunta_diez_dos', '#check_sustancias_pregunta_diez_tres', '#check_sustancias_pregunta_diez_cuatro', '#check_sustancias_pregunta_diez_cinco', true);
      
      if (valor_pregunta1 == -1 || valor_pregunta2 == -1 || valor_pregunta3 == -1 || valor_pregunta4 == -1 || valor_pregunta5 == -1 || valor_pregunta6 == -1 || valor_pregunta7 == -1 || valor_pregunta8 == -1 || valor_pregunta9 == -1 || valor_pregunta10 == -1) {
        evaluacion = -1;
      } else {
        evaluacion = valor_pregunta1 + valor_pregunta2 + valor_pregunta3 + valor_pregunta4 + valor_pregunta5 + valor_pregunta6 + valor_pregunta7 + valor_pregunta8 + valor_pregunta9 + valor_pregunta10;
      }
    }

    var resultado = {
      valor_pregunta1: valor_pregunta1,
      valor_pregunta2: valor_pregunta2,
      valor_pregunta3: valor_pregunta3,
      valor_pregunta4: valor_pregunta4,
      valor_pregunta5: valor_pregunta5,
      valor_pregunta6: valor_pregunta6,
      valor_pregunta7: valor_pregunta7,
      valor_pregunta8: valor_pregunta8,
      valor_pregunta9: valor_pregunta9,
      valor_pregunta10: valor_pregunta10,
      evaluacion: evaluacion
    };

    return resultado;
  }

  /== funcion para devolver el valor de la pregunta seleccionada ==/
  function devolverValorPregunta(check1, check2, check3, check4, check5, empieza_cero) {
    var is_check1 = check1 ? $(check1).is(":checked") : null;
    var is_check2 = check2 ? $(check2).is(":checked") : null;
    var is_check3 = check3 ? $(check3).is(":checked") : null;
    var is_check4 = check4 ? $(check4).is(":checked") : null;
    var is_check5 = check5 ? $(check5).is(":checked") : null;
    var valor = -1;

    if (is_check1 != null && is_check1 == true) {
      valor = empieza_cero == true ? 0 : 1;
    } else if (is_check2 != null && is_check2 == true) {
      valor = empieza_cero == true ? 1 : 2;
    } else if (is_check3 != null && is_check3 == true) {
      valor = empieza_cero == true ? 2 : 3;
    } else if (is_check4 != null && is_check4 == true) {
      valor = empieza_cero == true ? 3 : 4;
    } else if (is_check5 != null && is_check5 == true) {
      valor = empieza_cero == true ? 4 : 5;
    }

    return valor;
  }

  /== funcion para devolver los valores de nivel y color de depresion ==/
  function devolverValoresDepresion(evaluacion) {
    var nivel = '';
    var color = '';

    if (evaluacion < 55) {
      nivel = 'Ninguno o Poco';
      color = 'green';
    }

    if ((evaluacion >= 55) && (evaluacion <= 59.9)) {
      nivel = 'Leve';
      color = 'yellow';
    }
    
    if ((evaluacion >= 60) && (evaluacion <= 69.9)) {
      nivel = 'Moderado';
      color = 'orange';
    }
    
    if (evaluacion >= 70) {
      nivel = 'Severo';
      color = 'red';
    }

    var params = {
      nivel: nivel,
      color: color
    };

    return params;
  }

  /== funcion para devolver los valores de nivel y color de ira ==/
  function devolverValoresIra(evaluacion) {
    var nivel = '';
    var color = '';

    if (evaluacion < 55) {
      nivel = 'Ninguno o Poco';
      color = 'green';
    }

    if ((evaluacion >= 55) && (evaluacion <= 59.9)) {
      nivel = 'Leve';
      color = 'yellow';
    }
    
    if ((evaluacion >= 60) && (evaluacion <= 69.9)) {
      nivel = 'Moderado';
      color = 'orange';
    }
    
    if (evaluacion >= 70) {
      nivel = 'Severo';
      color = 'red';
    }

    var params = {
      nivel: nivel,
      color: color
    };

    return params;
  }

  /== funcion para devolver los valores de nivel y color de mania ==/
  function devolverValoresMania(evaluacion) {
    var nivel = '';
    var color = '';

    if (evaluacion <= 3) {
      nivel = 'Ninguno o Poco';
      color = 'green';
    }

    if ((evaluacion >= 4) && (evaluacion <= 5)) {
      nivel = 'Menos probabilidad de síntomas significativos de manía';
      color = 'yellow';
    }
    
    if (evaluacion == 6) {
      nivel = 'Necesidad de tratamiento y/o estudios de diagnóstico adicionales';
      color = 'orange';
    }
    
    if (evaluacion > 6) {
      nivel = 'Condición maníaca o hipomaníaca';
      color = 'red';
    }

    var params = {
      nivel: nivel,
      color: color
    };

    return params;
  }

  function devolverValoresAnsiedad(evaluacion) {
    var nivel = '';
    var color = '';

    if (evaluacion < 55) {
      nivel = 'Ninguno o poco';
      color = 'green';
    }

    if ((evaluacion >= 55) && (evaluacion <= 59.9)) {
      nivel = 'Leve';
      color = 'yellow';
    }
    
    if ((evaluacion >= 60) && (evaluacion <= 69.9)) {
      nivel = 'Moderado';
      color = 'orange';
    }
    
    if (evaluacion >= 70) {
      nivel = 'Severo';
      color = 'red';
    }

    var params = {
      nivel: nivel,
      color: color
    };

    return params;
  }

  function devolverValoresSomaticos(evaluacion) {
    var nivel = '';
    var color = '';

    if ((evaluacion >= 0) && (evaluacion <= 4)) {
      nivel = 'Mínimo';
      color = 'green';
    }

    if ((evaluacion >= 5) && (evaluacion <= 9)) {
      nivel = 'Bajo';
      color = 'yellow';
    }
    
    if ((evaluacion >= 10) && (evaluacion <= 14)) {
      nivel = 'Medio';
      color = 'orange';
    }
    
    if ((evaluacion >= 15) && (evaluacion <= 30)) {
      nivel = 'Alto';
      color = 'red';
    }

    var params = {
      nivel: nivel,
      color: color
    };

    return params;
  }

  function devolverValoresSuenno(evaluacion) {
    var nivel = '';
    var color = '';
    
    if (evaluacion < 55) {
      nivel = 'Ninguno o Poco';
      color = 'green';
    }

    if ((evaluacion >= 55) && (evaluacion <= 59.9)) {
      nivel = 'Leve';
      color = 'yellow';
    }
    
    if ((evaluacion >= 60) && (evaluacion <= 69.9)) {
      nivel = 'Moderado';
      color = 'orange';
    }
    
    if (evaluacion >= 70) {
      nivel = 'Severo';
      color = 'red';
    }

    var params = {
      nivel: nivel,
      color: color
    };

    return params;
  }

  function devolverValoresRepetitivos(evaluacion) {
    var nivel = '';
    var color = '';

    if (evaluacion < 55) {
      nivel = 'Ninguno o Poco';
      color = 'green';
    }

    if ((evaluacion >= 55) && (evaluacion <= 59.9)) {
      nivel = 'Leve';
      color = 'yellow';
    }
    
    if ((evaluacion >= 60) && (evaluacion <= 69.9)) {
      nivel = 'Moderado';
      color = 'orange';
    }
    
    if (evaluacion >= 70) {
      nivel = 'Severo';
      color = 'red';
    }

    var params = {
      nivel: nivel,
      color: color
    };

    return params;
  }

  function devolverValoresSustancias(evaluacion) {
    var nivel = '';
    var color = '';

    if ((evaluacion >= 0) && (evaluacion <= 1)) {
      nivel = 'Ninguno o Poco';
      color = 'green';
    }

    if (evaluacion == 2) {
      nivel = 'Leve';
      color = 'yellow';
    }
    
    if (evaluacion == 3) {
      nivel = 'Moderado';
      color = 'orange';
    }
    
    // pongo esto de esta forma para poder ver los resultados en la vista
    if (evaluacion > 4) {
      nivel = 'Severo';
      color = 'red';
    }

    var params = {
      nivel: nivel,
      color: color
    };

    return params;
  }

  function limpiarBoxDepresion() {
    //limpiar campos depresion
    $("input[type='radio'][name=radioOptionsDepresionPregunta1]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsDepresionPregunta2]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsDepresionPregunta3]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsDepresionPregunta4]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsDepresionPregunta5]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsDepresionPregunta6]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsDepresionPregunta7]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsDepresionPregunta8]").prop('checked', false);
  }

  function limpiarBoxIra() {
    //limpiar campos ira
    $("input[type='radio'][name=radioOptionsIraPregunta1]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsIraPregunta2]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsIraPregunta3]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsIraPregunta4]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsIraPregunta5]").prop('checked', false);
  }

  function limpiarBoxMania() {
    //limpiar campos mania
    $("input[type='radio'][name=radioOptionsManiaPregunta1]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsManiaPregunta2]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsManiaPregunta3]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsManiaPregunta4]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsManiaPregunta5]").prop('checked', false);
  }

  function limpiarBoxAndisedad() {
    //limpiar campos ansiedad
    $("input[type='radio'][name=radioOptionsAnsiedadPregunta1]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsAnsiedadPregunta2]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsAnsiedadPregunta3]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsAnsiedadPregunta4]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsAnsiedadPregunta5]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsAnsiedadPregunta6]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsAnsiedadPregunta7]").prop('checked', false);
  }

  function limpiarBoxSomatico() {
    //limpiar campos somatico
    $("input[type='radio'][name=radioOptionsSomaticoPregunta1]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta2]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta3]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta4]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta5]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta6]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta7]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta8]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta9]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta10]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta11]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta12]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta13]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta14]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSomaticoPregunta15]").prop('checked', false);
  }

  function limpiarBoxSuenno() {
    //limpiar campos sueño
    $("input[type='radio'][name=radioOptionsSuennoPregunta1]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSuennoPregunta2]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSuennoPregunta3]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSuennoPregunta4]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSuennoPregunta5]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSuennoPregunta6]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSuennoPregunta7]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSuennoPregunta8]").prop('checked', false);
  }

  function limpiarBoxRepetitivo() {
    //limpiar campos repetitivo
    $("input[type='radio'][name=radioOptionsRepetitivoPregunta1]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsRepetitivoPregunta2]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsRepetitivoPregunta3]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsRepetitivoPregunta4]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsRepetitivoPregunta5]").prop('checked', false);
  }

  function limpiarBoxSustancia() {
    //limpiar campos sustancias
    $("input[type='radio'][name=radioOptionsSustanciasPregunta1]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSustanciasPregunta2]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSustanciasPregunta3]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSustanciasPregunta4]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSustanciasPregunta5]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSustanciasPregunta6]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSustanciasPregunta7]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSustanciasPregunta8]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSustanciasPregunta9]").prop('checked', false);
    $("input[type='radio'][name=radioOptionsSustanciasPregunta10]").prop('checked', false);
  }

  function limpiarTodosCampos() {
    limpiarBoxDepresion();
    $('#mst2_depresion_no_aplica').prop('checked', false);

    limpiarBoxIra();
    $('#mst2_ira_no_aplica').prop('checked', false);

    limpiarBoxMania();
    $('#mst2_mania_no_aplica').prop('checked', false);

    limpiarBoxAndisedad();
    $('#mst2_ansiedad_no_aplica').prop('checked', false);

    limpiarBoxSomatico();
    $('#mst2_somatico_no_aplica').prop('checked', false);

    limpiarBoxSuenno();
    $('#mst2_suenno_no_aplica').prop('checked', false);

    limpiarBoxRepetitivo();
    $('#mst2_repetitivo_no_aplica').prop('checked', false);

    limpiarBoxSustancia();
    $('#mst2_sustancias_no_aplica').prop('checked', false);
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

  function desabilitarAllChecksDepresion(value) {
    $("input[name='radioOptionsDepresionPregunta1']").prop('disabled', value);
    $("input[name='radioOptionsDepresionPregunta2']").prop('disabled', value);
    $("input[name='radioOptionsDepresionPregunta3']").prop('disabled', value);
    $("input[name='radioOptionsDepresionPregunta4']").prop('disabled', value);
    $("input[name='radioOptionsDepresionPregunta5']").prop('disabled', value);
    $("input[name='radioOptionsDepresionPregunta6']").prop('disabled', value);
    $("input[name='radioOptionsDepresionPregunta7']").prop('disabled', value);
    $("input[name='radioOptionsDepresionPregunta8']").prop('disabled', value);
  }

  function desabilitarAllChecksIra(value) {
    $("input[name='radioOptionsIraPregunta1']").prop('disabled', value);
    $("input[name='radioOptionsIraPregunta2']").prop('disabled', value);
    $("input[name='radioOptionsIraPregunta3']").prop('disabled', value);
    $("input[name='radioOptionsIraPregunta4']").prop('disabled', value);
    $("input[name='radioOptionsIraPregunta5']").prop('disabled', value);
  }

  function desabilitarAllChecksMania(value) {
    $("input[name='radioOptionsManiaPregunta1']").prop('disabled', value);
    $("input[name='radioOptionsManiaPregunta2']").prop('disabled', value);
    $("input[name='radioOptionsManiaPregunta3']").prop('disabled', value);
    $("input[name='radioOptionsManiaPregunta4']").prop('disabled', value);
    $("input[name='radioOptionsManiaPregunta5']").prop('disabled', value);
  }

  function desabilitarAllChecksAnsiedad(value) {
    $("input[name='radioOptionsAnsiedadPregunta1']").prop('disabled', value);
    $("input[name='radioOptionsAnsiedadPregunta2']").prop('disabled', value);
    $("input[name='radioOptionsAnsiedadPregunta3']").prop('disabled', value);
    $("input[name='radioOptionsAnsiedadPregunta4']").prop('disabled', value);
    $("input[name='radioOptionsAnsiedadPregunta5']").prop('disabled', value);
    $("input[name='radioOptionsAnsiedadPregunta6']").prop('disabled', value);
    $("input[name='radioOptionsAnsiedadPregunta7']").prop('disabled', value);
  }

  function desabilitarAllChecksSomaticos(value) {
    $("input[name='radioOptionsSomaticoPregunta1']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta2']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta3']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta4']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta5']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta6']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta7']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta8']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta9']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta10']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta11']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta12']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta13']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta14']").prop('disabled', value);
    $("input[name='radioOptionsSomaticoPregunta15']").prop('disabled', value);
  }

  function desabilitarAllChecksSuenno(value) {
    $("input[name='radioOptionsSuennoPregunta1']").prop('disabled', value);
    $("input[name='radioOptionsSuennoPregunta2']").prop('disabled', value);
    $("input[name='radioOptionsSuennoPregunta3']").prop('disabled', value);
    $("input[name='radioOptionsSuennoPregunta4']").prop('disabled', value);
    $("input[name='radioOptionsSuennoPregunta5']").prop('disabled', value);
    $("input[name='radioOptionsSuennoPregunta6']").prop('disabled', value);
    $("input[name='radioOptionsSuennoPregunta7']").prop('disabled', value);
    $("input[name='radioOptionsSuennoPregunta8']").prop('disabled', value);
  }

  function desabilitarAllChecksRepetitivo(value) {
    $("input[name='radioOptionsRepetitivoPregunta1']").prop('disabled', value);
    $("input[name='radioOptionsRepetitivoPregunta2']").prop('disabled', value);
    $("input[name='radioOptionsRepetitivoPregunta3']").prop('disabled', value);
    $("input[name='radioOptionsRepetitivoPregunta4']").prop('disabled', value);
    $("input[name='radioOptionsRepetitivoPregunta5']").prop('disabled', value);
  }

  function desabilitarAllChecksSustancias(value) {
    $("input[name='radioOptionsSustanciasPregunta1']").prop('disabled', value);
    $("input[name='radioOptionsSustanciasPregunta2']").prop('disabled', value);
    $("input[name='radioOptionsSustanciasPregunta3']").prop('disabled', value);
    $("input[name='radioOptionsSustanciasPregunta4']").prop('disabled', value);
    $("input[name='radioOptionsSustanciasPregunta5']").prop('disabled', value);
    $("input[name='radioOptionsSustanciasPregunta6']").prop('disabled', value);
    $("input[name='radioOptionsSustanciasPregunta7']").prop('disabled', value);
    $("input[name='radioOptionsSustanciasPregunta8']").prop('disabled', value);
    $("input[name='radioOptionsSustanciasPregunta9']").prop('disabled', value);
    $("input[name='radioOptionsSustanciasPregunta10']").prop('disabled', value);
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  mst_nivel2.init();
});