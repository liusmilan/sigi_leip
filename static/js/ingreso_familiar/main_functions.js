var ingreso_familiar = function() {
  var $ = jQuery.noConflict();

  $('#color').minicolors({
    animationEasing: 'swing',
    defaultValue: '#36c267'
  });
    

  function initEvents() {
    getIngresoFamiliar();

    /== evento para mostrar modal de agregar ingreso familiar ==/
    $('#btn_nuevo_ingreso_familiar').on('click', function() {
      $('#modal_agregar_editar_ingreso_familiar').modal('show');
      $('#modal_agregar_editar_ingreso_familiar').find('.modal-title').text('Agregar Ingreso Familiar');
      $('#btn_agregar_ingreso_familiar').text('Agregar');
      limpiarCampos();
      $('#color').minicolors('value', '#36c267');      
    });

    /== evento para cerrar modal de agregar ingreso familiar ==/
    $('#btn_cerrar_modal_ingreso_familiar').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_ingreso_familiar').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar ingreso familiar ==/
    $('#btn_cancelar_modal_ingreso_familiar').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_ingreso_familiar').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un ingreso familiar ==/
    $('#btn_agregar_ingreso_familiar').on('click', function() {
      var id = $('#id_ingreso_familiar').val();
      var estado = $('#estado_ingreso_familiar').is(":checked");
      var ingreso = $('#ingreso').val();
      var nivel = $('#nivel').val();
      var color = $('#color').val();
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (validarCampos() != '') {
        btn.html(textOriginalBtn);
        notificacion('Error', validarCampos(), 'error');
      } else {
        $.ajax({
          url: "/ingreso_familiar/agregar_ingreso_familiar",
          data: {
            id: id ? id : '',
            estado: estado,
            ingreso: ingreso,
            nivel: nivel,
            color: color
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              if (response.accion == 'agregar') {
                notificacion('', response.mensaje, response.tipo_mensaje);
                btn.html(textOriginalBtn);
                limpiarCampos();
                getIngresoFamiliar();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_ingreso_familiar').modal('hide');
                $('#id_ingreso_familiar').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Ingreso familiar seleccionado",
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

    /== evento para llenar los campos del modal editar ingreso familiar ==/
    $('#btn_editar_ingreso_familiar').on('click', function() {
      $('#modal_agregar_editar_ingreso_familiar').modal('show');
      $('#modal_agregar_editar_ingreso_familiar').find('.modal-title').text('Editar Ingreso Familiar');
      $('#btn_agregar_ingreso_familiar').text('Editar');
      let id = $('#id_ingreso_familiar').val();

      $.ajax({
        url: "/ingreso_familiar/get_ingreso_familiar",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#ingreso').val(response.ingreso);
          $('#nivel').val(response.nivel);
          $('#color').minicolors('value', response.color);

          if (response.estado == 'HABILITADO') {
            $('#estado_ingreso_familiar').prop('checked', true);
          } else {
            $('#estado_ingreso_familiar').prop('checked', false);
          }
        },
        error: function(response) {

        }
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un ingreso familiar ==/
    $('#btn_eliminar_ingreso_familiar').on('click', function() {
      let id = $('#id_ingreso_familiar').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Ingreso familiar?',
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
          eliminarIngresoFamiliar(id);
        } else {
          swal({
            title: 'Cancelado',
            text: 'Ha cancelado la eliminación de este Ingreso familiar',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
          },
          function() {
            $('#id_ingreso_familiar').val('');
            location.reload();
          });
        }        
      });
    });    
  }

  /== funcion para obtener todos los ingresos familiares ==/
  function getIngresoFamiliar() {
    $.ajax({
      url: "/ingreso_familiar/lista_ingreso_familiar",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarIngresosFamiliares(response);
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para crear el listado de ingresos familiares ==/
  function listarIngresosFamiliares(datos) {
    let tabla = new DataTable('#tabla_ingresos_familiares', {
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
      order: [0, 'desc'],
      data: datos,
      columnDefs: [{className: 'text-center', targets: 2}], 
      columns: [
        { data: 'ingreso' },
        { data: 'nivel' },
        { data: 'color' },
        { data: 'estado' }
      ],
      rowCallback: function(row, data) {
        $($(row).find('td')[2]).css('background-color', data.color);
      },
      initComplete: function(row, data) {
        $('#dropdown_acciones_listado_ingreso_familiar').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_ingreso_familiar').css('display', 'block');
        $('#dropdown_acciones_listado_ingreso_familiar').css('display', 'none');
        $('#id_ingreso_familiar').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_ingreso_familiar').css('display', 'none');
        $('#dropdown_acciones_listado_ingreso_familiar').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_ingreso_familiar').val(data.id);
      }
    });
  }

  /== funcion para eliminar un ingreso familiar ==/
  function eliminarIngresoFamiliar(id) {
    $.ajax({
      url: "/ingreso_familiar/eliminar_ingreso_familiar",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_ingreso_familiar').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Ingreso familiar seleccionado",
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

  /== funcion para limpiar los campos del modal ingresos familiares ==/
  function limpiarCampos() {
    $('#id_ingreso_familiar').val('');
    $('#ingreso').val('');
    $('#nivel').val('');
    $('#color').minicolors('value', '#36c267');
    $("#estado_ingreso_familiar").prop("checked", false);
  }

  /== funcion para validar los campos del modal ==/
  function validarCampos() {
    var ingreso = $('#ingreso').val();
    var nivel = $('#nivel').val();
    var color = $('#color').val();
    var mensaje_error = '';

    if (ingreso == '' || nivel == '' || color == '') {
      mensaje_error = 'Existen campos obligatorios por llenar';
    }

    return mensaje_error;
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  ingreso_familiar.init();
});