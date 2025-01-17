var valoracion = function() {
  var $ = jQuery.noConflict();
  var accion = '';
  var id_valoracion = '';
  var lista_talleres = [];
  var idRowData = '';
  var id_institucion = '';

  
  $('.fecha_valoracion_atencion').datepicker({
    format: 'dd/mm/yyyy',
    language: 'es',
    todayHighlight: true,
    autoclose: true
  });

  function initEvents() {
    /== eventos sobre la tabla de los talleres en el modal de valoracion ==/
    $('#tabla_valoracion_talleres').on('click', 'tr', function() {
      //deseleccionar las filas no marcadas
      $('tbody tr').not(this).removeClass('table-active');
      //seleccionar una fila
      $(this).toggleClass('table-active');

      if ($(this).hasClass('table-active')) {
        //coger los datos de la fila
        idRowData = parseInt($(this).children('td').map(function() { return $(this).text(); }).get(0));
      }
    });

    /== evento para mostrar modal de valoracion ==/
    $('#btn_add_decidir_valoracion').on('click', function() {
      console.log(lista_talleres, 'lista_talleres-add-open');
      var id_atencion = $('#id_atencion').val();

      $.ajax({
        url: "/valoracion/get_valoracion_by_atencion",
        type: "get",
        data: {id_atencion: id_atencion},
        dataType: "json",
        success: function(response) {
          if (response.datos.mensaje == 'existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'Esta Atención ya se le ha decidido una Valoración.', 'error');
          } else {
            $('#modal_decidir_valoracion').modal('show');
            accion = 'agregar';
            llenarCampoValoradoPor();
            ocultarCampos();
            console.log(lista_talleres, 'lista_talleres-open');

            $('#tipo_atencion_valoracion').select2({
              dropdownParent: $('#modal_decidir_valoracion .modal-body'),
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

            $('#tipo_institucion_valoracion').select2({
              dropdownParent: $('#modal_decidir_valoracion .modal-body'),
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
      
            $('#institucion_valoracion').select2({
              dropdownParent: $('#modal_decidir_valoracion .modal-body'),
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

            llenarSelectTipoAtencion('');
            llenarSelectTipoInstitucion('');
          }
        },
        error: function(response) {}
      });
    });

    /== evento para cerrar modal de valoracion ==/
    $('#btn_cerrar_modal_decidir_valoracion').on('click', function() {
      limpiarCampos();
      $('#modal_decidir_valoracion').modal('hide');
      $(document).trigger('actualizar_lista_atenciones');
    });

    /== evento para cancelar modal de solicitar atencion ==/
    $('#btn_cancelar_modal_decidir_valoracion').on('click', function() {
      limpiarCampos();
      $('#modal_decidir_valoracion').modal('hide');
      $(document).trigger('actualizar_lista_atenciones');
    });

    /== evento para mostrar las instituciones o los talleres ==/
    $('#tipo_atencion_valoracion').on('change', function() {
      var id_tipo_atencion = $(this).val();
      var textoSeleccionado = $(this).find('option:selected').text();
      
      if (id_tipo_atencion == 'sel' || id_tipo_atencion == '-') {
        $('#seccion_tipo_institucion').css('display', 'none');
        $('#seccion_institucion').css('display', 'none');
        $('#btn_add_taller').css('display', 'none');
        $('#btn_eliminar_taller').css('display', 'none');
        $('#tabla_valoracion_talleres').css('display', 'none');
      } else {
        $.ajax({
          url: "/tipo_atencion/get_tipo_atencion",
          data: {
            id: id_tipo_atencion
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              // ocultarCampos();

              if (response.tipo_atencion.derivar == true) {
                $('#seccion_tipo_institucion').css('display', 'block');
                $('#seccion_institucion').css('display', 'block');
              } else {
                $('#seccion_tipo_institucion').css('display', 'none');
                $('#seccion_institucion').css('display', 'none');
              }

              if (response.tipo_atencion.taller == true) {
                $('#btn_add_taller').css('display', 'block');
                $('#btn_eliminar_taller').css('display', 'block');
                $('#tabla_valoracion_talleres').css('display', 'block');
                //ocultar la primera columna luego de agregar en la tabla
                $('#tabla_valoracion_talleres th:nth-child(1), #tabla_valoracion_talleres td:nth-child(1)').hide();
              } else {
                $('#btn_add_taller').css('display', 'none');
                $('#btn_eliminar_taller').css('display', 'none');
                $('#tabla_valoracion_talleres tbody').empty();
                lista_talleres = [];
                $('#tabla_valoracion_talleres').css('display', 'none');
              }
            } else {
              notificacion('Error', response.mensaje, 'error');
            }
          },
          error: function(response) {}
        });
      }
    });

    /== evento para cargar las instituciones segun el tipo ==/
    $('#tipo_institucion_valoracion').on('change', function() {
      var id_tipo_inst = $(this).val();
      var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
      var optionEmpty = $("<option/>").val('-').text('-----------');

      // vaciar select institucion
      $.each($('#institucion_valoracion').find("option"), function (key, value) {
        $(value).remove();
      });

      if (id_tipo_inst == 'sel') {
        $('#institucion_valoracion').find("option").end().append(optionEmpty.attr('selected', true));
      } else {
        $.ajax({
          url: "/institucion/get_instituciones_by_tipo_institucion",
          data: {
            tipo_institucion: id_tipo_inst == 'privada' ? 'pv' : 'pu'
          },
          type: "get",
          dataType: "json",
          success: function(response) {
            if (response.mensaje == 'existe') {
              $('#institucion_valoracion').find("option").end().append(optionSeleccione);

              $.each(response.instituciones, function (key, value) {
                var option = $("<option/>").val(value.id).text(value.nombre);

                if (value.estado) {
                  if (id_institucion != '') {
                    // llenar select institucion en modal editar
                    if (value.id == id_institucion) {
                      $('#institucion_valoracion').find("option").end().append(option.attr('selected', true));
                    } else {
                      if ((id_tipo_inst == 'publica') && (value.tipo_institucion == 'pu')) {
                        $('#institucion_valoracion').find("option").end().append(option);  
                      } else if ((id_tipo_inst == 'privada') && (value.tipo_institucion == 'pv')) {
                        $('#institucion_valoracion').find("option").end().append(option);  
                      }
                    }
                  } else {
                    // llenar select institucion en modal agregar
                    if ((id_tipo_inst == 'publica') && (value.tipo_institucion == 'pu')) {
                      $('#institucion_valoracion').find("option").end().append(option);  
                    } else if ((id_tipo_inst == 'privada') && (value.tipo_institucion == 'pv')) {
                      $('#institucion_valoracion').find("option").end().append(option);  
                    }
                  }
                }
              });

              $('#institucion_valoracion').trigger("chosen:updated").trigger("change");
            } else {
              $('#institucion_valoracion').find("option").end().append(optionEmpty.attr('selected', true));
            }
          },
          error: function(response) {}
        });
      }
    });

    /== evento para cancelar modal del listado de los talleres ==/
    $('#btn_cancelar_modal_listado_talleres').on('click', function() {
      $('#tabla_listado_talleres').DataTable().destroy();
      $('#modal_listado_talleres').modal('hide');
    });

    /== evento para mostrar modal de los talleres ==/
    $('#btn_add_taller').on('click', function() {
      $('#modal_listado_talleres').modal('show');
      
      $.ajax({
        url: "/taller/get_talleres",
        type: "get",
        dataType: "json",
        success: function(response) {
          var tabla = $('#tabla_listado_talleres').DataTable({
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
            pageLength: 5,
            destroy: true,
            ascrollx: true,
            "aLengthMenu": [5, 10, 25, 50],
            order: [[0, 'desc']],
            data: response.talleres,
            columns: [
              { data: 'nombre' },
              { data: 'modalidad.nombre'},
              { data: 'fecha_inicio'},
              { data: 'fecha_fin'},
              { data: 'especialista'}
            ],
            rowCallback: function(row, data) {
              $($(row).find('td')[2]).html(data.fecha_inicio + (data.hora_inicio ? ' ' + data.hora_inicio : ''));
            },
            initComplete: function() {}
          });
      
          //evento para seleccionar una fila en la tabla
          // Reasignar el evento para seleccionar una fila en la tabla
          $('#tabla_listado_talleres tbody').off('click', 'tr');
          $('#tabla_listado_talleres tbody').on('click', 'tr', function(e) {
            let classList = e.currentTarget.classList;
            let rowData;
            if (classList.contains('selected')) {
              classList.remove('selected');
            } else {
              tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
              classList.add('selected');
              rowData = tabla.row(this).data();
            }
          });
        },
        error: function(response) {}
      });
    });

    /== evento para agregar talleres a la tabla ==/
    $('#btn_agregar_talleres_valoracion').on('click', function() {
      var lista = [];
      var table = $('#tabla_listado_talleres').DataTable();
      var data = table.rows('.selected').data();

      data.each(function(index) {
        lista.push(index);
      });

      if (lista.length > 0) {
        if (validarAddTalleres(lista) == true) {
          notificacion('Error', 'De los talleres seleccionados ya existe un agregado.', 'error');
        } else {
          $.each(lista, function (key, value) {
            //crear la fila con los datos que se van a agregar a la tabla
            var fila = '<tr><td>' + parseInt(value.id) + '</td><td>' + value.nombre + '</td><td>' + value.modalidad.nombre + '</td><td>' + value.fecha_inicio + (value.hora_inicio ? ' ' + value.hora_inicio : '') + '</td><td>' + value.fecha_fin + '</td><td>' + value.especialista + '</td></tr>';
            //agregar datos a la tabla
            $('#tabla_valoracion_talleres tbody').append(fila);
            //ocultar la primera columna luego de agregar en la tabla
            $('#tabla_valoracion_talleres th:nth-child(1), #tabla_valoracion_talleres td:nth-child(1)').hide();
            lista_talleres.push(value);
          });

          $('#modal_listado_talleres').modal('hide');
          deseleccionarFilasTablaTalleres();
        }
      } else {
        notificacion('Error', 'Debe de seleccionar al menos un taller', 'error');
      }
    });
    
    /== evento para eliminar los talleres de la tabla talleres del modal de valoracion ==/
    $('#btn_eliminar_taller').on('click', function() {
      var filaSeleccionada = $('.table-active');
      
      //eliminar el item seleccionado de la lista
      lista_talleres = $.grep(lista_talleres, function(value) {
        return parseInt(value.id) != idRowData;
      });

      //eliminar el item seleccionado de la tabla
      filaSeleccionada.remove();
    });
    
    $('#btn_agregar_valoracion').on('click', function() {
      var id_atencion = $('#id_atencion').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);
      var fecha = $('#fecha_valoracion').val();
      var valorado_por = $('#valorado_por').val();
      var tipo_atencion_valoracion = $('#tipo_atencion_valoracion').val();
      var tipo_atencion_valoracion_text = $('#tipo_atencion_valoracion option:selected').text();
      var clasificacion = '';
      var tipo_institucion = '';
      var institucion = '';

      if (tipo_atencion_valoracion_text.toLowerCase().indexOf('taller') > -1) {
        //talleres
        clasificacion = 'talleres';        
      }
      
      if (tipo_atencion_valoracion_text.toLowerCase().indexOf('derivar') > -1) {
        //derivar
        tipo_institucion = $('#tipo_institucion_valoracion').val();
        institucion = $('#institucion_valoracion').val();
        clasificacion = 'derivar';
      }
      
      if ((tipo_atencion_valoracion_text.toLowerCase().indexOf('taller') < 0) && ((tipo_atencion_valoracion_text.toLowerCase().indexOf('derivar') < 0))) {
        //otros
        clasificacion = 'otros';
      }

      var params = {
        clasificacion: clasificacion,
        fecha: fecha,
        valorado_por: valorado_por,
        id_user_aut: $('#user_autenticado').val(),
        tipo_atencion_valoracion: tipo_atencion_valoracion,
        talleres: lista_talleres,
        tipo_institucion: tipo_institucion,
        institucion: institucion,
        accion: accion,
        id_atencion: id_atencion
      }

      console.log(params, 'params');

      var validacion = validarFormulario(params);

      if (validacion !== '') {
        btn.html(textOriginalBtn);
        notificacion('Error', validacion);
      } else {
        $.ajax({
          url: "/valoracion/agregar_valoracion",
          data: {
            params: JSON.stringify(params)
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              btn.html(textOriginalBtn);
              lista_talleres = [];
              idRowData = '';
              $('#modal_decidir_valoracion').modal('hide');
  
              swal({
                title: "Información",
                text: response.mensaje,
                type: response.tipo_mensaje,
                showCancelButton: false,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Aceptar",
                closeOnConfirm: true
              },
              function() {
                limpiarCampos();
                $(document).trigger('actualizar_lista_atenciones');
              });
            }
          },
          error: function(response) {
            notificacion('Error', 'Ha ocurrido un error al guardar los datos.', 'error');
          }
        });
      }
    });

    $('#btn_edit_decidir_valoracion').on('click', function() {
      var id_atencion = $('#id_atencion').val();
      
      $.ajax({
        url: "/valoracion/get_valoracion_by_atencion",
        type: "get",
        data: {id_atencion: id_atencion},
        dataType: "json",
        success: function(response) {
          if (response.datos.mensaje == 'no_existe') {
            deseleccionarFilasTabla();
            notificacion('Error', 'Esta Atención no tiene registrado una Valoración. Por favor primero agréguela para luego poder editarla.', 'error');
          } else {
            $('#modal_decidir_valoracion').modal('show');
            accion = 'editar';
            llenarCampoValoradoPor();
            $('#fecha_valoracion').val(response.datos.fecha_valoracion);

            $('#tipo_atencion_valoracion').select2({
              dropdownParent: $('#modal_decidir_valoracion .modal-body'),
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

            if (response.talleres.length > 0) {
              //llenar tabla de talleres
              $.each(response.talleres, function (key, value) {
                lista_talleres.push(value);
                var fila = '<tr><td>' + parseInt(value.id) + '</td><td>' + value.nombre + '</td><td>' + value.modalidad.nombre + '</td><td>' + value.fecha_inicio + '</td><td>' + value.fecha_fin + '</td><td>' + value.especialista + '</td></tr>';
                $('#tabla_valoracion_talleres tbody').append(fila);
                $('#tabla_valoracion_talleres th:nth-child(1), #tabla_valoracion_talleres td:nth-child(1)').hide();
              });
            }

            // crear selects de las instituciones
            $('#tipo_institucion_valoracion').select2({
              dropdownParent: $('#modal_decidir_valoracion .modal-body'),
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

            $('#institucion_valoracion').select2({
              dropdownParent: $('#modal_decidir_valoracion .modal-body'),
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

            if (response.datos.tipo_institucion != "") {
              llenarSelectTipoInstitucion(response.datos.tipo_institucion);
              id_institucion = response.datos.institucion.id;
            } else {
              llenarSelectTipoInstitucion('');
            }

            llenarSelectTipoAtencion(response.datos.tipo_atencion.id);
          }
        },
        error: function(response) {}
      });
    });

  }

  function deseleccionarFilasTabla() {
    var tabla = $('#tabla_atenciones_psicologicas').DataTable();
    tabla.rows().every(function() {
      var rowNode = this.node();

      if ($(rowNode).hasClass('selected')) {
        $(rowNode).removeClass('selected');
      }

      $('#btn_solicitar_atencion').css('display', 'block');
      $('#dropdown_acciones_atenciones_psicologicas').css('display', 'none');
      $('#id_atencion').val('');
    });
  }

  /== funcion para llenar el select de las tipos de atencion ==/
  function llenarSelectTipoAtencion(id_tipo_atencion) {
    $.ajax({
      url: "/tipo_atencion/get_all_tipo_atencion",
      type: "get",
      dataType: "json",
      success: function(response) {
        var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
        var optionEmpty = $("<option/>").val('-').text('-----------');

        if (response.mensaje == 'success') {
          if (id_tipo_atencion != '') {
            $('#tipo_atencion_valoracion').find("option").end().append(optionSeleccione);
          } else {
            $('#tipo_atencion_valoracion').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.tipos_atenciones, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_tipo_atencion != '') {
                // llenar select tipo_atencion en modal de editar
                if (value.id == id_tipo_atencion) {
                  $('#tipo_atencion_valoracion').find("option").end().append(option.attr('selected', true));
                } else {
                  $('#tipo_atencion_valoracion').find("option").end().append(option);
                }              
              } else {
                // llenar select categoria en modal de agregar
                $('#tipo_atencion_valoracion').find("option").end().append(option);
              }
            }            
          });

          $('#tipo_atencion_valoracion').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#tipo_atencion_valoracion').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {}
    });
  }

  /== funcion para llenar el select de tipo de institucion ==/
  function llenarSelectTipoInstitucion(id_tipo_institucion) {
    var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
    var optionEmpty = $("<option/>").val('-').text('-----------');
    var option1 = $("<option/>").val('publica').text('Pública');
    var option2 = $("<option/>").val('privada').text('Privada');

    if (id_tipo_institucion != '') {
      $('#tipo_institucion_valoracion').find("option").end().append(optionSeleccione);
    } else {
      $('#tipo_institucion_valoracion').find("option").end().append(optionSeleccione.attr('selected', true));
    }

    if (id_tipo_institucion != '') {
      // llenar select tipo_institucion en modal de editar
      if ('publica' == id_tipo_institucion) {
        $('#tipo_institucion_valoracion').find("option").end().append(option1.attr('selected', true));
        $('#tipo_institucion_valoracion').find("option").end().append(option2);
      } else if ('privada' == id_tipo_institucion) {
        $('#tipo_institucion_valoracion').find("option").end().append(option1);
        $('#tipo_institucion_valoracion').find("option").end().append(option2.attr('selected', true));
      }      
    } else {
      // llenar select tipo_institucion en modal de agregar
      $('#tipo_institucion_valoracion').find("option").end().append(option1);
      $('#tipo_institucion_valoracion').find("option").end().append(option2);
    } 

    $('#tipo_institucion_valoracion').trigger("chosen:updated").trigger("change");
  }

  function limpiarCampos() {
    id_institucion = '';
    id_valoracion = '';
    idRowData = '';
    accion = '';
    $('#fecha_valoracion').val('');
    $('#tabla_valoracion_talleres tbody').empty();
    lista_talleres = [];
    // $('#tipo_institucion_valoracion').val('sel');
    
    $.each($('#tipo_atencion_valoracion').find("option"), function (key, value) {
      $(value).remove();
    });
    
    $.each($('#tipo_institucion_valoracion').find("option"), function (key, value) {
      $(value).remove();
    });
  }

  function llenarCampoValoradoPor() {
    var id_usuario_autenticado = $('#user_autenticado').val();

    $.ajax({
      url: "/usuario/get_usuario",
      type: "get",
      data: {id: id_usuario_autenticado},
      dataType: "json",
      success: function(response) {
        var nombre_persona_autenticada = response.persona.nombre + (response.persona.segundo_nombre ? ' ' + response.persona.segundo_nombre + ' ' : ' ') + response.persona.apellido + (response.persona.segundo_apellido ? ' ' + response.persona.segundo_apellido : '')
        $('#valorado_por').val(nombre_persona_autenticada);
      },
      error: function(response) {}
    });
  }

  function deseleccionarFilasTablaTalleres() {
    var tabla = $('#tabla_listado_talleres').DataTable();
    tabla.rows().every(function() {
      var rowNode = this.node();

      if ($(rowNode).hasClass('selected')) {
        $(rowNode).removeClass('selected');
      }
    });
  }

  function validarAddTalleres(lista) {
    var error = false;
    $.each(lista, function (key, value) {
      var lista_resultado = $.grep(lista_talleres, function(e) {
        return e.id == value.id;
      });
  
      if (lista_resultado.length > 0) {
        error = true;
        return false;
      }
    });
    
    return error;
  }

  function validarFormulario(params) {
    var error = '';

    switch (params.clasificacion) {
      case 'talleres':
        if (params.talleres.length == 0) {
          error = 'Debe de agregar al menos un taller.'
          break;
        }
        break;
      case 'derivar':
        if ((params.tipo_institucion == '') || (params.tipo_institucion == '-') || (params.tipo_institucion == 'sel')) {
          error = 'Debe de seleccionar un Tipo de Institución.'
          break;
        }

        if ((params.institucion == '') || (params.institucion == '-') || (params.institucion == 'sel')) {
          error = 'Debe de seleccionar una Institución.'
          break;
        }
        break;
    }

    if (params.fecha == '') {
      error = 'Debe de seleccionar una Fecha.'
    }
    
    if (params.tipo_atencion_valoracion == '') {
      error = 'Debe de seleccionar un Tipo de Atención.'
    }

    return error;
  }

  function ocultarCampos() {
    $('#seccion_tipo_institucion').css('display', 'none');
    $('#seccion_institucion').css('display', 'none');
    $('#btn_add_taller').css('display', 'none');
    $('#btn_eliminar_taller').css('display', 'none');
    $('#tabla_valoracion_talleres').css('display', 'none');
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  valoracion.init();
});