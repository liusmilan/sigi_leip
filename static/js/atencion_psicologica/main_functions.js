var atenciones_psicologicas = function() {
  var $ = jQuery.noConflict();
  var id_municipio = '';

  $('.fecha_atencion_paciente').datepicker({
    format: 'dd/mm/yyyy',
    language: 'es',
    todayHighlight: true
  });

  function initEvents() {
    mostrarOcultarAlertas();
    getAtencionesPsicologicas();
    
    /== evento para mostrar modal de solicitar atencion ==/
    $('#btn_solicitar_atencion').on('click', function() {
      $('#modal_solicitar_atencion').modal('show');
      $('#modal_solicitar_atencion').find('.modal-title').text('Solicitar Atención');
      $("input[type='radio'][name=inlineRadioOptionsHijos]").prop('checked', false);
      $("input[type='radio'][name=inlineRadioOptionsTrabaja]").prop('checked', false);
      $("input[type='radio'][name=inlineRadioOptionsBeca]").prop('checked', false);
      var id_user_aut = $('#user_autenticado').val();

      $('#estado_atencion').select2({
        dropdownParent: $('#modal_solicitar_atencion .modal-body'),
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

      $('#municipio_atencion').select2({
        dropdownParent: $('#modal_solicitar_atencion .modal-body'),
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

      $('#semestre_atencion').select2({
        dropdownParent: $('#modal_solicitar_atencion .modal-body'),
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

      $('#licenciatura_atencion').select2({
        dropdownParent: $('#modal_solicitar_atencion .modal-body'),
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

      $('#vive_con_atencion').select2({
        dropdownParent: $('#modal_solicitar_atencion .modal-body'),
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

      $('#grado_academico_atencion').select2({
        dropdownParent: $('#modal_solicitar_atencion .modal-body'),
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

      $('#ingreso_familiar_atencion').select2({
        dropdownParent: $('#modal_solicitar_atencion .modal-body'),
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

      $.ajax({
        url: "/atencion_psicologica/get_atencion_by_solicitante",
        data: {
          id_user_aut: id_user_aut
        },
        dataType: "json",
        success: function(response) {
          if (response.mensaje == 'no_existe') {
            llenarSelectEstados('');
            llenarSelectSemestres('');
            llenarSelectLicenciaturas('');
            llenarSelectViveCon('', '');
            llenarSelectGradoAcademico('', '');
            llenarSelectIngresoFamiliar('');
          } else if (response.mensaje == 'existe') {
            llenarSelectSemestres('');
            llenarSelectViveCon('', '');
            llenarSelectIngresoFamiliar('');
            llenarSelectLicenciaturas(response.atencion.licenciatura.id);
            llenarSelectEstados(response.atencion.estado.id);
            id_municipio = response.atencion.municipio.id;
            $('#direccion_atencion').val(response.atencion.direccion);

            if (response.atencion.grado_academico_otro != '' && response.atencion.grado_academico_otro != null) {
              $('#otro_grado_academico_atencion').val(response.atencion.grado_academico_otro);
              $('#otro_grado_academico_atencion').attr('disabled', false);
            } else {
              llenarSelectGradoAcademico(response.atencion.grado_academico.id, '');
              $('#otro_grado_academico_atencion').val('');
              $('#otro_grado_academico_atencion').attr('disabled', true);
            }
          }
        }
      });
    });

    /== evento para cerrar modal de solicitar atencion ==/
    $('#btn_cerrar_modal_atencion').on('click', function() {
      //limpiarCampos();
      $('#modal_solicitar_atencion').modal('hide');
      location.reload();
    });

    /== evento para cerrar modal de solicitar atencion ==/
    $('#btn_cancelar_modal_atencion').on('click', function() {
      //limpiarCampos();
      $('#modal_solicitar_atencion').modal('hide');
      location.reload();
    });

    /== evento para cargar los municipios segun el estado que se escoja ==/
    $('#estado_atencion').on('change', function() {
      var id_estado = $(this).val();
      var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
      var optionEmpty = $("<option/>").val('-').text('-----------');

      // vaciar select municipios
      $.each($('#municipio_atencion').find("option"), function (key, value) {
        $(value).remove();
      });

      if (id_estado == 'sel') {
        $('#municipio_atencion').find("option").end().append(optionEmpty.attr('selected', true));
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
              $('#municipio_atencion').find("option").end().append(optionSeleccione);

              $.each(response.municipios, function (key, value) {
                var option = $("<option/>").val(value.id).text(value.nombre);

                if (id_municipio != '') {
                  // llenar select municipio en modal editar
                  if (value.id == id_municipio) {
                    $('#municipio_atencion').find("option").end().append(option.attr('selected', true));
                  } else {
                    $('#municipio_atencion').find("option").end().append(option);
                  }
                } else {
                  // llenar select municipio en modal agregar
                  $('#municipio_atencion').find("option").end().append(option);
                }
              });

              $('#municipio_atencion').trigger("chosen:updated").trigger("change");
            } else {
              $('#municipio_atencion').find("option").end().append(optionEmpty.attr('selected', true));
            }
          },
          error: function(response) {
            
          }
        });
      }
    });

    /== evento para mostrar campo otro en vive_con ==/
    $('#vive_con_atencion').on('change', function() {
      var vive = $(this).val();
      
      if (vive == 'otro') {
        $('#otro_vive_con_atencion').attr('disabled', false);
      } else {
        $('#otro_vive_con_atencion').val('');
        $('#otro_vive_con_atencion').attr('disabled', true);
      }
    });

    /== evento para mostrar campo otro en grado_academico ==/
    $('#grado_academico_atencion').on('change', function() {
      var grado = $(this).val();
      
      if (grado == 'otro') {
        $('#otro_grado_academico_atencion').attr('disabled', false);
      } else {
        $('#otro_grado_academico_atencion').val('');
        $('#otro_grado_academico_atencion').attr('disabled', true);
      }
    });

    $('#btn_agregar_atencion').on('click', function() {
      var textOriginalBtn = '<span class="indicator-label"> Agregar</span>'
      var loadingTextBtn = '<span class="indicator-progress"> Guardando... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>'
      var btn = $(this);
      btn.html(loadingTextBtn);

      var licenciatura = $('#licenciatura_atencion').val();
      var semestre = $('#semestre_atencion').val();
      var estado = $('#estado_atencion').val();
      var municipio = $('#municipio_atencion').val();
      var ingreso = $('#ingreso_familiar_atencion').val();
      var vive = $('#vive_con_atencion').val();
      var grado = $('#grado_academico_atencion').val();
      var otro_vive_con_atencion = $('#otro_vive_con_atencion').val();
      var otro_grado_academico_atencion = $('#otro_grado_academico_atencion').val();
      var hijo = devolverHijo();
      var trabaja = devolverTrabaja();
      var beca = devolverBeca();
      var fecha_atencion = $('#fecha_atencion').val();
      var id_solicitante = $('#user_autenticado').val();
      var direccion = $('#direccion_atencion').val();

      if ((validarCampos(licenciatura, semestre, estado, municipio, ingreso, vive, grado, otro_vive_con_atencion, otro_grado_academico_atencion, direccion) == 'error') || (beca == '') || (hijo == '') || (trabaja == '')) {
        btn.html(textOriginalBtn);
        notificacion('Error', 'Existen campos obligatorios por llenar o seleccionar.', 'error');
      } else {
        $.ajax({
          url: "/atencion_psicologica/agregar_atencion_psicologica",
          data: {
            fecha_atencion: fecha_atencion,
            beca_apoyo_economico: beca == 'si' ? true : false,
            hijos: hijo == 'si' ? true : false,
            trabaja: trabaja == 'si' ? true : false,
            direccion: direccion,
            vive_con_otro: otro_vive_con_atencion ? otro_vive_con_atencion : '',
            grado_academico_otro: otro_grado_academico_atencion ? otro_grado_academico_atencion : '',
            id_vive_con: (vive != 'sel') && (vive != '-') ? vive : '',
            id_grado_academico: (grado != 'sel') && (grado != '-') ? grado : '',
            id_estado: estado,
            id_municipio: municipio,
            id_solicitante: id_solicitante,
            id_ingreso_familiar: ingreso,
            id_semestre: semestre,
            id_licenciatura: licenciatura
          },
          dataType: "json",
          success: function(response) {
            if (response.tipo_mensaje == 'success') {
              if (response.accion == 'agregar') {
                btn.html(textOriginalBtn);
                
                limpiarCampos();
                $('#modal_solicitar_atencion').modal('hide');

                swal({
                  title: "",
                  text: "Se han agregado correctamente los datos de la Atención Psicológica",
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
  }

  /== funcion para mostrar-ocultar las alertas y el btn de acciones y solicitar atencion ==/
  function mostrarOcultarAlertas() {
    $.ajax({
      url: "/atencion_psicologica/nom_dependientes",
      type: "get",
      dataType: "json",
      success: function(response) {
        if (response.datos.mostrar_alertas == false) {
          //no mostrar alertas y mostrar btn de acciones y solicitar atencion
          $('#block_actions_atencion_psicologica').css('display','block');
          $('#alerta_atenciones_psicologicas').css('display','none');
          $('#btn_solicitar_atencion').css('display','block');
        } else if (response.datos.mostrar_alertas == true) {
          //mostrar alertas y no mostrar btn de acciones y solicitar atencion
          $('#block_actions_atencion_psicologica').css('display','none');
          $('#alerta_atenciones_psicologicas').css('display','block');
          $('#btn_solicitar_atencion').css('display','none');
          
          if (response.datos.grados == true) {
            //no existen grados
            $('#alerta_atencion_grados_academicos').css('display','block');
          } else {
            $('#alerta_atencion_grados_academicos').css('display','none');
          }

          if (response.datos.vives == true) {
            $('#alerta_atencion_vive_con').css('display','block');
          } else {
            $('#alerta_atencion_vive_con').css('display','none');
          }

          if (response.datos.semestres == true) {
            $('#alerta_atencion_semestres').css('display','block');
          } else {
            $('#alerta_atencion_semestres').css('display','none');
          }

          if (response.datos.licenciaturas == true) {
            $('#alerta_atencion_licenciaturas').css('display','block');
          } else {
            $('#alerta_atencion_licenciaturas').css('display','none');
          }

          if (response.datos.estados == true) {
            $('#alerta_atencion_estados').css('display','block');
          } else {
            $('#alerta_atencion_estados').css('display','none');
          }

          if (response.datos.municipios == true) {
            $('#alerta_atencion_municipios').css('display','block');
          } else {
            $('#alerta_atencion_municipios').css('display','none');
          }

          if (response.datos.ingresos == true) {
            $('#alerta_atencion_ingresos_familiares').css('display','block');
          } else {
            $('#alerta_atencion_ingresos_familiares').css('display','none');
          }
        }
      },
      error: function(response) {}
    });
  }

  /== funcion para obtener todas las atenciones psicologicas ==/
  function getAtencionesPsicologicas() {
    $.ajax({
      url: "/atencion_psicologica/lista_atencion_psicologica",
      data: {
        'id_user_aut': $('#user_autenticado').val()
      },
      type: "get",
      dataType: "json",
      success: function(response) {
        listarAtencionesPsicologicas(response);
      },
      error: function(response) {}
    });
  }

  /== funcion para crear el listado de atenciones psicologicas ==/
  function listarAtencionesPsicologicas(datos) {
    let tabla = new DataTable('#tabla_atenciones_psicologicas', {
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
        { data: 'solicitante.nombre' },
        { data: 'fecha_atencion' },
        { data: 'entrevistador.nombre' },
        { data: 'psicoterapeuta.nombre' },
        { data: 'instrumentos_aplicados' },
        { data: 'mst_nivel1' },
        { data: 'mst_nivel1' },
        { data: 'ssi_beck' },
        { data: 'fpp' },
        { data: 'ingreso_familiar.ingreso' },
        { data: 'tipo_atencion' },
        { data: 'seguimiento.estado.nombre' },
        { data: 'detalles' }
      ],
      rowCallback: function(row, data) {
        $($(row).find('td')[0]).html(data.solicitante.nombre + (data.solicitante.segundo_nombre ? ' ' + data.solicitante.segundo_nombre + ' ' : ' ') + data.solicitante.apellido + (data.solicitante.segundo_apellido ? ' ' + data.solicitante.segundo_apellido : ''));
        $($(row).find('td')[2]).html(data.entrevistador ? data.entrevistador.nombre + (data.entrevistador.segundo_nombre ? ' ' + data.entrevistador.segundo_nombre + ' ' : ' ') + data.entrevistador.apellido + (data.entrevistador.segundo_apellido ? ' ' + data.entrevistador.segundo_apellido : '') : '');
        $($(row).find('td')[3]).html(data.psicoterapeuta ? data.psicoterapeuta.nombre + (data.psicoterapeuta.segundo_nombre ? ' ' + data.psicoterapeuta.segundo_nombre + ' ' : ' ') + data.psicoterapeuta.apellido + (data.psicoterapeuta.segundo_apellido ? ' ' + data.psicoterapeuta.segundo_apellido : '') : '');
        $($(row).find('td')[9]).html(data.ingreso_familiar.ingreso + ' - ' + data.ingreso_familiar.nivel);
        $($(row).find('td')[9]).css('background-color', data.ingreso_familiar.color);
        $($(row).find('td')[11]).html(data.seguimiento ? data.seguimiento.estado.nombre : '');
        $($(row).find('td')[10]).html(data.tipo_atencion ? data.tipo_atencion.tipo_atencion : '');
        $($(row).find('td')[6]).html(data.mst_nivel1 ? data.mst_nivel1.pregunta11 : '');
        
        if (data.mst_nivel1) {
          $($(row).find('td')[5]).html(data.mst_nivel1.total);
          $($(row).find('td')[5]).css('background-color', data.mst_nivel1.color);
        } else {
          $($(row).find('td')[5]).html('');
        }

        if (data.fpp) {
          $($(row).find('td')[8]).html(data.fpp.total);
          $($(row).find('td')[8]).css('background-color', data.fpp.color);
        } else {
          $($(row).find('td')[8]).html('');
        }

        if (data.ssi_beck) {
          $($(row).find('td')[7]).html(data.ssi_beck.total);
          $($(row).find('td')[7]).css('background-color', data.ssi_beck.color);
        } else {
          $($(row).find('td')[7]).html('');
        }
        
        // $($(row).find('td')[13]).html(data.activo ? 'Sí' : 'No');
      },
      initComplete: function() {
        $('#dropdown_acciones_atenciones_psicologicas').css('display', 'none');
      }
    });

    //evento para seleccionar una fila en la tabla
    // evento para capturar los datos de la columna seleccionada en la tabla
    tabla.on('click', 'tbody tr', function(e) {
      let classList = e.currentTarget.classList;
      let data;

      if (classList.contains('selected')) {
        classList.remove('selected');
        $('#btn_solicitar_atencion').css('display', 'block');
        $('#dropdown_acciones_atenciones_psicologicas').css('display', 'none');
        $('#id_atencion').val('');
      } else {
        tabla.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
        $('#btn_solicitar_atencion').css('display', 'none');
        $('#dropdown_acciones_atenciones_psicologicas').css('display', 'block');

        data = tabla.row(this).data();
        $('#id_atencion').val(data.id);
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
            $('#estado_atencion').find("option").end().append(optionSeleccione);
          } else {
            $('#estado_atencion').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.estados, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (id_estado != '') {
              // llenar select estados en modal de editar
              if (value.id == id_estado) {
                $('#estado_atencion').find("option").end().append(option.attr('selected', true));
              } else {
                $('#estado_atencion').find("option").end().append(option);
              }              
            } else {
              // llenar select estados en modal de agregar
              $('#estado_atencion').find("option").end().append(option);
            }            
          });

          $('#estado_atencion').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#estado_atencion').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para llenar el select de los semestres ==/
  function llenarSelectSemestres(id_semestre) {
    $.ajax({
      url: "/semestre/get_all_semestre",
      type: "get",
      dataType: "json",
      success: function(response) {
        var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
        var optionEmpty = $("<option/>").val('-').text('-----------');

        if (response.mensaje == 'success') {
          if (id_semestre != '') {
            $('#semestre_atencion').find("option").end().append(optionSeleccione);
          } else {
            $('#semestre_atencion').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.semestres, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_semestre != '') {
                // llenar select semestres en modal de editar
                if (value.id == id_semestre) {
                  $('#semestre_atencion').find("option").end().append(option.attr('selected', true));
                } else {
                  $('#semestre_atencion').find("option").end().append(option);
                }                          
              } else {
                // llenar select semestres en modal de agregar
                $('#semestre_atencion').find("option").end().append(option);
              }
            }
          });

          $('#semestre_atencion').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#semestre_atencion').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para llenar el select de las licenciaturas ==/
  function llenarSelectLicenciaturas(id_licenciatura) {
    $.ajax({
      url: "/licenciatura/get_all_licenciatura",
      type: "get",
      dataType: "json",
      success: function(response) {
        var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
        var optionEmpty = $("<option/>").val('-').text('-----------');

        if (response.mensaje == 'success') {
          if (id_licenciatura != '') {
            $('#licenciatura_atencion').find("option").end().append(optionSeleccione);
          } else {
            $('#licenciatura_atencion').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.licenciaturas, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_licenciatura != '') {
                // llenar select licenciatura en modal de editar
                if (value.id == id_licenciatura) {
                  $('#licenciatura_atencion').find("option").end().append(option.attr('selected', true));
                } else {
                  $('#licenciatura_atencion').find("option").end().append(option);
                }                          
              } else {
                // llenar select licenciatura en modal de agregar
                $('#licenciatura_atencion').find("option").end().append(option);
              }
            }
          });

          $('#licenciatura_atencion').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#licenciatura_atencion').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para llenar el select vive con ==/
  function llenarSelectViveCon(id_vive_con, otro_vive_con) {
    $.ajax({
      url: "/vive_con/get_all_vive_con",
      type: "get",
      dataType: "json",
      success: function(response) {
        var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
        var optionEmpty = $("<option/>").val('-').text('-----------');
        var optionOtro = $("<option/>").val('otro').text('Otro');

        if (response.mensaje == 'success') {
          if (id_vive_con != '') {
            $('#vive_con_atencion').find("option").end().append(optionSeleccione);
          } else {
            $('#vive_con_atencion').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.vives, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_vive_con != '') {
                // llenar select vive_con en modal de editar
                if (value.id == id_vive_con) {
                  $('#vive_con_atencion').find("option").end().append(option.attr('selected', true));
                } else {
                  $('#vive_con_atencion').find("option").end().append(option);
                }                          
              } else {
                // llenar select vive_con en modal de agregar
                $('#vive_con_atencion').find("option").end().append(option);
              }
            }
          });

          if (otro_vive_con != '') {
            $('#vive_con_atencion').find("option").end().append(optionOtro.attr('selected', true));
          } else {
            $('#vive_con_atencion').find("option").end().append(optionOtro);
          }

          $('#vive_con_atencion').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#vive_con_atencion').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para llenar el select grado academico ==/
  function llenarSelectGradoAcademico(id_grado, otro_grado) {
    $.ajax({
      url: "/grado_academico/get_all_grado_academico",
      type: "get",
      dataType: "json",
      success: function(response) {
        var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
        var optionEmpty = $("<option/>").val('-').text('-----------');
        var optionOtro = $("<option/>").val('otro').text('Otro');

        if (response.mensaje == 'success') {
          if (id_grado != '') {
            $('#grado_academico_atencion').find("option").end().append(optionSeleccione);
          } else {
            $('#grado_academico_atencion').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.grados_academicos, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.nombre);

            if (value.estado == 'HABILITADO') {
              if (id_grado != '') {
                // llenar select grado_academico en modal de editar
                if (value.id == id_grado) {
                  $('#grado_academico_atencion').find("option").end().append(option.attr('selected', true));
                } else {
                  $('#grado_academico_atencion').find("option").end().append(option);
                }                          
              } else {
                // llenar select grado_academico en modal de agregar
                $('#grado_academico_atencion').find("option").end().append(option);
              }
            }
          });

          if (otro_grado != '') {
            $('#grado_academico_atencion').find("option").end().append(optionOtro.attr('selected', true));
          } else {
            $('#grado_academico_atencion').find("option").end().append(optionOtro);
          }

          $('#grado_academico_atencion').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#grado_academico_atencion').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para llenar el select ingreso familiar ==/
  function llenarSelectIngresoFamiliar(id_ingreso) {
    $.ajax({
      url: "/ingreso_familiar/get_all_ingreso_familiar",
      type: "get",
      dataType: "json",
      success: function(response) {
        var optionSeleccione = $("<option/>").val('sel').text("Seleccione...");
        var optionEmpty = $("<option/>").val('-').text('-----------');

        if (response.mensaje == 'success') {
          if (id_ingreso != '') {
            $('#ingreso_familiar_atencion').find("option").end().append(optionSeleccione);
          } else {
            $('#ingreso_familiar_atencion').find("option").end().append(optionSeleccione.attr('selected', true));
          }
          
          $.each(response.ingresos_familiares, function (key, value) {
            var option = $("<option/>").val(value.id).text(value.ingreso);

            if (value.estado == 'HABILITADO') {
              if (id_ingreso != '') {
                // llenar select ingresos_familiares en modal de editar
                if (value.id == id_ingreso) {
                  $('#ingreso_familiar_atencion').find("option").end().append(option.attr('selected', true));
                } else {
                  $('#ingreso_familiar_atencion').find("option").end().append(option);
                }                          
              } else {
                // llenar select ingresos_familiares en modal de agregar
                $('#ingreso_familiar_atencion').find("option").end().append(option);
              }
            }
          });

          $('#ingreso_familiar_atencion').trigger("chosen:updated").trigger("change");
        } else if (response.mensaje == 'error') {
          $('#ingreso_familiar_atencion').find("option").end().append(optionEmpty.attr('selected', true));
        }
      },
      error: function(response) {
        
      }
    });
  }

  /== funcion para validar los campos del modal ==/
  function validarCampos(licenciatura, semestre, estado, municipio, ingreso, vive, grado, otro_vive_con_atencion, otro_grado_academico_atencion, direccion) {
    var error = '';
    
    if (licenciatura == 'sel' && licenciatura == '-') {
      error = 'error';
    } else if (semestre == 'sel' && semestre == '-') {
      error = 'error';
    } else if (estado == 'sel' && estado == '-') {
      error = 'error';
    } else if (municipio == 'sel' && municipio == '-') {
      error = 'error';
    } else if (direccion == '') {
      error = 'error';
    } else if (ingreso == 'sel' && ingreso == '-') {
      error = 'error';
    } else if (vive == 'sel' && vive == '-') {
      if ((vive == 'otro') && (otro_vive_con_atencion == '')) {
        error = 'error';
      }  
    } else if (grado == 'sel' && grado == '-') {
      if ((grado == 'otro') && (otro_grado_academico_atencion == '')) {
        error = 'error';
      }
    }

    return error;
  }

  /== funcion para devolver hijo seleccionado ==/
  function devolverHijo() {
    var hijo_si = $('#check_hijos_si').is(":checked");
    var hijo_no = $('#check_hijos_no').is(":checked");
    var hijo = '';

    if (hijo_si == true) {
      hijo = 'si';
    } else if (hijo_no == true) {
      hijo = 'no';
    }

    return hijo;
  }

  /== funcion para devolver trabaja seleccionado ==/
  function devolverTrabaja() {
    var trabaja_si = $('#check_trabaja_si').is(":checked");
    var trabaja_no = $('#check_trabaja_no').is(":checked");
    var trabaja = '';

    if (trabaja_si == true) {
      trabaja = 'si';
    } else if (trabaja_no == true) {
      trabaja = 'no';
    }

    return trabaja;
  }

  /== funcion para devolver beca seleccionado ==/
  function devolverBeca() {
    var beca_si = $('#check_beca_si').is(":checked");
    var beca_no = $('#check_beca_no').is(":checked");
    var beca = '';

    if (beca_si == true) {
      beca = 'si';
    } else if (beca_no == true) {
      beca = 'no';
    }

    return beca;
  }

  function limpiarCampos() {
    $("input[type='radio'][name=inlineRadioOptionsHijos]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsTrabaja]").prop('checked', false);
    $("input[type='radio'][name=inlineRadioOptionsBeca]").prop('checked', false);
    $('#fecha_atencion').val('');
    $('#direccion_atencion').val('');
    $('#otro_vive_con_atencion').val('');
    $('#otro_grado_academico_atencion').val('');
    id_municipio = '';

    $.each($('#licenciatura_atencion').find("option"), function (key, value) {
      $(value).remove();
    });
    $.each($('#semestre_atencion').find("option"), function (key, value) {
      $(value).remove();
    });
    $.each($('#estado_atencion').find("option"), function (key, value) {
      $(value).remove();
    });
    $.each($('#municipio_atencion').find("option"), function (key, value) {
      $(value).remove();
    });
    $.each($('#ingreso_familiar_atencion').find("option"), function (key, value) {
      $(value).remove();
    });
    $.each($('#vive_con_atencion').find("option"), function (key, value) {
      $(value).remove();
    });
    $.each($('#grado_academico_atencion').find("option"), function (key, value) {
      $(value).remove();
    });

    llenarSelectEstados('');
    llenarSelectGradoAcademico('', '');
    llenarSelectIngresoFamiliar('');
    llenarSelectLicenciaturas('');
    llenarSelectSemestres('');
    llenarSelectViveCon('', '');
  }

  return {
    init: function() {
        initEvents();
    }
  };
}();

jQuery(function () {
  atenciones_psicologicas.init();
});