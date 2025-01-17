var vive_con = function() {
  var $ = jQuery.noConflict();

  function initEvents() {
    getConvivencias();

    /== evento para mostrar modal de agregar vive con ==/
    $('#btn_nuevo_vive_con').on('click', function() {
      $('#modal_agregar_editar_vive_con').modal('show');
      $('#modal_agregar_editar_vive_con').find('.modal-title').text('Agregar Datos de Convivencia');
      $('#btn_agregar_vive_con').text('Agregar');
      limpiarCampos();
    });

    /== evento para cerrar modal de agregar vive con ==/
    $('#btn_cerrar_modal_vive_con').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_vive_con').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar vive con ==/
    $('#btn_cancelar_modal_vive_con').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_vive_con').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un vive con ==/
    $('#btn_agregar_vive_con').on('click', function() {
      var id = $('#id_vive_con').val();
      var estado = $('#estado_vive_con').is(":checked");
      var vive_con = $('#nombre_vive_con').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (vive_con == '' || vive_con == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El campo Vive con, es obligatorio', 'error');
      } else {
        $.ajax({
          url: "/vive_con/agregar_vive_con",
          data: {
            id: id ? id : '',
            estado: estado,
            vive_con: vive_con
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              if (response.accion == 'agregar') {
                notificacion('', response.mensaje, response.tipo_mensaje);
                btn.html(textOriginalBtn);
                limpiarCampos();
                getConvivencias();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_vive_con').modal('hide');
                $('#id_vive_con').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos.",
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

    /== evento para llenar los campos del modal editar vive con ==/
    $('#btn_editar_vive_con').on('click', function() {
      $('#modal_agregar_editar_vive_con').modal('show');
      $('#modal_agregar_editar_vive_con').find('.modal-title').text('Editar Datos de Convivencia');
      $('#btn_agregar_vive_con').text('Editar');
      let id = $('#id_vive_con').val();

      $.ajax({
        url: "/vive_con/get_vive_con",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_vive_con').val(response.vive_con);

          if (response.estado == 'HABILITADO') {
            $('#estado_vive_con').prop('checked', true);
          } else {
            $('#estado_vive_con').prop('checked', false);
          }
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar vive con ==/
    $('#btn_eliminar_vive_con').on('click', function() {
      let id = $('#id_vive_con').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar estos datos?',
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
          eliminarConvivencia(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de estos datos',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_vive_con').val('');
            location.reload();
          });
        }        
      });
    });
  }
  
  /== funcion para obtener todos las convivencias ==/
  function getConvivencias() {
    $.ajax({
      url: "/vive_con/lista_vive_con",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarConvivencias(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de convivencias ==/
  function listarConvivencias(datos) {
    let tabla = new DataTable('#tabla_convivencias', {
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
        { data: 'vive_con' },
        { data: 'estado' }
      ],
      initComplete: function() {
        $('#dropdown_acciones_listado_vive_con').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_vive_con').css('display', 'block');
        $('#dropdown_acciones_listado_vive_con').css('display', 'none');
        $('#id_vive_con').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_vive_con').css('display', 'none');
        $('#dropdown_acciones_listado_vive_con').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_vive_con').val(data.id);
      }
    });
  }

  /== funcion para eliminar una convivencia ==/
  function eliminarConvivencia(id) {
    $.ajax({
      url: "/vive_con/eliminar_vive_con",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_vive_con').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el dato seleccionado",
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

  /== funcion para limpiar los campos del modal vive con ==/
  function limpiarCampos() {
    $('#id_vive_con').val('');
    $('#nombre_vive_con').val('');
    $("#estado_vive_con").prop("checked", false);
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  vive_con.init();
});