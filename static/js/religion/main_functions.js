var religion = function() {
  var $ = jQuery.noConflict();

  function initEvents() {
    getReligiones();

    /== evento para mostrar modal de agregar religion ==/
    $('#btn_nuevo_religion').on('click', function() {
      $('#modal_agregar_editar_religion').modal('show');
      $('#btn_agregar_religion').text('Agregar');
      limpiarCampos();
    });

    /== evento para cerrar modal de agregar religion ==/
    $('#btn_cerrar_modal_religion').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_religion').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar religion ==/
    $('#btn_cancelar_modal_religion').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_religion').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un religion ==/
    $('#btn_agregar_religion').on('click', function() {
      var id = $('#id_religion').val();
      var estado = $('#estado_religion').is(":checked");
      var nombre = $('#nombre_religion').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (nombre == '' || nombre == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El nombre de la Religión es obligatorio', 'error');
      } else {
        $.ajax({
          url: "/religion/agregar_religion",
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
                getReligiones();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_religion').modal('hide');
                $('#id_religion').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos de la religión seleccionada",
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

    /== evento para llenar los campos del modal editar religion ==/
    $('#btn_editar_religion').on('click', function() {
      $('#modal_agregar_editar_religion').modal('show');
      $('#modal_agregar_editar_religion').find('.modal-title').text('Editar Religión');
      $('#btn_agregar_religion').text('Editar');
      let id = $('#id_religion').val();

      $.ajax({
        url: "/religion/get_religion",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_religion').val(response.nombre);

          if (response.estado == 'HABILITADO') {
            $('#estado_religion').prop('checked', true);
          } else {
            $('#estado_religion').prop('checked', false);
          }
        },
        error: function(response) {}
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar una religion ==/
    $('#btn_eliminar_religion').on('click', function() {
      let id = $('#id_religion').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar esta Religión?',
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
          eliminarReligion(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de esta Religión',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_religion').val('');
            location.reload();
          });
        }        
      });
    });
  }

  /== funcion para obtener todos los religiones ==/
  function getReligiones() {
    $.ajax({
      url: "/religion/lista_religion",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarReligiones(response);
      },
      error: function(response) {}
    });
  }

  /== funcion para crear el listado de religiones ==/
  function listarReligiones(datos) {
    let tabla = new DataTable('#tabla_religiones', {
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
        $('#dropdown_acciones_listado_religion').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_religion').css('display', 'block');
        $('#dropdown_acciones_listado_religion').css('display', 'none');
        $('#id_religion').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_religion').css('display', 'none');
        $('#dropdown_acciones_listado_religion').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_religion').val(data.id);
      }
    });
  }

  /== funcion para eliminar un religion ==/
  function eliminarReligion(id) {
    $.ajax({
      url: "/religion/eliminar_religion",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_religion').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminada correctamente la Religión seleccionada",
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

  /== funcion para limpiar los campos del modal religion ==/
  function limpiarCampos() {
    $('#id_religion').val('');
    $('#nombre_religion').val('');
    $("#estado_religion").prop("checked", false);
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  religion.init();
});