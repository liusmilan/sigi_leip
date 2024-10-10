var seguimiento_atencion = function() {
  var $ = jQuery.noConflict();

  $('.fecha_seguimiento_atencion').datepicker({
    format: 'dd/mm/yyyy',
    language: 'es',
    todayHighlight: true
  });
  
  function initEvents() {
    /== evento para mostrar modal de seguimiento atencion ==/
    $('#btn_add_seguimiento_atencion').on('click', function() {
      var id_user_aut = $('#user_autenticado').val();

      $.ajax({
        url: "/estado_atencion/get_all_estados_atencion",
        type: "get",
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'success') {
            $('#modal_seguimiento_atencion').modal('show');
            $('#modal_seguimiento_atencion').find('.modal-title').text('Seguimiento de Atención');
            $('#btn_guardar_seguimiento_atencion').text('Guardar');
            devolverUsuarioAutenticado(id_user_aut);

            $('#estado_seguimiento').select2({
              dropdownParent: $('#modal_seguimiento_atencion .modal-body'),
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
        
            llenarSelectEstado(response.estados);
          } else {
            deseleccionarFilasTabla();
            notificacion('Error', 'No existen Estados de Atención registrados en el sistema. Por favor agregue al menos uno para registrar Seguimientos de Atención.', 'error');
          }
        },
        error: function(response) {}
      });
    });

    /== evento para cerrar modal de seguimiento atencion ==/
    $('#btn_cerrar_modal_seguimiento').on('click', function() {
      limpiarCampos();
      $('#modal_seguimiento_atencion').modal('hide');
      location.reload();
    });
    
    /== evento para cerrar modal de seguimiento atencion ==/
    $('#btn_cancelar_modal_seguimiento_atencion').on('click', function() {
      limpiarCampos();
      $('#modal_seguimiento_atencion').modal('hide');
      location.reload();
    });

    /== evento para guardar el seguimiento atencion ==/
    $('#btn_guardar_seguimiento_atencion').on('click', function() {
      var textOriginalBtn = '<span class="indicator-label"> Guardar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);
      var id_user_aut = $('#user_autenticado').val();
      var id_atencion = $('#id_atencion').val();
      var estado = $('#estado_seguimiento').val();
      var fecha = $('#fecha_seguimiento').val();
      var observaciones = $('#observaciones_seguimiento').val();
      
      if (validarCampos() == 'error') {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Existen campos obligatorios por llenar o seleccionar.', 'error');
      } else {
        $.ajax({
          url: "/seguimiento_atencion/agregar_seguimiento_atencion",
          data: {
            fecha: fecha,
            observaciones: observaciones,
            id_user_aut: id_user_aut,
            id_estado: estado,
            id_atencion: id_atencion
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              btn.html(textOriginalBtn);
              limpiarCampos();
              $('#modal_seguimiento_atencion').modal('hide');

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

  /== funcion para llenar el select de estados de atencion ==/
  function llenarSelectEstado(estados) {
    var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
    var optionEmpty = $("<option/>").val('-').text('-----------');
    $('#estado_seguimiento').find("option").end().append(optionSeleccione.attr('selected', true));
   
    $.each(estados, function (key, value) {
      var option = $("<option/>").val(value.id).text(value.nombre);
      $('#estado_seguimiento').find("option").end().append(option);
    });
    
    $('#estado_seguimiento').trigger("chosen:updated").trigger("change");
  }

  function devolverUsuarioAutenticado(id_user_aut) {
    $.ajax({
      url: "/usuario/get_usuario",
      type: "get",
      data: {
        id: id_user_aut
      },
      dataType: "json",
      success: function(response) {
        $('#persona_seguimiento').val(response.persona.nombre + (response.persona.segundo_nombre ? ' ' + response.persona.segundo_nombre + ' ' : ' ') + response.persona.apellido + (response.persona.segundo_apellido ? ' ' + response.persona.segundo_apellido : ' '));
      },
        error: function(response) {}
    });
  }

  function limpiarCampos() {
    $('#fecha_seguimiento').val('');
    $('#observaciones_seguimiento').val('');
    $.each($('#estado_seguimiento').find("option"), function (key, value) {
      $(value).remove();
    });

    llenarSelectEstado('');
  }

  function validarCampos() {
    var error = '';
    var estado_seguimiento = $('#estado_seguimiento').val();
    var fecha_seguimiento = $('#fecha_seguimiento').val();
    var observaciones_seguimiento = $('#observaciones_seguimiento').val();

    if ((estado_seguimiento == 'sel') || (estado_seguimiento == '-')) {
      error = 'error';
    } else if (fecha_seguimiento == '') {
      error = 'error';
    } else if (observaciones_seguimiento == '') {
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
  seguimiento_atencion.init();
});