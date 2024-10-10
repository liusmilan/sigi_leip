var taller = function() {
  var $ = jQuery.noConflict();

  $('.fecha_inicio_taller').datepicker({
    format: 'dd/mm/yyyy',
    language: 'es',
    todayHighlight: true
  });

  $('.fecha_fin_taller').datepicker({
    format: 'dd/mm/yyyy',
    language: 'es',
    todayHighlight: true
  });

  function initEvents() {
    existenModalidades();
    getTalleres();
  
    /== evento para mostrar modal de agregar taller ==/
    $('#btn_nuevo_taller').on('click', function() {
      $('#modal_agregar_editar_taller').modal('show');
      $('#modal_agregar_editar_taller').find('.modal-title').text('Agregar Taller');
      $('#btn_agregar_taller').text('Agregar');
      
      $('#modalidad_taller').select2({
        dropdownParent: $('#modal_agregar_editar_taller .modal-body'),
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

      llenarSelectModalidades('');
    });

    /== evento para cerrar modal de agregar taller ==/
    $('#btn_cerrar_modal_taller').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_taller').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de agregar taller ==/
    $('#btn_cancelar_modal_taller').on('click', function() {
      limpiarCampos();
      $('#modal_agregar_editar_taller').modal('hide');
      location.reload();
    });

    /== evento para agregar o editar un taller ==/
    $('#btn_agregar_taller').on('click', function() {
      var id = $('#id_taller').val();
      var nombre = $('#nombre_taller').val();
      var id_modalidad = $('#modalidad_taller').val();
      var especialista = $('#especialista_taller').val();
      var fecha_inicio = $('#fecha_inicio').val();
      var fecha_fin = $('#fecha_fin').val();
      var estado = $('#estado_taller').is(":checked");
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      if (validarCampos() != '') {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Existen campos obligatorios por llenar o seleccionar.', 'error');
      } else {
        $.ajax({
          url: "/taller/agregar_taller",
          data: {
            id: id ? id : '',
            nombre: nombre,
            id_modalidad: id_modalidad,
            especialista: especialista,
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
            estado: estado
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              if (response.accion == 'agregar') {
                notificacion('', response.mensaje, response.tipo_mensaje);
                btn.html(textOriginalBtn);
                limpiarCampos();
                getTalleres();
              } else if (response.accion == 'editar') {
                btn.html(textOriginalBtn);
                limpiarCampos();
                $('#modal_agregar_editar_taller').modal('hide');
                $('#id_taller').val('');

                swal({
                  title: "",
                  text: "Se han editado correctamente los datos del Taller seleccionado",
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

    /== evento para llenar los campos del modal editar taller ==/
    $('#btn_editar_taller').on('click', function() {
      $('#modal_agregar_editar_taller').modal('show');
      $('#modal_agregar_editar_taller').find('.modal-title').text('Editar Taller');
      $('#btn_agregar_taller').text('Editar');
      let id = $('#id_taller').val();

      $.ajax({
        url: "/taller/get_taller",
        data: {
          id: id
        },
        dataType: "json",
        success: function(response) {
          $('#modalidad_taller').select2({
            dropdownParent: $('#modal_agregar_editar_taller .modal-body'),
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
    
          llenarSelectModalidades(response.modalidad.id);
          $('#nombre_taller').val(response.nombre);
          $('#especialista_taller').val(response.especialista);
          $('#fecha_inicio').val(response.fecha_inicio);
          $('#fecha_fin').val(response.fecha_fin);
          
          if (response.estado == 'HABILITADO') {
            $('#estado_taller').prop('checked', true);
          } else {
            $('#estado_taller').prop('checked', false);
          }
        },
        error: function(response) {}
      });
    });

    /== evento para mostrar notificacion de confirmacion para eliminar un taller ==/
    $('#btn_eliminar_taller').on('click', function() {
      let id = $('#id_taller').val();

      swal({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este Taller?',
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
          eliminarTaller(id);
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

  /== funcion para verificar que existen modadlidades ==/
  function existenModalidades() {
    $.ajax({
      url: "/taller/get_modalidades",
      type: "get",
      dataType: "json",
      success: function(response) {
        if (response.mensaje == 'success') {
          //mostrar btn de acciones y agregar
          $('#block_actions').css('display','block');
          $('#alerta_modalidad_taller').css('display','none');
        } else if (response.mensaje == 'error') {
          //no mostrar btn de acciones y agregar y mostrar alerta
          $('#block_actions').css('display','none');
          $('#alerta_modalidad_taller').css('display','block');
          $('#btn_nuevo_taller').css('display','none');
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para obtener todos los talleres ==/
  function getTalleres() {
    $.ajax({
      url: "/taller/lista_taller",
      type: "get",
      dataType: "json",
      success: function(response) {
        listarTalleres(response);
      },
      error: function(response) {}
    });
  }

  /== funcion para crear el listado de talleres==/
  function listarTalleres(datos) {
    let tabla = new DataTable('#tabla_talleres', {
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
        { data: 'modalidad.nombre'},
        { data: 'fecha_inicio'},
        { data: 'fecha_fin'},
        { data: 'especialista'},
        { data: 'estado' }
      ],
      initComplete: function() {
        $('#dropdown_acciones_listado_talleres').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_nuevo_taller').css('display', 'block');
        $('#dropdown_acciones_listado_talleres').css('display', 'none');
        $('#id_taller').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_nuevo_taller').css('display', 'none');
        $('#dropdown_acciones_listado_talleres').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_taller').val(data.id);
      }
    });
  }

  /== funcion para eliminar un taller ==/
  function eliminarTaller(id) {
    $.ajax({
      url: "/taller/eliminar_taller",
      data: {
        id: id
      },
      dataType: "json",
      success: function(response) {
        if (response.tipo_mensaje == 'success') {
          $('#id_taller').val('');
          
          swal({
            title: "Eliminado",
            text: "Ha sido eliminado correctamente el Taller seleccionado",
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
      error: function(response) {}
    });
  }

  /== funcion para llenar el select de las modalidades ==/
  function llenarSelectModalidades(id_modalidad) {
    $.ajax({
      url: "/taller/get_modalidades",
      type: "get",
      dataType: "json",
      success: function(response) {
        var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
        var optionEmpty = $("<option/>").val('-').text('-----------');

        if (response.mensaje == 'success') {
          if (id_modalidad != '') {
            $('#modalidad_taller').find("option").end().append(optionSeleccione);
          } else {
            $('#modalidad_taller').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.modalidades, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (id_modalidad != '') {
              // llenar select modalidad en modal de editar
              if (value.id == id_modalidad) {
                $('#modalidad_taller').find("option").end().append(option.attr('selected', true));
              } else {
                $('#modalidad_taller').find("option").end().append(option);
              }              
            } else {
              // llenar select modalidad en modal de agregar
              $('#modalidad_taller').find("option").end().append(option);
            }            
          });

          $('#modalidad_taller').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#modalidad_taller').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {}
    });
  }

  /== funcion para limpiar los campos del modal ==/
  function limpiarCampos() {
    $('#id_taller').val('');
    $('#nombre_taller').val('');
    $("#especialista_taller").val('');
    $("#fecha_inicio").val('');
    $("#fecha_fin").val('');
    $("#estado_taller0").prop("checked", false);

    $.each($('#modalidad_taller').find("option"), function (key, value) {
      $(value).remove();
    });
    
    llenarSelectModalidades('');
  }

  /== funcion para validar los campos del modal ==/
  function validarCampos() {
    var nombre = $('#nombre_taller').val();
    var modalidad = $('#modalidad_taller').val();
    var especialista = $('#especialista_taller').val();
    var fecha_inicio = $('#fecha_inicio').val();
    var fecha_fin = $('#fecha_fin').val();
    var mensaje_error = '';
    
    if (nombre == '' || nombre == null) {
      mensaje_error = 'error.';
    } else if (modalidad == 'sel' || modalidad == '-') {
      mensaje_error = 'error.';
    } else if (especialista == '' || especialista == null) {
      mensaje_error = 'error.';
    } else if (fecha_inicio == '' || fecha_inicio == null) {
      mensaje_error = 'error.';
    } else if (fecha_fin == '' || fecha_fin == null) {
      mensaje_error = 'error.';
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
  taller.init();
});