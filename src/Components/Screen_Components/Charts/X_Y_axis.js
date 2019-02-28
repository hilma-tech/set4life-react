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
    _p: 'מציג את הזמן הממוצע עבור כל משחק, מהרגע שהוצגו קלפים חדשים על הלוח, עד הלחיצה על הכפתור "מצאתי סט"'
  },
  avgTime_chooseSet: {
    title: 'זמן ממוצע מהלחיצה על כפתור הסט עד בחירת סט נכון',
    _p: 'מציג את הזמן הממוצע מהרגע בו לוחצים על הכפתור "מצאתי סט", עד לבחירת סט כלשהו'
  },
  numOfSets: {
    title: 'מספר הסטים בכל משחק',
    _p: 'מציג את מספר הסטים שכל שחקן יצר בכל משחק לפי קטגוריות שונות'
  }
}

let chartsObj = {
  avgTime_hitSet: {
    Correct: {
      data: null,
      label: 'סטים נכונים',
      borderColor: "red",
      backgroundColor:"red",
      fill: false,
      pointRadius: 5
    },
    Wrong: {
      data: null,
      label: 'סטים לא נכונים',
      borderColor: "#3e95ce",
      backgroundColor:"#3e95ce",
      fill: false,
      pointRadius: 5
    }
  },
  avgTime_chooseSet: {
    Correct: {
      label: 'סט נכון',
      data: null,
      borderColor: "green",
      backgroundColor:"green",
      fill: false,
      pointRadius: 5
    }
  },
  numOfSets: {
    Correct: {
      data: null,
      label: "סטים נכונים",
      borderColor: "#3e95ce",
      backgroundColor:"#3e95ce",
      fill: false,
      pointRadius: 5
    },
    Wrong: {
      data: null,
      label: "סטים לא נכונים",
      borderColor: "#3e9234",
      backgroundColor:"#3e9234",
      fill: false,
      pointRadius: 5
    },
    Missed: {
      data: null,
      label: "סטים מפוספסים",
      borderColor: "#3eeeee",
      backgroundColor:"#3eeeee",
      fill: false,
      pointRadius: 5
    }
  }
}


export { x_y_axis, chartsObj, fillingAxis, chartTitles };
