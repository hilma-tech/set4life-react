import React,{Component} from 'react';
import ChartData from '../../ChartData';
import firebaseObj from '../../firebase/firebaseObj';
import Variables from '../../SetGame/Variables';


export default class ChartsPage extends Component{
    constructor(props){
        super(props);
        this.state={
            flag:false,
            y_axis:[],
            x_axis:[],
            title:''
        }
    }
    correct_or_wrongSets=(event)=>{
        firebaseObj.readingDataOnFirebaseCB(val=>{
            let x_axis=Object.keys(val);
            let y_axis=Object.values(val).map(val=>
                val=Object.keys(val).length);
            this.setState({x_axis:x_axis,y_axis:y_axis,flag:true,title:'correct sets'})
        },`Players/iWhdMGvrXPbET8egC0Hoby25a9g2`)

    }
    
    render(){
        return(
            <div>
                {this.state.flag?
                <ChartData 
                x_axis={this.state.x_axis}
                y_axis={this.state.y_axis}
                title={this.state.title}/>:
                <div>
                    <button onClick={this.correct_or_wrongSets} >מידע על סטים</button>
                    <button>זמן ממוצע</button>
                </div>}
                
                
            </div>
        );
    }
}