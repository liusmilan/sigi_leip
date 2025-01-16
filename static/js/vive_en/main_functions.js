var vive_en = function() {
  var $ = jQuery.noConflict();

  function initEvents() {
    getViviendas();

    /== evento para mostrar modal de agregar vive en ==/
    $('#btn_nuevo_vive_en').on('click', function() {
      $('#modal_agregar_editar_vive_en').modal('show');
      $('#modal_agregar_editar_vive_en').find('.modal-title').text('Agregar Datos de Vivienda');
      $('#btn_agregar_vive_en').text('Agregar');
      limpiarCampos();
    });

    /== evento para cerrar modal de agregar vive en ==/
    $('#btn_cerrar_modal_vive_en').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_vive_en').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar vive en ==/
    $('#btn_cancelar_modal_vive_en').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_vive_en').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un vive en ==/
    $('#btn_agregar_vive_en').on('click', function() {
      var id = $('#id_vive_en').val();
      var estado = $('#estado_vive_en').is(":checked");
      var vive_en = $('#nombre_vive_en').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (vive_en == '' || vive_en == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El campo Vive en, es obligatorio', 'error');
      } else {
        $.ajax({
          url: "/vive_en/agregar_vive_en",
          data: {
            id: id ? id : '',
            estado: estado,
            vive_en: vive_en
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              if (response.accion == 'agregar') {
                notificacion('', response.mensaje, response.tipo_mensaje);
                btn.html(textOriginalBtn);
                limpiarCampos();
                getViviendas();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_vive_en').modal('hide');
                $('#id_vive_en').val('');

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

    /== evento para llenar los campos del modal editar vive en ==/
    $('#btn_editar_vive_en').on('click', function() {
      $('#modal_agregar_editar_vive_en').modal('show');
      $('#modal_agregar_editar_vive_en').find('.modal-title').text('Editar Datos de Vivienda');
      $('#btn_agregar_vive_en').text('Editar');
      let id = $('#id_vive_en').val();

      $.ajax({
        url: "/vive_en/get_vive_en",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_vive_en').val(response.vive_en);

          if (response.estado == 'HABILITADO') {
            $('#estado_vive_en').prop('checked', true);
          } else {
            $('#estado_vive_en').prop('checked', false);
          }
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar vive en ==/
    $('#btn_eliminar_vive_en').on('click', function() {
      let id = $('#id_vive_en').val();

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
          eliminarVivienda(id);
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
            $('#id_vive_en').val('');
            location.reload();
          });
        }        
      });
    });
  }
  
  /== funcion para obtener todos las viviendas ==/
  function getViviendas() {
    $.ajax({
      url: "/vive_en/lista_vive_en",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarViviendas(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de viviendas ==/
  function listarViviendas(datos) {
    let tabla = new DataTable('#tabla_viviendas', {
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
        { data: 'vive_en' },
        { data: 'estado' }
      ],
      initComplete: function() {
        $('#dropdown_acciones_listado_vive_en').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_vive_en').css('display', 'block');
        $('#dropdown_acciones_listado_vive_en').css('display', 'none');
        $('#id_vive_en').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_vive_en').css('display', 'none');
        $('#dropdown_acciones_listado_vive_en').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_vive_en').val(data.id);
      }
    });
  }

  /== funcion para eliminar una vivienda ==/
  function eliminarVivienda(id) {
    $.ajax({
      url: "/vive_en/eliminar_vive_en",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_vive_en').val('');
          
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

  /== funcion para limpiar los campos del modal vive en ==/
  function limpiarCampos() {
    $('#id_vive_en').val('');
    $('#nombre_vive_en').val('');
    $("#estado_vive_en").prop("checked", false);
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  vive_en.init();
});