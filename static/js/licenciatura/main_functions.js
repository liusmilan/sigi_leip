var licenciatura = function() {
  var $ = jQuery.noConflict();

  function initEvents() {
    getLicenciaturas();

    /== evento para mostrar modal de agregar licenciatura ==/
    $('#btn_nuevo_licenciatura').on('click', function() {
      $('#modal_agregar_editar_licenciatura').modal('show');
      $('#modal_agregar_editar_licenciatura').find('.modal-title').text('Agregar Licenciatura');
      $('#btn_agregar_licenciatura').text('Agregar');

      $('#tipo_licenciatura').select2({
        dropdownParent: $('#modal_agregar_editar_licenciatura .modal-body'),
        width: '100%',
        language: {
          noResults: function() {
            return "No hay resultado";        
          },
          searching: function() {
            return "Buscando..";
          }
        }
      });

      llenarSelectTipoLicenciatura('');
    });

    /== evento para cerrar modal de agregar licenciatura ==/
    $('#btn_cerrar_modal_licenciatura').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_licenciatura').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar licenciatura ==/
    $('#btn_cancelar_modal_licenciatura').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_licenciatura').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar una licenciatura ==/
    $('#btn_agregar_licenciatura').on('click', function() {
      var id = $('#id_licenciatura').val();
      var estado = $('#estado_licenciatura').is(":checked");
      var nombre = $('#nombre_licenciatura').val();
      var tipo_licenciatura = $('#tipo_licenciatura').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (nombre == '' || nombre == null) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'El nombre de la Licenciatura es obligatorio.', 'error');
      } else if (tipo_licenciatura == 'sel' || tipo_licenciatura == '-') {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Debe de seleccionar un tipo de Licenciatura.', 'error');
      } else {
        $.ajax({
          url: "/licenciatura/agregar_licenciatura",
          data: {
            id: id ? id : '',
            estado: estado,
            nombre: nombre,
            tipo_licenciatura: tipo_licenciatura
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              if (response.accion == 'agregar') {
                notificacion('', response.mensaje, response.tipo_mensaje);
                btn.html(textOriginalBtn);
                limpiarCampos();
                getLicenciaturas();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_licenciatura').modal('hide');
                $('#id_licenciatura').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos de la Licenciatura-Postgrado seleccionada",
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

    /== evento para llenar los campos del modal editar licenciatura ==/
    $('#btn_editar_licenciatura').on('click', function() {
      $('#modal_agregar_editar_licenciatura').modal('show');
      $('#modal_agregar_editar_licenciatura').find('.modal-title').text('Editar Licenciatura');
      $('#btn_agregar_licenciatura').text('Editar');
      let id = $('#id_licenciatura').val();

      $.ajax({
        url: "/licenciatura/get_licenciatura",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_licenciatura').val(response.nombre);

          if (response.estado == 'HABILITADO') {
            $('#estado_licenciatura').prop('checked', true);
          } else {
            $('#estado_licenciatura').prop('checked', false);
          }

          $('#tipo_licenciatura').select2({
            dropdownParent: $('#modal_agregar_editar_licenciatura .modal-body'),
            width: '100%',
            language: {
              noResults: function() {
                return "No hay resultado";        
              },
              searching: function() {
                return "Buscando..";
              }
            }
          });

          llenarSelectTipoLicenciatura(response.tipo_licenciatura);
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar una licenciatura ==/
    $('#btn_eliminar_licenciatura').on('click', function() {
      let id = $('#id_licenciatura').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar esta Licenciatura?',
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
          eliminarLicenciatura(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de esta Licenciatura',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_licenciatura').val('');
            location.reload();
          });
        }        
      });
    });
  }

  /== funcion para obtener todos las licenciaturas ==/
  function getLicenciaturas() {
    $.ajax({
      url: "/licenciatura/lista_licenciatura",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarLicenciaturas(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de licenciaturas ==/
  function listarLicenciaturas(datos) {
    let tabla = new DataTable('#tabla_licenciaturas', {
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
        { data: 'tipo_licenciatura'},
        { data: 'estado' }
      ],
      rowCallback: function(row, data) {
        $($(row).find('td')[1]).html(data.tipo_licenciatura == 'lic' ? 'Licenciatura' : data.tipo_licenciatura == 'pos' ? 'Postgrado' : '');
      },
      initComplete: function() {
        $('#dropdown_acciones_listado_licenciatura').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_licenciatura').css('display', 'block');
        $('#dropdown_acciones_listado_licenciatura').css('display', 'none');
        $('#id_licenciatura').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_licenciatura').css('display', 'none');
        $('#dropdown_acciones_listado_licenciatura').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_licenciatura').val(data.id);
      }
    });
  }

  /== funcion para eliminar una licenciatura ==/
  function eliminarLicenciatura(id) {
    $.ajax({
      url: "/licenciatura/eliminar_licenciatura",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_licenciatura').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente la Licenciatura seleccionado",
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

  /== funcion para llenar el select de licenciatura ==/
  function llenarSelectTipoLicenciatura(id_tipo_licenciatura) {
    var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
    var optionEmpty = $("<option/>").val('-').text('-----------');
    var option1 = $("<option/>").val('lic').text('Licenciatura');
    var option2 = $("<option/>").val('pos').text('Postgrado');

    if (id_tipo_licenciatura != '') {
      $('#tipo_licenciatura').find("option").end().append(optionSeleccione);
    } else {
      $('#tipo_licenciatura').find("option").end().append(optionSeleccione.attr('selected', true));
    }

    if (id_tipo_licenciatura != '') {
      // llenar select tipo_licenciatura en modal de editar
      if ('lic' == id_tipo_licenciatura) {
        $('#tipo_licenciatura').find("option").end().append(option1.attr('selected', true));
        $('#tipo_licenciatura').find("option").end().append(option2);
      } else if ('pos' == id_tipo_licenciatura) {
        $('#tipo_licenciatura').find("option").end().append(option1);
        $('#tipo_licenciatura').find("option").end().append(option2.attr('selected', true));
      } else {
        $('#tipo_licenciatura').find("option").end().append(option1);
        $('#tipo_licenciatura').find("option").end().append(option2);
      }        
    } else {
      // llenar select tipo_licenciatura en modal de agregar
      $('#tipo_licenciatura').find("option").end().append(option1);
      $('#tipo_licenciatura').find("option").end().append(option2);
    } 

    $('#tipo_licenciatura').trigger("chosen:updated").trigger("change");
  }

  /== funcion para limpiar los campos del modal licenciaturas ==/
  function limpiarCampos() {
    $('#id_licenciatura').val('');
    $('#nombre_licenciatura').val('');
    $("#estado_licenciatura").prop("checked", false);

    $.each($('#tipo_licenciatura').find("option"), function (key, value) {
      $(value).remove();
    });

    llenarSelectTipoLicenciatura('');
  }

return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  licenciatura.init();
});