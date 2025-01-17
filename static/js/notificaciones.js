/-- notificaciones con plugin Toast -/
notificacion1 = function (msg, tipo) {
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
  
  if (tipo == 'info') {
    toastr.info(msg);
  } else if (tipo == 'success') {
    toastr.success(msg);
  } else if (tipo == 'error') {
    toastr.error(msg);
  } else if (tipo == 'warning') {
    toastr.warning(msg);
  }
};


/-- notificaciones con plugin SweetAlert --/
notificacion = function (accion, mensaje, tipo_notificacion) {
  swal(accion, mensaje, tipo_notificacion)
};
