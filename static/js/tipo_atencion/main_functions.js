var tipo_atencion = function() {
  var $ = jQuery.noConflict();

  function initEvents() {
    getTiposAtencion();

    /== evento para mostrar modal de agregar tipo de atencion ==/
    $('#btn_nuevo_tipo_atencion').on('click', function() {
      $('#modal_agregar_editar_tipo_atencion').modal('show');
      $('#modal_agregar_editar_tipo_atencion').find('.modal-title').text('Agregar Tipo de Atención');
      $('#btn_agregar_tipo_atencion').text('Agregar');
      $("input[type='radio'][name=inlineRadioOptions]").prop('checked', false);
      limpiarCampos();
    });

    /== evento para cerrar modal de agregar tipo de atencion ==/
    $('#btn_cerrar_modal_tipo_atencion').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_tipo_atencion').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar tipo de atencion ==/
    $('#btn_cancelar_modal_tipo_atencion').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_tipo_atencion').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un tipo de atencion ==/
    $('#btn_agregar_tipo_atencion').on('click', function() {
      var id = $('#id_tipo_atencion').val();
      var estado = $('#estado_tipo_atencion').is(":checked");
      var nombre = $('#nombre_tipo_atencion').val();
      var categoria = devolverCategoria();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (nombre == '' || nombre == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El nombre del Tipo de Atención es obligatorio', 'error');
      } else if (categoria == '') {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Debe de seleccionar una Categoría', 'error');
      } else {
        $.ajax({
          url: "/tipo_atencion/agregar_tipo_atencion",
          data: {
            id: id ? id : '',
            estado: estado,
            categoria: categoria,
            nombre: nombre
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              if (response.accion == 'agregar') {
                notificacion('', response.mensaje, response.tipo_mensaje);
                btn.html(textOriginalBtn);
                limpiarCampos();
                getTiposAtencion();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_tipo_atencion').modal('hide');
                $('#id_tipo_atencion').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Tipo de Atención seleccionado",
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

    /== evento para llenar los campos del modal editar tipo de atencion ==/
    $('#btn_editar_tipo_atencion').on('click', function() {
      $('#modal_agregar_editar_tipo_atencion').modal('show');
      $('#modal_agregar_editar_tipo_atencion').find('.modal-title').text('Editar Tipo de Atención');
      $('#btn_agregar_tipo_atencion').text('Editar');
      let id = $('#id_tipo_atencion').val();

      $.ajax({
        url: "/tipo_atencion/get_tipo_atencion",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_tipo_atencion').val(response.nombre);

          if (response.categoria == 'Derivar') {
            $('#check_derivar').prop('checked', true);
          } else if (response.categoria == 'Taller') {
            $('#check_taller').prop('checked', true);
          } else if (response.categoria == 'Otro') {
            $('#check_otro').prop('checked', true);
          }

          if (response.estado == 'HABILITADO') {
            $('#estado_tipo_atencion').prop('checked', true);
          } else {
            $('#estado_tipo_atencion').prop('checked', false);
          }
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un tipo de atencion ==/
    $('#btn_eliminar_tipo_atencion').on('click', function() {
      let id = $('#id_tipo_atencion').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Tipo de Atención?',
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
          eliminarTipoAtencion(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Tipo de Atención',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_tipo_atencion').val('');
            location.reload();
          });
        }        
      });
    });
  }
  
  /== funcion para obtener todos los tipos de atencion ==/
  function getTiposAtencion() {
    $.ajax({
      url: "/tipo_atencion/lista_tipo_atencion",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarTiposAtencion(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de tipos de atencion ==/
  function listarTiposAtencion(datos) {
    // if ($.fn.DataTable.isDataTable('#tabla_tipos_atencion')) {
    //   $('#tabla_tipos_atencion').DataTable().destroy();
    // }

    let tabla = new DataTable('#tabla_tipos_atencion', {
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
        { data: 'categoria'},
        { data: 'estado' }
      ],
      initComplete: function() {
        $('#dropdown_acciones_listado_tipo_atencion').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_tipo_atencion').css('display', 'block');
        $('#dropdown_acciones_listado_tipo_atencion').css('display', 'none');
        $('#id_tipo_atencion').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_tipo_atencion').css('display', 'none');
        $('#dropdown_acciones_listado_tipo_atencion').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_tipo_atencion').val(data.id);
      }
    });
  }

  /== funcion para eliminar un tipo de atencion ==/
  function eliminarTipoAtencion(id) {
    $.ajax({
      url: "/tipo_atencion/eliminar_tipo_atencion",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_tipo_atencion').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Tipo de Atención seleccionado",
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

  /== funcion para limpiar los campos del modal tipos de atencion ==/
  function limpiarCampos() {
    $('#id_tipo_atencion').val('');
    $('#nombre_tipo_atencion').val('');
    $("#estado_tipo_atencion").prop("checked", false);
    $("input[type='radio'][name=inlineRadioOptions]").prop('checked', false);
  }

  /== funcion para devolver categoria ==/
  function devolverCategoria() {
    var derivar = $('#check_derivar').is(":checked");
    var taller = $('#check_taller').is(":checked");
    var otro = $('#check_otro').is(":checked");
    var categoria = '';

    if (derivar == true) {
      categoria = 'Derivar';
    } else if (taller == true) {
      categoria = 'Taller';
    } else if (otro == true) {
      categoria = 'Otro';
    }

    return categoria
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  tipo_atencion.init();
});