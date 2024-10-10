var institucion = function() {
  var $ = jQuery.noConflict();
  var id_tipo_institucion = '';

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid"
  });

  /== evento para validar que escriban en el campo del contacto solo numeros y () - ==/
  $('.input-number').on('input', function () { 
    this.value = this.value.replace(/[^0-9 ()-]/g,'');
  });

  validarCamposModalInstitucion();
  
  function initEvents() {
    getInstituciones();

    /== evento para cerrar modal de agregar instituciones ==/
    $('#btn_cerrar_modal_institucion').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_institucion').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar instituciones ==/
    $('#btn_cancelar_modal_institucion').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_institucion').modal('hide');
      location.reload();
    });

    /== evento para mostrar modal de agregar instituciones ==/
    $('#btn_nueva_institucion').on('click', function () {
      $('#modal_agregar_editar_institucion').modal('show');
      $('#modal_agregar_editar_institucion').find('.modal-title').text('Agregar Insituciones');
      $('#btn_agregar_institucion').text('Agregar');

      $('#tipo_institucion').select2({
        dropdownParent: $('#modal_agregar_editar_institucion .modal-body'),
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

      llenarSelectTipoInstitucion('');
    });

    /== evento para agregar o editar una institucion ==/
    $('#btn_agregar_institucion').on('click', function () {
      if ($('#form_institucion').valid() == true) {
        var id = $('#id_institucion').val();
        var nombre_institucion = $('#nombre_institucion').val();
        var tipo_institucion = $('#tipo_institucion').val();
        var descripcion_institucion = $('#descripcion_institucion').val();
        var domicilio_institucion = $('#domicilio_institucion').val();
        var contacto_institucion = $('#contacto_institucion').val();
        var correo_institucion = $('#correo_institucion').val();
        var sitio_web_institucion = $('#sitio_web_institucion').val();
        var estado_institucion = $('#estado_institucion').is(":checked");
        var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
        var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
        var btn = $(this);
        btn.html(loadingTextBtn);

        if (tipo_institucion == 'sel' || tipo_institucion == '-') {
          btn.html(textOriginalBtn);
          notificacion('Error', 'Debe de escojer un Tipo de Institución', 'error');
        } else {
          $.ajax({
            url: "/institucion/agregar_institucion",
            data: {
              id: id ? id : '',
              nombre: nombre_institucion,
              tipo_institucion: tipo_institucion,
              descripcion: descripcion_institucion,
              domicilio: domicilio_institucion,
              contacto: contacto_institucion,
              correo: correo_institucion,
              sitio_web: sitio_web_institucion,
              estado_institucion: estado_institucion
            },
            dataType: "json",
            success: function(response) {
              if (response.tipo_mensaje == 'success') {
                if (response.accion == 'agregar') {
                  notificacion('', response.mensaje, response.tipo_mensaje);
                  btn.html(textOriginalBtn);
                  limpiarCampos();
                  getInstituciones();
                } else if (response.accion == 'editar') {
                  btn.html(textOriginalBtn);
                  limpiarCampos();
                  $('#modal_agregar_editar_institucion').modal('hide');
                  $('#id_institucion').val('');

                  swal({
                    title: "",
                    text: "Se han editado correctamente los datos de la Institución seleccionada",
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

    /== evento para llenar los campos del modal editar institucion ==/
    $('#btn_editar_institucion').on('click', function() {
      $('#modal_agregar_editar_institucion').modal('show');
      $('#modal_agregar_editar_institucion').find('.modal-title').text('Editar Institución');
      $('#btn_agregar_institucion').text('Editar');
      let id = $('#id_institucion').val();

      $.ajax({
        url: "/institucion/get_institucion",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#nombre_institucion').val(response.nombre);
          $('#descripcion_institucion').val(response.descripcion);
          $('#domicilio_institucion').val(response.domicilio);
          $('#contacto_institucion').val(response.contacto);
          $('#correo_institucion').val(response.correo);
          $('#sitio_web_institucion').val(response.sitio_web);
    
          $('#tipo_institucion').select2({
            dropdownParent: $('#modal_agregar_editar_institucion .modal-body'),
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

          if (response.estado_institucion == true) {
            $('#estado_institucion').prop('checked', true);
          } else {
            $('#estado_institucion').prop('checked', false);
          }

          llenarSelectTipoInstitucion(response.tipo_institucion);
        }
      });
    });
    
    /== evento para mostrar notificacion de confirmacion para eliminar una institucion ==/
    $('#btn_eliminar_institucion').on('click', function() {
      let id = $('#id_institucion').val();
  
      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar esta Institución?',
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
          eliminarInstitucion(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de esta Institución',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_institucion').val('');
            location.reload();
          });
        }        
      });
    });
  }

  /== funcion para obtener todos las instituciones ==/
  function getInstituciones() {
    $.ajax({
      url: "/institucion/lista_institucion",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarInstituciones(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de instituciones ==/
  function listarInstituciones(datos) {
    let tabla = new DataTable('#tabla_instituciones', {
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
        { data: 'tipo_institucion' },
        { data: 'estado_institucion' },
        { data: 'nombre' },
        { data: 'descripcion' },
        { data: 'domicilio' },
        { data: 'contacto' },
        { data: 'correo' },
        { data: 'sitio_web' }  
      ],
      rowCallback: function(row, data) {
        $($(row).find('td')[0]).html(data.tipo_institucion == 'pu' ? 'Pública' : 'Privada');
        $($(row).find('td')[1]).html(data.estado_institucion ? 'Habilitado' : 'Desabilitado');
      },
      initComplete: function() {
        $('#dropdown_acciones_listado_institucion').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nueva_institucion').css('display', 'block');
        $('#dropdown_acciones_listado_institucion').css('display', 'none');
        $('#id_institucion').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nueva_institucion').css('display', 'none');
        $('#dropdown_acciones_listado_institucion').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_institucion').val(data.id);
      }
    });
  }

  /== funcion para llenar el select de tipo de institucion ==/
  function llenarSelectTipoInstitucion(id_tipo_institucion) {
    var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
    var optionEmpty = $("<option/>").val('-').text('-----------');
    var option1 = $("<option/>").val('pu').text('Pública');
    var option2 = $("<option/>").val('pv').text('Privada');

    if (id_tipo_institucion != '') {
      $('#tipo_institucion').find("option").end().append(optionSeleccione);
    } else {
      $('#tipo_institucion').find("option").end().append(optionSeleccione.attr('selected', true));
    }

    if (id_tipo_institucion != '') {
      // llenar select tipo institucion en modal de editar
      if ('pu' == id_tipo_institucion) {
        $('#tipo_institucion').find("option").end().append(option1.attr('selected', true));
        $('#tipo_institucion').find("option").end().append(option2);
      } else if ('pv' == id_tipo_institucion) {
        $('#tipo_institucion').find("option").end().append(option1);
        $('#tipo_institucion').find("option").end().append(option2.attr('selected', true));
      } else {
        $('#tipo_institucion').find("option").end().append(option1);
        $('#tipo_institucion').find("option").end().append(option2);
      }        
    } else {
      // llenar select tipo institucion en modal de agregar
      $('#tipo_institucion').find("option").end().append(option1);
      $('#tipo_institucion').find("option").end().append(option2);
    } 

    $('#tipo_institucion').trigger("chosen:updated").trigger("change");
  }

  /== funcion para limpiar los campos del modal ==/
  function limpiarCampos() {
    $('#id_institucion').val('');
    $('#nombre_institucion').val('');
    $('#descripcion_institucion').val('');
    $('#domicilio_institucion').val('');
    $('#contacto_institucion').val('');
    $('#correo_institucion').val('');
    $('#sitio_web_institucion').val('');
    $("#institucion_habilitado").prop("checked", false);

    $.each($('#tipo_institucion').find("option"), function (key, value) {
      $(value).remove();
    });

    llenarSelectTipoInstitucion('');

    id_tipo_institucion = '';
  }

  /== funcion para validar los campos del formulario institucion ==/
  function validarCamposModalInstitucion() {
    $('#form_institucion').validate({
      rules: {
        nombre_institucion: {
          minlength: 2
        },
        descripcion_institucion: {
          minlength: 2
        },
        domicilio_institucion: {
          minlength: 2
        },
        correo_institucion: {
          email: true
        },
        contacto_institucion: {
          minlength: 8
        },
        sitio_web_institucion: {
          url: true
        }
      },
      messages: {
        nombre_institucion: {
          required: 'Por favor ingrese el Nombre de la Institución',
          minlength: 'El Nombre de la Institución debe tener al menos 2 caracteres'
        },
        descripcion_institucion: {
          required: 'Por favor ingrese la Descripción',
          minlength: 'La Descripción debe tener al menos 2 caracteres'
        },
        domicilio_institucion: {
          required: 'Por favor ingrese el Domicilio',
          minlength: 'El Domicilio debe tener al menos 2 caracteres'
        },
        contacto_institucion: {
          required: 'Por favor ingrese un número de Contacto',
          minlength: 'El Contacto debe tener al menos 8 caracteres'
        },
        correo_institucion: 'Por favor ingrese el Correo Electrónico de la Institución',
        sitio_web_institucion: 'Por favor ingrese el Sitio Web de la Institución'
      }
    });
  }

  /== funcion para eliminar una institucion ==/
  function eliminarInstitucion(id) {
    $.ajax({
      url: "/institucion/eliminar_institucion",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_institucion').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente la Institución seleccionada",
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
  institucion.init();
});