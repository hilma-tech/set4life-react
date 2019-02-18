import React,{Component} from 'react';
import ChartData from '../../../Charts/ChartData';
import './charts-page.css'

export default class ChartsPage extends Component{
    constructor(props){
        super(props);
        this.state={
            chartType:'charts'
        }
        window.history.pushState('charts','','charts');
        window.addEventListener('popstate',(event)=>{
            switch(event.state){
                case "avgTime":
                case "numOfSets":
                case "charts":
                    if(this.state.chartType!==event.state)
                        this.setState({chartType:event.state});
                    break;
            }
        });
    }

    onClickShowChart=(event)=>{
        this.setState({chartType:event.target.getAttribute('id')}) 
    }

    render(){
        switch(this.state.chartType){
            case 'charts':
                return(
                    <div className='page'>
                        <button className='btn' onClick={this.onClickShowChart} id='numOfSets'  >מידע על סטים</button>
                        <button className='btn' onClick={this.onClickShowChart} id='avgTime' >זמן ממוצע</button>
                    </div>);
            case 'avgTime':case 'numOfSets':
                return <ChartData chartType={this.state.chartType}/>;
        }
    }
}