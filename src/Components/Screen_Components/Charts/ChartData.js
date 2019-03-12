import React, { Component } from 'react';
import ChartFunctions from './ChartFunctions';
import LoadGif from '../../../data/design/loading-img.gif';
import { fillingAxis, x_y_axis, chartsObj, chartTitles } from './X_Y_axis';
import './chart-data.css'


class ChartData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartType: 'numOfSets',
            dropDown_level: 3
        }
        window.history.pushState('charts', '', 'charts');
        ChartFunctions.chartType = this.state.chartType;
        fillingAxis();
    }

    componentDidMount() {
        ChartFunctions.creatingChartInfo();
    }

    onChange_dropDown_level = (event) => {
        let dropDown_level = event.target.options[event.target.selectedIndex].getAttribute('num');
        this.setState({ dropDown_level: dropDown_level })
        ChartFunctions.updatingDataInChart(dropDown_level);
        //1-  2 const parameter
        //2-  1 const parameter
        //3-  no const parameters
    }

    onClickChartType = (event) => {
        this.setState({ chartType: event.target.getAttribute('name') })
        ChartFunctions.chartType = event.target.getAttribute('name');
        ChartFunctions.updatingChartType(this.state.dropDown_level);
    }

    render() {
        return (
            <ChartContainer
                onChange={this.onChange_dropDown_level}
                chartType={this.state.chartType}
                onClickChartType={this.onClickChartType} />
        );
    }
}


///small components////////////////////////////////////////

const ChartContainer = (props) => (
    <div className='chart-seen page-seen'>
        <div className='upper-bar chartPage d-flex align-items-center py-2'>
            <a className="" onClick={() => window.history.back()}><i className="fas fa-arrow-right"></i></a>
            <div className='chart-type-switch' >
                <button className="btn btn-primary btn-sm" name='numOfSets' onClick={props.onClickChartType} >מספר סטים</button>
                <button className="btn btn-primary btn-sm mx-2" name='avgTime_hitSet' onClick={props.onClickChartType} >זמן ממוצע ללחיצה</button>
                <button className="btn btn-primary btn-sm" name='avgTime_chooseSet' onClick={props.onClickChartType} >זמן ממוצע לבחירה</button>
            </div>
            <DropDown_level
                onChange={props.onChange}
                name={props.chartType} />
        </div>
        <div className='chart-container'>
            <div className='chart-info'>
                <h1>{chartTitles[props.chartType].title}</h1>
                <p>{chartTitles[props.chartType]._p}</p>
            </div>
            {/* <div class="card">
                        <div class="card-body">
                            <canvas id="_chart" width="550" height="500"></canvas>
                        </div>
                    </div> */}
            <div id="lineChart" className='chart-div col-xs-11' >
                <canvas width="350" height="500" id='_chart' />
            </div>
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
    <div className="form-inline no-bg mr-5">
        <label className="no-bg ml-2 font-weight-bold text-primary">רמת קושי :</label>
        <select className="mr-auto d-inline w-7 form-control" name={props.chartType} onChange={props.onChange} >
            {displayLevels.map((level, i) =>
                <option key={i} num={i + 1} selected={i + 1 === 3} >{level}</option>)}
        </select>
    </div>
);

///////////////////////////////////////////////////////////////////////////////////////

export default ChartData;


