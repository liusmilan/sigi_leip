var estado_atencion = function() {
  var $ = jQuery.noConflict();

  function initEvents() {
    getEstadosAtencion();

    /== evento para mostrar modal de agregar estado de atencion ==/
    $('#btn_nuevo_estado_atencion').on('click', function() {
      $('#modal_agregar_editar_estado_atencion').modal('show');
      $('#modal_agregar_editar_estado_atencion').find('.modal-title').text('Agregar Estado de Atención');
      $('#btn_agregar_estado_atencion').text('Agregar');
      limpiarCampos();
    });

    /== evento para cerrar modal de agregar estado de atencion ==/
    $('#btn_cerrar_modal_estado_atencion').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_estado_atencion').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar estado de atencion ==/
    $('#btn_cancelar_modal_estado_atencion').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_estado_atencion').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un estado de atencion ==/
    $('#btn_agregar_estado_atencion').on('click', function() {
      var id = $('#id_estado_atencion').val();
      var estado = $('#estado_estado_atencion').is(":checked");
      var nombre = $('#nombre_estado_atencion').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (nombre == '' || nombre == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El nombre del Estado de Atención es obligatorio', 'error');
      } else {
        $.ajax({
          url: "/estado_atencion/agregar_estado_atencion",
          data: {
            id: id ? id : '',
            estado: estado,
            nombre: nombre
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              if (response.accion == 'agregar') {
                notificacion('', response.mensaje, response.tipo_mensaje);
                btn.html(textOriginalBtn);
                limpiarCampos();
                getEstadosAtencion();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_estado_atencion').modal('hide');
                $('#id_estado_atencion').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Estado de Atención seleccionado",
                  type: "success",
                  showCancelButton: false,
                  confirmButtonClass: "btn-success",
                  confirmButtonText: "Aceptar",
                  closeOnConfirm: false
                },
                function() {
                  location.reload();
                });
              }              
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

    /== evento para llenar los campos del modal editar estado de atencion ==/
    $('#btn_editar_estado_atencion').on('click', function() {
      $('#modal_agregar_editar_estado_atencion').modal('show');
      $('#modal_agregar_editar_estado_atencion').find('.modal-title').text('Editar Estado de Atención');
      $('#btn_agregar_estado_atencion').text('Editar');
      let id = $('#id_estado_atencion').val();

      $.ajax({
        url: "/estado_atencion/get_estado_atencion",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_estado_atencion').val(response.nombre);

          if (response.estado == 'HABILITADO') {
            $('#estado_estado_atencion').prop('checked', true);
          } else {
            $('#estado_estado_atencion').prop('checked', false);
          }
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un estado de atencion ==/
    $('#btn_eliminar_estado_atencion').on('click', function() {
      let id = $('#id_estado_atencion').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Estado de Atención?',
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: false,
        closeOnCancel: false
      },
      function(isConfirm) {
        if (isConfirm) {
          eliminarEstadoAtencion(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Estado de Atención',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_estado_atencion').val('');
            location.reload();
          });
        }        
      });
    });
  }

  /== funcion para obtener todos los estados de atencion ==/
  function getEstadosAtencion() {
    $.ajax({
      url: "/estado_atencion/lista_estado_atencion",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarEstadosAtencion(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de estados de atencion ==/
  function listarEstadosAtencion(datos) {
    let tabla = new DataTable('#tabla_estados_atencion', {
      language: {
        "decimal": "",
        "emptyTable": "No hay información",
        "info": "Mostrando de _START_ a _END_ entradas de un total de _TOTAL_",
        "infoEmpty": "Mostrando de 0 a 0 de un total de 0 Entradas",
        "infoFiltered": "(Filtrado de _MAX_ total entradas)",
        "infoPOstFix": "",
        "thousands": ",",
        "lengthMenu": "Mostrar _MENU_ Entradas",
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "search": "Buscar",
        "zeroRecords": "No se encontraron resultados",
        "paginate": {
          "first": "Primero",
          "last": "Ultimo",
          "next": "Siguiente",
          "previous": "Anterior"
        }
      },
      deferRender: true,
      pageLength: 10,
      destroy: true,
      "aLengthMenu": [5, 10, 25, 50],
      order: [[0, 'desc']],
      data: datos,
      columns: [
        { data: 'nombre' },
        { data: 'estado' }
      ],
      initComplete: function() {
        $('#dropdown_acciones_listado_estado_atencion').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_estado_atencion').css('display', 'block');
        $('#dropdown_acciones_listado_estado_atencion').css('display', 'none');
        $('#id_estado_atencion').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_estado_atencion').css('display', 'none');
        $('#dropdown_acciones_listado_estado_atencion').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_estado_atencion').val(data.id);
      }
    });
  }

  /== funcion para eliminar un estado de atencion ==/
  function eliminarEstadoAtencion(id) {
    $.ajax({
      url: "/estado_atencion/eliminar_estado_atencion",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_estado_atencion').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Estado de Atención seleccionado",
            type: "success",
            showCancelButton: false,
            confirmButtonClass: "btn-success",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            location.reload();
          });
        } else {
          notificacion('Eliminación fallida', response.mensaje, response.tipo_mensaje);
        }
      },
      error: function(response) {

      }
    });            
  }

  /== funcion para limpiar los campos del modal estados de atencion ==/
  function limpiarCampos() {
    $('#id_estado_atencion').val('');
    $('#nombre_estado_atencion').val('');
    $("#estado_estado_atencion").prop("checked", false);
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  estado_atencion.init();
});