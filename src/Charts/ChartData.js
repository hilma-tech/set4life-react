import React, { Component } from 'react';
import firebaseObj from '../firebase/firebaseObj';
import ChartFunctions from './ChartFunctions';
import Variables from '../SetGame/Variables';
import LoadGif from '../data/design/loading-img.gif';

class ChartData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfSets: {},
            level: 3,
            //1-  2 const parameter
            //2-  1 const parameter
            //3-  no const parameters
            chartsOptions: 'load'
            //load-load gif
            //charts-see charts
        }
        window.history.pushState(this.props.chartType, '', this.props.chartType);
    }

    componentDidMount() {
        if (this.props.chartType === 'avgTime')
            ChartFunctions.avgTimeCharts();
        else if (this.props.chartType === 'numOfSets')
            this.numOfSets();
        this.setState({ chartsOptions: 'charts' })
    }

    numOfSets = () => {
        firebaseObj.readingDataOnFirebaseCB(val => {
            ChartFunctions.createX_axis(val.games);
            let x_axis = ChartFunctions.arrX_axis;
            let have = false;
            let y_axis_correct = [];
            let y_axis_worng = [];
            let y_axis_missed = [];

            if (!val.CorrectSets) {
                x_axis.forEach(() => {
                    y_axis_correct.push(0)
                });
            }

            if (!val.WrongSets) {
                x_axis.forEach(() => {
                    y_axis_worng.push(0)
                });
            }

            if (!val.MissedSets) {
                x_axis.forEach(() => {
                    y_axis_missed.push(0)
                });
            }

            x_axis.map(game => {
                if (val.CorrectSets) {
                    Object.keys(val.CorrectSets).map(GameCode => {
                        if (GameCode === game)
                            have = true;
                    });
                    if (have)
                        y_axis_correct.push(Object.keys(val.CorrectSets[game]).length)
                    else
                        y_axis_correct.push(0)
                    have = false
                }

                if (val.WrongSets) {
                    Object.keys(val.WrongSets).map(GameCode => {
                        if (GameCode === game)
                            have = true;
                    });
                    if (have)
                        y_axis_worng.push(Object.keys(val.WrongSets[game]).length)
                    else
                        y_axis_worng.push(0)
                    have = false
                }

                if (val.MissedSets) {
                    Object.keys(val.MissedSets).map(GameCode => {
                        if (GameCode === game)
                            have = true;
                    });
                    if (have)
                        y_axis_missed.push(Object.keys(val.MissedSets[game]).length)
                    else
                        y_axis_missed.push(0)
                }
                have = false;
            });
            let y_axis = {
                title: 'מספר הסטים בכל משחק',
                correct: {
                    data: y_axis_correct,
                    label: "סטים נכונים",
                    borderColor: "#3e95ce",
                    fill: false
                },
                wrong: {
                    data: y_axis_worng,
                    label: "סטים לא נכונים",
                    borderColor: "#3e9234",
                    fill: false
                },
                missed: {
                    data: y_axis_missed,
                    label: "סטים מפוספסים",
                    borderColor: "#3eeeee",
                    fill: false
                }
            }
            this.setState({ numOfSets: y_axis });
            ChartFunctions.createChart(this.state.numOfSets, 'firstChart');
        }, `Players/${Variables.userId}`)
    }

    render() {
        switch (this.state.chartsOptions) {
            case 'load':
                return (
                    <div className='page'>
                        <img src={LoadGif} alt='loading' />
                    </div>);

            case 'charts':
                return (
                    <div>
                        <div>
                            <input className="slider" type="range" min="1" max="3" value={this.state.level} onChange={(event) => this.setState({ level: event.target.value })} />
                            <canvas id='firstChart' />
                        </div>
                        <div>
                            <input type="range" min="1" max="3" value="1" />
                            <canvas id='secondChart' />
                        </div>

                    </div>);
        }
    }
}

export default ChartData;
