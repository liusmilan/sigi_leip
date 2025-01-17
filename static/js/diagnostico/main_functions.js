var diagnostico = function() {
  var $ = jQuery.noConflict();
  var id_grupo_trastorno = '';
  
  function initEvents() {
    existenCategorias();
    getDiagnosticos();

    /== evento para mostrar modal de agregar diagnostico ==/
    $('#btn_nuevo_diagnostico').on('click', function() {
      $('#modal_agregar_editar_diagnostico').modal('show');
      $('#modal_agregar_editar_diagnostico').find('.modal-title').text('Agregar Diagnósticos');
      $('#btn_agregar_diagnostico').text('Agregar');
      
      $('#categoria_diagnostico').select2({
        dropdownParent: $('#modal_agregar_editar_diagnostico .modal-body'),
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

      $('#grupo_diagnostico').select2({
        dropdownParent: $('#modal_agregar_editar_diagnostico .modal-body'),
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
      //llenarSelectGrupos('');
    });

    /== evento para cerrar modal de agregar diagnostico ==/
    $('#btn_cerrar_modal_diagnostico').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_diagnostico').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar diagnostico ==/
    $('#btn_cancelar_modal_diagnostico').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_diagnostico').modal('hide');
      location.reload();
    });

    /== evento para cargar los grupos segun la categoria que se escoja ==/
    $('#categoria_diagnostico').on('change', function() {
      var id_categoria = $(this).val();
      var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
      var optionEmpty = $("<option/>").val('-').text('-----------');

      // vaciar select grupos
      $.each($('#grupo_diagnostico').find("option"), function (key, value) {
        $(value).remove();
      });

      if (id_categoria == 'sel') {
        $('#grupo_diagnostico').find("option").end().append(optionEmpty.attr('selected', true));
        //aki debe ser llenar el select de los grupos normal con todos los grupos
      } else {
        $.ajax({
          url: "/grupo_trastorno/get_grupos_by_categoria",
          data: {
            id_categoria: id_categoria
          },
          type: "get",
          dataType: "json",
          success: function(response) {
            if (response.mensaje == 'success') {
              $('#grupo_diagnostico').find("option").end().append(optionSeleccione);

              $.each(response.grupos, function (key, value) {
                var option = $("<option/>").val(value.id).text(value.nombre);

                if (value.estado == 'HABILITADO') {
                  if (id_grupo_trastorno != '') {
                    // llenar select grupo de trastorno en modal editar
                    if (value.id == id_grupo_trastorno) {
                      $('#grupo_diagnostico').find("option").end().append(option.attr('selected', true));
                    } else {
                      $('#grupo_diagnostico').find("option").end().append(option);
                    }
                  } else {
                    // llenar select grupo de trastorno en modal agregar
                    $('#grupo_diagnostico').find("option").end().append(option);
                  }
                }
              });

              $('#grupo_diagnostico').trigger("chosen:updated").trigger("change");
            } else {
              $('#grupo_diagnostico').find("option").end().append(optionEmpty.attr('selected', true));
            }
          },
          error: function(response) {
            
          }
        });
      }
    });

    /== evento para agregar o editar un diagnostico ==/
    $('#btn_agregar_diagnostico').on('click', function() {
      var id = $('#id_diagnostico').val();
      var nombre = $('#nombre_diagnostico').val();
      var id_categoria = $('#categoria_diagnostico').val();
      var id_grupo = $('#grupo_diagnostico').val();
      var estado = $('#estado_diagnostico').is(":checked");
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (validarCampos() != '') {
        btn.html(textOriginalBtn);
        notificacion('Error', validarCampos(), 'error');
      } else {
        $.ajax({
          url: "/diagnostico/agregar_diagnostico",
          data: {
            id: id ? id : '',
            nombre: nombre,
            id_categoria: id_categoria,
            id_grupo: id_grupo,
            estado: estado,
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              if (response.accion == 'agregar') {
                notificacion('', response.mensaje, response.tipo_mensaje);
                btn.html(textOriginalBtn);
                limpiarCampos();
                getDiagnosticos();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_diagnostico').modal('hide');
                $('#id_diagnostico').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Diagnóstico seleccionado",
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

    /== evento para llenar los campos del modal editar diagnostico ==/
    $('#btn_editar_diagnostico').on('click', function() {
      $('#modal_agregar_editar_diagnostico').modal('show');
      $('#modal_agregar_editar_diagnostico').find('.modal-title').text('Editar Diagnóstico');
      $('#btn_agregar_diagnostico').text('Editar');
      let id = $('#id_diagnostico').val();

      $.ajax({
        url: "/diagnostico/get_diagnostico",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#categoria_diagnostico').select2({
            dropdownParent: $('#modal_agregar_editar_diagnostico .modal-body'),
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

          $('#grupo_diagnostico').select2({
            dropdownParent: $('#modal_agregar_editar_diagnostico .modal-body'),
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
          
          $('#nombre_diagnostico').val(response.nombre);
          
          if (response.estado == 'HABILITADO') {
            $('#estado_diagnostico').prop('checked', true);
          } else {
            $('#estado_diagnostico').prop('checked', false);
          }
          
          llenarSelectCategorias(response.categoria.id);
          id_grupo_trastorno = response.grupo != '' ? response.grupo.id : '';
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un diagnostico ==/
    $('#btn_eliminar_diagnostico').on('click', function() {
      let id = $('#id_diagnostico').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Diagnóstico?',
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
          eliminarDiagnostico(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Diagnóstico',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_diagnostico').val('');
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
          $('#alerta_categoria_diagnostico').css('display','none');
        } else if (response.mensaje == 'error') {
          //no mostrar btn de acciones y agregar y mostrar alerta
          $('#block_actions').css('display','none');
          $('#alerta_categoria_diagnostico').css('display','block');
          $('#btn_nuevo_diagnostico').css('display','none');
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para obtener todos los diagnosticos ==/
  function getDiagnosticos() {
    $.ajax({
      url: "/diagnostico/lista_diagnostico",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarDiagnosticos(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de grupos de trastorno ==/
  function listarDiagnosticos(datos) {
    let tabla = new DataTable('#tabla_diagnosticos', {
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
        { data: 'grupo'},
        { data: 'categoria.nombre'},
        { data: 'estado' },
      ],
      rowCallback: function(row, data) {
        $($(row).find('td')[1]).html(data.grupo != '' ? data.grupo.nombre : '');
      },
      initComplete: function() {
        $('#dropdown_acciones_listado_diagnostico').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_diagnostico').css('display', 'block');
        $('#dropdown_acciones_listado_diagnostico').css('display', 'none');
        $('#id_diagnostico').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_diagnostico').css('display', 'none');
        $('#dropdown_acciones_listado_diagnostico').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_diagnostico').val(data.id);
      }
    });
  }

  /== funcion para eliminar un diagnostico ==/
  function eliminarDiagnostico(id) {
    $.ajax({
      url: "/diagnostico/eliminar_diagnostico",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_diagnostico').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Diagnóstico seleccionado",
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
            $('#categoria_diagnostico').find("option").end().append(optionSeleccione);
          } else {
            $('#categoria_diagnostico').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.categorias_trastorno, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_categoria != '') {
                // llenar select categoria en modal de editar
                if (value.id == id_categoria) {
                  $('#categoria_diagnostico').find("option").end().append(option.attr('selected', true));
                } else {
                  $('#categoria_diagnostico').find("option").end().append(option);
                }              
              } else {
                // llenar select categoria en modal de agregar
                $('#categoria_diagnostico').find("option").end().append(option);
              }
            }            
          });

          $('#categoria_diagnostico').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#categoria_diagnostico').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para validar los campos del modal ==/
  function validarCampos() {
    var nombre = $('#nombre_diagnostico').val();
    var categoria = $('#categoria_diagnostico').val();
    var mensaje_error = '';
    
    if (nombre == '' || nombre == null) {
      mensaje_error = 'Debe de escribir un Diagnóstico.';
    } else if (categoria == 'sel' || categoria == '-') {
      mensaje_error = 'Debe de seleccionar una Categoría de Trastorno.';
    }

    return mensaje_error;
  }
  
  /== funcion para limpiar los campos del modal ==/
  function limpiarCampos() {
    $('#id_diagnostico').val('');
    $('#nombre_diagnostico').val('');
    $("#estado_diagnostico").prop("checked", false);

    $.each($('#categoria_diagnostico').find("option"), function (key, value) {
      $(value).remove();
    });
    
    llenarSelectCategorias('');
    id_grupo_trastorno = '';
  }

  return {
    init: function() {
      initEvents();
    }
  };  
  }();
    
  jQuery(function () {
    diagnostico.init();
  });