var rol = function () {
  var $ = jQuery.noConflict();

  function initEvents() {
    getRoles();

    /== evento para mostrar modal de agregar rol ==/
    $('#btn_nuevo_rol').on('click', function() {
      $('#modal_agregar_editar_rol').modal('show');
      $('#modal_agregar_editar_rol').find('.modal-title').text('Agregar Rol');
      $('#btn_agregar_rol').text('Agregar');
      limpiarCampos();
    });

    /== evento para cerrar modal de agregar rol ==/
    $('#btn_cerrar_modal_rol').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_rol').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar rol ==/
    $('#btn_cancelar_modal_rol').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_rol').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un rol ==/
    $('#btn_agregar_rol').on('click', function() {
      var id = $('#id_rol').val();
      var nombre = $('#nombre_rol').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (nombre == '' || nombre == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El nombre del Rol es obligatorio', 'error');
      } else {
        $.ajax({
          url: "/rol/agregar_rol",
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
                getRoles();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_rol').modal('hide');
                $('#id_rol').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Rol seleccionado",
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

    /== evento para llenar los campos del modal editar rol ==/
    $('#btn_editar_rol').on('click', function() {
      $('#modal_agregar_editar_rol').modal('show');
      $('#modal_agregar_editar_rol').find('.modal-title').text('Editar Rol');
      $('#btn_agregar_rol').text('Editar');
      let id = $('#id_rol').val();

      $.ajax({
        url: "/rol/get_rol",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_rol').val(response.nombre);
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un tipo de atencion ==/
    $('#btn_eliminar_rol').on('click', function() {
      let id = $('#id_rol').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Rol?',
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
          eliminarRol(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Rol',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_rol').val('');
            location.reload();
          });
        }        
      });
    });    
  }

  /== funcion para obtener todos los roles ==/
  function getRoles() {
    $.ajax({
      url: "/rol/lista_rol",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarRoles(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de roles ==/
  function listarRoles(datos) {
    let tabla = new DataTable('#tabla_roles', {
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
        $('#dropdown_acciones_listado_rol').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_rol').css('display', 'block');
        $('#dropdown_acciones_listado_rol').css('display', 'none');
        $('#id_rol').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_rol').css('display', 'none');
        $('#dropdown_acciones_listado_rol').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_rol').val(data.id);
      }
    });
  }

  /== funcion para eliminar un rol ==/
  function eliminarRol(id) {
    $.ajax({
      url: "/rol/eliminar_rol",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_rol').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Rol seleccionado",
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

  /== funcion para limpiar los campos del modal rol ==/
  function limpiarCampos() {
    $('#id_rol').val('');
    $('#nombre_rol').val('');
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  rol.init();
});