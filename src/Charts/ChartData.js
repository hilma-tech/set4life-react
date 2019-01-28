import React,{Component} from 'react';
import firebaseObj from '../firebase/firebaseObj';
import ChartFunctions from './ChartFunctions';
import Variables from '../SetGame/Variables';

class ChartData extends Component{
    constructor(props){
      super(props);
      this.state={
        numOfSets:{}
      }
      window.history.pushState(this.props.chartType,'',this.props.chartType);
    }

    componentDidMount(){
      if(this.props.chartType==='avgTime')
        ChartFunctions.avgTimeCharts();
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
        let y_axis=[
            { 
                data: y_axis_correct,
                label: "סטים נכונים",
                borderColor: "#3e95ce",
                fill: false
            },
            {
                data: y_axis_worng,
                label: "סטים לא נכונים",
                borderColor: "#3e9234",
                fill: false
            },
            {
                data: y_axis_missed,
                label: "סטים מפוספסים",
                borderColor: "#3eeeee",
                fill: false
            }
        ]
        this.setState({numOfSets:y_axis});
        ChartFunctions.createChart(this.state.numOfSets,'firstChart','מספר הסטים בכל משחק');
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