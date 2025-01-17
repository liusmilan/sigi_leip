var grado_academico = function() {
  var $ = jQuery.noConflict();

  function initEvents() {
    getGradosAcademicos();

    /== evento para mostrar modal de agregar grado academico ==/
    $('#btn_nuevo_grado_academico').on('click', function() {
      $('#modal_agregar_editar_grado_academico').modal('show');
      $('#modal_agregar_editar_grado_academico').find('.modal-title').text('Agregar Grado Académico');
      $('#btn_agregar_grado_academico').text('Agregar');
      limpiarCampos();
    });

    /== evento para cerrar modal de agregar grado academico ==/
    $('#btn_cerrar_modal_grado_academico').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_grado_academico').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar grado academico ==/
    $('#btn_cancelar_modal_grado_academico').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_grado_academico').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un grado academico ==/
    $('#btn_agregar_grado_academico').on('click', function() {
      var id = $('#id_grado_academico').val();
      var estado = $('#estado_grado_academico').is(":checked");
      var nombre = $('#nombre_grado_academico').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (nombre == '' || nombre == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El nombre del Grado Académico es obligatorio', 'error');
      } else {
        $.ajax({
          url: "/grado_academico/agregar_grado_academico",
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
                getGradosAcademicos();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_grado_academico').modal('hide');
                $('#id_grado_academico').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Grado Académico seleccionado",
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

    /== evento para llenar los campos del modal editar grado academico ==/
    $('#btn_editar_grado_academico').on('click', function() {
      $('#modal_agregar_editar_grado_academico').modal('show');
      $('#modal_agregar_editar_grado_academico').find('.modal-title').text('Editar Grado Académico');
      $('#btn_agregar_grado_academico').text('Editar');
      let id = $('#id_grado_academico').val();

      $.ajax({
        url: "/grado_academico/get_grado_academico",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_grado_academico').val(response.nombre);

          if (response.estado == 'HABILITADO') {
            $('#estado_grado_academico').prop('checked', true);
          } else {
            $('#estado_grado_academico').prop('checked', false);
          }
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un grado academico ==/
    $('#btn_eliminar_grado_academico').on('click', function() {
      let id = $('#id_grado_academico').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Grado Académico?',
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
          eliminarGradoAcademico(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Grado Académico',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_grado_academico').val('');
            location.reload();
          });
        }        
      });
    });
  }

  /== funcion para obtener todos los grados academicos ==/
  function getGradosAcademicos() {
    $.ajax({
      url: "/grado_academico/lista_grado_academico",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarGradosAcademicos(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de grados academicos ==/
  function listarGradosAcademicos(datos) {
    let tabla = new DataTable('#tabla_grados_academicos', {
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
        $('#dropdown_acciones_listado_grado_academico').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_grado_academico').css('display', 'block');
        $('#dropdown_acciones_listado_grado_academico').css('display', 'none');
        $('#id_grado_academico').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_grado_academico').css('display', 'none');
        $('#dropdown_acciones_listado_grado_academico').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_grado_academico').val(data.id);
      }
    });
  }

  /== funcion para eliminar un grados academicos ==/
  function eliminarGradoAcademico(id) {
    $.ajax({
      url: "/grado_academico/eliminar_grado_academico",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_grado_academico').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Grado Académico seleccionado",
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

  /== funcion para limpiar los campos del modal grados academicos ==/
  function limpiarCampos() {
    $('#id_grado_academico').val('');
    $('#nombre_grado_academico').val('');
    $("#estado_grado_academico").prop("checked", false);
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  grado_academico.init();
});