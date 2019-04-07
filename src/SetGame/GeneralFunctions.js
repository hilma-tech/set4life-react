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
                return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        }
    }
}

export default GereralFunctions;