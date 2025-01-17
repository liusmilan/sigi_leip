var usuario = function () {
  var $ = jQuery.noConflict();
  var id_persona = '';
  var lista_roles = '';

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid"
  });

  /== agregar regla al pluging validate para validar contraseña ==/
  $.validator.addMethod("validarContrasenna", function(value, element) {
    return this.optional(element) || value.length >= 8 && /\d/.test(value) && /[a-z]/i.test(value);
  }, 'La contraseña debe tener por lo menos 8 caracteres y al menos un número y una letra');

  validarCamposModalUsuario();

  function initEvents() {
    existenRoles();
    existenPersonas();
    getUsuarios();

    /== evento para cerrar modal de agregar usuarios ==/
    $('#btn_cerrar_modal_usuario').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_usuario').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar usuarios ==/
    $('#btn_cancelar_modal_usuario').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_usuario').modal('hide');
      location.reload();
    });

    /== evento para mostrar modal de agregar usuarios ==/
    $('#btn_nuevo_usuario').on('click', function () {
      $('#modal_agregar_editar_usuario').modal('show');
      $('#modal_agregar_editar_usuario').find('.modal-title').text('Agregar Usuarios');
      $('#btn_agregar_usuario').text('Agregar');
      
      $('#persona_usuario').select2({
        dropdownParent: $('#modal_agregar_editar_usuario .modal-body'),
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

      $('#rol_usuario').select2({
        dropdownParent: $('#modal_agregar_editar_usuario .modal-body'),
        width: '100%',
        placeholder: 'Seleccione...',
        language: {
          noResults: function() {
            return "No hay resultado";        
          },
          searching: function() {
            return "Buscando..";
          }
        }
      });

      llenarSelectPersonas('');
      llenarSelectRoles('');
    });
   
    /== evento para agregar o editar un usuario ==/
    $('#btn_agregar_usuario').on('click', function () {
      if ($('#form_usuario').valid() == true) {
        var id = $('#id_usuario').val();
        var usuario = $('#nombre_usuario').val();
        var contrasenna = $('#contrasenna_usuario').val();
        var persona = $('#persona_usuario').val();
        var roles = $('#rol_usuario').val();
        var trabajador_ley = $('#trabajador_ley').is(":checked");
        var usuario_habilitado = $('#usuario_habilitado').is(":checked");
        var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
        var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
        var btn = $(this);
        btn.html(loadingTextBtn);

        if (persona == 'sel' || persona == '-') {
          btn.html(textOriginalBtn);
          notificacion('Error', 'Debe de escojer una Persona', 'error');
        } else if (roles.length == 0) {
          btn.html(textOriginalBtn);
          notificacion('Error', 'Debe de escojer al menos un Rol', 'error');
        } else {
          $.ajax({
            url: "/usuario/agregar_usuario",
            data: {
              id: id ? id : '',
              usuario: usuario,
              contrasenna: contrasenna,
              persona: persona,
              'roles[]': roles,
              trabajador_ley: trabajador_ley,
              usuario_habilitado: usuario_habilitado
            },
            dataType: "json",
            success: function(response) {
              if (response.tipo_mensaje == 'success') {
                if (response.accion == 'agregar') {
                  notificacion('', response.mensaje, response.tipo_mensaje);
                  btn.html(textOriginalBtn);
                  limpiarCampos();
                  getUsuarios();
                } else if (response.accion == 'editar') {
                  btn.html(textOriginalBtn);
                  limpiarCampos();
                  $('#modal_agregar_editar_usuario').modal('hide');
                  $('#id_usuario').val('');

                  swal({
                    title: "",
                    text: "Se han editado correctamente los datos del Usuario seleccionado",
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

    /== evento para llenar los campos del modal editar usuarios ==/
    $('#btn_editar_usuario').on('click', function() {
      $('#modal_agregar_editar_usuario').modal('show');
      $('#modal_agregar_editar_usuario').find('.modal-title').text('Editar Usuario');
      $('#btn_agregar_usuario').text('Editar');
      $('#user_pass').css('display', 'none');
      $('#user_confirm_pass').css('display', 'none');

      let id = $('#id_usuario').val();

      $.ajax({
        url: "/usuario/get_usuario",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_usuario').val(response.nombre_usuario);

          $('#persona_usuario').select2({
            dropdownParent: $('#modal_agregar_editar_usuario .modal-body'),
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
    
          $('#rol_usuario').select2({
            dropdownParent: $('#modal_agregar_editar_usuario .modal-body'),
            width: '100%',
            placeholder: 'Seleccione...',
            language: {
              noResults: function() {
                return "No hay resultado";        
              },
              searching: function() {
                return "Buscando..";
              }
            }
          });

          //roles
          var roles_json=$.parseJSON(response.roles);
          var roles=[];

          for (element in roles_json) {
            var obj={
              id: roles_json[element]["pk"]
            };
            roles.push(obj);
          };

          if (response.trabajador_ley == true) {
            $('#trabajador_ley').prop('checked', true);
          } else {
            $('#trabajador_ley').prop('checked', false);
          }

          if (response.usuario_activo == true) {
            $('#usuario_habilitado').prop('checked', true);
          } else {
            $('#usuario_habilitado').prop('checked', false);
          }

          llenarSelectPersonas(response.persona.id);
          llenarSelectRoles(roles);
        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un usuario ==/
    $('#btn_eliminar_usuario').on('click', function() {
      let id = $('#id_usuario').val();
  
      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Usuario?',
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
          eliminarUsuario(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Usuario',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_usuario').val('');
            location.reload();
          });
        }        
      });
    });
  }

  /== funcion para obtener todos los usuarios ==/
  function getUsuarios() {
    $.ajax({
      url: "/usuario/lista_usuario",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarUsuarios(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de usuarios ==/
  function listarUsuarios(datos) {
    let tabla = new DataTable('#tabla_usuarios', {
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
      scrollY: '400px',
      scrollColapse: true,
      "aLengthMenu": [5, 10, 25, 50],
      order: [[0, 'desc']],
      data: datos,
      columns: [
        { data: 'nombre' },
        { data: 'persona.nombre' },
        { data: 'roles' },
        { data: 'trabajador_ley' },
        { data: 'usuario_activo' }
      ],
      rowCallback: function(row, data) {
        $($(row).find('td')[1]).html(data.persona.nombre + ' ' + data.persona.segundo_nombre + ' ' + data.persona.apellido + ' ' + data.persona.segundo_apellido);
        //$($(row).find('td')[3]).html(data.tipo_usuario == 'cu' ? 'Comunidad Universitaria' : data.tipo_usuario == 'pg' ? 'Población General' : '');
        $($(row).find('td')[3]).html(data.trabajador_ley ? 'Sí' : 'No');
        $($(row).find('td')[4]).html(data.usuario_activo ? 'Sí' : 'No');

        //roles
        var roles_json=$.parseJSON(data.roles);
        var datosRoles=[];
        var roles='';
        
        for (element in roles_json) { 
          datosRoles.push(roles_json[element]["fields"]);
        };

        for (el in datosRoles) {
          if (el < datosRoles.length-1) {
            roles+=datosRoles[el].nombre + ', '
          } else {
            roles+=datosRoles[el].nombre
          }
        }

        $($(row).find('td')[2]).html(roles);
      },
      initComplete: function() {
        $('#dropdown_acciones_listado_usuario').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_usuario').css('display', 'block');
        $('#dropdown_acciones_listado_usuario').css('display', 'none');
        $('#id_usuario').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_usuario').css('display', 'none');
        $('#dropdown_acciones_listado_usuario').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_usuario').val(data.id);

        if (data.activo == false) {
          $('#btn_eliminar_usuario').css('display', 'none');
        } else {
          $('#btn_eliminar_usuario').css('display', 'block');
        }
      }
    });
  }

  /== funcion para verificar que existen roles ==/
  function existenRoles() {
    $.ajax({
      url: "/rol/get_roles",
      type: "get",
      dataType: "json",
      success: function(response) {
        if (response.mensaje == 'success') {
          //mostrar btn de acciones y agregar
          $('#block_actions_usuarios').css('display','block');
          $('#alerta_roles_usuarios').css('display','none');
          $('#alerta_usuarios').css('display','none');
        } else if (response.mensaje == 'error') {
          //no mostrar btn de acciones y agregar y mostrar alerta
          $('#block_actions_usuarios').css('display','none');
          $('#alerta_roles_usuarios').css('display','block');
          $('#alerta_usuarios').css('display','block');
          $('#btn_nuevo_usuario').css('display','none');
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para verificar que existen personas ==/
  function existenPersonas() {
    $.ajax({
      url: "/persona/get_personas",
      type: 'get',
      dataType: "json",
      success: function(response) {
        if (response.mensaje == 'success') {
          //mostrar btn de acciones y agregar
          $('#block_actions_usuarios').css('display','block');
          $('#alerta_personas_usuarios').css('display','none');
          $('#alerta_usuarios').css('display','none');
        } else if (response.mensaje == 'error') {
          //no mostrar btn de acciones y agregar y mostrar alerta
          $('#block_actions_usuarios').css('display','none');
          $('#alerta_personas_usuarios').css('display','block');
          $('#alerta_usuarios').css('display','block');
          $('#btn_nuevo_usuario').css('display','none');
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para llenar el select de las personas ==/
  function llenarSelectPersonas(id_persona) {
    $.ajax({
      url: "/persona/get_personas",
      type: "get",
      dataType: "json",
      success: function(response) {
        var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
        var optionEmpty = $("<option/>").val('-').text('-----------');

        if (response.mensaje == 'success') {
          if (id_persona != '') {
            $('#persona_usuario').find("option").end().append(optionSeleccione);
          } else {
            $('#persona_usuario').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.personas, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre + (value.segundo_nombre ? ' ' + value.segundo_nombre + ' ' : ' ') + value.apellido + (value.segundo_apellido ? ' ' + value.segundo_apellido : ' '));

            if (id_persona != '') {
              // llenar select personas en modal de editar
              if (value.id == id_persona) {
                $('#persona_usuario').find("option").end().append(option.attr('selected', true));
              } else {
                if (!value.has_user) {
                  if (value.activo == true) {
                    $('#persona_usuario').find("option").end().append(option);
                  }
                }
              }              
            } else {
              // llenar select personas en modal de agregar
              if (!value.has_user) {
                if (value.activo == true) {
                  $('#persona_usuario').find("option").end().append(option);
                }
              }
            }
          });

          $('#persona_usuario').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#persona_usuario').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para llenar el select de los roles ==/
  function llenarSelectRoles(lista_roles) {
    $.ajax({
      url: "/rol/get_roles",
      type: "get",
      dataType: "json",
      success: function(response) {
        var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
        var optionEmpty = $("<option/>").val('-').text('-----------');

        if (response.mensaje == 'success') {
          // if (lista_roles != '') {
          //   $('#rol_usuario').find("option").end().append(optionSeleccione);
          // } else {
          //   $('#rol_usuario').find("option").end().append(optionSeleccione.attr('selected', true));
          // }
          
          $.each(response.roles, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (lista_roles != '') {
              // llenar select roles en modal de editar
              $.each(lista_roles, function (k, val) {
                if (value.id == val.id) {
                  $('#rol_usuario').find("option").end().append(option.attr('selected', true));
                } else {
                  if (value.nombre == 'SOLICITANTE') {
                    $('#rol_usuario').find("option").end().append(option.attr('selected', true));
                  } else {
                    $('#rol_usuario').find("option").end().append(option);
                  }
                }
              });
            } else {
              if (value.nombre == 'SOLICITANTE') {
                $('#rol_usuario').find("option").end().append(option.attr('selected', true));
                // $('#rol_usuario option[value="' + value.id + '"]').prop('disabled', true);
              } else {
                // llenar select roles en modal de agregar
                $('#rol_usuario').find("option").end().append(option);
              }  
            }            
          });

          $('#rol_usuario').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#rol_usuario').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para limpiar los campos del modal ==/
  function limpiarCampos() {
    $('#id_usuario').val('');
    $('#nombre_usuario').val('');
    $('#contrasenna_usuario').val('');
    $('#confirmar_contrasenna_usuario').val('');
    
    $.each($('#persona_usuario').find("option"), function (key, value) {
      $(value).remove();
    });

    $.each($('#rol_usuario').find("option"), function (key, value) {
      $(value).remove();
    });

    llenarSelectPersonas('');
    llenarSelectRoles('');

    $("#trabajador_ley").prop("checked", false);
    $("#usuario_habilitado").prop("checked", false);

    id_persona = '';
    lista_roles = '';
  }

  /== funcion para validar los campos del formulario usuario ==/
  function validarCamposModalUsuario() {
    $('#form_usuario').validate({
      rules: {
        nombre_usuario: {
          minlength: 2
        },
        contrasenna_usuario: {
          validarContrasenna: true
        },
        confirmar_contrasenna_usuario: {
          equalTo: '#contrasenna_usuario'
        },

      },
      messages: {
        nombre_usuario: {
          required: 'Por favor ingrese el Nombre de Usuario',
          minlength: 'El Nombre del Usuario debe tener al menos 2 caracteres'
        },
        contrasenna_usuario: {
          required: 'Por favor ingrese la Contraseña',
        },
        confirmar_contrasenna_usuario: {
          required: 'Por favor confirme la Contraseña',
          equalTo: 'Por favor ingrese nuevamente la misma Contraseña'
        }
      }
    });
  }

  /== funcion para eliminar un usuario ==/
  function eliminarUsuario(id) {
    $.ajax({
      url: "/usuario/eliminar_usuario",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_usuario').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Usuario seleccionado",
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
  
  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  usuario.init();
});