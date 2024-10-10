/** grafico donuts de las solicitudes de atencion que sale en el dashboard */
document.addEventListener("DOMContentLoaded", () => {
    echarts.init(document.querySelector("#solicitudes_atencion_charts")).setOption({
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
        data: [{
            value: 5,
            name: 'Otros'
          },
          {
            value: 15,
            name: 'Profesores'
          },
          {
            value: 20,
            name: 'Trabajadores'
          },
          {
            value: 30,
            name: 'Estudiantes'
          }
        ]
      }]
    });
  });