var tipo_persona_udg = function() {
  var $ = jQuery.noConflict();

  function initEvents() {
    getTipoPersonaUdg();

    /== evento para mostrar modal de agregar tipo de persona udg ==/
    $('#btn_nuevo_tipo_persona_udg').on('click', function() {
      $('#modal_agregar_tipo_persona_udg').modal('show');
      $('#modal_agregar_tipo_persona_udg').find('.modal-title').text('Agregar Tipo de Persona en UDG');
      $('#btn_agregar_tipo_persona_udg').text('Agregar');
      limpiarCampos();
    });

    /== evento para cerrar modal de agregar tipo de persona udg ==/
    $('#btn_cerrar_modal_tipo_persona_udg').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_tipo_persona_udg').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar tipo de persona udg ==/
    $('#btn_cancelar_modal_tipo_persona_udg').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_tipo_persona_udg').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un tipo de persona udg ==/
    $('#btn_agregar_tipo_persona_udg').on('click', function() {
      var id = $('#id_tipo_persona_udg').val();
      var estado = $('#estado_tipo_persona_udg').is(":checked");
      var nombre = $('#nombre_tipo_persona_udg').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (nombre == '' || nombre == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El nombre del Tipo de Persona es obligatorio', 'error');
      } else {
        $.ajax({
          url: "/tipo_persona_udg/agregar_tipo_persona_udg",
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
                getTipoPersonaUdg();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_tipo_persona_udg').modal('hide');
                $('#id_tipo_persona_udg').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Tipo de Persona seleccionado",
                  type: "success",
                  showCancelButton: false,
                  confirmButtonClass: "btn-success",
                  confirmButtonText: "Aceptar",
                  closeOnConfirm: true
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

    /== evento para llenar los campos del modal editar tipo de persona udg ==/
    $('#btn_editar_tipo_persona_udg').on('click', function() {
      $('#modal_agregar_tipo_persona_udg').modal('show');
      $('#modal_agregar_tipo_persona_udg').find('.modal-title').text('Editar Tipo de Persona en UDG');
      $('#btn_agregar_tipo_persona_udg').text('Editar');
      let id = $('#id_tipo_persona_udg').val();

      $.ajax({
        url: "/tipo_persona_udg/get_tipo_persona_udg",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_tipo_persona_udg').val(response.nombre);

          if (response.estado == 'HABILITADO') {
            $('#estado_tipo_persona_udg').prop('checked', true);
          } else {
            $('#estado_tipo_persona_udg').prop('checked', false);
          }
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un tipo de persona udg ==/
    $('#btn_eliminar_tipo_persona_udg').on('click', function() {
      let id = $('#id_tipo_persona_udg').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Tipo de Persona?',
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
          eliminarTipoPersonaUdg(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Tipo de Persona',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_tipo_persona_udg').val('');
            location.reload();
          });
        }        
      });
    });
  }


  /== funcion para obtener todos los tipos de persona udg ==/
  function getTipoPersonaUdg() {
    $.ajax({
      url: "/tipo_persona_udg/lista_tipo_persona_udg",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarTipoPersonaUdg(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de tipos de persona udg ==/
  function listarTipoPersonaUdg(datos) {
    let tabla = new DataTable('#tabla_tipo_persona_udg', {
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
        $('#dropdown_acciones_listado_tipo_persona_udg').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_tipo_persona_udg').css('display', 'block');
        $('#dropdown_acciones_listado_tipo_persona_udg').css('display', 'none');
        $('#id_tipo_persona_udg').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_tipo_persona_udg').css('display', 'none');
        $('#dropdown_acciones_listado_tipo_persona_udg').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_tipo_persona_udg').val(data.id);
      }
    });
  }

  /== funcion para eliminar un tipo de persona udg ==/
  function eliminarTipoPersonaUdg(id) {
    $.ajax({
      url: "/tipo_persona_udg/eliminar_tipo_persona_udg",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_tipo_persona_udg').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Tipo de Persona seleccionado",
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

  /== funcion para limpiar los campos del modal tipos de persona udg ==/
  function limpiarCampos() {
    $('#id_tipo_persona_udg').val('');
    $('#nombre_tipo_persona_udg').val('');
    $("#estado_tipo_persona_udg").prop("checked", false);
  }

  return {
   init: function() {
       initEvents();
   }
  };
}();

jQuery(function () {
  tipo_persona_udg.init();
});