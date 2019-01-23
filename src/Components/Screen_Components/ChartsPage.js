import React,{Component} from 'react';
import ChartData from '../../ChartData';


export default class ChartsPage extends Component{
    constructor(props){
        super(props);
        this.state={
            flag:false
        }
    }
    
    num_of_sets=()=>{
        this.setState({flag:true});
    }

    render(){
            
        return(
            
            <div>
                {this.state.flag?
                <ChartData/>:
                <div>
                    <button onClick={this.num_of_sets} >מידע על סטים</button>
                    <button>זמן ממוצע</button>
                </div>}
                
                
            </div>
        );
    }
}