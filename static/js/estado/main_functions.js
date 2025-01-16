var estados = function() {
  var $ = jQuery.noConflict();

  function initEvents() {
    getEstados();

    /== evento para mostrar modal de agregar estados ==/
    $('#btn_nuevo_estado').on('click', function() {
      $('#modal_agregar_editar_estado').modal('show');
      $('#modal_agregar_editar_estado').find('.modal-title').text('Agregar Estados');
      $('#btn_agregar_estado').text('Agregar');
      limpiarCampos();
    });

    /== evento para cerrar modal de agregar estados ==/
    $('#btn_cerrar_modal_estado').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_estado').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar estado ==/
    $('#btn_cancelar_modal_estado').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_estado').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un estado ==/
    $('#btn_agregar_estado').on('click', function() {
      var id = $('#id_estado').val();
      var nombre = $('#nombre_estado').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (nombre == '' || nombre == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El nombre del Estado es obligatorio', 'error');
      } else {
        $.ajax({
          url: "/estado/agregar_estado",
          data: {
            id: id ? id : '',
            nombre: nombre
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              if (response.accion == 'agregar') {
                notificacion('', response.mensaje, response.tipo_mensaje);
                btn.html(textOriginalBtn);
                limpiarCampos();
                getEstados();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_estado').modal('hide');
                $('#id_estado').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Estado seleccionado",
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

    /== evento para llenar los campos del modal editar estados ==/
    $('#btn_editar_estado').on('click', function() {
      $('#modal_agregar_editar_estado').modal('show');
      $('#modal_agregar_editar_estado').find('.modal-title').text('Editar Estado');
      $('#btn_agregar_estado').text('Editar');
      let id = $('#id_estado').val();

      $.ajax({
        url: "/estado/get_estado",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_estado').val(response.nombre);
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un estado ==/
    $('#btn_eliminar_estado').on('click', function() {
      let id = $('#id_estado').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Estado?',
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
          eliminarEstado(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Estado',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_estado').val('');
            location.reload();
          });
        }        
      });
    });
  }

  /== funcion para obtener todos los estados ==/
  function getEstados() {
    $.ajax({
      url: "/estado/lista_estado",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarEstados(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de estados ==/
  function listarEstados(datos) {
    let tabla = new DataTable('#tabla_estados', {
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
        { data: 'nombre' }
      ],
      initComplete: function() {
        $('#dropdown_acciones_listado_estado').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_estado').css('display', 'block');
        $('#dropdown_acciones_listado_estado').css('display', 'none');
        $('#id_estado').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_estado').css('display', 'none');
        $('#dropdown_acciones_listado_estado').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_estado').val(data.id);
      }
    });
  }

  /== funcion para eliminar un estado ==/
  function eliminarEstado(id) {
    $.ajax({
      url: "/estado/eliminar_estado",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_estado').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Estado seleccionado",
            type: "success",
            showCancelButton: false,
            confirmButtonClass: "btn-success",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            location.reload();
          });
        } else if (response.tipo_mensaje == 'error_mun_asociado') {
          $('#id_estado').val('');

          swal({
            text: response.mensaje,
            title: "Eliminación fallida",
            type: "error",
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

  /== funcion para limpiar los campos del modal estados ==/
  function limpiarCampos() {
    $('#id_estado').val('');
    $('#nombre_estado').val('');
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  estados.init();
});