var crear_cuenta = function () {
  var $ = jQuery.noConflict();
  var currentStep = 1;
  var form = $('#wizardForm');
  var steps = $('.form-step');
  var progressSteps = $('.step');
  var prevBtn = $('.btn-prev');
  var nextBtn = $('.btn-next');
  var submitBtn = $('.btn-submit');
  var id_tipo_persona_udg = '';
  var id_estado = '';
  var id_municipio = '';
  var selectedTipoPersona = '';

  
  $('.cc_fecha_nacimiento_persona').datepicker({
    format: 'dd/mm/yyyy',
    language: 'es',
    todayHighlight: true,
    autoclose: true
  });

  /== evento para validar que escriban en el campo del telefono solo numeros y () - ==/
  $('.input-number').on('input', function () { 
    this.value = this.value.replace(/[^0-9 ()-]/g,'');
  });

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid"
  });

  /== agregar regla al pluging validate para validar contraseña ==/
  $.validator.addMethod("validarContrasenna", function(value, element) {
    return this.optional(element) || value.length >= 8 && /\d/.test(value) && /[a-z]/i.test(value);
  }, 'La contraseña debe tener por lo menos 8 caracteres y al menos un número y una letra');

  function initEvents() {
    // inicializar el RadioButtons de Comunidad Universitaria seleccionado
    $('#tipo_persona_cu').prop('checked', true);
     // Initialize form
    updateButtons();

    // Handle next button click
    nextBtn.click(function() {
      if (currentStep < steps.length) {
        currentStep++;

        switch (currentStep) {
        case 2:
          fillFormPersona();
          updateForm();
          break;
        case 3:
          validarFormPersona();
          validarFormPersona1();
          
          if ($('#form_persona_cc').valid() == true) {
            if (validarFormPersona1() == true) {
              currentStep--;
              updateForm();
              notificacion('Error', 'Faltan campos obligatorios por llenar o seleccionar', 'error');
            } else {
              // ver si existe la persona en la BD
              $.ajax({
                url: "/persona/existe_persona",
                type: "get",
                dataType: "json",
                data: {
                  nombre: $('#cc_nombre_persona').val(),
                  segundo_nombre: $('#cc_segundo_nombre_persona').val(),
                  apellido: $('#cc_apellido_persona').val(),
                  segundo_apellido: $('#cc_segundo_apellido_persona').val(),
                },
                success: function(response) {
                  if (response.tipo_mensaje == 'error') {
                    currentStep--;
                    updateForm();
                    notificacion('Error', response.mensaje, response.tipo_mensaje);
                  } else if (response.tipo_mensaje == 'success') {
                    updateForm();
                    limpiarCamposUsuario();
                  }
                },
                error: function(response) { }
              });
            }
          } else {
            currentStep--;
            updateForm();
          }

          var nombre_persona = $('#cc_nombre_persona').val() + ($('#cc_segundo_nombre_persona').val() ? ' ' + $('#cc_segundo_nombre_persona').val() + ' ' : ' ') + $('#cc_apellido_persona').val() + ($('#cc_segundo_apellido_persona').val() ? ' ' + $('#cc_segundo_apellido_persona').val() : '');
          $('#form_usuario_cc h4').html(nombre_persona);

          updateForm();
          break;
        case 4:
          validarFormUsuario();

          if ($('#form_usuario_cc').valid() == true) {
            // ver si existe la persona en la BD
            $.ajax({
              url: "/usuario/existe_usuario",
              type: "get",
              dataType: "json",
              data: {
                usuario: $('#cc_nombre_usuario').val()
              },
              success: function(response) {
                if (response.tipo_mensaje == 'error') {
                  currentStep--;
                  updateForm();
                  notificacion('Error', response.mensaje, response.tipo_mensaje);
                } else if (response.tipo_mensaje == 'success') {
                  updateForm();
                  fillProfile();
                }
              },
              error: function(response) { }
            });
          } else {
            currentStep--;
            updateForm();
          }

          break;
        }
      }
    });

    // Handle previous button click
    prevBtn.click(function() {
      if (currentStep > 1) {
          currentStep--;
          updateForm();
      }

      if (currentStep == 1) {
        limpiarCamposPersona();
      }

      if (currentStep == 2) {
        limpiarCamposUsuario();
      }
    });

    /== radioButtons tipo de persona ==/
    $('.card').click(function() {
        // const radio = $(this).prev('input[type="radio"]');
        const radio = $(this).prev('.rb-tp');
        radio.prop('checked', true);
        
        // Add animation effect
        $(this).addClass('pulse');
        setTimeout(() => {
            $(this).removeClass('pulse');
        }, 300);
        
        selectedTipoPersona = radio.val();
        console.log('Selected tipo de persona:', selectedTipoPersona);
    });

    /== evento para cargar los municipios segun el estado que se escoja ==/
    $('#cc_persona_estado').on('change', function() {
      var id_estado = $(this).val();
      var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
      var optionEmpty = $("<option/>").val('-').text('-----------');

      // vaciar select municipios
      $.each($('#cc_persona_municipio').find("option"), function (key, value) {
        $(value).remove();
      });

      if (id_estado == 'sel') {
        $('#cc_persona_municipio').find("option").end().append(optionEmpty.attr('selected', true));
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
              $('#cc_persona_municipio').find("option").end().append(optionSeleccione);

              $.each(response.municipios, function (key, value) {
                var option = $("<option/>").val(value.id).text(value.nombre);

                if (id_municipio != '') {
                  // llenar select municipio en modal editar
                  if (value.id == id_municipio) {
                    $('#cc_persona_municipio').find("option").end().append(option.attr('selected', true));
                  } else {
                    $('#cc_persona_municipio').find("option").end().append(option);
                  }
                } else {
                  // llenar select municipio en modal agregar
                  $('#cc_persona_municipio').find("option").end().append(option);
                }
              });

              $('#cc_persona_municipio').trigger("chosen:updated").trigger("change");
            } else {
              $('#cc_persona_municipio').find("option").end().append(optionEmpty.attr('selected', true));
            }
          },
          error: function(response) {}
        });
      }
    });

    /== guardar todos los datos ==/
    $('#btn_crear_nueva_cuenta').on('click', function() {
      var textOriginalBtn = '<span class="indicator-label">Guardar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);
      guardarPersona(btn, textOriginalBtn);
    });

  }

  // Update form display
  function updateForm() {
    steps.removeClass('active');
    progressSteps.removeClass('active');
    $(`.form-step[data-step="${currentStep}"]`).addClass('active');

    progressSteps.each(function(index) {
        if (index < currentStep) {
            $(this).addClass('active');
        }
    });

    updateButtons();
  }

  // Update button visibility
  function updateButtons() {
      prevBtn.toggle(currentStep > 1);
      nextBtn.toggle(currentStep < steps.length);
      submitBtn.toggle(currentStep === steps.length);
  }

  function fillFormPersona() {
    $('#cc_persona_estado').select2({
      dropdownParent: $('.select-estado-cc'),
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

    $('#cc_persona_municipio').select2({
      dropdownParent: $('.select-municipio-cc'),
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

    $('#cc_tipo_persona_udg').select2({
      dropdownParent: $('.select-tipo-persona-udg'),
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

    llenarSelectTipoPersonaUdg('');
    llenarSelectEstados('');

    if (selectedTipoPersona == 'cu') {
      $('#cc_comunidad_universitaria').css('display', 'block');
    } else if (selectedTipoPersona == 'pg') {
      $('#cc_comunidad_universitaria').css('display', 'none');
    }
  }

  function llenarSelectTipoPersonaUdg(id_tipo_persona_udg) {
    $.ajax({
      url: "/tipo_persona_udg/get_all_tipo_persona_udg",
      type: "get",
      dataType: "json",
      success: function(response) {
        var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
        var optionEmpty = $("<option/>").val('-').text('-----------');

        if (response.mensaje == 'success') {
          if (id_tipo_persona_udg != '') {
            $('#cc_tipo_persona_udg').find("option").end().append(optionSeleccione);
          } else {
            $('#cc_tipo_persona_udg').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.tipos_personas, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              $('#cc_tipo_persona_udg').find("option").end().append(option);

              if (id_tipo_persona_udg != '') {
                if (value.id == id_tipo_persona_udg) {
                  $('#cc_tipo_persona_udg').find("option").end().append(option.attr('selected', true));
                } else {
                  $('#cc_tipo_persona_udg').find("option").end().append(option);
                }                          
              } else {
                $('#cc_tipo_persona_udg').find("option").end().append(option);
              }
            }
          });

          $('#cc_tipo_persona_udg').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#cc_tipo_persona_udg').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) { }
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
            $('#cc_persona_estado').find("option").end().append(optionSeleccione);
          } else {
            $('#cc_persona_estado').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.estados, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (id_estado != '') {
              // llenar select estados en modal de editar
              if (value.id == id_estado) {
                $('#cc_persona_estado').find("option").end().append(option.attr('selected', true));
              } else {
                $('#cc_persona_estado').find("option").end().append(option);
              }              
            } else {
              // llenar select estados en modal de agregar
              $('#cc_persona_estado').find("option").end().append(option);
            }            
          });

          $('#cc_persona_estado').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#cc_persona_estado').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  function validarFormPersona() {
    $('#form_persona_cc').validate({
      rules: {
        cc_nombre_persona: {
          minlength: 2
        },
        cc_segundo_nombre_persona: {
          minlength: 2
        },
        cc_apellido_persona: {
          minlength: 2
        },
        cc_segundo_apellido_persona: {
          minlength: 2
        },
        cc_email_persona: {
          email: true
        },
        cc_telefono_contacto: {
          minlength: 8
        },
        cc_direccion_persona: {
          minlength: 10
        },
        cc_nombre_emergencia: {
          minlength: 10
        },
        cc_parentesco: {
          minlength: 2
        },
        cc_telefono_emergencia: {
          minlength: 8
        }
      },
      messages: {
        cc_nombre_persona: {
          required: 'Por favor ingrese el Nombre de la Persona',
          minlength: 'El Nombre de la Persona debe tener al menos 2 caracteres'
        },
        cc_segundo_nombre_persona: {
          minlength: 'El Segundo Nombre de la Persona debe tener al menos 2 caracteres'
        },
        cc_apellido_persona: {
          required: 'Por favor ingrese el Apellido de la Persona',
          minlength: 'El Apellido de la Persona debe tener al menos 2 caracteres'
        },
        cc_segundo_apellido_persona: {
          required: 'Por favor ingrese el Segundo Apellido de la Persona',
          minlength: 'El Segundo Apellido de la Persona debe tener al menos 2 caracteres'
        },
        cc_fecha_nacimiento: {
          required: 'Por favor escoja una fecha'
        },
        cc_telefono_contacto: {
          required: 'Por favor ingrese un número de Teléfono',
          minlength: 'El Teléfono debe tener al menos 8 caracteres'
        },        
        cc_email_persona: 'Por favor ingrese el Email de la Persona',
        cc_direccion_persona: {
          required: 'Por favor ingrese la Dirección de la Persona',
          minlength: 'La dirección de la Persona debe tener al menos 10 caracteres'
        },
        cc_nombre_emergencia: {
          required: 'Por favor ingrese el Nombre y Apellidos de la Persona a llamar',
          minlength: 'El Nombre de la Persona debe tener al menos 10 caracteres'
        },
        cc_parentesco: {
          required: 'Por favor ingrese el Parentesco',
          minlength: 'El Parentesco debe tener al menos 2 caracteres'
        },
        cc_telefono_emergencia: {
          required: 'Por favor ingrese un número de Teléfono',
          minlength: 'El Teléfono debe tener al menos 8 caracteres'
        },
        cc_codigo_udg: {
          required: 'Por favor ingrese el Código UDG',
        }
      }
    });
  }

  function validarFormPersona1() {
    var error = false;
    var sexo = devolverSexo();
    var genero = devolverGenero();
    var estado = $('#cc_persona_estado').val();
    var municipio = $('#cc_persona_municipio').val();
    var tipo_persona_udg = $('#cc_tipo_persona_udg').val();

    if (selectedTipoPersona == 'cu') {
      if (tipo_persona_udg == 'sel' || tipo_persona_udg == '-') {
        error = true;
      }
    }

    if (sexo == '') {
      error = true;
    } else if (genero == '') {
      error = true;
    } else if (estado == 'sel' || estado == '-') {
      error = true;
    } else if (municipio == 'sel' || municipio == '-') {
      error = true;
    }

    return error;
  }

   /== funcion para devolver genero ==/
  function devolverGenero() {
    var genero = '';
    var masculino = $('#cc_check_genero_masculino').is(":checked");
    var fememnino = $('#cc_check_genero_femenino').is(":checked");
    var no_binario = $('#cc_check_genero_no_binario').is(":checked");

    if (masculino == true) {
      genero = 'M';
    } else if (fememnino == true) {
      genero = 'F';
    } else if (no_binario == true) {
      genero = 'B';
    }

    return genero
  }

   /== funcion para devolver sexo ==/
  function devolverSexo() {
    var sexo = '';
    var hombre = $('#cc_check_sexo_hombre').is(":checked");
    var mujer = $('#cc_check_sexo_mujer').is(":checked");

    if (hombre == true) {
      sexo = 'H';
    } else if (mujer == true) {
      sexo = 'M';
    }

    return sexo
  }

  /== se carga solo al iniciar la pagina ==/
  function limpiarCamposPersona() {
    // datos form persona
    $('#cc_nombre_persona').val('');
    $('#cc_segundo_nombre_persona').val('');
    $('#cc_apellido_persona').val('');
    $('#cc_segundo_apellido_persona').val('');
    $('#cc_email_persona').val('');
    $('#cc_fecha_nacimiento').val('');
    $('#cc_telefono_contacto').val('');
    $('#cc_direccion_persona').val('');
    $('#cc_nombre_emergencia').val('');
    $('#cc_parentesco').val('');
    $('#cc_telefono_emergencia').val('');
    $('#cc_nombre_responsable').val('');
    $('#cc_codigo_udg').val('');
    $("input[type='radio'][name=inlineRadioOptionsCcSexo]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsCcGenero]").prop('checked', false);

    $.each($('#cc_persona_estado').find("option"), function (key, value) {
      $(value).remove();
    });

    $.each($('#cc_tipo_persona_udg').find("option"), function (key, value) {
      $(value).remove();
    });

    id_municipio = '';
  }

  function validarFormUsuario() {
    $('#form_usuario_cc').validate({
      rules: {
        cc_nombre_usuario: {
          minlength: 2
        },
        cc_contrasenna_usuario: {
          validarContrasenna: true
        },
        cc_confirmar_contrasenna_usuario: {
          equalTo: '#cc_contrasenna_usuario'
        },

      },
      messages: {
        cc_nombre_usuario: {
          required: 'Por favor ingrese el Nombre de Usuario',
          minlength: 'El Nombre del Usuario debe tener al menos 2 caracteres'
        },
        cc_contrasenna_usuario: {
          required: 'Por favor ingrese la Contraseña',
        },
        cc_confirmar_contrasenna_usuario: {
          required: 'Por favor confirme la Contraseña',
          equalTo: 'Por favor ingrese nuevamente la misma Contraseña'
        }
      }
    });
  }

  function limpiarCamposUsuario() {
    $('#cc_nombre_usuario').val('');
    $('#cc_contrasenna_usuario').val('');
    $('#cc_confirmar_contrasenna_usuario').val('');
    $("#cc_trabajador_ley").prop("checked", false);
  }

  function fillProfile() {
    $('#full_name_profile').html($('#cc_nombre_persona').val() + ($('#cc_segundo_nombre_persona').val() ? ' ' + $('#cc_segundo_nombre_persona').val() + ' ' : ' ') + $('#cc_apellido_persona').val() + ($('#cc_segundo_apellido_persona').val() ? ' ' + $('#cc_segundo_apellido_persona').val() : ''));
    $('#email_profile').html($('#cc_email_persona').val());
    $('#birth_date_profile').html($('#cc_fecha_nacimiento').val());
    $('#user_profile').html($('#cc_nombre_usuario').val());
    $('#phone_profile').html($('#cc_telefono_contacto').val());
    $('#address_profile').html($('#cc_direccion_persona').val());
    $('#sex_profile').html(devolverSexo() == 'H' ? 'Hombre' : 'Mujer');

  }

  function guardarPersona(btn, textOriginalBtn) {
    var nombre_persona = $('#cc_nombre_persona').val();
    var segundo_nombre_persona = $('#cc_segundo_nombre_persona').val();
    var apellido_persona = $('#cc_apellido_persona').val();
    var segundo_apellido_persona = $('#cc_segundo_apellido_persona').val();
    var email_persona = $('#cc_email_persona').val();
    var fecha_nacimiento = $('#cc_fecha_nacimiento').val();
    var telefono_contacto = $('#cc_telefono_contacto').val();
    var direccion_persona = $('#cc_direccion_persona').val();
    var nombre_emergencia = $('#cc_nombre_emergencia').val();
    var parentesco = $('#cc_parentesco').val();
    var telefono_emergencia = $('#cc_telefono_emergencia').val();
    var nombre_responsable = $('#cc_nombre_responsable').val();
    var sexo = devolverSexo();
    var genero = devolverGenero();
    var estado = $('#cc_persona_estado').val();
    var municipio = $('#cc_persona_municipio').val();
    var tipo_persona_udg = $('#cc_tipo_persona_udg').val();
    var codigo_udg = $('#cc_codigo_udg').val();

    $.ajax({
      url: "/persona/agregar_persona_no_autenticacion",
      data: {
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
        genero: genero,
        id_estado: estado,
        id_municipio: municipio,
        id_tipo_persona_udg: tipo_persona_udg,
        codigo_udg: codigo_udg,
        tipo_persona: selectedTipoPersona
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          var id_persona = response.id;
          guardarUsuario(id_persona, btn, textOriginalBtn);
        } else if (response.tipo_mensaje == 'error') {
          notificacion('Error','Ocurrió un problema al guardar los datos.', 'error');
          btn.html(textOriginalBtn);
        }
      },
      error: function(response) {
        notificacion('Error','Ocurrió un problema al guardar los datos.', 'error');
        btn.html(textOriginalBtn);
      }
    });
  }
  
  function guardarUsuario(id_persona, btn, textOriginalBtn) {
    var usuario = $('#cc_nombre_usuario').val();
    var contrasenna = $('#cc_contrasenna_usuario').val();
    var trabajador_ley = $('#trabajador_ley').is(":checked");

    $.ajax({
      url: "/usuario/agregar_usuario_no_autenticacion",
      data: {
        usuario: usuario,
        contrasenna: contrasenna,
        persona: id_persona,
        trabajador_ley: trabajador_ley
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          notificacion('', 'Se han guardado satisfactoriamente los datos.', 'success');
          btn.html(textOriginalBtn);
          $('#btn_crear_nueva_cuenta').css('display', 'none');
          $('#btn_inicio_sesion').css('display', 'block');
        } else if (response.tipo_mensaje == 'error') {
          notificacion('Error','Ocurrió un problema al guardar los datos.', 'error');
        btn.html(textOriginalBtn);
        }
      },
      error: function(response) {
        notificacion('Error','Ocurrió un problema al guardar los datos.', 'error');
        btn.html(textOriginalBtn);
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
  crear_cuenta.init();
});