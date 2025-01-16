var asignar_psicoterapeuta = function() {
  var $ = jQuery.noConflict();
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
  var accion = '';
  
  $('.fecha_consulta_asignar').datepicker({
    format: 'dd/mm/yyyy',
    language: 'es',
    todayHighlight: true,
    autoclose: true
  });


  function initEvents() {
    /== evento para mostrar modal de asignar psicoterapeuta ==/
    $('#btn_add_asignar_especialista_psicoterapeuta').on('click', function() {
      var id_atencion = $('#id_atencion').val();

      $.ajax({
        url: "/asignar/get_asignado_by_atencion",
        type: "get",
        data: {
          id_atencion: id_atencion,
          tipo_persona: 'psicoterapeuta'
        },
        dataType: "json",
        success: function(response) {
          mostrarModalAgregar(response.mensaje, id_atencion);
        },
        error: function(response) {}
      });
    });

    /== evento para cerrar modal de asignar psicoterapeuta ==/
    $('#btn_cerrar_modal_asignar_psicoterapeuta').on('click', function() {
      limpiarCampos();
      $('#modal_asignar_psicoterapeuta').modal('hide');
      $(document).trigger('actualizar_lista_atenciones');
    });
    
    /== evento para cerrar modal de asignar psicoterapeuta ==/
    $('#btn_cancelar_modal_asignar_psicoterapeuta').on('click', function() {
      limpiarCampos();
      $('#modal_asignar_psicoterapeuta').modal('hide');
      $(document).trigger('actualizar_lista_atenciones');
    });

    /== evento para guardar el psicoterapeuta asignado ==/
    $('#btn_guardar_asignar_psicoterapeuta').on('click', function() {
      var textOriginalBtn = '<span class="indicator-label"> Guardar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);
      var id_user_aut = $('#user_autenticado').val();
      var id_atencion = $('#id_atencion').val();
      var persona_asignada = $('#psicoterapeuta_asignar').val();
      var fecha = $('#fecha_consulta').val();
      var hora = $('#hora_consulta').val();

      if (validarCampos() == 'error') {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Existen campos obligatorios por llenar o seleccionar.', 'error');
      } else {
        $.ajax({
          url: "/asignar/agregar_persona_asignada",
          data: {
            id_user_aut: id_user_aut,
            id_atencion: id_atencion,
            persona_asignada: persona_asignada,
            fecha: fecha,
            hora: hora,
            accion: accion,
            tipo_persona: 'psicoterapeuta'
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              btn.html(textOriginalBtn);
              limpiarCampos();
              $('#modal_asignar_psicoterapeuta').modal('hide');

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

    /== evento para mostrar modal editar asignar psicoterapeuta ==/
    $('#btn_edit_asignar_especialista_psicoterapeuta').on('click', function() {
      var id_atencion = $('#id_atencion').val();
      
      $.ajax({
        url: "/asignar/get_asignado_by_atencion",
        data: {
          id_atencion: id_atencion,
          tipo_persona: 'psicoterapeuta'
        },
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'no_existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'No se puede editar el Asignar Psicoterapeuta para esta Atención debido a que todavía no se a asignado ningún psicoterapeuta.', 'error');
          } else {
            mostrarModalEditar(response, id_atencion);
          }
        },
        error: function(response) {}
      });
    });
  }

  function mostrarModalAgregar(mensaje, id_atencion) {
    if (mensaje == 'existe') {
      deseleccionarFilasTabla();
      notificacion('Error', 'Ya se ha asignado un psicoterapeuta para esta Atención. Si desea cambiarlo, elija la opción de editar', 'error');
    } else {
      $.ajax({
        url: "/asignar/get_horarios_disponibilidad",
        type: "get",
        data: {id_atencion: id_atencion},
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'no_existe_disponibilidad') {
            deseleccionarFilasTabla();
            notificacion('Error', 'No puede asignar un Psicoterapeuta porque todavía no se ha registrado una Disponibilidad de Horario de Consulta para la Atención seleccionada', 'error');
          } else {
            $('#modal_asignar_psicoterapeuta').modal('show');
            $('#modal_asignar_psicoterapeuta').find('.modal-title').text('Asignar Psicoterapeuta');
            $('#btn_guardar_asignar_psicoterapeuta').text('Guardar');
            
            var datos_horario = JSON.parse(response.horario);
            $('#horario_cita_asignar_psicoterapeuta').html(devolverHorario(datos_horario));
            accion = 'agregar';
          
            $('#psicoterapeuta_asignar').select2({
              dropdownParent: $('#modal_asignar_psicoterapeuta .modal-body'),
              width: '100%',
              language: {
                noResults: function() {
                  return "No hay resultado";        
                },
                searching: function() {
                  return "Buscando..";
                }
              }
            });
        
            llenarSelectPsicoterapeuta('');
          }
        },
        error: function(response) {}
      });
    }
  }

  function mostrarModalEditar(datos, id_atencion) {
    $('#modal_asignar_psicoterapeuta').modal('show');
    $('#modal_asignar_psicoterapeuta').find('.modal-title').text('Asignar Psicoterapeuta');
    $('#btn_guardar_asignar_psicoterapeuta').text('Guardar');
    accion = 'editar';
    $('#fecha_consulta').val(datos.fecha);
    $('#hora_consulta').val(datos.hora);
          
    $('#psicoterapeuta_asignar').select2({
      dropdownParent: $('#modal_asignar_psicoterapeuta .modal-body'),
      width: '100%',
      language: {
        noResults: function() {
          return "No hay resultado";        
        },
        searching: function() {
          return "Buscando..";
        }
      }
    });

    llenarSelectPsicoterapeuta(datos.persona_asignada.id);
    
    $.ajax({
      url: "/asignar/get_horarios_disponibilidad",
      type: "get",
      data: {id_atencion: id_atencion},
      dataType: "json",
      success: function(response) {
        var datos_horario = JSON.parse(response.horario);
        $('#horario_cita_asignar_psicoterapeuta').html(devolverHorario(datos_horario));
      },
      error: function(response) {}
    });
  }

  /== funcion para llenar el select de psicoterapeuta ==/
  function llenarSelectPsicoterapeuta(id_persona) {
    $.ajax({
      url: "/persona/get_personas",
      type: "get",
      dataType: "json",
      success: function(response) {
        var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
        var optionEmpty = $("<option/>").val('-').text('-----------');

        if (response.mensaje == 'success') {
          if (id_persona != '') {
            $('#psicoterapeuta_asignar').find("option").end().append(optionSeleccione);
          } else {
            $('#psicoterapeuta_asignar').find("option").end().append(optionSeleccione.attr('selected', true));
          }

          if (devolverPsicoterapeutas(response.personas).length > 0) {
            $.each(devolverPsicoterapeutas(response.personas), function (key, value) {
              if (value.activo == true) {
                var option = $("<option/>").val(value.id).text(value.nombre + (value.segundo_nombre ? ' ' + value.segundo_nombre + ' ' : ' ') + value.apellido + (value.segundo_apellido ? ' ' + value.segundo_apellido : ' '));
  
                if (id_persona != '') {
                  // llenar select personas en modal de editar
                  if (value.id == id_persona) {
                    $('#psicoterapeuta_asignar').find("option").end().append(option.attr('selected', true));
                  } else {
                    $('#psicoterapeuta_asignar').find("option").end().append(option);
                  }              
                } else {
                  // llenar select personas en modal de agregar
                  $('#psicoterapeuta_asignar').find("option").end().append(option);
                }
              }
            });
            
            $('#psicoterapeuta_asignar').trigger("chosen:updated").trigger("change");
          } else {
            $('#psicoterapeuta_asignar').find("option").end().append(optionEmpty.attr('selected', true));
          }
        } else if (response.mensaje == 'error') {
          $('#psicoterapeuta_asignar').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {}
    });
  }
  
  function devolverPsicoterapeutas(personas) {
    var psicoterapeutas = [];

    for (per in personas) {
      var nameRoles=[];
      
      if (personas[per].roles != null) {
        var roles_json=$.parseJSON(personas[per].roles);

        for (r in roles_json) {
          nameRoles.push(roles_json[r]["fields"]);
        };

        for (r1 in nameRoles) {
          if (nameRoles[r1].nombre == 'CONSULTA_PSICOTERAPEUTICA') {
            psicoterapeutas.push(personas[per]);
          }
        }
      }
    }

    return psicoterapeutas
  }

  function devolverHorario(lista_horario) {
    var horasPorDia = {};
    var resultado = '';

    $.each(lista_horario, function(index, item) {
      var h = devolverHora(item.fields.hora);

      if (horasPorDia[item.fields.dia]) {
        horasPorDia[item.fields.dia].push(h);
      } else {
        horasPorDia[item.fields.dia] = [h];
      }
    });

    $.each(horasPorDia, function(dia, horas) {
      resultado += dia + ': ' + horas.join('/ ') + '<br/> ';
    });

    return resultado;
  }

  function devolverHora(id) {
    var hora = '';

    $.each(eval(listaHorasMC), function (key1, val) {
      if (val.id == id) {
        hora = val.value;
      }
    });

    return hora;
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
    $('#fecha_consulta').val('');
    $('#hora_consulta').val('');
    accion = '';

    $.each($('#psicoterapeuta_asignar').find("option"), function (key, value) {
      $(value).remove();
    });

  }

  function validarCampos() {
    var error = '';
    var persona_asignada = $('#psicoterapeuta_asignar').val();
    var fecha = $('#fecha_consulta').val();
    var hora = $('#hora_consulta').val();

    if ((persona_asignada == 'sel') || (persona_asignada == '-')) {
      error = 'error';
    } else if (fecha == '') {
      error = 'error';
    } else if (hora == '') {
      error = 'error';
    }

    return error;
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  asignar_psicoterapeuta.init();
});