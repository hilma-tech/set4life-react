import React,{Component} from 'react';
import firebaseObj from '../firebase/firebaseObj';
import ChartFunctions from './ChartFunctions';
import Variables from '../SetGame/Variables';

class ChartData extends Component{
    constructor(props){
      super(props);
      this.state={
        hittingSetButton:{
          title:'זמן ממוצע עד הלחיצה על כפתור סט',
          correctChart:{
            label:'סטים נכונים',
            borderColor: "red",
            fill: false,
          },
          wrongChart:{
            label:'סטים לא נכונים',
            borderColor: "#3e95ce",
            fill: false,
            pointRadius: 0
          }
        },
        choosingCorrectSet:{
          title:'זמן ממוצע מהלחיצה על כפתור הסט עד בחירת סט נכון',
          borderColor: "green",
          fill:false
        },
        numOfSets:{}
      }
      window.history.pushState(this.props.chartType,'',this.props.chartType);
    }

    componentDidMount(){
      if(this.props.chartType==='avgTime')
        this.avgTimeCharts();
      else if(this.props.chartType==='numOfSets')
        this.numOfSets();
    }

    numOfSets=()=>{
      firebaseObj.readingDataOnFirebaseCB(val=>{
        ChartFunctions.createX_axis(val.games);
        let x_axis=ChartFunctions.arrX_axis;
        let have=false;
        let y_axis_correct=[];
        let y_axis_worng=[];
        let y_axis_missed=[];

        if(!val.CorrectSets){
            x_axis.forEach(() => {
                y_axis_correct.push(0)
            });
        }

        if(!val.WrongSets){
            x_axis.forEach(() => {
                y_axis_worng.push(0)
            });
        }

        if(!val.MissedSets){
            x_axis.forEach(() => {
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
            have=false;
        });
        let y_axis={
          title:'num of set',
          correct:{ 
                data: y_axis_correct,
                label: "correct sets",
                borderColor: "#3e95ce",
                fill: false
            },
            wrong:{
                data: y_axis_worng,
                label: "wrong sets",
                borderColor: "#3e9234",
                fill: false
            },
            missed:{
                data: y_axis_missed,
                label: "missed sets",
                borderColor: "#3eeeee",
                fill: false
            }
        }
        this.setState({numOfSets:y_axis});
        ChartFunctions.createChart(this.state.numOfSets,'firstChart');
    },`Players/${Variables.userId}`)
    }

    
    avgTimeCharts=()=>{
      firebaseObj.readingDataOnFirebaseCB(playerObj=>{
        ChartFunctions.createX_axis(playerObj.games);

        //hitting set button
        let correctChart=this.state.hittingSetButton.correctChart;
        correctChart.data=ChartFunctions.avgTime(playerObj.CorrectSets,'hitSet');

        let wrongChart=this.state.hittingSetButton.wrongChart;
        wrongChart.data=ChartFunctions.avgTime(playerObj.WrongSets,'hitSet');
        ///////////////////

        let choosingCorrectSet=this.state.choosingCorrectSet;
        choosingCorrectSet.data=ChartFunctions.avgTime(playerObj.CorrectSets,'chooseSet');
        
        this.setState({hittingSetButton:{title:this.state.hittingSetButton.title,
          correctChart:correctChart,wrongChart:wrongChart},
          choosingCorrectSet:choosingCorrectSet});
        ChartFunctions.createChart(this.state.hittingSetButton,'firstChart');
        ChartFunctions.createChart(this.state.choosingCorrectSet,'secondChart');

      },`Players/${Variables.userId}`)
    }

    render() {
      return(
        <div>
          <canvas id='firstChart' height="100vh" />
          <canvas id='secondChart' height="100vh" />
        </div>
      )
    }
}

export default ChartData;