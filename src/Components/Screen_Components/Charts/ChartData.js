import React, { Component } from 'react';
import ChartFunctions from './ChartFunctions';
import LoadGif from '../../../data/design/loading-img.gif';
import { fillingAxis, x_y_axis, chartsObj, chartTitles } from './X_Y_axis';
import './chart-data.css'
import LeftArrow from '../../../data/design/left-arrow.png';



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
            <ChartContainer
                onChange={this.onChange_dropDown_level}
                chartType={this.state.chartType}
                onClickChartType={this.onClickChartType}
                group_buttons={this.state.group_buttons} />
        );
    }
}

///small components////////////////////////////////////////

const ChartContainer = (props) => (
    <div id='chart-data' className='container-fluid' style={{ direction: 'rtl' }}>
        <nav className='navbar px-0' style={{ backgroundColor: 'var(--dark_purple)' }}>
            <div id='dropdown_and_buttons' 
            className="container col-md-10 col-lg-11 d-flex flex-lg-row flex-md-row justify-content-md-center mt-md-2 mx-0 m-lg-0" >
                <div class="btn-group col-md-12 col-lg-5 mx-auto justify-content-center" role="group" aria-label="Basic example" style={{ direction: 'ltr' }}>
                    <button class="btn btn-secondary text-body active" type="button" onClick={props.onClickChartType} name='numOfSets' id='numOfSets' href="#numOfSets" disabled={props.group_buttons.numOfSets} >מספר הסטים</button>
                    <button class="btn btn-secondary text-body" type="button" onClick={props.onClickChartType} name='avgTime_hitSet' id='avgTime_hitSet' href="#avgTime_hitSet" disabled={props.group_buttons.avgTime_hitSet} >זמן ממוצע ללחיצה</button>
                    <button class="btn btn-secondary text-body" type="button" onClick={props.onClickChartType} name='avgTime_chooseSet' id='avgTime_chooseSet' href="#avgTime_chooseSet" disabled={props.group_buttons.avgTime_chooseSet} >זמן ממוצע לבחירה</button>
                </div>
                <DropDown_level
                    onChange={props.onChange}
                    name={props.chartType} />
            </div>
            <a className="col-1 p-0 mr-auto" onClick={() => window.history.back()}><img src={LeftArrow} /></a>
        </nav>
        <div className='container-fluid mt-md-2 col-md-10 col-lg-11'>
            <div className='chart-info'>
                <h1 className='h1 font-weight-light mt-md-3 m-lg-0 col-lg-12' >{chartTitles[props.chartType].title}</h1>
                <p className='lead m-lg-0' >{chartTitles[props.chartType]._p}</p>
            </div>
            <div id="lineChart" className='chart-div container col-lg-11 col-md-12' >
                <canvas width="450" height="380" id='_chart' />
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
    <div id='drop_down_chart' className="d-flex ml-5 col-lg-4 col-md-10 text-align-center mx-auto mt-md-3 m-lg-0">
        <label className="no-bg col-lg-5 col-md-5 p-0 my-lg-auto text-lg-left ml-lg-1">רמת קושי:</label>
        <select className="d-flex form-control col-lg-4 col-md-3" name={props.chartType} onChange={props.onChange} >
            {displayLevels.map((level, i) =>
                <option key={i} num={i + 1} selected={i + 1 === 3}>{level}</option>)}
        </select>
    </div>
);

///////////////////////////////////////////////////////////////////////////////////////

export default ChartData;


