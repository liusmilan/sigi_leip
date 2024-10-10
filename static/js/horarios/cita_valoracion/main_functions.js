var cita_valoracion = function () {
  var $ = jQuery.noConflict();
  const listaHoras = [
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


  function initEvents() {
    cargarSelectHoras();

    $('#check_lunes').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_lunes').attr('disabled', false);
      } else {
        $('#horas_lunes').attr('disabled', true);
        
        $.each($('#horas_lunes').find("option"), function (key, value) {
          $(value).remove();
        });

        llenarSelectHoras('#horas_lunes', '');
      }
    });

    $('#check_martes').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_martes').attr('disabled', false);
      } else {
        $('#horas_martes').attr('disabled', true);
        
        $.each($('#horas_martes').find("option"), function (key, value) {
          $(value).remove();
        });

        llenarSelectHoras('#horas_martes', '');
      }
    });

    $('#check_miercoles').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_miercoles').attr('disabled', false);
      } else {
        $('#horas_miercoles').attr('disabled', true);
        
        $.each($('#horas_miercoles').find("option"), function (key, value) {
          $(value).remove();
        });

        llenarSelectHoras('#horas_miercoles', '');
      }
    });

    $('#check_jueves').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_jueves').attr('disabled', false);
      } else {
        $('#horas_jueves').attr('disabled', true);
        
        $.each($('#horas_jueves').find("option"), function (key, value) {
          $(value).remove();
        });

        llenarSelectHoras('#horas_jueves', '');
      }
    });

    $('#check_viernes').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_viernes').attr('disabled', false);
      } else {
        $('#horas_viernes').attr('disabled', true);
        
        $.each($('#horas_viernes').find("option"), function (key, value) {
          $(value).remove();
        });

        llenarSelectHoras('#horas_viernes', '');
      }
    });

    $('#check_sabado').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_sabado').attr('disabled', false);
      } else {
        $('#horas_sabado').attr('disabled', true);
        
        $.each($('#horas_sabado').find("option"), function (key, value) {
          $(value).remove();
        });

        llenarSelectHoras('#horas_sabado', '');
      }
    });

    $('#btn_guardar_cita_valoracion').on('click', function() {
      var horarioLunes = [];
      var horarioMartes = [];
      var horarioMiercoles = [];
      var horarioJueves = [];
      var horarioViernes = [];
      var horarioSabado = [];

      if ($('#check_lunes').is(":checked") == true) {
        horarioLunes = [
          {
            dia: 'lunes',
            horas: $('#horas_lunes').val()
          }
        ]
      }

      if ($('#check_martes').is(":checked") == true) {
        horarioMartes = [
          {
            dia: 'martes',
            horas: $('#horas_martes').val()
          }
        ]
      }

      if ($('#check_miercoles').is(":checked") == true) {
        horarioMiercoles = [
          {
            dia: 'miercoles',
            horas: $('#horas_miercoles').val()
          }
        ]
      }

      if ($('#check_jueves').is(":checked") == true) {
        horarioJueves = [
          {
            dia: 'jueves',
            horas: $('#horas_jueves').val()
          }
        ]
      }

      if ($('#check_viernes').is(":checked") == true) {
        horarioViernes = [
          {
            dia: 'viernes',
            horas: $('#horas_viernes').val()
          }
        ]
      }

      if ($('#check_sabado').is(":checked") == true) {
        horarioSabado = [
          {
            dia: 'sabado',
            horas: $('#horas_sabado').val()
          }
        ]
      }

      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (validar() != '') {
        btn.html(textOriginalBtn);
        notificacion('Error', validar(), 'error');
      } else {
        $.ajax({
          url: "/horario/agregar_horario",
          data: {
            'horarioLunes[]': horarioLunes.length > 0 ? JSON.stringify(horarioLunes) : null,
            'horarioMartes[]': horarioMartes.length > 0 ? JSON.stringify(horarioMartes) : null,
            'horarioMiercoles[]': horarioMiercoles.length > 0 ? JSON.stringify(horarioMiercoles) : null,
            'horarioJueves[]': horarioJueves.length > 0 ? JSON.stringify(horarioJueves) : null,
            'horarioViernes[]': horarioViernes.length > 0 ? JSON.stringify(horarioViernes) : null,
            'horarioSabado[]': horarioSabado.length > 0 ? JSON.stringify(horarioSabado) : null,
            tipoHorario: 'cita'
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              notificacion('', response.mensaje, response.tipo_mensaje);
              btn.html(textOriginalBtn);
            } else if (response.tipo_mensaje == 'error') {
              notificacion('Error',response.mensaje, response.tipo_mensaje);
              btn.html(textOriginalBtn);
            }

            cargarSelectHoras();
          },
          error: function(response) {
            btn.html(textOriginalBtn);
          }
        });
      }
    });
  }

  function cargarSelectHoras() {
    $('#horas_lunes').select2({
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

    $('#horas_martes').select2({
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

    $('#horas_miercoles').select2({
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

    $('#horas_jueves').select2({
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

    $('#horas_viernes').select2({
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

    $('#horas_sabado').select2({
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

    $.ajax({
      url: "/horario/horario_cita_valoracion",
      type: "get",
      dataType: "json",
      success: function(response) {
        if (response[0].horario_lunes.horas != '') {
          $('#check_lunes').prop('checked', true);
          $('#horas_lunes').attr('disabled', false);
          llenarSelectHoras('#horas_lunes', (response[0].horario_lunes.horas).split(','));
        } else {
          $('#check_lunes').prop('checked', false);
          $('#horas_lunes').attr('disabled', true);
          llenarSelectHoras('#horas_lunes', '');
        }

        if (response[0].horario_martes.horas != '') {
          $('#check_martes').prop('checked', true);
          $('#horas_martes').attr('disabled', false);
          llenarSelectHoras('#horas_martes', (response[0].horario_martes.horas).split(','));
        } else {
          $('#check_martes').prop('checked', false);
          $('#horas_martes').attr('disabled', true);
          llenarSelectHoras('#horas_martes', '');
        }

        if (response[0].horario_miercoles.horas != '') {
          $('#check_miercoles').prop('checked', true);
          $('#horas_miercoles').attr('disabled', false);
          llenarSelectHoras('#horas_miercoles', (response[0].horario_miercoles.horas).split(','));
        } else {
          $('#check_miercoles').prop('checked', false);
          $('#horas_miercoles').attr('disabled', true);
          llenarSelectHoras('#horas_miercoles', '');
        }

        if (response[0].horario_jueves.horas != '') {
          $('#check_jueves').prop('checked', true);
          $('#horas_jueves').attr('disabled', false);
          llenarSelectHoras('#horas_jueves', (response[0].horario_jueves.horas).split(','));
        } else {
          $('#check_jueves').prop('checked', false);
          $('#horas_jueves').attr('disabled', true);
          llenarSelectHoras('#horas_jueves', '');
        }

        if (response[0].horario_viernes.horas != '') {
          $('#check_viernes').prop('checked', true);
          $('#horas_viernes').attr('disabled', false);
          llenarSelectHoras('#horas_viernes', (response[0].horario_viernes.horas).split(','));
        } else {
          $('#check_viernes').prop('checked', false);
          $('#horas_viernes').attr('disabled', true);
          llenarSelectHoras('#horas_viernes', '');
        }

        if (response[0].horario_sabado.horas != '') {
          $('#check_sabado').prop('checked', true);
          $('#horas_sabado').attr('disabled', false);
          llenarSelectHoras('#horas_sabado', (response[0].horario_sabado.horas).split(','));
        } else {
          $('#check_sabado').prop('checked', false);
          $('#horas_sabado').attr('disabled', true);
          llenarSelectHoras('#horas_sabado', '');
        }
      },
      error: function(response) {
        
      }
    });
  }

  function llenarSelectHoras(select, arregloHoras) {
    // limpiar select
    $.each($(select).find("option"), function (key, value) {
      $(value).remove();
    });

    if (arregloHoras != '') {
      $.each(eval(listaHoras), function (key, value) {
        var option = $("<option/>").val(value.id).text(value.value);
        
        $.each(arregloHoras, function (key1, val) {
          if (arregloHoras[key1-1] == value.id) {
            $(select).find("option").end().append(option.attr('selected', true));
          } else {
            $(select).find("option").end().append(option);
          }
        });
      });
    } else {
      $.each(eval(listaHoras), function (key, value) {
        var option = $("<option/>").val(value.id).text(value.value);
        $(select).find("option").end().append(option);
      });
    }

    $(select).trigger("chosen:updated").trigger("change");
  }

  function validar() {
    var msg_error = '';

    if (($('#check_lunes').is(":checked") == true) && ($('#horas_lunes').val() == '')) {
      msg_error = 'Por favor escoja las horas para el Lunes';
    }

    if (($('#check_martes').is(":checked") == true) && ($('#horas_martes').val() == '')) {
      msg_error = 'Por favor escoja las horas para el Martes';
    }

    if (($('#check_miercoles').is(":checked") == true) && ($('#horas_miercoles').val() == '')) {
      msg_error = 'Por favor escoja las horas para el Miércoles';
    }

    if (($('#check_jueves').is(":checked") == true) && ($('#horas_jueves').val() == '')) {
      msg_error = 'Por favor escoja las horas para el Jueves';
    }

    if (($('#check_viernes').is(":checked") == true) && ($('#horas_viernes').val() == '')) {
      msg_error = 'Por favor escoja las horas para el Viernes';
    }

    if (($('#check_sabado').is(":checked") == true) && ($('#horas_sabado').val() == '')) {
      msg_error = 'Por favor escoja las horas para el Sábado';
    }

    return msg_error;
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  cita_valoracion.init();
});