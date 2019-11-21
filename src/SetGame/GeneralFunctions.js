const GereralFunctions={

    string_From_List(listArr,before='',after=''){
        let str=before;
        listArr.map((val,i)=>
            str+=((i===listArr.length-1&&listArr.length!==1)?' ו':(listArr.length<=2||i===0)?"":" ,")+val);
        return str+after;     
    },

    timeAndDate(purpose){
        let d=new Date();
        switch(purpose){
            case 'time':{
                let hour=d.getHours();
                let min=d.getMinutes();
                return `${hour<10?'0':''}${hour}:${min<10?'0':''}${min}`;
            }
            case 'date':
                let day=`${d.getDate()}`.length===1?`0${d.getDate()}`:`${d.getDate()}`;
                let month=`${d.getMonth()+1}`.length===1?`0${d.getMonth()+1}`:`${d.getMonth()+1}`;
                let year=d.getFullYear()
                return `${year}-${month}-${day}`;
        }
    }
}

export default GereralFunctions;