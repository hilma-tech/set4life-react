import React, { Component } from 'react';
import ChartFunctions from './ChartFunctions';
import { fillingAxis, x_y_axis, chartsObj, chartTitles } from './X_Y_axis';
import './chart-data.css'
import LeftArrow from '../../../data/design/left-arrow.png';
import ErrorMes from '../ErrorMes/ErrorMes';

let chart_canvas = null;

class ChartData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartType: 'numOfSets',
            dropDown_level: 3,
            group_buttons: {
                numOfSets: true,
                avgTime_hitSet: false,
                avgTime_chooseSet: false
            }
        }
        window.history.pushState('charts', '', 'charts');
        ChartFunctions.chartType = this.state.chartType;
        fillingAxis();
    }

    finish_load = () => {
        this.setState({ _load: false })
    }

    componentDidMount() {
        ChartFunctions.creatingChartInfo(chart_canvas);
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
        let group_buttons = this.state.group_buttons;
        for (let btn in group_buttons) {
            if (btn !== event.target.getAttribute('name'))
                group_buttons[btn] = false;
        }
        group_buttons[event.target.getAttribute('name')] = true;
        this.setState({ group_buttons: group_buttons })
    }

    render() {
        return (
            <ChartPage
                onChange={this.onChange_dropDown_level}
                chartType={this.state.chartType}
                onClickChartType={this.onClickChartType}
                group_buttons={this.state.group_buttons}
                onClickGameTypeButton={this.props.onClickGameTypeButton} />
        );
    }
}

///small components////////////////////////////////////////

const ChartPage = (props) => (
    <div id='chart-data' className='container-fluid' style={{ direction: 'rtl' }}>
        <nav className='navbar px-0 py-2'>
            <div id='dropdown_and_buttons' className="container col-11 d-flex  m-lg-0" >
                <div className="btn-group col-md-12 col-lg-5 justify-content-center" role="group" aria-label="Basic example" style={{ direction: 'ltr' }}>
                    <button className="btn btn-primary text-body" type="button" onClick={props.onClickChartType} name='numOfSets' id='numOfSets' disabled={props.group_buttons.numOfSets} >מספר הסטים</button>
                    <button className="btn btn-primary text-body" type="button" onClick={props.onClickChartType} name='avgTime_hitSet' id='avgTime_hitSet' disabled={props.group_buttons.avgTime_hitSet} >זמן ממוצע ללחיצה</button>
                    <button className="btn btn-primary text-body" type="button" onClick={props.onClickChartType} name='avgTime_chooseSet' id='avgTime_chooseSet' disabled={props.group_buttons.avgTime_chooseSet} >זמן ממוצע לבחירה</button>
                </div>
                <DropDown_level
                    onChange={props.onChange}
                    name={props.chartType} />
            </div>
            <a className="col-1 p-0 mr-auto" onClick={props.onClickGameTypeButton} name='sel' >
                <img className='upper-bar-icon' src={LeftArrow} onClick={props.onClickGameTypeButton} name='sel' />
            </a>
        </nav>
        <div id='chart-container' className='col-md-11 mx-auto'>
            <div id='chart-info'>
                <h1>{chartTitles[props.chartType].title}</h1>
                <p className='lead m-lg-0 m-0' >{chartTitles[props.chartType]._p}</p>
            </div>
            <div id="lineChart" className='container' >
                <canvas id='_chart' ref={el => chart_canvas = el} />
            </div>
        </div>
    </div>
);

const displayLevels = ['קל', 'בינוני', 'קשה'];
const DropDown_level = (props) => (
    <div id='drop_down_chart' className="d-flex ml-5 col-lg-4 col-md-10 justify-content-center mx-auto mt-md-3 m-lg-0">
        <label className="no-bg my-auto ml-1">רמת קושי:</label>
        <select className="d-flex form-control" name={props.chartType} onChange={props.onChange} >
            {displayLevels.map((level, i) =>
                <option key={i} num={i + 1} selected={i + 1 === 3}>{level}</option>)}
        </select>
    </div>
);

///////////////////////////////////////////////////////////////////////////////////////

export default ChartData;


