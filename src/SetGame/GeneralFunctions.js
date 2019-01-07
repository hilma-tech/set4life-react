const GereralFunctions={

    string_From_List(listArr,before,after){
        let str=before;
        listArr.map((val,i)=>
            str+=((i===listArr.length-1&&listArr.length!==1)?' ו':(listArr.length<=2)?"":" ,")+val);
        return str+after;     
    }
}

export default GereralFunctions;