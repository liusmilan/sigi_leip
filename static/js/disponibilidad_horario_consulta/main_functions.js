var disponibilidad_horario_consulta = function() {
  var $ = jQuery.noConflict();
  var accion = '';
  var id_atencion = '';
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

  $('#horas_disp_lunes').select2({
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

  $('#horas_disp_martes').select2({
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

  $('#horas_disp_miercoles').select2({
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

  $('#horas_disp_jueves').select2({
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

  $('#horas_disp_viernes').select2({
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

  $('#horas_disp_sabado').select2({
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
    /== evento para mostrar modal agregar disponibilidad horario consulta ==/
    $('#btn_add_disponibilidad_consulta').on('click', function() {
      var id_atencion = $('#id_atencion').val();
    
      $.ajax({
        url: "/disponibilidad_horario_consulta/get_disponibilidad_horario_consulta_by_atencion",
        type: "get",
        data: {id_atencion: id_atencion},
        dataType: "json",
        success: function(response) {
          mostrarModal(response.mensaje);
        },
        error: function(response) {}
      });
    });

    /== evento para mostrar modal editar disponibilidad horario consulta ==/
    $('#btn_edit_disponibilidad_consulta').on('click', function() {
      id_atencion = $('#id_atencion').val();

      $.ajax({
        url: "/disponibilidad_horario_consulta/get_disponibilidad_horario_consulta_by_atencion",
        data: {
          id_atencion: id_atencion
        },
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'no_existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'No se puede editar una Disponibilidad de Horario de Consulta para esta Atención debido a que todavía no tiene ninguna registrada.', 'error');
          } else {
            $('#modal_disponibilidad_horario_consulta').modal('show');
            $('#modal_disponibilidad_horario_consulta').find('.modal-title').text('Disponibilidad de Horario de Consulta');
            $('#btn_guardar_disponibilidad_horario_consulta').text('Guardar');
            accion = 'editar';

            $('#box_edit_horarios_disponibilidad').css('display', 'block');
            $('#card_horarios_dispobilidad').find('input, textarea, select, button').prop('disabled', true);

            if (response.horario_lunes.horas != '') {
              $('#box_lunes_').css('display','block');
              var horas_lunes = [];

              for (it in JSON.parse(response.horario_lunes.horas)) {
                horas_lunes.push(JSON.parse(response.horario_lunes.horas)[it].fields.hora)
              }
              
              llenarSelectHoras('#horas_disp_lunes', horas_lunes, accion);
              $('#check_disp_lunes').prop('checked', true);
            } else {
              $('#box_lunes_disp').css('display','none');
              $('#check_disp_lunes').prop('checked', false);
            }
  
            if (response.horario_martes.horas != '') {
              $('#box_martes_disp').css('display','block');
              var horas_martes = [];

              for (it in JSON.parse(response.horario_martes.horas)) {
                horas_martes.push(JSON.parse(response.horario_martes.horas)[it].fields.hora)
              }

              llenarSelectHoras('#horas_disp_martes', horas_martes, accion);
              $('#check_disp_martes').prop('checked', true);
            } else {
              $('#box_martes_disp').css('display','none');
              $('#check_disp_martes').prop('checked', false);
            }
  
            if (response.horario_miercoles.horas != '') {
              $('#box_miercoles_disp').css('display','block');
              var horas_miercoles = [];

              for (it in JSON.parse(response.horario_miercoles.horas)) {
                horas_miercoles.push(JSON.parse(response.horario_miercoles.horas)[it].fields.hora)
              }

              llenarSelectHoras('#horas_disp_miercoles', horas_miercoles, accion);
              $('#check_disp_miercoles').prop('checked', true);
            } else {
              $('#box_miercoles_disp').css('display','none');
              $('#check_disp_miercoles').prop('checked', false);
            }
  
            if (response.horario_jueves.horas != '') {
              $('#box_jueves_disp').css('display','block');
              var horas_jueves = [];

              for (it in JSON.parse(response.horario_jueves.horas)) {
                horas_jueves.push(JSON.parse(response.horario_jueves.horas)[it].fields.hora)
              }

              llenarSelectHoras('#horas_disp_jueves', horas_jueves, accion);
              $('#check_disp_jueves').prop('checked', true);
            } else {
              $('#box_jueves_disp').css('display','none');
              $('#check_disp_jueves').prop('checked', false);
            }
  
            if (response.horario_viernes.horas != '') {
              $('#box_viernes_disp').css('display','block');
              var horas_viernes = [];

              for (it in JSON.parse(response.horario_viernes.horas)) {
                horas_viernes.push(JSON.parse(response.horario_viernes.horas)[it].fields.hora)
              }

              llenarSelectHoras('#horas_disp_viernes', horas_viernes, accion);
              $('#check_disp_viernes').prop('checked', true);
            } else {
              $('#box_viernes_disp').css('display','none');
              $('#check_disp_viernes').prop('checked', false);
            }
  
            if (response.horario_sabado.horas != '') {
              $('#box_sabado_disp').css('display','block');
              var horas_sabado = [];

              for (it in JSON.parse(response.horario_sabado.horas)) {
                horas_sabado.push(JSON.parse(response.horario_sabado.horas)[it].fields.hora)
              }

              llenarSelectHoras('#horas_disp_sabado', horas_sabado, accion);
              $('#check_disp_sabado').prop('checked', true);
            } else {
              $('#box_sabado_disp').css('display','none');
              $('#check_disp_sabado').prop('checked', false);
            }
          }
        },
        error: function(response) {}
      });
    });
    
    /== evento para cerrar modal de disponibilidad horario consulta ==/
    $('#btn_cerrar_modal_disponibilidad_horario_consulta').on('click', function() {
      limpiarCampos();
      $('#modal_disponibilidad_horario_consulta').modal('hide');
      $(document).trigger('actualizar_lista_atenciones');
    });

    /== evento para cerrar modal de disponibilidad horario consulta ==/
    $('#btn_cancelar_modal_disponibilidad_horario_consulta').on('click', function() {
      limpiarCampos();
      $('#modal_disponibilidad_horario_consulta').modal('hide');
      $(document).trigger('actualizar_lista_atenciones');
    });

    $('#check_disp_lunes').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_disp_lunes').attr('disabled', false);
      } else {
        $('#horas_disp_lunes').attr('disabled', true);
      }
    });

    $('#check_disp_martes').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_disp_martes').attr('disabled', false);
      } else {
        $('#horas_disp_martes').attr('disabled', true);
      }
    });

    $('#check_disp_miercoles').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_disp_miercoles').attr('disabled', false);
      } else {
        $('#horas_disp_miercoles').attr('disabled', true);
      }
    });

    $('#check_disp_jueves').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_disp_jueves').attr('disabled', false);
      } else {
        $('#horas_disp_jueves').attr('disabled', true);
      }
    });

    $('#check_disp_viernes').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_disp_viernes').attr('disabled', false);
      } else {
        $('#horas_disp_viernes').attr('disabled', true);
      }
    });

    $('#check_disp_sabado').on('click', function() {
      if ($(this).is(":checked")) {
        $('#horas_disp_sabado').attr('disabled', false);
      } else {
        $('#horas_disp_sabado').attr('disabled', true);
      }
    });

    /== evento para guardar el disponibilidad horario consulta ==/
    $('#btn_guardar_disponibilidad_horario_consulta').on('click', function() {
      var textOriginalBtn = '<span class="indicator-label"> Guardar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);
      var id_user_aut = $('#user_autenticado').val();
      var id_atencion = $('#id_atencion').val();
      var horarioLunes = [];
      var horarioMartes = [];
      var horarioMiercoles = [];
      var horarioJueves = [];
      var horarioViernes = [];
      var horarioSabado = [];

      if ($('#check_disp_lunes').is(":checked") == true) {
        horarioLunes = [
          {
            dia: 'lunes',
            horas: $('#horas_disp_lunes').val()
          }
        ]
      }

      if ($('#check_disp_martes').is(":checked") == true) {
        horarioMartes = [
          {
            dia: 'martes',
            horas: $('#horas_disp_martes').val()
          }
        ]
      }

      if ($('#check_disp_miercoles').is(":checked") == true) {
        horarioMiercoles = [
          {
            dia: 'miercoles',
            horas: $('#horas_disp_miercoles').val()
          }
        ]
      }

      if ($('#check_disp_jueves').is(":checked") == true) {
        horarioJueves = [
          {
            dia: 'jueves',
            horas: $('#horas_disp_jueves').val()
          }
        ]
      }

      if ($('#check_disp_viernes').is(":checked") == true) {
        horarioViernes = [
          {
            dia: 'viernes',
            horas: $('#horas_disp_viernes').val()
          }
        ]
      }

      if ($('#check_disp_sabado').is(":checked") == true) {
        horarioSabado = [
          {
            dia: 'sabado',
            horas: $('#horas_disp_sabado').val()
          }
        ]
      }

      if (validarCampos() == 'error') {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Existen campos obligatorios por seleccionar.', 'error');
      } else {
        $.ajax({
          url: "/disponibilidad_horario_consulta/agregar_disponibilidad_horario_consulta",
          data: {
            'horarioLunes[]': horarioLunes.length > 0 ? JSON.stringify(horarioLunes) : null,
            'horarioMartes[]': horarioMartes.length > 0 ? JSON.stringify(horarioMartes) : null,
            'horarioMiercoles[]': horarioMiercoles.length > 0 ? JSON.stringify(horarioMiercoles) : null,
            'horarioJueves[]': horarioJueves.length > 0 ? JSON.stringify(horarioJueves) : null,
            'horarioViernes[]': horarioViernes.length > 0 ? JSON.stringify(horarioViernes) : null,
            'horarioSabado[]': horarioSabado.length > 0 ? JSON.stringify(horarioSabado) : null,
            id_user_aut: id_user_aut,
            id_atencion: id_atencion,
            accion: accion
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              btn.html(textOriginalBtn);
              limpiarCampos();
              $('#modal_disponibilidad_horario_consulta').modal('hide');

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
              btn.html(textOriginalBtn);
            }
          },
          error: function(response) {
            btn.html(textOriginalBtn);
          }
        });
      }
    });

    /== evento para mostrar los horarios del nomenclador cuando se seleccione el check en modal editar ==/
    $('#check_edit_disp').on('change', function() {
      if (this.checked) {
        $('#card_horarios_dispobilidad').find('input, textarea, select, button').prop('disabled', false);
        horariosAccionAgregar();
        console.log('agregar');
      } else {
        $('#card_horarios_dispobilidad').find('input, textarea, select, button').prop('disabled', true);
        horariosAccionEditar();
        console.log('editar');
      }
    });
  }

  function mostrarModal(mensaje) {
    if (mensaje == 'existe') {
      deseleccionarFilasTabla();
      notificacion('Error', 'Ya existe una Disponibilidad registrada para esta Atención.', 'error');
    } else {
      $('#modal_disponibilidad_horario_consulta').modal('show');
      $('#modal_disponibilidad_horario_consulta').find('.modal-title').text('Disponibilidad de Horario de Consulta');
      accion = 'agregar';

      $('#box_edit_horarios_disponibilidad').css('display', 'none');
      $('#card_horarios_dispobilidad').find('input, textarea, select, button').prop('disabled', false);
      
      horariosAccionAgregar();
    }
  }
  
  function llenarSelectHoras(select, arregloHoras, accion_modal) {
    // limpiar select
    $.each($(select).find("option"), function (key, value) {
      $(value).remove();
    });

    var arrayLength = accion_modal == 'agregar' ? arregloHoras.length-1 : arregloHoras.length

    for(var i=0; i<arrayLength; i++) {
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
    accion = '';
  }

  function validarCampos() {
    var error = '';

    if (($('#check_disp_lunes').is(":checked") == false) && ($('#check_disp_martes').is(":checked") == false) && ($('#check_disp_miercoles').is(":checked") == false) && ($('#check_disp_jueves').is(":checked") == false) && ($('#check_disp_viernes').is(":checked") == false) && ($('#check_disp_sabado').is(":checked") == false)) {
      error = 'error';
    }

    return error;
  }

  function horariosAccionAgregar() {
    $.ajax({
      url: "/horario/horario_consulta_psicoterapeutica",
      type: "get",
      dataType: "json",
      success: function(response) {
        if (response[0].horario_lunes.horas != '') {
          $('#box_lunes_disp').css('display','block');
          var horas_lunes = (response[0].horario_lunes.horas).split(',');
          llenarSelectHoras('#horas_disp_lunes', horas_lunes, accion);
          $('#check_disp_lunes').prop('checked', true);
        } else {
          $('#box_lunes_disp').css('display','none');
          $('#check_disp_lunes').prop('checked', false);
        }

        if (response[0].horario_martes.horas != '') {
          $('#box_martes_disp').css('display','block');
          var horas_martes = (response[0].horario_martes.horas).split(',');
          llenarSelectHoras('#horas_disp_martes', horas_martes, accion);
          $('#check_disp_martes').prop('checked', true);
        } else {
          $('#box_martes_disp').css('display','none');
          $('#check_disp_martes').prop('checked', false);
        }

        if (response[0].horario_miercoles.horas != '') {
          $('#box_miercoles_disp').css('display','block');
          var horas_miercoles = (response[0].horario_miercoles.horas).split(',');
          llenarSelectHoras('#horas_disp_miercoles', horas_miercoles, accion);
          $('#check_disp_miercoles').prop('checked', true);
        } else {
          $('#box_miercoles_disp').css('display','none');
          $('#check_disp_miercoles').prop('checked', false);
        }

        if (response[0].horario_jueves.horas != '') {
          $('#box_jueves_disp').css('display','block');
          var horas_jueves = (response[0].horario_jueves.horas).split(',');
          llenarSelectHoras('#horas_disp_jueves', horas_jueves, accion);
          $('#check_disp_jueves').prop('checked', true);
        } else {
          $('#box_jueves_disp').css('display','none');
          $('#check_disp_jueves').prop('checked', false);
        }

        if (response[0].horario_viernes.horas != '') {
          $('#box_viernes_disp').css('display','block');
          var horas_viernes = (response[0].horario_viernes.horas).split(',');
          llenarSelectHoras('#horas_disp_viernes', horas_viernes, accion);
          $('#check_disp_viernes').prop('checked', true);
        } else {
          $('#box_viernes_disp').css('display','none');
          $('#check_disp_viernes').prop('checked', false);
        }

        if (response[0].horario_sabado.horas != '') {
          $('#box_sabado_disp').css('display','block');
          var horas_sabado = (response[0].horario_sabado.horas).split(',');
          llenarSelectHoras('#horas_disp_sabado', horas_sabado, accion);
          $('#check_disp_sabado').prop('checked', true);
        } else {
          $('#box_sabado_disp').css('display','none');
          $('#check_disp_sabado').prop('checked', false);
        }
      },
      error: function(response) {}
    });
  }

  function horariosAccionEditar() {
    console.log(id_atencion);
    $.ajax({
      url: "/disponibilidad_horario_consulta/get_disponibilidad_horario_consulta_by_atencion",
      data: {
        id_atencion: id_atencion
      },
      dataType: "json",
      success: function(response) {
        if (response.horario_lunes.horas != '') {
          $('#box_lunes_').css('display','block');
          var horas_lunes = [];

          for (it in JSON.parse(response.horario_lunes.horas)) {
            horas_lunes.push(JSON.parse(response.horario_lunes.horas)[it].fields.hora);
          }
          
          llenarSelectHoras('#horas_disp_lunes', horas_lunes, accion);
          $('#check_disp_lunes').prop('checked', true);
        } else {
          $('#box_lunes_disp').css('display','none');
          $('#check_disp_lunes').prop('checked', false);
        }
  
        if (response.horario_martes.horas != '') {
          $('#box_martes_disp').css('display','block');
          var horas_martes = [];

          for (it in JSON.parse(response.horario_martes.horas)) {
            horas_martes.push(JSON.parse(response.horario_martes.horas)[it].fields.hora)
          }

          llenarSelectHoras('#horas_disp_martes', horas_martes, accion);
          $('#check_disp_martes').prop('checked', true);
        } else {
          $('#box_martes_disp').css('display','none');
          $('#check_disp_martes').prop('checked', false);
        }
  
        if (response.horario_miercoles.horas != '') {
          $('#box_miercoles_disp').css('display','block');
          var horas_miercoles = [];

          for (it in JSON.parse(response.horario_miercoles.horas)) {
            horas_miercoles.push(JSON.parse(response.horario_miercoles.horas)[it].fields.hora)
          }

          llenarSelectHoras('#horas_disp_miercoles', horas_miercoles, accion);
          $('#check_disp_miercoles').prop('checked', true);
        } else {
          $('#box_miercoles_disp').css('display','none');
          $('#check_disp_miercoles').prop('checked', false);
        }
  
        if (response.horario_jueves.horas != '') {
          $('#box_jueves_disp').css('display','block');
          var horas_jueves = [];

          for (it in JSON.parse(response.horario_jueves.horas)) {
            horas_jueves.push(JSON.parse(response.horario_jueves.horas)[it].fields.hora)
          }

          llenarSelectHoras('#horas_disp_jueves', horas_jueves, accion);
          $('#check_disp_jueves').prop('checked', true);
        } else {
          $('#box_jueves_disp').css('display','none');
          $('#check_disp_jueves').prop('checked', false);
        }
  
        if (response.horario_viernes.horas != '') {
          $('#box_viernes_disp').css('display','block');
          var horas_viernes = [];

          for (it in JSON.parse(response.horario_viernes.horas)) {
            horas_viernes.push(JSON.parse(response.horario_viernes.horas)[it].fields.hora)
          }

          llenarSelectHoras('#horas_disp_viernes', horas_viernes, accion);
          $('#check_disp_viernes').prop('checked', true);
        } else {
          $('#box_viernes_disp').css('display','none');
          $('#check_disp_viernes').prop('checked', false);
        }
  
        if (response.horario_sabado.horas != '') {
          $('#box_sabado_disp').css('display','block');
          var horas_sabado = [];

          for (it in JSON.parse(response.horario_sabado.horas)) {
            horas_sabado.push(JSON.parse(response.horario_sabado.horas)[it].fields.hora)
          }

          llenarSelectHoras('#horas_disp_sabado', horas_sabado, accion);
          $('#check_disp_sabado').prop('checked', true);
        } else {
          $('#box_sabado_disp').css('display','none');
          $('#check_disp_sabado').prop('checked', false);
        }
      },
      error: function(response) {}
    });
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  disponibilidad_horario_consulta.init();
});