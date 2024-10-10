var motivo_consulta = function() {
  var $ = jQuery.noConflict();
  var accion = '';
  const listaHorasMC = [
    {
      id: 0,
      value: '00:00'
    },
    {
      id: 1,
      value: '01:00'
    },
    {
      id: 2,
      value: '02:00'
    },
    {
      id: 3,
      value: '03:00'
    },
    {
      id: 4,
      value: '04:00'
    },
    {
      id: 5,
      value: '05:00'
    },
    {
      id: 6,
      value: '06:00'
    },
    {
      id: 7,
      value: '07:00'
    },
    {
      id: 8,
      value: '08:00'
    },
    {
      id: 9,
      value: '09:00'
    },
    {
      id: 10,
      value: '10:00'
    },
    {
      id: 11,
      value: '11:00'
    },
    {
      id: 12,
      value: '12:00'
    },
    {
      id: 13,
      value: '13:00'
    },
    {
      id: 14,
      value: '14:00'
    },
    {
      id: 15,
      value: '15:00'
    },
    {
      id: 16,
      value: '16:00'
    },
    {
      id: 17,
      value: '17:00'
    },
    {
      id: 18,
      value: '18:00'
    },
    {
      id: 19,
      value: '19:00'
    },
    {
      id: 20,
      value: '20:00'
    },
    {
      id: 21,
      value: '21:00'
    },
    {
      id: 22,
      value: '22:00'
    },
    {
      id: 23,
      value: '23:00'
    }
  ];

  $('#horas_mc_lunes').select2({
    width: '100%',
    placeholder: 'Seleccione...',
    language: {
      noResults: function() {
        return "No hay resultado";        
      },
      searching: function() {
        return "Buscando..";
      }
    }
  });

  $('#horas_mc_martes').select2({
    width: '100%',
    placeholder: 'Seleccione...',
    language: {
      noResults: function() {
        return "No hay resultado";        
      },
      searching: function() {
        return "Buscando..";
      }
    }
  });

  $('#horas_mc_miercoles').select2({
    width: '100%',
    placeholder: 'Seleccione...',
    language: {
      noResults: function() {
        return "No hay resultado";        
      },
      searching: function() {
        return "Buscando..";
      }
    }
  });

  $('#horas_mc_jueves').select2({
    width: '100%',
    placeholder: 'Seleccione...',
    language: {
      noResults: function() {
        return "No hay resultado";        
      },
      searching: function() {
        return "Buscando..";
      }
    }
  });

  $('#horas_mc_viernes').select2({
    width: '100%',
    placeholder: 'Seleccione...',
    language: {
      noResults: function() {
        return "No hay resultado";        
      },
      searching: function() {
        return "Buscando..";
      }
    }
  });

  $('#horas_mc_sabado').select2({
    width: '100%',
    placeholder: 'Seleccione...',
    language: {
      noResults: function() {
        return "No hay resultado";        
      },
      searching: function() {
        return "Buscando..";
      }
    }
  });

  function initEvents() {

    /== evento para mostrar modal agregar motivo de consulta ==/
    $('#btn_add_motivo_consulta').on('click', function() {
      var id_atencion = $('#id_atencion').val();
    
      $.ajax({
        url: "/motivo_consulta/get_motivo_consulta_by_atencion",
        type: "get",
        data: {id_atencion: id_atencion},
        dataType: "json",
        success: function(response) {
          mostrarModal(response.mensaje);
        },
        error: function(response) {}
      });
    });

    /== evento para mostrar modal editar motivo de consulta ==/
    $('#btn_edit_motivo_consulta').on('click', function() {
      var id_atencion = $('#id_atencion').val();

      $.ajax({
        url: "/motivo_consulta/get_motivo_consulta_by_atencion",
        data: {
          id_atencion: id_atencion
        },
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'no_existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'No se puede editar un Motivo de Consulta para esta Atención debido a que todavía no tiene ninguna registrada.', 'error');
          } else {
            $('#modal_motivo_consulta').modal('show');
            $('#modal_motivo_consulta').find('.modal-title').text('Motivo de Consulta');
            $('#btn_guardar_motivo_consulta').text('Guardar');
            $('#pregunta_tres').val(response.pregunta_tres);
            llenarDatosPreguntaUno(response.pregunta_uno);
            llenarDatosPreguntaDos(response.pregunta_dos);
            accion = 'editar';

            //pregunta_ cuatro
            if (response.horario_lunes.horas != '') {
              $('#box_lunes').css('display','block');
              var horas_lunes = (response.horario_lunes.horas).split(',');
              llenarSelectHoras('#horas_mc_lunes', horas_lunes);
              $('#check_mc_lunes').prop('checked', true);
            } else {
              $('#box_lunes').css('display','none');
              $('#check_mc_lunes').prop('checked', false);
            }
  
            if (response.horario_martes.horas != '') {
              $('#box_martes').css('display','block');
              var horas_martes = (response.horario_martes.horas).split(',');
              llenarSelectHoras('#horas_mc_martes', horas_martes);
              $('#check_mc_martes').prop('checked', true);
            } else {
              $('#box_martes').css('display','none');
              $('#check_mc_martes').prop('checked', false);
            }
  
            if (response.horario_miercoles.horas != '') {
              $('#box_miercoles').css('display','block');
              var horas_miercoles = (response.horario_miercoles.horas).split(',');
              llenarSelectHoras('#horas_mc_miercoles', horas_miercoles);
              $('#check_mc_miercoles').prop('checked', true);
            } else {
              $('#box_miercoles').css('display','none');
              $('#check_mc_miercoles').prop('checked', false);
            }
  
            if (response.horario_jueves.horas != '') {
              $('#box_jueves').css('display','block');
              var horas_jueves = (response.horario_jueves.horas).split(',');
              llenarSelectHoras('#horas_mc_jueves', horas_jueves);
              $('#check_mc_jueves').prop('checked', true);
            } else {
              $('#box_jueves').css('display','none');
              $('#check_mc_jueves').prop('checked', false);
            }
  
            if (response.horario_viernes.horas != '') {
              $('#box_viernes').css('display','block');
              var horas_viernes = (response.horario_viernes.horas).split(',');
              llenarSelectHoras('#horas_mc_viernes', horas_viernes);
              $('#check_mc_viernes').prop('checked', true);
            } else {
              $('#box_viernes').css('display','none');
              $('#check_mc_viernes').prop('checked', false);
            }
  
            if (response.horario_sabado.horas != '') {
              $('#box_sabado').css('display','block');
              var horas_sabado = (response.horario_sabado.horas).split(',');
              llenarSelectHoras('#horas_mc_sabado', horas_sabado);
              $('#check_mc_sabado').prop('checked', true);
            } else {
              $('#box_sabado').css('display','none');
              $('#check_mc_sabado').prop('checked', false);
            }
          }
        },
        error: function(response) {}
      });
    });

    /== evento para cerrar modal de motivo de consulta ==/
    $('#btn_cerrar_modal_motivo_consulta').on('click', function() {
      limpiarCampos();
      $('#modal_motivo_consulta').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de motivo de consulta ==/
    $('#btn_cancelar_modal_motivo_consulta').on('click', function() {
      limpiarCampos();
      $('#modal_motivo_consulta').modal('hide');
      location.reload();
    });

    $('#check_mc_lunes').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_mc_lunes').attr('disabled', false);
      } else {
        $('#horas_mc_lunes').attr('disabled', true);
      }
    });

    $('#check_mc_martes').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_mc_martes').attr('disabled', false);
      } else {
        $('#horas_mc_martes').attr('disabled', true);
      }
    });

    $('#check_mc_miercoles').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_mc_miercoles').attr('disabled', false);
      } else {
        $('#horas_mc_miercoles').attr('disabled', true);
      }
    });

    $('#check_mc_jueves').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_mc_jueves').attr('disabled', false);
      } else {
        $('#horas_mc_jueves').attr('disabled', true);
      }
    });

    $('#check_mc_viernes').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_mc_viernes').attr('disabled', false);
      } else {
        $('#horas_mc_viernes').attr('disabled', true);
      }
    });

    $('#check_mc_sabado').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_mc_sabado').attr('disabled', false);
      } else {
        $('#horas_mc_sabado').attr('disabled', true);
      }
    });

    /== evento para guardar el motivo de consulta ==/
    $('#btn_guardar_motivo_consulta').on('click', function() {
      var textOriginalBtn = '<span class="indicator-label"> Guardar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);
      var id_user_aut = $('#user_autenticado').val();
      var id_atencion = $('#id_atencion').val();
      var pregunta_tres = $('#pregunta_tres').val();
      var pregunta_dos = devolverPreguntaDos();
      var pregunta_uno = devolverPreguntaUno();
      var horarioLunes = [];
      var horarioMartes = [];
      var horarioMiercoles = [];
      var horarioJueves = [];
      var horarioViernes = [];
      var horarioSabado = [];

      if ($('#check_mc_lunes').is(":checked") == true) {
        horarioLunes = [
          {
            dia: 'lunes',
            horas: $('#horas_mc_lunes').val()
          }
        ]
      }

      if ($('#check_mc_martes').is(":checked") == true) {
        horarioMartes = [
          {
            dia: 'martes',
            horas: $('#horas_mc_martes').val()
          }
        ]
      }

      if ($('#check_mc_miercoles').is(":checked") == true) {
        horarioMiercoles = [
          {
            dia: 'miercoles',
            horas: $('#horas_mc_miercoles').val()
          }
        ]
      }

      if ($('#check_mc_jueves').is(":checked") == true) {
        horarioJueves = [
          {
            dia: 'jueves',
            horas: $('#horas_mc_jueves').val()
          }
        ]
      }

      if ($('#check_mc_viernes').is(":checked") == true) {
        horarioViernes = [
          {
            dia: 'viernes',
            horas: $('#horas_mc_viernes').val()
          }
        ]
      }

      if ($('#check_mc_sabado').is(":checked") == true) {
        horarioSabado = [
          {
            dia: 'sabado',
            horas: $('#horas_mc_sabado').val()
          }
        ]
      }

      if (validarCampos() == 'error') {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Existen campos obligatorios por llenar o seleccionar.', 'error');
      } else {
        $.ajax({
          url: "/motivo_consulta/agregar_motivo_consulta",
          data: {
            'horarioLunes[]': horarioLunes.length > 0 ? JSON.stringify(horarioLunes) : null,
            'horarioMartes[]': horarioMartes.length > 0 ? JSON.stringify(horarioMartes) : null,
            'horarioMiercoles[]': horarioMiercoles.length > 0 ? JSON.stringify(horarioMiercoles) : null,
            'horarioJueves[]': horarioJueves.length > 0 ? JSON.stringify(horarioJueves) : null,
            'horarioViernes[]': horarioViernes.length > 0 ? JSON.stringify(horarioViernes) : null,
            'horarioSabado[]': horarioSabado.length > 0 ? JSON.stringify(horarioSabado) : null,
            id_user_aut: id_user_aut,
            id_atencion: id_atencion,
            pregunta_tres: pregunta_tres,
            pregunta_dos: pregunta_dos,
            pregunta_uno: pregunta_uno,
            accion: accion
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              btn.html(textOriginalBtn);
              limpiarCampos();
              $('#modal_motivo_consulta').modal('hide');

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
  }

  
  function llenarSelectHoras(select, arregloHoras) {
    // limpiar select
    $.each($(select).find("option"), function (key, value) {
      $(value).remove();
    });

    for(var i=0; i<arregloHoras.length-1; i++) {
      var opt = devolverValueOption(arregloHoras[i]);
      
      if (opt != '') {
        var option = opt;
        $(select).find("option").end().append(option.attr('selected', true));
      }
    }

    $(select).trigger("chosen:updated").trigger("change");
  }

  function devolverValueOption(id) {
    var option = '';

    $.each(eval(listaHorasMC), function (key1, val) {
      if (val.id == id) {
        option = $("<option/>").val(val.id).text(val.value);
      }
    });

    return option;
  }

  function limpiarCampos() {
    $('#pregunta_tres').val('');
    $("input[type='radio'][name=inlineRadioOptionsPreguntaUno]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsPreguntaDos]").prop('checked', false);
    $('#check_siente_uno').prop('checked', true);
    $('#check_estado_uno').prop('checked', true);
    accion = '';
  }

  function validarCampos() {
    var error = '';

    if ($('#pregunta_tres').val() == '') {
      error = 'error';
    } else if (($('#check_mc_lunes').is(":checked") == false) && ($('#check_mc_martes').is(":checked") == false) && ($('#check_mc_miercoles').is(":checked") == false) && ($('#check_mc_jueves').is(":checked") == false) && ($('#check_mc_viernes').is(":checked") == false) && ($('#check_mc_sabado').is(":checked") == false)) {
      error = 'error';
    } else if (devolverPreguntaUno() == '') {
      error = 'error';
    } else if (devolverPreguntaDos() == '') {
      error = 'error';
    }

    return error;
  }

  /== funcion para devolver PreguntaUno ==/
  function devolverPreguntaUno() {
    var check = '';
    var check_uno = $('#check_siente_uno').is(":checked");
    var check_dos = $('#check_siente_dos').is(":checked");
    var check_tres = $('#check_siente_tres').is(":checked");
    var check_cuatro = $('#check_siente_cuatro').is(":checked");
    var check_cinco = $('#check_siente_cinco').is(":checked");

    if (check_uno == true) {
      check = 'check_uno'
    } else if (check_dos == true) {
      check = 'check_dos'
    } else if (check_tres == true) {
      check = 'check_tres'
    } else if (check_cuatro == true) {
      check = 'check_cuatro'
    } else if (check_cinco == true) {
      check = 'check_cinco'
    }

    return check;
  }

  /== funcion para devolver PreguntaDos ==/
  function devolverPreguntaDos() {
    var check = '';
    var check_uno = $('#check_estado_uno').is(":checked");
    var check_dos = $('#check_estado_dos').is(":checked");
    var check_tres = $('#check_estado_tres').is(":checked");
    var check_cuatro = $('#check_estado_cuatro').is(":checked");
    var check_cinco = $('#check_estado_cinco').is(":checked");

    if (check_uno == true) {
      check = 'check_uno'
    } else if (check_dos == true) {
      check = 'check_dos'
    } else if (check_tres == true) {
      check = 'check_tres'
    } else if (check_cuatro == true) {
      check = 'check_cuatro'
    } else if (check_cinco == true) {
      check = 'check_cinco'
    }

    return check;
  }

  function mostrarModal(mensaje) {
    if (mensaje == 'existe') {
      deseleccionarFilasTabla();
      notificacion('Error', 'Ya existe un Motivo de Consulta registrado para esta Atención.', 'error');
    } else {
      $('#modal_motivo_consulta').modal('show');
      $('#modal_motivo_consulta').find('.modal-title').text('Motivo de Consulta');
      $("input[type='radio'][name=inlineRadioOptionsPreguntaUno]").prop('checked', false);
      $("input[type='radio'][name=inlineRadioOptionsPreguntaDos]").prop('checked', false);
      $('#check_siente_uno').prop('checked', true);
      $('#check_estado_uno').prop('checked', true);
      accion = 'agregar';
      
      $.ajax({
        url: "/horario/horario_cita_valoracion",
        type: "get",
        dataType: "json",
        success: function(response) {
          if (response[0].horario_lunes.horas != '') {
            $('#box_lunes').css('display','block');
            var horas_lunes = (response[0].horario_lunes.horas).split(',');
            llenarSelectHoras('#horas_mc_lunes', horas_lunes);
            $('#check_mc_lunes').prop('checked', true);
          } else {
            $('#box_lunes').css('display','none');
            $('#check_mc_lunes').prop('checked', false);
          }

          if (response[0].horario_martes.horas != '') {
            $('#box_martes').css('display','block');
            var horas_martes = (response[0].horario_martes.horas).split(',');
            llenarSelectHoras('#horas_mc_martes', horas_martes);
            $('#check_mc_martes').prop('checked', true);
          } else {
            $('#box_martes').css('display','none');
            $('#check_mc_martes').prop('checked', false);
          }

          if (response[0].horario_miercoles.horas != '') {
            $('#box_miercoles').css('display','block');
            var horas_miercoles = (response[0].horario_miercoles.horas).split(',');
            llenarSelectHoras('#horas_mc_miercoles', horas_miercoles);
            $('#check_mc_miercoles').prop('checked', true);
          } else {
            $('#box_miercoles').css('display','none');
            $('#check_mc_miercoles').prop('checked', false);
          }

          if (response[0].horario_jueves.horas != '') {
            $('#box_jueves').css('display','block');
            var horas_jueves = (response[0].horario_jueves.horas).split(',');
            llenarSelectHoras('#horas_mc_jueves', horas_jueves);
            $('#check_mc_jueves').prop('checked', true);
          } else {
            $('#box_jueves').css('display','none');
            $('#check_mc_jueves').prop('checked', false);
          }

          if (response[0].horario_viernes.horas != '') {
            $('#box_viernes').css('display','block');
            var horas_viernes = (response[0].horario_viernes.horas).split(',');
            llenarSelectHoras('#horas_mc_viernes', horas_viernes);
            $('#check_mc_viernes').prop('checked', true);
          } else {
            $('#box_viernes').css('display','none');
            $('#check_mc_viernes').prop('checked', false);
          }

          if (response[0].horario_sabado.horas != '') {
            $('#box_sabado').css('display','block');
            var horas_sabado = (response[0].horario_sabado.horas).split(',');
            llenarSelectHoras('#horas_mc_sabado', horas_sabado);
            $('#check_mc_sabado').prop('checked', true);
          } else {
            $('#box_sabado').css('display','none');
            $('#check_mc_sabado').prop('checked', false);
          }
        },
        error: function(response) {}
      });
    }  
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

  function llenarDatosPreguntaUno(check) {
    switch (check) {
      case 'check_uno':
        $('#check_siente_uno').prop('checked', true);
        break;
      case 'check_dos':
        $('#check_siente_dos').prop('checked', true);
        break;
      case 'check_tres':
        $('#check_siente_tres').prop('checked', true);
        break;
      case 'check_cuatro':
        $('#check_siente_cuatro').prop('checked', true);
        break;
      case 'check_cinco':
        $('#check_siente_cinco').prop('checked', true);
        break;
    }
  }

  function llenarDatosPreguntaDos(check) {
    switch (check) {
      case 'check_uno':
        $('#check_estado_uno').prop('checked', true);
        break;
      case 'check_dos':
        $('#check_estado_dos').prop('checked', true);
        break;
      case 'check_tres':
        $('#check_estado_tres').prop('checked', true);
        break;
      case 'check_cuatro':
        $('#check_estado_cuatro').prop('checked', true);
        break;
      case 'check_cinco':
        $('#check_estado_cinco').prop('checked', true);
        break;
    }
  }
  
  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  motivo_consulta.init();
});