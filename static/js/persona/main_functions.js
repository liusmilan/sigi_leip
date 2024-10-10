var personas = function() {
  var $ = jQuery.noConflict();
  var id_municipio = '';

  $('.fecha_nacimiento_persona').datepicker({
    format: 'dd/mm/yyyy',
    language: 'es',
    todayHighlight: true
  });

  /== evento para validar que escriban en el campo del telefono solo numeros y () - ==/
  $('.input-number').on('input', function () { 
    this.value = this.value.replace(/[^0-9 ()-]/g,'');
  });

  //== agregar regla al pluging validate para validar select estados ==/
  // $.validator.addMethod("validarSelectEstados", function(value, element) {
  //   if ($('#persona_estado').val() == 'sel' || $('#persona_estado').val() == '-') {
  //     return false;
  //   }
  //   return true;
  // }, "Seleccione una opción");

  //== agregar regla al pluging validate para validar select municipios ==/
  // $.validator.addMethod("validarSelectMunicipios", function(value, element) {
  //   if ($('#persona_municipio').val() == 'sel' || $('#persona_municipio').val() == '-') {
  //     return false;
  //   }
  //   return true;
  // }, "Seleccione una opción");

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid"
  });
  
  validarCamposModalPersona();
   

  function initEvents() {
    existenEstados();
    existenMunicipios();
    getPersonas();

    
    /== evento para mostrar modal de agregar personas ==/
    $('#btn_nueva_persona').on('click', function() {
      $('#modal_agregar_editar_persona').modal('show');
      $('#modal_agregar_editar_persona').find('.modal-title').text('Agregar Personas');
      $('#btn_agregar_persona').text('Agregar');      

      $("input[type='radio'][name=inlineRadioOptions]").prop('checked', false);

      $('#persona_estado').select2({
        dropdownParent: $('#modal_agregar_editar_persona .modal-body'),
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

      $('#persona_municipio').select2({
        dropdownParent: $('#modal_agregar_editar_persona .modal-body'),
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

    /== evento para cerrar modal de agregar personas ==/
    $('#btn_cerrar_modal_persona').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_persona').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar personas ==/
    $('#btn_cancelar_modal_persona').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_persona').modal('hide');
      location.reload();
    });

    /== evento para cargar los municipios segun el estado que se escoja ==/
    $('#persona_estado').on('change', function() {
      //aplicar validacion al select estados cada vez que se escoja una opcion
      // $(this).trigger('blur');

      
      var id_estado = $(this).val();
      var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
      var optionEmpty = $("<option/>").val('-').text('-----------');

      // vaciar select municipios
      $.each($('#persona_municipio').find("option"), function (key, value) {
        $(value).remove();
      });

      if (id_estado == 'sel') {
        $('#persona_municipio').find("option").end().append(optionEmpty.attr('selected', true));
      } else {
        $.ajax({
          url: "/municipio/get_municipios_by_estado",
          data: {
            id_estado: id_estado
          },
          type: "get",
          dataType: "json",
          success: function(response) {
            if (response.mensaje == 'success') {
              $('#persona_municipio').find("option").end().append(optionSeleccione);

              $.each(response.municipios, function (key, value) {
                var option = $("<option/>").val(value.id).text(value.nombre);

                if (id_municipio != '') {
                  // llenar select municipio en modal editar
                  if (value.id == id_municipio) {
                    $('#persona_municipio').find("option").end().append(option.attr('selected', true));
                  } else {
                    $('#persona_municipio').find("option").end().append(option);
                  }
                } else {
                  // llenar select municipio en modal agregar
                  $('#persona_municipio').find("option").end().append(option);
                }
              });

              $('#persona_municipio').trigger("chosen:updated").trigger("change");
            } else {
              $('#persona_municipio').find("option").end().append(optionEmpty.attr('selected', true));
            }
          },
          error: function(response) {
            
          }
        });
      }
    });

    //== evento para validar select municipios cada vez que se escoja una opcion ==/
    // $('#persona_municipio').on('change', function() {
    //   //aplicar validacion al select municipios cada vez que se escoja una opcion
    //   $(this).trigger('blur');
    // });

    /== evento para agregar o editar una persona ==/
    $('#btn_agregar_persona').on('click', function () {
      if ($('#form_persona').valid() == true) {
        var id = $('#id_persona').val();
        var nombre_persona = $('#nombre_persona').val();
        var segundo_nombre_persona = $('#segundo_nombre_persona').val();
        var apellido_persona = $('#apellido_persona').val();
        var segundo_apellido_persona = $('#segundo_apellido_persona').val();
        var email_persona = $('#email_persona').val();
        var fecha_nacimiento = $('#fecha_nacimiento').val();
        var telefono_contacto = $('#telefono_contacto').val();
        var direccion_persona = $('#direccion_persona').val();
        var nombre_emergencia = $('#nombre_emergencia').val();
        var parentesco = $('#parentesco').val();
        var telefono_emergencia = $('#telefono_emergencia').val();
        var nombre_responsable = $('#nombre_responsable').val();
        var sexo = devolverSexo();
        var estado = $('#persona_estado').val();
        var municipio = $('#persona_municipio').val();
        var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
        var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
        var btn = $(this);
        btn.html(loadingTextBtn);

        if (sexo == '') {
          btn.html(textOriginalBtn);
          notificacion('Error', 'Debe de seleccionar un Sexo', 'error');
        } else if (estado == 'sel' || estado == '-') {
          btn.html(textOriginalBtn);
          notificacion('Error', 'Debe de escojer un Estado', 'error');
        } else if (municipio == 'sel' || municipio == '-') {
          btn.html(textOriginalBtn);
          notificacion('Error', 'Debe de escojer un Municipio', 'error');
        } else {
          $.ajax({
            url: "/persona/agregar_persona",
            data: {
              id: id ? id : '',
              nombre: nombre_persona,
              segundo_nombre: segundo_nombre_persona,
              apellido: apellido_persona,
              segundo_apellido: segundo_apellido_persona,
              email: email_persona,
              fecha_nacimiento: fecha_nacimiento,
              telefono: telefono_contacto,
              direccion: direccion_persona,
              nombre_emergencia: nombre_emergencia,
              parentesco: parentesco,
              telefono_emergencia: telefono_emergencia,
              nombre_responsable: nombre_responsable,
              sexo: sexo,
              id_estado: estado,
              id_municipio: municipio
            },
            dataType: "json",
            success: function(response) {
              if (response.tipo_mensaje == 'success') {
                if (response.accion == 'agregar') {
                  notificacion('', response.mensaje, response.tipo_mensaje);
                  btn.html(textOriginalBtn);
                  limpiarCampos();
                  getPersonas();
                } else if (response.accion == 'editar') {
                  btn.html(textOriginalBtn);
                  limpiarCampos();
                  $('#modal_agregar_editar_persona').modal('hide');
                  $('#id_persona').val('');

                  swal({
                    title: "",
                    text: "Se han editado correctamente los datos de la Persona seleccionada",
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
      }
    });

    /== evento para llenar los campos del modal editar municipios ==/
    $('#btn_editar_persona').on('click', function() {
      $('#modal_agregar_editar_persona').modal('show');
      $('#modal_agregar_editar_persona').find('.modal-title').text('Editar Persona');
      $('#btn_agregar_persona').text('Editar');
      let id = $('#id_persona').val();

      $.ajax({
        url: "/persona/get_persona",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#persona_estado').select2({
            dropdownParent: $('#modal_agregar_editar_persona .modal-body'),
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

          $('#persona_municipio').select2({
            dropdownParent: $('#modal_agregar_editar_persona .modal-body'),
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
          
          $('#nombre_persona').val(response.nombre);
          $('#segundo_nombre_persona').val(response.segundo_nombre);
          $('#apellido_persona').val(response.apellido);
          $('#segundo_apellido_persona').val(response.segundo_apellido);
          $('#fecha_nacimiento').val(response.fecha_nacimiento);
          $('#telefono_contacto').val(response.telefono);
          $('#direccion_persona').val(response.direccion);
          $('#nombre_emergencia').val(response.nombre_emergencia);
          $('#parentesco').val(response.parentesco);
          $('#telefono_emergencia').val(response.telefono_emergencia);
          $('#nombre_responsable').val(response.nombre_responsable);
          $('#email_persona').val(response.email);

          if (response.sexo == 'Masculino') {
            $('#check_sexo_masculino').prop('checked', true);
          } else if (response.sexo == 'Femenino') {
            $('#check_sexo_femenino').prop('checked', true);
          } else if (response.sexo == 'Otro') {
            $('#check_sexo_otro').prop('checked', true);
          }

          llenarSelectEstados(response.estado.id);
          id_municipio = response.municipio.id;
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar una persona ==/
    $('#btn_eliminar_persona').on('click', function() {
      let id = $('#id_persona').val();
  
      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar esta Persona?',
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
          eliminarPersona(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de esta Persona',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_persona').val('');
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
          $('#block_actions_personas').css('display','block');
          $('#alerta_personas_estados').css('display','none');
          $('#alerta_personas').css('display','none');
        } else if (response.mensaje == 'error') {
          //no mostrar btn de acciones y agregar y mostrar alerta
          $('#block_actions_personas').css('display','none');
          $('#alerta_personas_estados').css('display','block');
          $('#alerta_personas').css('display','block');
          $('#btn_nueva_persona').css('display','none');
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para verificar que existen municipios ==/
  function existenMunicipios() {
    $.ajax({
      url: "/municipio/get_municipios",
      type: "get",
      dataType: "json",
      success: function(response) {
        if (response.mensaje == 'success') {
          //mostrar btn de acciones y agregar
          $('#block_actions_personas').css('display','block');
          $('#alerta_personas_municipios').css('display','none');
          $('#alerta_personas').css('display','none');
        } else if (response.mensaje == 'error') {
          //no mostrar btn de acciones y agregar y mostrar alerta
          $('#block_actions_personas').css('display','none');
          $('#alerta_personas_municipios').css('display','block');
          $('#alerta_personas').css('display','block');
          $('#btn_nueva_persona').css('display','none');
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para obtener todas las personas ==/
  function getPersonas() {
    $.ajax({
      url: "/persona/lista_persona",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarPersonas(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de personas ==/
  function listarPersonas(datos) {
    let tabla = new DataTable('#tabla_personas', {
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
      scrollX: true,
      "aLengthMenu": [5, 10, 25, 50],
      order: [[0, 'desc']],
      data: datos,
      columns: [
        { data: 'nombre' },
        { data: 'apellido'},
        { data: 'email'},
        { data: 'sexo'},
        { data: 'fecha_nacimiento'},
        { data: 'telefono'},
        { data: 'direccion'},
        { data: 'nombre_emergencia'},
        { data: 'telefono_emergencia'},
        { data: 'parentesco'},
        { data: 'nombre_responsable'},
        { data: 'estado.nombre'},
        { data: 'municipio.nombre'},
        { data: 'activo'}
      ],
      rowCallback: function(row, data) {
        $($(row).find('td')[0]).html(data.nombre + ' ' + data.segundo_nombre);
        $($(row).find('td')[1]).html(data.apellido + ' ' + data.segundo_apellido);
        $($(row).find('td')[13]).html(data.activo ? 'Sí' : 'No');
      },
      initComplete: function() {
        $('#dropdown_acciones_listado_personas').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nueva_persona').css('display', 'block');
        $('#dropdown_acciones_listado_personas').css('display', 'none');
        $('#id_persona').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nueva_persona').css('display', 'none');
        $('#dropdown_acciones_listado_personas').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_persona').val(data.id);

        if (data.activo == false) {
          $('#btn_eliminar_persona').css('display', 'none');
        } else {
          $('#btn_eliminar_persona').css('display', 'block');
        }
      }
    });
  }

  /== funcion para eliminar una persona ==/
  function eliminarPersona(id) {
    $.ajax({
      url: "/persona/eliminar_persona",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_persona').val('');
          
          swal({
            title: "Eliminado",
            text: "La Persona seleccionada ya no se encuentra activa en el sistema",
            type: "success",
            showCancelButton: false,
            confirmButtonClass: "btn-success",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            location.reload();
          });
        } else if (response.tipo_mensaje == 'error_user_asociado') {
          $('#id_persona').val('');

          swal({
            text: response.mensaje,
            title: "Eliminación fallida",
            type: "error",
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
            $('#persona_estado').find("option").end().append(optionSeleccione);
          } else {
            $('#persona_estado').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.estados, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (id_estado != '') {
              // llenar select estados en modal de editar
              if (value.id == id_estado) {
                $('#persona_estado').find("option").end().append(option.attr('selected', true));
              } else {
                $('#persona_estado').find("option").end().append(option);
              }              
            } else {
              // llenar select estados en modal de agregar
              $('#persona_estado').find("option").end().append(option);
            }            
          });

          $('#persona_estado').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#persona_estado').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para limpiar los campos del modal ==/
  function limpiarCampos() {
    $('#id_persona').val('');
    $('#nombre_persona').val('');
    $('#segundo_nombre_persona').val('');
    $('#apellido_persona').val('');
    $('#segundo_apellido_persona').val('');
    $('#email_persona').val('');
    $('#fecha_nacimiento').val('');
    $('#telefono_contacto').val('');
    $('#direccion_persona').val('');
    $('#nombre_emergencia').val('');
    $('#parentesco').val('');
    $('#telefono_emergencia').val('');
    $('#nombre_responsable').val('');
    $("input[type='radio'][name=inlineRadioOptions]").prop('checked', false);

    $.each($('#persona_estado').find("option"), function (key, value) {
      $(value).remove();
    });
    llenarSelectEstados('');
    id_municipio = '';
  }

  /== funcion para devolver sexo ==/
  function devolverSexo() {
    var masculino = $('#check_sexo_masculino').is(":checked");
    var fememnino = $('#check_sexo_femenino').is(":checked");
    var otro = $('#check_sexo_otro').is(":checked");
    var sexo = '';

    if (masculino == true) {
      sexo = 'Masculino';
    } else if (fememnino == true) {
      sexo = 'Femenino';
    } else if (otro == true) {
      sexo = 'Otro';
    }

    return sexo
  }

  /== funcion para validar los campos del formulario ==/
  function validarCamposModalPersona() {
    $('#form_persona').validate({
      rules: {
        nombre_persona: {
          minlength: 2
        },
        segundo_nombre_persona: {
          minlength: 2
        },
        apellido_persona: {
          minlength: 2
        },
        segundo_apellido_persona: {
          minlength: 2
        },
        email_persona: {
          email: true
        },
        telefono_contacto: {
          minlength: 8
        },
        direccion_persona: {
          minlength: 10
        },
        nombre_emergencia: {
          minlength: 10
        },
        parentesco: {
          minlength: 2
        },
        telefono_emergencia: {
          minlength: 8
        }
        // ,
        // persona_estado: {
        //   validarSelectEstados: true
        // },
        // persona_municipio: {
        //   validarSelectMunicipios: true
        // }
      },
      messages: {
        nombre_persona: {
          required: 'Por favor ingrese el Nombre de la Persona',
          minlength: 'El Nombre de la Persona debe tener al menos 2 caracteres'
        },
        segundo_nombre_persona: {
          minlength: 'El Segundo Nombre de la Persona debe tener al menos 2 caracteres'
        },
        apellido_persona: {
          required: 'Por favor ingrese el Apellido de la Persona',
          minlength: 'El Apellido de la Persona debe tener al menos 2 caracteres'
        },
        segundo_apellido_persona: {
          required: 'Por favor ingrese el Segundo Apellido de la Persona',
          minlength: 'El Segundo Apellido de la Persona debe tener al menos 2 caracteres'
        },
        fecha_nacimiento: {
          required: 'Por favor escoja una fecha'
        },
        telefono_contacto: {
          required: 'Por favor ingrese un número de Teléfono',
          minlength: 'El Teléfono debe tener al menos 8 caracteres'
        },        
        email_persona: 'Por favor ingrese el Email de la Persona',
        direccion_persona: {
          required: 'Por favor ingrese la Dirección de la Persona',
          minlength: 'La dirección de la Persona debe tener al menos 10 caracteres'
        },
        nombre_emergencia: {
          required: 'Por favor ingrese el Nombre y Apellidos de la Persona a llamar',
          minlength: 'El Nombre de la Persona debe tener al menos 10 caracteres'
        },
        parentesco: {
          required: 'Por favor ingrese el Parentesco',
          minlength: 'El Parentesco debe tener al menos 2 caracteres'
        },
        telefono_emergencia: {
          required: 'Por favor ingrese un número de Teléfono',
          minlength: 'El Teléfono debe tener al menos 8 caracteres'
        }
        // ,
        // persona_estado: {
        //   validarSelectEstados: 'Seleccione un Estado'
        // },
        // persona_municipio: {
        //   validarSelectMunicipios: 'Seleccione un Municipio'
        // }
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
  personas.init();
});