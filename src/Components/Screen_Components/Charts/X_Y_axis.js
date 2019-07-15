let _axis = {
  level_1: [],
  level_2: [],
  level_3: []
}

const fillingAxis = () => {
  for (let chartType in x_y_axis) {
    for (let axis in x_y_axis[chartType])
      x_y_axis[chartType][axis] = JSON.parse(JSON.stringify(_axis));
  }
}

let x_y_axis = {

  avgTime_hitSet: {
    x_axis: {},
    y_Correct: {},
    y_Wrong: {}
  },

  avgTime_chooseSet: {
    x_axis: {},
    y_Correct: {}
  },
  
  numOfSets: {
    x_axis: {},
    y_Correct: {},
    y_Wrong: {},
    y_Missed: {}
  }
}


let chartTitles = {

  avgTime_hitSet: {
    title: 'זמן ממוצע עד הלחיצה על כפתור סט',
    _p: 'מציג את הזמן הממוצע עבור כל משחק, מהרגע שהוצגו קלפים חדשים על הלוח, עד הלחיצה על הכפתור "מצאתי סט"',
    y_axis_label:'הזמן הממוצע'
  },

  avgTime_chooseSet: {
    title: 'זמן ממוצע מהלחיצה על כפתור הסט עד בחירת סט נכון',
    _p: 'מציג את הזמן הממוצע מהרגע בו לוחצים על הכפתור "מצאתי סט", עד לבחירת סט כלשהו',
    y_axis_label:'הזמן הממוצע'
  },

  numOfSets: {
    title: 'מספר הסטים בכל משחק',
    _p: 'מציג את מספר הסטים שכל שחקן יצר בכל משחק לפי קטגוריות שונות',
    y_axis_label:'מספר הסטים'
  }
}


let chartsObj = {

  avgTime_hitSet: {
    Correct: {
      data: null,
      label: 'סטים נכונים',
      borderColor: "#8CC63F",
      backgroundColor: "#8CC63F",
      fill: false,
      pointRadius: 5
    },
    Wrong: {
      data: null,
      label: 'סטים לא נכונים',
      borderColor: "#FF1D00",
      backgroundColor: "#FF1D00",
      fill: false,
      pointRadius: 5
    }
  },

  avgTime_chooseSet: {
    Correct: {
      label: 'סט נכון',
      data: null,
      borderColor: "#8CC63F",
      backgroundColor: "#8CC63F",
      fill: false,
      pointRadius: 5
    }
  },

  numOfSets: {
    Correct: {
      data: null,
      label: "סטים נכונים",
      borderColor: "#8CC63F",
      backgroundColor: "#8CC63F",
      fill: false,
      pointRadius: 5
    },
    Wrong: {
      data: null,
      label: "סטים לא נכונים",
      borderColor: "#FF1D00",
      backgroundColor: "#FF1D00",
      fill: false,
      pointRadius: 5
    },
    Missed: {
      data: null,
      label: "סטים מפוספסים",
      borderColor: "orange",
      backgroundColor: "orange",
      fill: false,
      pointRadius: 5
    }
  }
}


export { x_y_axis, chartsObj, fillingAxis, chartTitles };
