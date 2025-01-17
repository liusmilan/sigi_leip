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
      getTiposAtencion();
    });

    /== evento para cerrar modal de agregar tipo de atencion ==/
    $('#btn_cancelar_modal_tipo_atencion').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_tipo_atencion').modal('hide');
      getTiposAtencion();
    });

    /== evento para agregar o editar un tipo de atencion ==/
    $('#btn_agregar_tipo_atencion').on('click', function() {
      var id = $('#id_tipo_atencion').val();
      var estado = $('#estado_tipo_atencion').is(":checked");
      var nombre = $('#nombre_tipo_atencion').val();
      var derivar = $('#check_derivar_ta').is(":checked") ? true : false;
      var taller = $('#check_taller_ta').is(":checked") ? true : false;
      var consulta = $('#check_consulta_ta').is(":checked") ? true : false;
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      var params = {
        id: id ? id : '',
        estado: estado,
        nombre: nombre,
        derivar: derivar,
        taller: taller,
        consulta: consulta
      }

      if (nombre == '' || nombre == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El nombre del Tipo de Atención es obligatorio', 'error');
      } else if (!validarCheckboxes()) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Debe de seleccionar una Categoría', 'error');
      } else {
        $.ajax({
          url: "/tipo_atencion/agregar_tipo_atencion",
          data: {
            params: JSON.stringify(params)
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
                  closeOnConfirm: true
                },
                function() {
                  getTiposAtencion();
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
          if (response.tipo_mensaje == 'success') {
            $('#nombre_tipo_atencion').val(response.tipo_atencion.nombre);

            if (response.tipo_atencion.derivar == true) {
              $('#check_derivar_ta').prop('checked', true);
            }

            if (response.tipo_atencion.taller == true) {
              $('#check_taller_ta').prop('checked', true);
            }
            
            if (response.tipo_atencion.consulta == true) {
              $('#check_consulta_ta').prop('checked', true);
            }

            if (response.tipo_atencion.estado == 'HABILITADO') {
              $('#estado_tipo_atencion').prop('checked', true);
            } else {
              $('#estado_tipo_atencion').prop('checked', false);
            }
          } else {
            notificacion('Error', response.mensaje, 'error');
          }
        },
        error: function(response) {}
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
            closeOnConfirm: true
          },
          function() {
            $('#id_tipo_atencion').val('');
            getTiposAtencion();
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
        deseleccionarFilasTablaTipoAtencion();
        listarTiposAtencion(response);
      },
      error: function(response) {
        console.error("Error al obtener los tipos de atenciones");
      }
    });
  }

  /== funcion para crear el listado de tipos de atencion ==/
  function listarTiposAtencion(datos) {
    var tabla = $('#tabla_tipos_atencion').DataTable({
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
        { data: 'categorias'},
        { data: 'estado' }
      ],
      initComplete: function() {
        $('#dropdown_acciones_listado_tipo_atencion').css('display', 'none');
      }
    });

    // Reasignar el evento para seleccionar una fila en la tabla
    $('#tabla_tipos_atencion tbody').off('click', 'tr');
    $('#tabla_tipos_atencion tbody').on('click', 'tr', function(e) {
      let classList = e.currentTarget.classList;
      let rowData;

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

        rowData = tabla.row(this).data();
        $('#id_tipo_atencion').val(rowData.id);
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
            getTiposAtencion();
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
    // $("input[type='radio'][name=inlineRadioOptions]").prop('checked', false);
    $('.checksTipoAtencion').each(function() {
          $($(this)).prop('checked', false);
    });

  }

  function deseleccionarFilasTablaTipoAtencion() {
    var tabla = $('#tabla_tipos_atencion').DataTable();
    tabla.rows().every(function() {
      var rowNode = this.node();

      if ($(rowNode).hasClass('selected')) {
        $(rowNode).removeClass('selected');
      }

      $('#btn_nuevo_tipo_atencion').css('display', 'block');
      $('#dropdown_acciones_listado_tipo_atencion').css('display', 'none');
      $('#id_tipo_atencion').val('');
    });
  }

  function validarCheckboxes() {
    const checkboxes = document.querySelectorAll('input[name="check_tipo_atencion"]');
    let check = false;

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        check = true;
      }
    });

    return check;
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