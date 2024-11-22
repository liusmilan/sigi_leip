$(document).ready(function () {
    // Realizar la solicitud AJAX
    $.ajax({
        url: 'atencion_psicologica/get_datos_grafico_solicitudes_atencion', // Cambia esta URL a la ruta donde obtendrás los datos
        method: 'GET', // Método de la solicitud (GET o POST)
        dataType: 'json', // Tipo de datos que esperas recibir
        success: function(data) {
          console.log(data, 'data');
            // Actualiza el total de solicitudes
            $('#total_solicitudes_atencion').text(data.total); // Cambia 'data.total' según tu estructura de datos

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

            // Configuración del gráfico de donuts
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
                    data: chartData // Asigna los datos del gráfico aquí
                }]
            };

            // Inicializa y establece las opciones del gráfico
            const myChart = echarts.init(document.querySelector("#solicitudes_atencion_charts"));
            myChart.setOption(chartOptions);
        },
        error: function(xhr, status, error) {
            console.error('Error en la solicitud AJAX:', error); // Manejo de errores
            $('#total_solicitudes_atencion').text('Error al cargar datos'); // Mensaje de error
        }
    });
});