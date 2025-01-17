$(document).ready(function () {
    $.ajax({
        url: 'atencion_psicologica/get_datos_grafico_solicitudes_atencion',
        method: 'GET',
        data: {
          id_usuario: $('#user_autenticado').val()
        },
        dataType: 'json',
        success: function(data) {
          console.log(data, 'data');
            $('#total_solicitudes_atencion h6').text(data.data.total);
            $('#total_solicitudes_usuario h6').text(data.data.total_atenciones_usuario);

            var chartData = [
              {
                'value': data.data.profesores,
                'name': 'Profesores'
              },
              {
                'value': data.data.estudiantes,
                'name': 'estudiantes'
              },
              {
                'value': data.data.trabajadores,
                'name': 'Trabajadores'
              },
              {
                'value': data.data.otros,
                'name': 'Otros'
              },
            ];

            const chartOptions = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: chartData
                }]
            };

            const myChart = echarts.init(document.querySelector("#solicitudes_atencion_charts"));
            myChart.setOption(chartOptions);
        },
        error: function(xhr, status, error) {
          console.error('Error en la solicitud AJAX:', error);
        }
    });
});