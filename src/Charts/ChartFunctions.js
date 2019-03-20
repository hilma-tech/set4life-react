import Chart from 'chart.js';
import firebaseObj from '../firebase/firebaseObj';
import Variables from '../SetGame/Variables';

const ChartFunctions={
    arrX_axis:[],

    avgTime(setObj,type){
        switch (type){
            case 'hitSet':
                type='DisplaysNewCards_Till_ClickSet';
                break;
            case 'chooseSet':
                type='ClickSet_Till_ChooseSet';
                break;
        }
        let arrAvg=[];
        this.arrX_axis.map(x=>{
          if(setObj.hasOwnProperty(x)){
            let sum=0;
            for(let setId in setObj[x])
              sum+=parseFloat(setObj[x][setId][type]);
            arrAvg.push(sum/Object.keys(setObj[x]).length);
          }
          else
            arrAvg.push(0);
        });
        return arrAvg;
    },

    createX_axis(gamesObj){
        let arrX_axis=[];
        for(let date in gamesObj)
          for(let num in gamesObj[date])
            arrX_axis.push(`${date}:${num}`);
        this.arrX_axis=arrX_axis;
    },

    createChart(obj, idElement,title){
        const ctx=document.getElementById(idElement).getContext('2d');

        new Chart(ctx,{
            type: 'line',
            data:{
                labels: this.arrX_axis,
                datasets:obj
            },
            options: {
              title: {
                display: true,
                text: title
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

    avgTimeCharts(){
        firebaseObj.readingDataOnFirebaseCB(playerObj=>{
          this.createX_axis(playerObj.games);
  
          let hittingSetButton=[
                {
                  data:this.avgTime(playerObj.CorrectSets,'hitSet'),
                  label:'סטים נכונים',
                  borderColor: "red",
                  fill: false,
                },
                {
                  data:this.avgTime(playerObj.WrongSets,'hitSet'),
                  label:'סטים לא נכונים',
                  borderColor: "#3e95ce",
                  fill: false,
                }
          ]
  
          let choosingCorrectSet=[{
              data:this.avgTime(playerObj.CorrectSets,'chooseSet'),
              borderColor: "green",
              fill:false
            }]
          
          this.createChart(hittingSetButton,'firstChart','זמן ממוצע עד הלחיצה על כפתור סט');
          this.createChart(choosingCorrectSet,'secondChart','זמן ממוצע מהלחיצה על כפתור הסט עד בחירת סט נכון');
  
        },`Players/${Variables.userId}`)
      }
}


export default ChartFunctions;