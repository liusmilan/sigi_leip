var municipios = function() {
  var $ = jQuery.noConflict();
  
  function initEvents() {
    existenEstados();
    getMunicipios();

    /== evento para mostrar modal de agregar municipios ==/
    $('#btn_nuevo_municipio').on('click', function() {
      $('#modal_agregar_editar_municipio').modal('show');
      $('#modal_agregar_editar_municipio').find('.modal-title').text('Agregar Municipios');
      $('#btn_agregar_municipio').text('Agregar');
      $('#municipio_estados').select2({
        dropdownParent: $('#modal_agregar_editar_municipio .modal-body'),
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

      llenarSelectEstados('');
    });

    /== evento para cerrar modal de agregar municipios ==/
    $('#btn_cerrar_modal_municipio').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_municipio').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar municipio ==/
    $('#btn_cancelar_modal_municipio').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_municipio').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un municipio ==/
    $('#btn_agregar_municipio').on('click', function() {
      var id = $('#id_municipio').val();
      var nombre = $('#nombre_municipio').val();
      var id_estado = $('#municipio_estados').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (validarCampos() != '') {
        btn.html(textOriginalBtn);
        notificacion('Error', validarCampos(), 'error');
      } else {
        $.ajax({
          url: "/municipio/agregar_municipio",
          data: {
            id: id ? id : '',
            nombre: nombre,
            id_estado: id_estado,
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              if (response.accion == 'agregar') {
                notificacion('', response.mensaje, response.tipo_mensaje);
                btn.html(textOriginalBtn);
                limpiarCampos();
                getMunicipios();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_municipio').modal('hide');
                $('#id_municipio').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Municipio seleccionado",
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

    /== evento para llenar los campos del modal editar municipios ==/
    $('#btn_editar_municipio').on('click', function() {
      $('#modal_agregar_editar_municipio').modal('show');
      $('#modal_agregar_editar_municipio').find('.modal-title').text('Editar Municipio');
      $('#btn_agregar_municipio').text('Editar');
      let id = $('#id_municipio').val();

      $.ajax({
        url: "/municipio/get_municipio",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#municipio_estados').select2({
            dropdownParent: $('#modal_agregar_editar_municipio .modal-body'),
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
          $('#nombre_municipio').val(response.nombre);
          llenarSelectEstados(response.estado.id);
        },
        error: function(response) {

        }
      });
    });
    
    /== evento para mostrar notificacion de confirmacion para eliminar un municipio ==/
    $('#btn_eliminar_municipio').on('click', function() {
      let id = $('#id_municipio').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Municipio?',
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
          eliminarMunicipio(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Municipio',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_municipio').val('');
            location.reload();
          });
        }        
      });
    });
  }

  /== funcion para verificar que existen estados ==/
  function existenEstados() {
    $.ajax({
      url: "/estado/get_estados",
      type: "get",
      dataType: "json",
      success: function(response) {
        if (response.mensaje == 'success') {
          //mostrar btn de acciones y agregar
          $('#block_actions').css('display','block');
          $('#alerta_estados').css('display','none');
        } else if (response.mensaje == 'error') {
          //no mostrar btn de acciones y agregar y mostrar alerta
          $('#block_actions').css('display','none');
          $('#alerta_estados').css('display','block');
          $('#btn_nuevo_municipio').css('display','none');
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para obtener todos los municipios ==/
  function getMunicipios() {
    $.ajax({
      url: "/municipio/lista_municipio",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarMunicipios(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de municipios ==/
  function listarMunicipios(datos) {
    let tabla = new DataTable('#tabla_municipios', {
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
        { data: 'estado.nombre'}
      ],
      initComplete: function() {
        $('#dropdown_acciones_listado_municipio').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_municipio').css('display', 'block');
        $('#dropdown_acciones_listado_municipio').css('display', 'none');
        $('#id_municipio').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_municipio').css('display', 'none');
        $('#dropdown_acciones_listado_municipio').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_municipio').val(data.id);
      }
    });
  }

  /== funcion para eliminar un municipio ==/
  function eliminarMunicipio(id) {
    $.ajax({
      url: "/municipio/eliminar_municipio",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_municipio').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Municipio seleccionado",
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

  /== funcion para llenar el select de los estados ==/
  function llenarSelectEstados(id_estado) {
    $.ajax({
      url: "/estado/get_estados",
      type: "get",
      dataType: "json",
      success: function(response) {
        var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
        var optionEmpty = $("<option/>").val('-').text('-----------');

        if (response.mensaje == 'success') {
          if (id_estado != '') {
            $('#municipio_estados').find("option").end().append(optionSeleccione);
          } else {
            $('#municipio_estados').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.estados, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (id_estado != '') {
              // llenar select estados en modal de editar
              if (value.id == id_estado) {
                $('#municipio_estados').find("option").end().append(option.attr('selected', true));
              } else {
                $('#municipio_estados').find("option").end().append(option);
              }              
            } else {
              // llenar select estados en modal de agregar
              $('#municipio_estados').find("option").end().append(option);
            }            
          });

          $('#municipio_estados').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#municipio_estados').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para validar los campos del modal ==/
  function validarCampos() {
    var nombre = $('#nombre_municipio').val();
    var estado = $('#municipio_estados').val();
    var mensaje_error = '';
    
    if (nombre == '' || nombre == null) {
      mensaje_error = 'El nombre del Municipio es obligatorio.';
    } else if (estado == 'sel' || estado == '-') {
      mensaje_error = 'Debe de seleccionar un Estado.';
    }

    return mensaje_error;
  }

  /== funcion para limpiar los campos del modal ==/
  function limpiarCampos() {
    $('#id_municipio').val('');
    $('#nombre_municipio').val('');
    $.each($('#municipio_estados').find("option"), function (key, value) {
      $(value).remove();
    });
    llenarSelectEstados('');
  }

  return {
    init: function() {
        initEvents();
    }
  };  
}();

jQuery(function () {
  municipios.init();
});