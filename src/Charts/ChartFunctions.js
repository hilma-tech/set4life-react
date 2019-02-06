import Chart from 'chart.js';
import firebaseObj from '../firebase/firebaseObj';
import Variables from '../SetGame/Variables';

const ChartFunctions = {
  arrX_axis: [],

  creatingColorsArr(oneSetObj){
    let param=['color','number','shade','shape'];
    let num=4;
    param.map(val=>{
      if(3<=oneSetObj[val]&&oneSetObj[val]<=5)
        num--;
    })

    switch(num){
      case 4:
        num="rgb(212, 244, 66)";
        break;
      case 3:
        num="rgb(224, 49, 195)";
        break;
      case 2:
        num="rgb(226, 107, 43)";
        break;   
    }
    return num;
  },

  avgTime(setObj, type) {
    let colorsArr=[];
    switch (type) {
      case 'hitSet':
        type = 'DisplaysNewCards_Till_ClickSet';
        break;
      case 'chooseSet':
        type = 'ClickSet_Till_ChooseSet';
        break;
    }
    let arrAvg = [];
    this.arrX_axis.map(x => {
      if (setObj.hasOwnProperty(x)) {
        let sum = 0;
        let _setId;
        for (let setId in setObj[x]){
          sum += parseFloat(setObj[x][setId][type]);
          (!_setId)&&(_setId=setId);
        }
        arrAvg.push(sum / Object.keys(setObj[x]).length);
        colorsArr.push(this.creatingColorsArr(setObj[x][_setId]))
      }
      else{
        arrAvg.push(0);
        colorsArr.push("rgb(255, 255, 255)");
      }   
    });

    return {
      avgTime:arrAvg,
      colorsArr:colorsArr
    };
  },

  createX_axis(gamesObj) {
    let arrX_axis = [];
    for (let date in gamesObj)
      for (let num in gamesObj[date])
        arrX_axis.push(`${date}:${num}`);
    this.arrX_axis = arrX_axis;
  },

  createChart(obj, idElement) {
    const ctx = document.getElementById(idElement).getContext('2d');
    let title = obj.title;
    delete obj.title;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.arrX_axis,
        datasets: Object.values(obj)
      },
      options: {
        title: {
          display: true,
          text: title,
          fontSize:25
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
  },

  avgTimeCharts() {
    firebaseObj.readingDataOnFirebaseCB(playerObj => {
      this.createX_axis(playerObj.games);
      let correct_avgTime_hit=this.avgTime(playerObj.CorrectSets, 'hitSet');
      let wrong_avgTime_hit=this.avgTime(playerObj.WrongSets, 'hitSet');
      let correct_avgTime_choose=this.avgTime(playerObj.CorrectSets, 'chooseSet');
  
      let hittingSetButton = {
        title: 'זמן ממוצע עד הלחיצה על כפתור סט',
        correct: {
          data: correct_avgTime_hit.avgTime,
          label: 'סטים נכונים',
          borderColor: "red",
          fill: false,
          pointBackgroundColor: correct_avgTime_hit.colorsArr,
          pointBorderColor:'#000000',
          pointRadius:5
        },
        wrong: {
          data:wrong_avgTime_hit.avgTime ,
          label: 'סטים לא נכונים',
          borderColor: "#3e95ce",
          fill: false,
          pointBackgroundColor: wrong_avgTime_hit.colorsArr,
          pointBorderColor:'#000000',
          pointRadius:5
        }
      }

      let choosingCorrectSet = {
        title: 'זמן ממוצע מהלחיצה על כפתור הסט עד בחירת סט נכון',
        correct: {
          data: correct_avgTime_choose.avgTime,
          borderColor: "green",
          fill: false,
          pointBackgroundColor: correct_avgTime_choose.colorsArr,
          pointBorderColor:'#000000',
          pointRadius:5
        }
      }
      this.createChart(hittingSetButton, 'firstChart');
      this.createChart(choosingCorrectSet, 'secondChart');

    }, `Players/${Variables.userId}`)
  }
}

export default ChartFunctions;