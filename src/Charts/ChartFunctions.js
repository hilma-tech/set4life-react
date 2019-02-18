import firebaseObj from '../firebase/firebaseObj';
import Variables from '../SetGame/Variables';
import Chart from 'chart.js';
import { x_y_axis, chartsObj} from './X_Y_axis';


let chartsRef = {
  chart_1: null,
  chart_2: null
}

const ChartFunctions = {
  chartType: null,

  set_chartType(chartType) {
    this.chartType = chartType;
  },

  avgTime(setObj) {
    let action;
    for (let _chart in x_y_axis.avgTime) {
      switch (_chart) {
        case 'hitSet':
          action = 'DisplaysNewCards_Till_ClickSet';
          break;
        case 'chooseSet':
          action = 'ClickSet_Till_ChooseSet';
          break;
      }
      for (let y_axis in x_y_axis.avgTime[_chart]) {
        if (y_axis !== 'x_axis') {
          let setObjCategory = y_axis.substring(2) + 'Sets';
          for (let level in x_y_axis.avgTime[_chart][y_axis]) {
            x_y_axis.avgTime[_chart].x_axis[level].map((x, i) => {
              let sum = 0;
              if (setObj[setObjCategory].hasOwnProperty(x))
                for (let setId in setObj[setObjCategory][x])
                  sum += parseFloat(setObj[setObjCategory][x][setId][action]);
              x_y_axis.avgTime[_chart][y_axis][level].push(sum);
            });
          }
          chartsObj.avgTime[_chart][y_axis.substring(2)].data = x_y_axis.avgTime[_chart][y_axis].level_3
        }
      }
    }
    console.log('finish y avgTime')
  },

  createX_axis(gamesObj) {
    for (let date in gamesObj)
      for (let num in gamesObj[date]) {
        let arr = this.chartType === 'avgTime' ? ['hitSet', 'chooseSet'] : ['_chart'];
        arr.map((type) => {
          let level = x_y_axis[this.chartType][type].x_axis[`level_${gamesObj[date][num].level}`];
          if (!level)
            level = [`${date}:${num}`]
          else if (!level.includes(`${date}:${num}`))
            level.push(`${date}:${num}`);
        });
      }
  },

  createChart() {
    let chart_num = 1;
    for (let _chart in chartsObj[this.chartType]) {
      let ctx = document.getElementById(`chart_${chart_num}`).getContext('2d');
      let chart_obj = chartsObj[this.chartType][_chart];
      let title = chart_obj.title;
      delete chart_obj.title;

      let _chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: x_y_axis[this.chartType][_chart].x_axis.level_3,
          datasets: Object.values(chart_obj)
        },
        options: {
          title: {
            display: true,
            text: title,
            fontSize: 25
          },
          scales: {
            yAxes: {
              ticks: {
                beginAtZero: true
              }
            }
          }
        }
      });
      chartsRef[`chart_${chart_num}`] = _chart
      chart_num++;
    }
  },

  updatingDataInChart(type, level) {
    let chartRef = chartsRef[`chart_${type}`];
    let _chart='_chart';

    if (this.chartType === 'avgTime') 
      _chart = type === 1 ? 'chooseSet' : 'hitSet';
  
      chartRef.data.labels = x_y_axis[this.chartType][_chart].x_axis[`level_${level}`];

      for (let i = 0; i < chartRef.data.datasets.length; i++) {
        chartRef.data.datasets[i].data = x_y_axis[this.chartType][_chart][i === 0 ? 'y_Correct' : 'y_Wrong'][`level_${level}`];
        chartRef.update();
      }
  },

  creatingChartInfo() {
    firebaseObj.readingDataOnFirebaseCB(playerObj => {
      this.createX_axis(playerObj.games);
      if (this.chartType === 'avgTime')
        this.avgTime(playerObj);
      else
        this.calculatesNumOfSets(playerObj);
      this.createChart();
    }, `Players/${Variables.userId}`)
  },

  calculatesNumOfSets(setObj) {
    for (let y_axis in x_y_axis.numOfSets._chart) {
      if (y_axis !== 'x_axis') {
        let setObjCategory = y_axis.substring(2) + 'Sets';
        for (let level in x_y_axis.numOfSets._chart[y_axis]) {
          x_y_axis.numOfSets._chart.x_axis[level].map((x) => {
            let num = 0;
            if (setObj[setObjCategory].hasOwnProperty(x))
              num = Object.keys(setObj[setObjCategory]).length;
            x_y_axis.numOfSets._chart[y_axis][level].push(num);
          });
        }
        chartsObj.numOfSets._chart[y_axis.substring(2)].data = x_y_axis.numOfSets._chart[y_axis].level_3
      }
    }
    console.log('finish y numOfSets', x_y_axis.numOfSets._chart)
  }
}


export default ChartFunctions;



