var estado_civil = function() {
  var $ = jQuery.noConflict();

  function initEvents() {
    getEstadosCiviles();

    /== evento para mostrar modal de agregar estado_civil ==/
    $('#btn_nuevo_estado_civil').on('click', function() {
      $('#modal_agregar_editar_estado_civil').modal('show');
      $('#btn_agregar_estado_civil').text('Agregar');
      limpiarCampos();
    });

    /== evento para cerrar modal de agregar estado_civil ==/
    $('#btn_cerrar_modal_estado_civil').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_estado_civil').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar estado_civil ==/
    $('#btn_cancelar_modal_estado_civil').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_estado_civil').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un estado_civil ==/
    $('#btn_agregar_estado_civil').on('click', function() {
      var id = $('#id_estado_civil').val();
      var estado = $('#estado_estado_civil').is(":checked");
      var nombre = $('#nombre_estado_civil').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (nombre == '' || nombre == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El nombre del Estado Civil es obligatorio', 'error');
      } else {
        $.ajax({
          url: "/estado_civil/agregar_estado_civil",
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
                getEstadosCiviles();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_estado_civil').modal('hide');
                $('#id_estado_civil').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Estado Civil seleccionada",
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

    /== evento para llenar los campos del modal editar estado_civil ==/
    $('#btn_editar_estado_civil').on('click', function() {
      $('#modal_agregar_editar_estado_civil').modal('show');
      $('#modal_agregar_editar_estado_civil').find('.modal-title').text('Editar Estado Civil');
      $('#btn_agregar_estado_civil').text('Editar');
      let id = $('#id_estado_civil').val();

      $.ajax({
        url: "/estado_civil/get_estado_civil",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_estado_civil').val(response.nombre);

          if (response.estado == 'HABILITADO') {
            $('#estado_estado_civil').prop('checked', true);
          } else {
            $('#estado_estado_civil').prop('checked', false);
          }
        },
        error: function(response) {}
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un estado_civil ==/
    $('#btn_eliminar_estado_civil').on('click', function() {
      let id = $('#id_estado_civil').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Estado Civil?',
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
          eliminarEstadoCivil(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Estado Civil',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_estado_civil').val('');
            location.reload();
          });
        }        
      });
    });
  }

  /== funcion para obtener todos los estados civiles ==/
  function getEstadosCiviles() {
    $.ajax({
      url: "/estado_civil/lista_estado_civil",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarEstadosCiviles(response);
      },
      error: function(response) {}
    });
  }

  /== funcion para crear el listado de estados civiles ==/
  function listarEstadosCiviles(datos) {
    let tabla = new DataTable('#tabla_estados_civiles', {
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
        $('#dropdown_acciones_listado_estado_civil').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_estado_civil').css('display', 'block');
        $('#dropdown_acciones_listado_estado_civil').css('display', 'none');
        $('#id_estado_civil').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_estado_civil').css('display', 'none');
        $('#dropdown_acciones_listado_estado_civil').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_estado_civil').val(data.id);
      }
    });
  }

  /== funcion para eliminar un estado_civil ==/
  function eliminarEstadoCivil(id) {
    $.ajax({
      url: "/estado_civil/eliminar_estado_civil",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_estado_civil').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Estado Civil seleccionado",
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
      error: function(response) {}
    });            
  }

  /== funcion para limpiar los campos del modal estado civil ==/
  function limpiarCampos() {
    $('#id_estado_civil').val('');
    $('#nombre_estado_civil').val('');
    $("#estado_estado_civil").prop("checked", false);
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  estado_civil.init();
});