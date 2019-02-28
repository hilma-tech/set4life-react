import React, { Component } from 'react';
import ChartFunctions from './ChartFunctions';
import LoadGif from '../../../data/design/loading-img.gif';
import { fillingAxis, x_y_axis, chartsObj, chartTitles } from './X_Y_axis';
import './chart-data.css'


class ChartData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartType:'avgTime_hitSet'
        }
        window.history.pushState('charts', '', 'charts');
        ChartFunctions.chartType = 'avgTime_hitSet';
        fillingAxis();
    }

    componentDidMount() {
        ChartFunctions.creatingChartInfo();
    }

    onChange_dropDown_level = (event) => {
        ChartFunctions.updatingDataInChart(event.target.options[event.target.selectedIndex].getAttribute('num'));
        //1-  2 const parameter
        //2-  1 const parameter
        //3-  no const parameters
    }

    onClickChartType = (event) => {
        this.setState({chartType:event.target.getAttribute('name')})
        ChartFunctions.chartType = event.target.getAttribute('name');
        ChartFunctions.updatingChartType();
    }

    render() {
        return (
            <div className='chart-seen' >
                <ChartContainer
                    onChange={this.onChange_dropDown_level}
                    chartType={this.state.chartType}
                    onClickChartType={this.onClickChartType} />
            </div>
        );
    }
}


///small components////////////////////////////////////////

const ChartContainer = (props) => (
    <div className='chart-container'>
        <div className='upperbar-chart' >
            <h1>{chartTitles[props.chartType].title}</h1>
            <p>{chartTitles[props.chartType]._p}</p>
            <DropDown_level
                onChange={props.onChange}
                name={props.chartType} />
            <Chart_terms chartInfo={Object.values(chartsObj[props.chartType])} />
            <button name='numOfSets' onClick={props.onClickChartType} >מספר סטים</button>
            <button name='avgTime_hitSet' onClick={props.onClickChartType} >זמן ממוצע ללחיצה</button>
            <button name='avgTime_chooseSet' onClick={props.onClickChartType} >זמן ממוצע לבחירה</button>
        </div>
        <div className='chart-div' >
            <canvas id='_chart' />
        </div>
    </div>
);


const Chart_terms = (props) => (
    <div className='chart-terms' >
        {props.chartInfo.map((val, i) => (
            <div key={i} className='circleAndInfo-container'>
                <div className='circle' style={{ backgroundColor: val.borderColor }}></div>
                <label>{val.label}</label>
            </div>)
        )}
    </div>
);

const displayLevels = ['קל', 'בינוני', 'קשה'];
const DropDown_level = (props) => (
    <select name={props.chartType} onChange={props.onChange} >
        {displayLevels.map((level, i) =>
            <option key={i} num={i + 1} selected={i + 1 === 3} >{level}</option>)}
    </select>
);

///////////////////////////////////////////////////////////////////////////////////////

export default ChartData;


