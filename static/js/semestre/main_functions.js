var semestre = function() {
  var $ = jQuery.noConflict();

  function initEvents() {
    getSemestres();

    /== evento para mostrar modal de agregar semestre ==/
    $('#btn_nuevo_semestre').on('click', function() {
      $('#modal_agregar_editar_semestre').modal('show');
      $('#modal_agregar_editar_semestre').find('.modal-title').text('Agregar Semestre');
      $('#btn_agregar_semestre').text('Agregar');
      limpiarCampos();
    });

    /== evento para cerrar modal de agregar semestre ==/
    $('#btn_cerrar_modal_semestre').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_semestre').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar semestre ==/
    $('#btn_cancelar_modal_semestre').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_semestre').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un semestre ==/
    $('#btn_agregar_semestre').on('click', function() {
      var id = $('#id_semestre').val();
      var estado = $('#estado_semestre').is(":checked");
      var nombre = $('#nombre_semestre').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (nombre == '' || nombre == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El nombre del Semestre es obligatorio', 'error');
      } else {
        $.ajax({
          url: "/semestre/agregar_semestre",
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
                getSemestres();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_semestre').modal('hide');
                $('#id_semestre').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Semestre seleccionado",
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

    /== evento para llenar los campos del modal editar semestre ==/
    $('#btn_editar_semestre').on('click', function() {
      $('#modal_agregar_editar_semestre').modal('show');
      $('#modal_agregar_editar_semestre').find('.modal-title').text('Editar Semestre');
      $('#btn_agregar_semestre').text('Editar');
      let id = $('#id_semestre').val();

      $.ajax({
        url: "/semestre/get_semestre",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_semestre').val(response.nombre);

          if (response.estado == 'HABILITADO') {
            $('#estado_semestre').prop('checked', true);
          } else {
            $('#estado_semestre').prop('checked', false);
          }
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un semestre ==/
    $('#btn_eliminar_semestre').on('click', function() {
      let id = $('#id_semestre').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Semestre?',
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
          eliminarSemestre(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Semestre',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_semestre').val('');
            location.reload();
          });
        }        
      });
    });
  }

  /== funcion para obtener todos los semestres ==/
  function getSemestres() {
    $.ajax({
      url: "/semestre/lista_semestre",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarSemestres(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de semestres ==/
  function listarSemestres(datos) {
    let tabla = new DataTable('#tabla_semestres', {
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
        $('#dropdown_acciones_listado_semestre').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_semestre').css('display', 'block');
        $('#dropdown_acciones_listado_semestre').css('display', 'none');
        $('#id_semestre').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_semestre').css('display', 'none');
        $('#dropdown_acciones_listado_semestre').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_semestre').val(data.id);
      }
    });
  }

  /== funcion para eliminar un semestre ==/
  function eliminarSemestre(id) {
    $.ajax({
      url: "/semestre/eliminar_semestre",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_semestre').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Semestre seleccionado",
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

  /== funcion para limpiar los campos del modal semestre ==/
  function limpiarCampos() {
    $('#id_semestre').val('');
    $('#nombre_semestre').val('');
    $("#estado_semestre").prop("checked", false);
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  semestre.init();
});