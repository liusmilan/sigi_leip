var cambiar_contrasenna = function () {
  var $ = jQuery.noConflict();

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid"
  });

  /== agregar regla al pluging validate para validar contraseña ==/
  $.validator.addMethod("validarContrasenna", function(value, element) {
    return this.optional(element) || value.length >= 8 && /\d/.test(value) && /[a-z]/i.test(value);
  }, 'La contraseña debe tener por lo menos 8 caracteres y al menos un número y una letra');

  validarCampos();
  validarCamposFu();


  function initEvents() {
    /== eventos para cambiar contrasenna desde fuera del nom usuario ==/
    $('#link_cambiar_contrasenna').on('click', function() {
      $('#modal_cambiar_contrasenna').modal('show');
      $('#nueva_contrasenna_usuario').val('');
      $('#confirmar_nueva_contrasenna_usuario').val('');
    });

    $('#btn_cerrar_modal_cambiar_contrasenna').on('click', function() {
      $('#nueva_contrasenna_usuario').val('');
      $('#confirmar_nueva_contrasenna_usuario').val('');
      $('#modal_cambiar_contrasenna').modal('hide');
    });
    
    $('#btn_cancelar_modal_cambiar_contrasenna').on('click', function() {
      $('#nueva_contrasenna_usuario').val('');
      $('#confirmar_nueva_contrasenna_usuario').val('');
      $('#modal_cambiar_contrasenna').modal('hide');
    });

    $('#btn_guardar_contrasenna').on('click', function() {
      id_user_aut = $('#user_autenticado').val();
      var contrasenna = $('#nueva_contrasenna_usuario').val();

      var textOriginalBtn = '<span class="indicator-label"> Cambiar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      $.ajax({
            url: "/usuario/cambiar_contrasenna",
            data: {
              id_user_aut: id_user_aut,
              contrasenna: contrasenna
            },
            dataType: "json",
            success: function(response) {
              if (response.tipo_mensaje == 'success') {
                $('#nueva_contrasenna_usuario').val('');
                $('#confirmar_nueva_contrasenna_usuario').val('');
                $('#modal_cambiar_contrasenna').modal('hide');
                btn.html(textOriginalBtn);

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
                  
                });
              } else if (response.tipo_mensaje == 'error') {
                notificacion('Error',response.mensaje, response.tipo_mensaje);
                btn.html(textOriginalBtn);
              }
            },
            error: function(response) {
              btn.html(textOriginalBtn);
            }
          });
    });

    /== eventos para cambiar contrasenna desde el nom usuario ==/
    $('#btn_cambiar_contrasenna').on('click', function() {
      $('#modal_cambiar_contrasenna_from_user').modal('show');
      $('#nueva_contrasenna_usuario_fu').val('');
      $('#confirmar_nueva_contrasenna_usuario_fu').val('');
    });

    $('#btn_cerrar_modal_cambiar_contrasenna_fu').on('click', function() {
      $('#nueva_contrasenna_usuario_fu').val('');
      $('#confirmar_nueva_contrasenna_usuario_fu').val('');
      $('#modal_cambiar_contrasenna_from_user').modal('hide');
    });
    
    $('#btn_cancelar_modal_cambiar_contrasenna_fu').on('click', function() {
      $('#nueva_contrasenna_usuario_fu').val('');
      $('#confirmar_nueva_contrasenna_usuario_fu').val('');
      $('#modal_cambiar_contrasenna_from_user').modal('hide');
    });

    $('#btn_guardar_contrasenna_fu').on('click', function() {
      var contrasenna = $('#nueva_contrasenna_usuario_fu').val();
      var textOriginalBtn = '<span class="indicator-label"> Cambiar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      $.ajax({
        url: "/usuario/cambiar_contrasenna",
        data: {
          id_user_aut: $('#id_usuario').val(),
          contrasenna: contrasenna
        },
        dataType: "json",
        success: function(response) {
          if (response.tipo_mensaje == 'success') {
            $('#nueva_contrasenna_usuario_fu').val('');
            $('#confirmar_nueva_contrasenna_usuario_fu').val('');
            $('#modal_cambiar_contrasenna_from_user').modal('hide');
            btn.html(textOriginalBtn);

            swal({
              title: "Información",
              text: response.mensaje,
              type: response.tipo_mensaje,
              showCancelButton: false,
              confirmButtonClass: "btn-success",
              confirmButtonText: "Aceptar",
              closeOnConfirm: true
            },
            function() { });
          } else if (response.tipo_mensaje == 'error') {
            notificacion('Error',response.mensaje, response.tipo_mensaje);
            btn.html(textOriginalBtn);
          }
        },
        error: function(response) {
          btn.html(textOriginalBtn);
        }
      });
    });

  }

  /== funcion para validar los campos del formulario usuario ==/
  function validarCampos() {
    $('#form_contrasenna').validate({
      rules: {
        nueva_contrasenna_usuario: {
          validarContrasenna: true
        },
        confirmar_nueva_contrasenna_usuario: {
          equalTo: '#nueva_contrasenna_usuario'
        },

      },
      messages: {
        nueva_contrasenna_usuario: {
          required: 'Por favor ingrese la Nueva Contraseña',
        },
        confirmar_nueva_contrasenna_usuario: {
          required: 'Por favor confirme la Nueva Contraseña',
          equalTo: 'Por favor ingrese nuevamente la misma Contraseña'
        }
      }
    });
  }

  function validarCamposFu() {
    $('#form_contrasenna_fu').validate({
      rules: {
        nueva_contrasenna_usuario_fu: {
          validarContrasenna: true
        },
        confirmar_nueva_contrasenna_usuario_fu: {
          equalTo: '#nueva_contrasenna_usuario'
        },

      },
      messages: {
        nueva_contrasenna_usuario_fu: {
          required: 'Por favor ingrese la Nueva Contraseña',
        },
        confirmar_nueva_contrasenna_usuario_fu: {
          required: 'Por favor confirme la Nueva Contraseña',
          equalTo: 'Por favor ingrese nuevamente la misma Contraseña'
        }
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
  cambiar_contrasenna.init();
});