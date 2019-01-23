import React,{Component} from 'react';
import Chart from 'chart.js';
import firebaseObj from './firebase/firebaseObj';
// import Variables from '../SetGame/Variables';

class ChartData extends Component{
    constructor(props){
        super(props);
        this.state={
            Y_axis:[],
            x_axis:[],
            title:''
        }
    }
    
    num_of_sets=(event)=>{
        firebaseObj.readingDataOnFirebaseCB(val=>{
            let x_axis=this.createX_axis(val.games);
            let have=false;
            let y_axis_correct=[];
            let y_axis_worng=[];
            let y_axis_missed=[];

            if(!val.CorrectSets){
                x_axis.forEach(element => {
                    y_axis_correct.push(0)
                });
            }

            if(!val.WrongSets){
                x_axis.forEach(element => {
                    y_axis_worng.push(0)
                });
            }

            if(!val.MissedSets){
                x_axis.forEach(element => {
                    y_axis_missed.push(0)
                });
            }

            x_axis.map(game=>{
                if(val.CorrectSets){
                    Object.keys(val.CorrectSets).map(GameCode=>{
                        if(GameCode===game)
                            have=true;
                    });
                    if(have)
                        y_axis_correct.push(Object.keys(val.CorrectSets[game]).length)
                    else
                        y_axis_correct.push(0)
                    have=false
                }

                if(val.WrongSets){
                    Object.keys(val.WrongSets).map(GameCode=>{
                        if(GameCode===game)
                            have=true;
                    });
                    if(have)
                        y_axis_worng.push(Object.keys(val.WrongSets[game]).length)
                    else
                        y_axis_worng.push(0)
                    have=false
                }

                if(val.MissedSets){
                    Object.keys(val.MissedSets).map(GameCode=>{
                        if(GameCode===game)
                            have=true;
                    });
                    if(have)
                        y_axis_missed.push(Object.keys(val.MissedSets[game]).length)
                    else
                        y_axis_missed.push(0)
                }
                
            });
            const y_axis=[
                { 
                    data: y_axis_correct,
                    label: "correct sets",
                    borderColor: "#3e95ce",
                    fill: false
                },{
                    data: y_axis_worng,
                    label: "wrong sets",
                    borderColor: "#3e9234",
                    fill: false
                },{
                    data: y_axis_missed,
                    label: "missed sets",
                    borderColor: "#3eeeee",
                    fill: false
                }
            ]
            this.setState({y_axis:y_axis,
                x_axis:x_axis,
                flag:true,
                title:'num of set'})
            this.createChart();
        },`Players/H9C4LSGF01QbTLQmckUZoYw1j1o2`)

    }
    
    createX_axis=(gamesObj)=>{
        let arrX_axis=[];
        for(let date in gamesObj)
          for(let num in gamesObj[date])
            arrX_axis.push(`${date}:${num}`);
        return arrX_axis;
    }


    componentDidMount(){
      
        this.num_of_sets();
 
    }

    createChart=()=>{
        const ctx=document.getElementById('chart').getContext('2d');
        let obj = {
            labels: this.state.x_axis,
            datasets:[
                this.state.y_axis
            ]
          };
        new Chart(ctx,{
            type: 'line',
                data: obj,
                options: {
                    title: {
                      display: true,
                      text: this.state.title
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