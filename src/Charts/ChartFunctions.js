import Chart from 'chart.js';

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

    createChart(obj, idElement){
        const ctx=document.getElementById(idElement).getContext('2d');

        let title=obj.title;
        delete obj.title;
        
        obj=typeof obj[Object.keys(obj)[0]]==='object'?Object.values(obj):[obj];

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
    }
}


export default ChartFunctions;