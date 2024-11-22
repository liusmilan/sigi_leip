var grupo_trastorno = function() {
  var $ = jQuery.noConflict();
  
  function initEvents() {
    existenCategorias();
    getGrupos();

    /== evento para mostrar modal de agregar grupo de trastorno ==/
    $('#btn_nuevo_grupo_trastorno').on('click', function() {
      $('#modal_agregar_editar_grupo_trastorno').modal('show');
      $('#modal_agregar_editar_grupo_trastorno').find('.modal-title').text('Agregar Grupo de Trastorno');
      $('#btn_agregar_grupo_trastorno').text('Agregar');
      $('#categoria_grupo').select2({
        dropdownParent: $('#modal_agregar_editar_grupo_trastorno .modal-body'),
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

      llenarSelectCategorias('');
    });

    /== evento para cerrar modal de agregar grupo de trastorno ==/
    $('#btn_cerrar_modal_grupo_trastorno').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_grupo_trastorno').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar grupo de trastorno ==/
    $('#btn_cancelar_modal_grupo_trastorno').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_grupo_trastorno').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un grupo de trastorno ==/
    $('#btn_agregar_grupo_trastorno').on('click', function() {
      var id = $('#id_grupo_trastorno').val();
      var nombre = $('#nombre_grupo_trastorno').val();
      var id_categoria = $('#categoria_grupo').val();
      var estado = $('#estado_grupo_trastorno').is(":checked");
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (validarCampos() != '') {
        btn.html(textOriginalBtn);
        notificacion('Error', validarCampos(), 'error');
      } else {
        $.ajax({
          url: "/grupo_trastorno/agregar_grupo_trastorno",
          data: {
            id: id ? id : '',
            nombre: nombre,
            id_categoria: id_categoria,
            estado: estado,
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              if (response.accion == 'agregar') {
                notificacion('', response.mensaje, response.tipo_mensaje);
                btn.html(textOriginalBtn);
                limpiarCampos();
                getGrupos();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_grupo_trastorno').modal('hide');
                $('#id_grupo_trastorno').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Grupo de Trastorno seleccionado",
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

    /== evento para llenar los campos del modal editar grupo de trastorno ==/
    $('#btn_editar_grupo_trastorno').on('click', function() {
      $('#modal_agregar_editar_grupo_trastorno').modal('show');
      $('#modal_agregar_editar_grupo_trastorno').find('.modal-title').text('Editar Grupo de Trastorno');
      $('#btn_agregar_grupo_trastorno').text('Editar');
      let id = $('#id_grupo_trastorno').val();

      $.ajax({
        url: "/grupo_trastorno/get_grupo_trastorno",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#categoria_grupo').select2({
            dropdownParent: $('#modal_agregar_editar_grupo_trastorno .modal-body'),
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
          
          $('#nombre_grupo_trastorno').val(response.nombre);
          
          if (response.estado == 'HABILITADO') {
            $('#estado_grupo_trastorno').prop('checked', true);
          } else {
            $('#estado_grupo_trastorno').prop('checked', false);
          }
          
          llenarSelectCategorias(response.categoria.id);
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un grupo de trastorno ==/
    $('#btn_eliminar_grupo_trastorno').on('click', function() {
      let id = $('#id_grupo_trastorno').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Grupo de Trastorno?',
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
          eliminarGrupo(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Grupo de Trastorno',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_grupo_trastorno').val('');
            location.reload();
          });
        }        
      });
    });
  }

  /== funcion para verificar que existen categorias ==/
  function existenCategorias() {
    $.ajax({
      url: "/categoria_trastorno/get_all_categoria_trastornos",
      type: "get",
      dataType: "json",
      success: function(response) {
        if (response.mensaje == 'success') {
          //mostrar btn de acciones y agregar
          $('#block_actions').css('display','block');
          $('#alerta_categoria').css('display','none');
        } else if (response.mensaje == 'error') {
          //no mostrar btn de acciones y agregar y mostrar alerta
          $('#block_actions').css('display','none');
          $('#alerta_categoria').css('display','block');
          $('#btn_nuevo_grupo_trastorno').css('display','none');
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para obtener todos los grupos de trastorno ==/
  function getGrupos() {
    $.ajax({
      url: "/grupo_trastorno/lista_grupo_trastorno",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarGrupos(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de grupos de trastorno ==/
  function listarGrupos(datos) {
    let tabla = new DataTable('#tabla_grupo_trastornos', {
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
        { data: 'categoria.nombre'},
        { data: 'estado' },
      ],
      initComplete: function() {
        $('#dropdown_acciones_listado_grupo_trastorno').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_grupo_trastorno').css('display', 'block');
        $('#dropdown_acciones_listado_grupo_trastorno').css('display', 'none');
        $('#id_grupo_trastorno').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_grupo_trastorno').css('display', 'none');
        $('#dropdown_acciones_listado_grupo_trastorno').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_grupo_trastorno').val(data.id);
      }
    });
  }

  /== funcion para eliminar un grupo de trastorno ==/
  function eliminarGrupo(id) {
    $.ajax({
      url: "/grupo_trastorno/eliminar_grupo_trastorno",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_grupo_trastorno').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Grupo de Trastorno seleccionado",
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

  /== funcion para llenar el select de las categorias ==/
  function llenarSelectCategorias(id_categoria) {
    $.ajax({
      url: "/categoria_trastorno/get_all_categoria_trastornos",
      type: "get",
      dataType: "json",
      success: function(response) {
        var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
        var optionEmpty = $("<option/>").val('-').text('-----------');

        if (response.mensaje == 'success') {
          if (id_categoria != '') {
            $('#categoria_grupo').find("option").end().append(optionSeleccione);
          } else {
            $('#categoria_grupo').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.categorias_trastorno, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_categoria != '') {
                // llenar select categoria en modal de editar
                if (value.id == id_categoria) {
                  $('#categoria_grupo').find("option").end().append(option.attr('selected', true));
                } else {
                  $('#categoria_grupo').find("option").end().append(option);
                }         
              } else {
                // llenar select categoria en modal de agregar
                $('#categoria_grupo').find("option").end().append(option);
              }
            }
          });

          $('#categoria_grupo').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#categoria_grupo').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para validar los campos del modal ==/
  function validarCampos() {
    var nombre = $('#nombre_grupo_trastorno').val();
    var categoria = $('#categoria_grupo').val();
    var mensaje_error = '';
    
    if (nombre == '' || nombre == null) {
      mensaje_error = 'Debe de escribir un Grupo de Trastorno.';
    } else if (categoria == 'sel' || categoria == '-') {
      mensaje_error = 'Debe de seleccionar una Categoría de Trastorno.';
    }

    return mensaje_error;
  }

  /== funcion para limpiar los campos del modal ==/
  function limpiarCampos() {
    $('#id_grupo_trastorno').val('');
    $('#nombre_grupo_trastorno').val('');
    $("#estado_grupo_trastorno").prop("checked", false);
    $.each($('#categoria_grupo').find("option"), function (key, value) {
      $(value).remove();
    });
    llenarSelectCategorias('');
  }

  return {
    init: function() {
      initEvents();
    }
  };  
}();
  
jQuery(function () {
  grupo_trastorno.init();
});