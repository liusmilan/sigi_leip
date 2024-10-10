$(function () {
  
  cantidadRolesUserAutenticado();

  

  function cantidadRolesUserAutenticado() {
    var id_user_aut = $('#user_autenticado').val();

    $.ajax({
      url: "/usuario/get_usuario",
      data: {
        id: id_user_aut
      },
      dataType: "json",
      success: function(response) {
        //roles
        var roles_json=$.parseJSON(response.roles);
        var roles=[];

        for (element in roles_json) {
          var obj={
            id: roles_json[element]["pk"]
          };
          roles.push(obj);
        };

        $('#cantidad_roles_usuario').text(roles.length);
      }
    });
  }

  
  

});