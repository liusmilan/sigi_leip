var consulta_psicoterapeutica = function () {
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

    $('#check_lunes_psico').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_lunes_psico').attr('disabled', false);
      } else {
        $('#horas_lunes_psico').attr('disabled', true);
        
        $.each($('#horas_lunes_psico').find("option"), function (key, value) {
          $(value).remove();
        });

        llenarSelectHoras('#horas_lunes_psico', '');
      }
    });

    $('#check_martes_psico').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_martes_psico').attr('disabled', false);
      } else {
        $('#horas_martes_psico').attr('disabled', true);
        
        $.each($('#horas_martes_psico').find("option"), function (key, value) {
          $(value).remove();
        });

        llenarSelectHoras('#horas_martes_psico', '');
      }
    });

    $('#check_miercoles_psico').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_miercoles_psico').attr('disabled', false);
      } else {
        $('#horas_miercoles_psico').attr('disabled', true);
        
        $.each($('#horas_miercoles_psico').find("option"), function (key, value) {
          $(value).remove();
        });

        llenarSelectHoras('#horas_miercoles_psico', '');
      }
    });

    $('#check_jueves_psico').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_jueves_psico').attr('disabled', false);
      } else {
        $('#horas_jueves_psico').attr('disabled', true);
        
        $.each($('#horas_jueves_psico').find("option"), function (key, value) {
          $(value).remove();
        });

        llenarSelectHoras('#horas_jueves_psico', '');
      }
    });

    $('#check_viernes_psico').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_viernes_psico').attr('disabled', false);
      } else {
        $('#horas_viernes_psico').attr('disabled', true);
        
        $.each($('#horas_viernes_psico').find("option"), function (key, value) {
          $(value).remove();
        });

        llenarSelectHoras('#horas_viernes_psico', '');
      }
    });

    $('#check_sabado_psico').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_sabado_psico').attr('disabled', false);
      } else {
        $('#horas_sabado_psico').attr('disabled', true);
        
        $.each($('#horas_sabado_psico').find("option"), function (key, value) {
          $(value).remove();
        });

        llenarSelectHoras('#horas_sabado_psico', '');
      }
    });

    $('#btn_guardar_horario_consulta_psico').on('click', function() {
      var horarioLunes = [];
      var horarioMartes = [];
      var horarioMiercoles = [];
      var horarioJueves = [];
      var horarioViernes = [];
      var horarioSabado = [];

      if ($('#check_lunes_psico').is(":checked") == true) {
        horarioLunes = [
          {
            dia: 'lunes',
            horas: $('#horas_lunes_psico').val()
          }
        ]
      }

      if ($('#check_martes_psico').is(":checked") == true) {
        horarioMartes = [
          {
            dia: 'martes',
            horas: $('#horas_martes_psico').val()
          }
        ]
      }

      if ($('#check_miercoles_psico').is(":checked") == true) {
        horarioMiercoles = [
          {
            dia: 'miercoles',
            horas: $('#horas_miercoles_psico').val()
          }
        ]
      }

      if ($('#check_jueves_psico').is(":checked") == true) {
        horarioJueves = [
          {
            dia: 'jueves',
            horas: $('#horas_jueves_psico').val()
          }
        ]
      }

      if ($('#check_viernes_psico').is(":checked") == true) {
        horarioViernes = [
          {
            dia: 'viernes',
            horas: $('#horas_viernes_psico').val()
          }
        ]
      }

      if ($('#check_sabado_psico').is(":checked") == true) {
        horarioSabado = [
          {
            dia: 'sabado',
            horas: $('#horas_sabado_psico').val()
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
            tipoHorario: 'consulta'
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
    $('#horas_lunes_psico').select2({
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

    $('#horas_martes_psico').select2({
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

    $('#horas_miercoles_psico').select2({
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

    $('#horas_jueves_psico').select2({
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

    $('#horas_viernes_psico').select2({
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

    $('#horas_sabado_psico').select2({
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
      url: "/horario/horario_consulta_psicoterapeutica",
      type: "get",
      dataType: "json",
      success: function(response) {
        if (response[0].horario_lunes.horas != '') {
          $('#check_lunes_psico').prop('checked', true);
          $('#horas_lunes_psico').attr('disabled', false);
          llenarSelectHoras('#horas_lunes_psico', (response[0].horario_lunes.horas).split(','));
        } else {
          $('#check_lunes_psico').prop('checked', false);
          $('#horas_lunes_psico').attr('disabled', true);
          llenarSelectHoras('#horas_lunes_psico', '');
        }

        if (response[0].horario_martes.horas != '') {
          $('#check_martes_psico').prop('checked', true);
          $('#horas_martes_psico').attr('disabled', false);
          llenarSelectHoras('#horas_martes_psico', (response[0].horario_martes.horas).split(','));
        } else {
          $('#check_martes_psico').prop('checked', false);
          $('#horas_martes_psico').attr('disabled', true);
          llenarSelectHoras('#horas_martes_psico', '');
        }

        if (response[0].horario_miercoles.horas != '') {
          $('#check_miercoles_psico').prop('checked', true);
          $('#horas_miercoles_psico').attr('disabled', false);
          llenarSelectHoras('#horas_miercoles_psico', (response[0].horario_miercoles.horas).split(','));
        } else {
          $('#check_miercoles_psico').prop('checked', false);
          $('#horas_miercoles_psico').attr('disabled', true);
          llenarSelectHoras('#horas_miercoles_psico', '');
        }

        if (response[0].horario_jueves.horas != '') {
          $('#check_jueves_psico').prop('checked', true);
          $('#horas_jueves_psico').attr('disabled', false);
          llenarSelectHoras('#horas_jueves_psico', (response[0].horario_jueves.horas).split(','));
        } else {
          $('#check_jueves_psico').prop('checked', false);
          $('#horas_jueves_psico').attr('disabled', true);
          llenarSelectHoras('#horas_jueves_psico', '');
        }

        if (response[0].horario_viernes.horas != '') {
          $('#check_viernes_psico').prop('checked', true);
          $('#horas_viernes_psico').attr('disabled', false);
          llenarSelectHoras('#horas_viernes_psico', (response[0].horario_viernes.horas).split(','));
        } else {
          $('#check_viernes_psico').prop('checked', false);
          $('#horas_viernes_psico').attr('disabled', true);
          llenarSelectHoras('#horas_viernes_psico', '');
        }

        if (response[0].horario_sabado.horas != '') {
          $('#check_sabado_psico').prop('checked', true);
          $('#horas_sabado_psico').attr('disabled', false);
          llenarSelectHoras('#horas_sabado_psico', (response[0].horario_sabado.horas).split(','));
        } else {
          $('#check_sabado_psico').prop('checked', false);
          $('#horas_sabado_psico').attr('disabled', true);
          llenarSelectHoras('#horas_sabado_psico', '');
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

    if (($('#check_lunes_psico').is(":checked") == true) && ($('#horas_lunes_psico').val() == '')) {
      msg_error = 'Por favor escoja las horas para el Lunes';
    }

    if (($('#check_martes_psico').is(":checked") == true) && ($('#horas_martes_psico').val() == '')) {
      msg_error = 'Por favor escoja las horas para el Martes';
    }

    if (($('#check_miercoles_psico').is(":checked") == true) && ($('#horas_miercoles_psico').val() == '')) {
      msg_error = 'Por favor escoja las horas para el Miércoles';
    }

    if (($('#check_jueves_psico').is(":checked") == true) && ($('#horas_jueves_psico').val() == '')) {
      msg_error = 'Por favor escoja las horas para el Jueves';
    }

    if (($('#check_viernes_psico').is(":checked") == true) && ($('#horas_viernes_psico').val() == '')) {
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
  consulta_psicoterapeutica.init();
});