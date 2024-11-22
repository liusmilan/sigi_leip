var diagnostico_dsm5 = function() {
  var $ = jQuery.noConflict();
  var accion = '';
  var id_diag_dsm5 = '';
  var lista_diagnosticos_dsm5 = [];
  var idRowData = '';

  /== ocultar la primera columna de la tabla ==/
  $('#tabla_diagnosticos_dsm5 th:nth-child(1), #tabla_diagnosticos_dsm5 td:nth-child(1)').hide();


  function initEvents() {
    /== eventos sobre la tabla de diagnosticos_dsm5 ==/
    $('#tabla_diagnosticos_dsm5').on('click', 'tr', function() {
      //deseleccionar las filas no marcadas
      $('tbody tr').not(this).removeClass('table-active');
      //seleccionar una fila
      $(this).toggleClass('table-active');

      if ($(this).hasClass('table-active')) {
        //coger los datos de la fila
        idRowData = parseInt($(this).children('td').map(function() { return $(this).text(); }).get(0));
      }
    });

    /== evento para mostrar modal del listado de diagnostico_dsm5 ==/
    $('#btn_add_diagnostico_provicional_dsm5').on('click', function() {
      var id_atencion = $('#id_atencion').val();

      $.ajax({
        url: "/atencion_psicologica/get_all_diagnosticos_dsm5",
        type: "get",
        data: {id_atencion: id_atencion},
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'success') {
            deseleccionarFilasTabla();
            notificacion('Error', 'Esta Atención ya tiene registrada Diagnósticos DSM-5.', 'error');
          } else {
            $('#modal_diagnostico_dsm5').modal('show');
            mostrarPersonaAutenticada();
            accion = 'agregar';
            verificarRoleUsuario();
          }
        },
        error: function(response) {}
      });
    });

    /== evento para mostrar modal de agregar los diagnostico_dsm5 ==/
    $('#btn_modal_add_diagnostico_dsm5').on('click', function() {
      $('#modal_agregar_diagnostico_dsm5').modal('show');
      $('#modal_agregar_diagnostico_dsm5').find('.modal-title').text('Adicionar Diagnóstico DSM-5');

      $('#categoria_diagnostico_dsm5').select2({
        dropdownParent: $('#modal_agregar_diagnostico_dsm5 .modal-body'),
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

      $('#diagnostico_dsm5').select2({
        dropdownParent: $('#modal_agregar_diagnostico_dsm5 .modal-body'),
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

    /== evento para cargar los diagnosticos segun la categoria que se escoja ==/
    $('#categoria_diagnostico_dsm5').on('change', function() {
      var id_categoria = $(this).val();
      var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
      var optionEmpty = $("<option/>").val('-').text('-----------');

      // vaciar select diagnostico
      $.each($('#diagnostico_dsm5').find("option"), function (key, value) {
        $(value).remove();
      });

      if (id_categoria == 'sel') {
        $('#diagnostico_dsm5').find("option").end().append(optionEmpty.attr('selected', true));
      } else {
        $.ajax({
          url: "/diagnostico/get_diagnosticos_by_categoria",
          data: {
            id_categoria: id_categoria
          },
          type: "get",
          dataType: "json",
          success: function(response) {
            if (response.mensaje == 'success') {
              $('#diagnostico_dsm5').find("option").end().append(optionSeleccione);

              $.each(response.diagnosticos, function (key, value) {
                var option = $("<option/>").val(value.id).text(value.nombre);

                if (value.estado == 'HABILITADO') {
                    if (id_diag_dsm5 != '') {
                    // llenar select diagnostico_dsm5 en modal editar
                    if (value.id == id_diag_dsm5) {
                      $('#diagnostico_dsm5').find("option").end().append(option.attr('selected', true));
                    } else {
                      $('#diagnostico_dsm5').find("option").end().append(option);
                    }
                  } else {
                    // llenar select diagnostico_dsm5 en modal agregar
                    $('#diagnostico_dsm5').find("option").end().append(option);
                  }
                }                
              });

              $('#diagnostico_dsm5').trigger("chosen:updated").trigger("change");
            } else {
              $('#diagnostico_dsm5').find("option").end().append(optionEmpty.attr('selected', true));
            }
          },
          error: function(response) {}
        });
      }
    });
    
    /== evento para cerrar modal de listado diagnostico_dsm5 ==/
    $('#btn_cerrar_modal_diagnostico_dsm5').on('click', function() {
      $('#modal_diagnostico_dsm5').modal('hide');
      limpiarModalDiagnosticoDsm5();
    });

    /== evento para cancelar modal de listado diagnostico_dsm5 ==/
    $('#btn_cancelar_modal_diagnostico_dsm5').on('click', function() {
      $('#modal_diagnostico_dsm5').modal('hide');
      limpiarModalDiagnosticoDsm5();
    });

    /== evento para cerrar modal de agregar diagnostico_dsm5 ==/
    $('#btn_cerrar_modal_add_diagnostico_dsm5').on('click', function() {
      limpiarCamposModalAddDiagnostico();
      $('#modal_agregar_diagnostico_dsm5').modal('hide');
    });

    /== evento para cancelar modal de agregar diagnostico_dsm5 ==/
    $('#btn_cancelar_modal_add_diagnostico_dsm5').on('click', function() {
      limpiarCamposModalAddDiagnostico();
      $('#modal_agregar_diagnostico_dsm5').modal('hide');
    });

    /== evento para agregar los diagnosticos a la tabla diagnosticos_dsm5 ==/
    $('#btn_add_diagnostico_dsm5').on('click', function(event) {
      event.preventDefault();
      var id_diagnostico = $('#diagnostico_dsm5').val();

      $.ajax({
        url: "/diagnostico/get_diagnostico",
        type: "get",
        data: {id: id_diagnostico},
        dataType: "json",
        success: function(response) {
          agregarDatosTabla(id_diagnostico, response);
        },
        error: function(response) {}
      });
    });

    /== evento para eliminar los diagnosticos de la tabla diagnosticos_dsm5 ==/
    $('#btn_eliminar_diagnostico_dsm5').on('click', function() {
      var filaSeleccionada = $('.table-active');
      
      //eliminar el item seleccionado de la lista
      lista_diagnosticos_dsm5 = $.grep(lista_diagnosticos_dsm5, function(value) {
        return parseInt(value) != idRowData;
      });

      //eliminar el item seleccionado de la tabla
      filaSeleccionada.remove();
    });

    /== evento para agregar o editar los diagnosticos_dsm5 ==/
    $('#btn_agregar_diagnostico_dsm5').on('click', function() {
      var id_atencion = $('#id_atencion').val();
      var observaciones = $('#observaciones_dsm5').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);
      
      if (lista_diagnosticos_dsm5.length > 0) {
        $.ajax({
          url: "/atencion_psicologica/agregar_editar_diagnostico_dsm5",
          data: {
            id_atencion: id_atencion,
            'diagnosticos[]': JSON.stringify(lista_diagnosticos_dsm5),
            accion: accion,
            observaciones: observaciones
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              btn.html(textOriginalBtn);
              lista_diagnosticos_dsm5 = [];
              idRowData = '';
              $('#modal_diagnostico_dsm5').modal('hide');

              swal({
                title: "",
                text: response.mensaje,
                type: response.tipo_mensaje,
                showCancelButton: false,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Aceptar",
                closeOnConfirm: true
              },
              function() {
                $(document).trigger('actualizar_lista_atenciones');
              });
            }
          },
          error: function(response) {}
        });
      } else {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Debe de agregar algún Diagnóstico', 'error');
      }
    });

    $('#btn_edit_diagnostico_provicional_dsm5').on('click', function() {
      var id_atencion = $('#id_atencion').val();
      
      $.ajax({
        url: "/atencion_psicologica/get_all_diagnosticos_dsm5",
        type: "get",
        data: {id_atencion: id_atencion},
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'error') {
            deseleccionarFilasTabla();
            notificacion('Error', 'Esta Atención no tiene registrado Diagnósticos DSM-5. Por favor primero agréguelos para luego poder editarlos.', 'error');
          } else {
            $('#modal_diagnostico_dsm5').modal('show');
            mostrarPersonaAutenticada();
            accion = 'editar';
            verificarRoleUsuario();
            $('#observaciones_dsm5').val(response.atencion.observaciones);

            // vaciar la tabla
            $('#tabla_diagnosticos_dsm5 tbody').empty();

            //llenar tabla de diagnosticos_dsm5
            $.each(response.diagnosticos, function (key, value) {
              lista_diagnosticos_dsm5.push(parseInt(value.diagnostico.id));
              var fila = '<tr><td>' + parseInt(value.diagnostico.id) + '</td><td>' + value.diagnostico.nombre + '</td><td>' + value.diagnostico.categoria.nombre + '</td><td>' + (value.diagnostico.grupo != null ? value.diagnostico.grupo.nombre : '') + '</td></tr>';
              $('#tabla_diagnosticos_dsm5 tbody').append(fila);
              $('#tabla_diagnosticos_dsm5 th:nth-child(1), #tabla_diagnosticos_dsm5 td:nth-child(1)').hide();
            });
          }
        },
        error: function(response) {}
      });
    });
  }

  // crear metodo que devuelve si el usuario autenticado tiene rol uno o el otro, para poder poner el titulo que lleva el modal


  function verificarRoleUsuario() {
    var id_user_aut = $('#user_autenticado').val();

    $.ajax({
      url: "/usuario/get_usuario",
      type: "get",
      data: {id: id_user_aut},
      dataType: "json",
      success: function(response) {
        var roles = JSON.parse(response.roles);
        var resultado = $.grep(roles, function(e) {
          return e.fields.nombre == 'CONSULTA_PSICOTERAPEUTICA';
        });

        if (resultado.length > 0) {
          $('#modal_diagnostico_dsm5').find('.modal-title').text('Diagnóstico DSM-5');
        } else {
          $('#modal_diagnostico_dsm5').find('.modal-title').text('Diagnóstico Provicional DSM-5');
        }
      },
      error: function(response) {}
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
            $('#categoria_diagnostico_dsm5').find("option").end().append(optionSeleccione);
          } else {
            $('#categoria_diagnostico_dsm5').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.categorias_trastorno, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_categoria != '') {
                // llenar select categoria en modal de editar
                if (value.id == id_categoria) {
                  $('#categoria_diagnostico_dsm5').find("option").end().append(option.attr('selected', true));
                } else {
                  $('#categoria_diagnostico_dsm5').find("option").end().append(option);
                }              
              } else {
                // llenar select categoria en modal de agregar
                $('#categoria_diagnostico_dsm5').find("option").end().append(option);
              }
            }
          });

          $('#categoria_diagnostico_dsm5').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#categoria_diagnostico_dsm5').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  function mostrarPersonaAutenticada() {
    var id_usuario_autenticado = $('#user_autenticado').val();

    $.ajax({
      url: "/usuario/get_usuario",
      type: "get",
      data: {id: id_usuario_autenticado},
      dataType: "json",
      success: function(response) {
        var nombre_persona_autenticada = response.persona.nombre + (response.persona.segundo_nombre ? ' ' + response.persona.segundo_nombre + ' ' : ' ') + response.persona.apellido + (response.persona.segundo_apellido ? ' ' + response.persona.segundo_apellido : '')
        $('#nombre_persona_autenticada').html('Usuario: ' + nombre_persona_autenticada);    
      },
      error: function(response) {}
    });
  }

  function limpiarCamposModalAddDiagnostico() {
    $.each($('#categoria_diagnostico_dsm5').find("option"), function (key, value) {
      $(value).remove();
    });
    
    id_diag_dsm5 = '';
  }

  function limpiarModalDiagnosticoDsm5() {
    lista_diagnosticos_dsm5 = [];
    idRowData = '';
    $('#observaciones_dsm5').val('');
    $(document).trigger('actualizar_lista_atenciones');
    // hay que ver como eliminar todos los registros de una tabla o como vaciar una tabla
    $('#tabla_diagnosticos_dsm5 tbody').empty();
  }

  /== funcion para agregar datos a la tabla desde el modal ==/
  function agregarDatosTabla(id_diagnostico, datos) {
    var diagnostico = {
      id: id_diagnostico,
      nombre: datos.nombre
    };

    var categoria = {
      id: datos.categoria.id,
      nombre: datos.categoria.nombre
    };

    var grupo;
    
    if (datos.grupo) {
      grupo = {
        id: datos.grupo.id,
        nombre: datos.grupo.nombre
      };
    } else {
      grupo = '';
    }

    var values = {
      diagnostico: diagnostico,
      categoria: categoria,
      grupo: grupo
    };

    var resultado = $.grep(lista_diagnosticos_dsm5, function(e) {
      return e == id_diagnostico;
    });

    if (resultado.length > 0) {
      notificacion('Error', 'Este Diagnóstico ya ha sido agregado. Por favor agregue otro', 'error');
      limpiarCamposModalAddDiagnostico();
      llenarSelectCategorias('');
    } else {
      lista_diagnosticos_dsm5.push(id_diagnostico);
      //crear la fila con los datos que se van a agregar a la tabla
      var fila = '<tr><td>' + parseInt(diagnostico.id) + '</td><td>' + diagnostico.nombre + '</td><td>' + categoria.nombre + '</td><td>' + (grupo != '' ? grupo.nombre : '') + '</td></tr>';
      //agregar datos a la tabla
      $('#tabla_diagnosticos_dsm5 tbody').append(fila);
      //ocultar la primera columna luego de agregar en la tabla
      $('#tabla_diagnosticos_dsm5 th:nth-child(1), #tabla_diagnosticos_dsm5 td:nth-child(1)').hide();
      limpiarCamposModalAddDiagnostico();
      llenarSelectCategorias('');
    }
  }

  function deseleccionarFilasTabla() {
    var tabla = $('#tabla_atenciones_psicologicas').DataTable();
    tabla.rows().every(function() {
      var rowNode = this.node();

      if ($(rowNode).hasClass('selected')) {
        $(rowNode).removeClass('selected');
      }
    });
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  diagnostico_dsm5.init();
});