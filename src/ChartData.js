import React,{Component} from 'react';
import Chart from 'chart.js';

class ChartData extends Component{
    componentDidMount(){
      

        this.createChart();
    }

    createChart=()=>{
        const ctx=document.getElementById('chart').getContext('2d');
        let obj = {
            labels: this.props.x_axis,
            datasets:[{ 
                data: this.props.y_axis,
                label: this.props.title,
                borderColor: "#3e95ce",
                fill: false
              }]
          };

        new Chart(ctx,{
            type: 'line',
                data: obj,
                options: {
                    title: {
                      display: true,
                      text: this.props.title
                    },
                    scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero: true
                          }
                      }]
                  }
                  }
        });

    }

    render() {
      return(
        <div>
          <canvas id='chart' height="100vh" />
        </div>
      )
    }
}

  export default ChartData;