var categoria_trastorno = function() {
  var $ = jQuery.noConflict();

  function initEvents() {
    getCategorias();

    /== evento para mostrar modal de agregar categoria de trastorno ==/
    $('#btn_nuevo_categoria_trastorno').on('click', function() {
      $('#modal_agregar_editar_categoria_trastorno').modal('show');
      $('#modal_agregar_editar_categoria_trastorno').find('.modal-title').text('Agregar Categoría de Trastornos del MSD-5');
      $('#btn_agregar_categoria_trastorno').text('Agregar');
      limpiarCampos();
    });

    /== evento para cerrar modal de agregar categoria de trastorno ==/
    $('#btn_cerrar_modal_categoria_trastorno').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_categoria_trastorno').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar categoria de trastorno ==/
    $('#btn_cancelar_modal_categoria_trastorno').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_categoria_trastorno').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un categoria de trastorno ==/
    $('#btn_agregar_categoria_trastorno').on('click', function() {
      var id = $('#id_categoria_trastorno').val();
      var estado = $('#estado_categoria_trastorno').is(":checked");
      var nombre = $('#nombre_categoria_trastorno').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (nombre == '' || nombre == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Debe de escribir una Categoría de Trastorno', 'error');
      } else {
        $.ajax({
          url: "/categoria_trastorno/agregar_categoria_trastorno",
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
                getCategorias();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_categoria_trastorno').modal('hide');
                $('#id_categoria_trastorno').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos de la Categoría seleccionada",
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

    /== evento para llenar los campos del modal editar categoria de trastorno ==/
    $('#btn_editar_categoria_trastorno').on('click', function() {
      $('#modal_agregar_editar_categoria_trastorno').modal('show');
      $('#modal_agregar_editar_categoria_trastorno').find('.modal-title').text('Editar Categoría de Trastorno del MSD-5');
      $('#btn_agregar_categoria_trastorno').text('Editar');
      let id = $('#id_categoria_trastorno').val();

      $.ajax({
        url: "/categoria_trastorno/get_categoria_trastorno",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_categoria_trastorno').val(response.nombre);

          if (response.estado == 'HABILITADO') {
            $('#estado_categoria_trastorno').prop('checked', true);
          } else {
            $('#estado_categoria_trastorno').prop('checked', false);
          }
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un categoria de trastorno ==/
    $('#btn_eliminar_categoria_trastorno').on('click', function() {
      let id = $('#id_categoria_trastorno').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar esta Categoría?',
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
          eliminarCategoriaTrastorno(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de esta Categoría',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_categoria_trastorno').val('');
            location.reload();
          });
        }        
      });
    });
  }

  /== funcion para obtener todos los categoria de trastorno ==/
  function getCategorias() {
    $.ajax({
      url: "/categoria_trastorno/lista_categoria_trastorno",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarCategorias(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de categoria de trastorno ==/
  function listarCategorias(datos) {
    let tabla = new DataTable('#tabla_categorias_trastorno', {
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
        $('#dropdown_acciones_listado_categoria_trastorno').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_categoria_trastorno').css('display', 'block');
        $('#dropdown_acciones_listado_categoria_trastorno').css('display', 'none');
        $('#id_categoria_trastorno').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_categoria_trastorno').css('display', 'none');
        $('#dropdown_acciones_listado_categoria_trastorno').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_categoria_trastorno').val(data.id);
      }
    });
  }

  /== funcion para eliminar un categoria de trastorno ==/
  function eliminarCategoriaTrastorno(id) {
    $.ajax({
      url: "/categoria_trastorno/eliminar_categoria_trastorno",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_categoria_trastorno').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminada correctamente la Categoría seleccionada",
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

  /== funcion para limpiar los campos del modal categoria de trastorno ==/
  function limpiarCampos() {
    $('#id_categoria_trastorno').val('');
    $('#nombre_categoria_trastorno').val('');
    $("#estado_categoria_trastorno").prop("checked", false);
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  categoria_trastorno.init();
});