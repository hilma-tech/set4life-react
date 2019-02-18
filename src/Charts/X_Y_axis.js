let _axis = {
  level_1: [],
  level_2: [],
  level_3: []
} 

const fillingAxis=()=>{
  for(let chartType in x_y_axis){
    for(let _chart in  x_y_axis[chartType]){
      for(let axis in x_y_axis[chartType][_chart]){
        x_y_axis[chartType][_chart][axis]=JSON.parse(JSON.stringify(_axis));
      }
    }
  }
}

let x_y_axis = {
  avgTime: {
    hitSet: {
      x_axis: {},
      y_Correct: {},
      y_Wrong: {}
    },
    chooseSet: {
      x_axis: {},
      y_Correct: {}
    }
  },
  numOfSets: {
    _chart: {
      x_axis: {},
      y_Correct: {},
      y_Wrong: {},
      y_Missed: {}
    }
  }
}


let chartsObj = {
  avgTime: {
    hitSet: {
      title: 'זמן ממוצע עד הלחיצה על כפתור סט',
      Correct: {
        data: null,
        label: 'סטים נכונים',
        borderColor: "red",
        fill: false,
        pointRadius: 5
      },
      Wrong: {
        data: null,
        label: 'סטים לא נכונים',
        borderColor: "#3e95ce",
        fill: false,
        pointRadius: 5
      }
    },
    chooseSet: {
      title: 'זמן ממוצע מהלחיצה על כפתור הסט עד בחירת סט נכון',
      Correct: {
        label: 'סט נכון',
        data: null,
        borderColor: "green",
        fill: false,
        pointRadius: 5
      }
    }
  },
  numOfSets: {
    _chart: {
      title: 'מספר הסטים בכל משחק',
      Correct: {
        data: null,
        label: "סטים נכונים",
        borderColor: "#3e95ce",
        fill: false,
        pointRadius: 5
      },
      Wrong: {
        data: null,
        label: "סטים לא נכונים",
        borderColor: "#3e9234",
        fill: false,
        pointRadius: 5
      },
      Missed: {
        data: null,
        label: "סטים מפוספסים",
        borderColor: "#3eeeee",
        fill: false,
        pointRadius: 5
      }
    }
  }
}


export { x_y_axis,chartsObj,fillingAxis};
