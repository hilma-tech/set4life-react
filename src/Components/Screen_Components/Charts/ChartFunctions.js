import firebaseObj from '../../../firebase/firebaseObj';
import Variables from '../../../SetGame/Variables';
import Chart from 'chart.js';
import { x_y_axis, chartsObj } from './X_Y_axis';

const ChartFunctions = {
  chartType: null,
  chartRef: null,
  _load: true,


  creatingChartInfo() {
    firebaseObj.readingDataOnFirebaseCB(playerObj => {
      this.createX_axis(playerObj.games);
      this.avgTime(playerObj);
      this.calculatesNumOfSets(playerObj);
      this.createChart();
    }, `Players/${Variables.userId}`)
  },


  createChart() {
    let ctx = document.getElementById(`_chart`).getContext('2d');

    let _chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: x_y_axis[this.chartType].x_axis.level_3,
        datasets: Object.values(chartsObj[this.chartType])
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false
        },
        scales: {
          yAxes: {
            ticks: {
              beginAtZero: true
            }
          }
        },
        legend: {
          labels: {
            fontSize: 20,
            padding: 20,
            usePointStyle: true,
          }
        }
      }
    });
    this.chartRef = _chart
  },


  createX_axis(gamesObj) {
    ['numOfSets', 'avgTime_hitSet', 'avgTime_chooseSet'].map(_chartType => {
      for (let date in gamesObj)
        for (let num in gamesObj[date]) {
          let x_axis_level = x_y_axis[_chartType].x_axis[`level_${gamesObj[date][num].level}`];
          if (!x_axis_level.includes(`${date}:${num}`))
            x_axis_level.push(`${date}:${num}`);
        }
    })
    console.log('finish x_axis')
  },


  ////setting y axis//////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  avgTime(setObj) {
    ['avgTime_hitSet', 'avgTime_chooseSet'].map(_chartType => {
      let action;
      if (_chartType === 'avgTime_hitSet')
        action = 'DisplaysNewCards_Till_ClickSet';
      else if (_chartType === 'avgTime_chooseSet')
        action = 'ClickSet_Till_ChooseSet';

      for (let y_axis in x_y_axis[_chartType]) {
        if (y_axis !== 'x_axis') {
          let setObjCategory = y_axis.substring(2) + 'Sets';
          for (let level in x_y_axis[_chartType][y_axis]) {
            x_y_axis[_chartType].x_axis[level].map(x => {
              let sum = 0;
              if (setObj[setObjCategory] && setObj[setObjCategory].hasOwnProperty(x)) {
                for (let setId in setObj[setObjCategory][x])
                  sum += parseFloat(setObj[setObjCategory][x][setId][action]);
              }
              x_y_axis[_chartType][y_axis][level].push(sum);
            });
          }
          chartsObj[_chartType][y_axis.substring(2)].data = x_y_axis[_chartType][y_axis].level_3
        }
      }
    });
    console.log('finish y avgTime')
  },


  calculatesNumOfSets(setObj) {
    for (let y_axis in x_y_axis.numOfSets) {
      if (y_axis !== 'x_axis') {
        let setObjCategory = y_axis.substring(2) + 'Sets';
        for (let level in x_y_axis.numOfSets.x_axis) {
          x_y_axis.numOfSets.x_axis[level].map(x => {
            let num = 0;
            if (setObj[setObjCategory] && setObj[setObjCategory].hasOwnProperty(x))
              num = Object.keys(setObj[setObjCategory][x]).length;
            x_y_axis.numOfSets[y_axis][level].push(num);
          });
        }
        chartsObj.numOfSets[y_axis.substring(2)].data = x_y_axis.numOfSets[y_axis].level_3
      }
    }
    console.log('finish y numOfSets')
  },
  ////////////////////////////////////////////////////////////////////////////////////////


  /////////////////////////update functions/////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  updatingChartType(level) {
    this.chartRef.data.labels = x_y_axis[this.chartType].x_axis[`level_${level}`];
    this.chartRef.data.datasets = Object.values(chartsObj[this.chartType]);
    this.chartRef.update();
  },


  updatingDataInChart(level) {
    this.chartRef.data.labels = x_y_axis[this.chartType].x_axis[`level_${level}`];
    let arrSetCategory = ['y_Correct', 'y_Wrong', 'y_Missed'];
    for (let i = 0; i < this.chartRef.data.datasets.length; i++) {
      this.chartRef.data.datasets[i].data = x_y_axis[this.chartType][arrSetCategory[i]][`level_${level}`];
      this.chartRef.update();
      for (let chartType in x_y_axis) {
        for (let y_axis in x_y_axis[chartType]) {
          if (y_axis !== 'x_axis')
            chartsObj[chartType][y_axis.substring(2)].data = x_y_axis[chartType][y_axis][`level_${level}`];
        }
      }
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
}


export default ChartFunctions;



