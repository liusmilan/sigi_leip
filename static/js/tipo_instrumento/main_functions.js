var tipo_instrumento_psicologico = function() {
  var $ = jQuery.noConflict();

  function initEvents() {
    getTiposInstrumentos();

    /== evento para mostrar modal de agregar tipo de instrumento ==/
    $('#btn_nuevo_tipo_instrumento').on('click', function() {
      $('#modal_agregar_editar_tipo_instrumento').modal('show');
      $('#modal_agregar_editar_tipo_instrumento').find('.modal-title').text('Agregar Tipo de Instrumento Psicológico');
      $('#btn_agregar_tipo_instrumento').text('Agregar');
      limpiarCampos();
    });

    /== evento para cerrar modal de agregar tipo de instrumento ==/
    $('#btn_cerrar_modal_tipo_instrumento').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_tipo_instrumento').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar tipo de instrumento ==/
    $('#btn_cancelar_modal_tipo_instrumento').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_tipo_instrumento').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un tipo de instrumento ==/
    $('#btn_agregar_tipo_instrumento').on('click', function() {
      var id = $('#id_tipo_instrumento').val();
      var estado = $('#estado_tipo_instrumento').is(":checked");
      var nombre = $('#nombre_tipo_instrumento').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (nombre == '' || nombre == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El nombre del Tipo de Instrumento Psicológico es obligatorio', 'error');
      } else {
        $.ajax({
          url: "/tipo_instrumento/agregar_tipo_instrumento",
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
                getTiposInstrumentos();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_tipo_instrumento').modal('hide');
                $('#id_tipo_instrumento').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Tipo de Instrumento Psicológico seleccionado",
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

    /== evento para llenar los campos del modal editar tipo de instrumento ==/
    $('#btn_editar_tipo_instrumento').on('click', function() {
      $('#modal_agregar_editar_tipo_instrumento').modal('show');
      $('#modal_agregar_editar_tipo_instrumento').find('.modal-title').text('Editar Tipo de Instrumento Psicológico');
      $('#btn_agregar_tipo_instrumento').text('Editar');
      let id = $('#id_tipo_instrumento').val();

      $.ajax({
        url: "/tipo_instrumento/get_tipo_instrumento",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_tipo_instrumento').val(response.nombre);

          if (response.estado == 'HABILITADO') {
            $('#estado_tipo_instrumento').prop('checked', true);
          } else {
            $('#estado_tipo_instrumento').prop('checked', false);
          }
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un tipo de instrumento ==/
    $('#btn_eliminar_tipo_instrumento').on('click', function() {
      let id = $('#id_tipo_instrumento').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Tipo de Instrumento Psicolóigco?',
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
          eliminarTipoInstrumento(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Tipo de Instrumento Psicolóigco',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_tipo_instrumento').val('');
            location.reload();
          });
        }        
      });
    });    
  }

  /== funcion para obtener todos los tipos de instrumentos ==/
  function getTiposInstrumentos() {
    $.ajax({
      url: "/tipo_instrumento/lista_tipo_instrumento",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarTiposInstrumentos(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de tipos de instrumentos ==/
  function listarTiposInstrumentos(datos) {
    let tabla = new DataTable('#tabla_tipos_instrumento', {
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
        $('#dropdown_acciones_listado_tipo_instrumento').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_tipo_instrumento').css('display', 'block');
        $('#dropdown_acciones_listado_tipo_instrumento').css('display', 'none');
        $('#id_tipo_instrumento').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_tipo_instrumento').css('display', 'none');
        $('#dropdown_acciones_listado_tipo_instrumento').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_tipo_instrumento').val(data.id);
      }
    });
  }

  /== funcion para eliminar un tipo de instrumento ==/
  function eliminarTipoInstrumento(id) {
    $.ajax({
      url: "/tipo_instrumento/eliminar_tipo_instrumento",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_tipo_instrumento').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Tipo de Instrumento Psicológico seleccionado",
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

  /== funcion para limpiar los campos del modal tipos de instrumento ==/
  function limpiarCampos() {
    $('#id_tipo_instrumento').val('');
    $('#nombre_tipo_instrumento').val('');
    $("#estado_tipo_instrumento").prop("checked", false);
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  tipo_instrumento_psicologico.init();
});