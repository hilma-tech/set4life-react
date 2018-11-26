
const setFunctions={

    objConstParameters:{},

    setobjConstParameters(objConstParameters){
        this.objConstParameters=objConstParameters;
    },

    //return a number with help to know if valid number of checkboxs is checked
    checkOfValidChecks(obj){
        let objArr=Object.values(obj);
        let count=4;
        for(let i=0;i<objArr.length;i++) !objArr[i]&&count--;
        return count;
    },
    
    // receive an array of 3 cardCodes and check if there is a set between them 
    //(return t/f)
    isSetBoolFunction(selectedCards)
    {   
        let colorSim = selectedCards[0].charAt(0)===selectedCards[1].charAt(0) && selectedCards[0].charAt(0)===selectedCards[2].charAt(0);
        let colorDiff = selectedCards[0].charAt(0)!==selectedCards[1].charAt(0) && selectedCards[0].charAt(0)!==selectedCards[2].charAt(0) && selectedCards[1].charAt(0)!==selectedCards[2].charAt(0);

        let shapeSim = selectedCards[0].charAt(1)===selectedCards[1].charAt(1) && selectedCards[0].charAt(1)===selectedCards[2].charAt(1);
        let shapeDiff = selectedCards[0].charAt(1)!==selectedCards[1].charAt(1) && selectedCards[0].charAt(1)!==selectedCards[2].charAt(1) && selectedCards[1].charAt(1)!==selectedCards[2].charAt(1);
        
        let shadingSim = selectedCards[0].charAt(2)===selectedCards[1].charAt(2) && selectedCards[0].charAt(2)===selectedCards[2].charAt(2);
        let shadingDiff = selectedCards[0].charAt(2)!==selectedCards[1].charAt(2) && selectedCards[0].charAt(2)!==selectedCards[2].charAt(2) && selectedCards[1].charAt(2)!==selectedCards[2].charAt(2);

        let numberSim = selectedCards[0].charAt(3)===selectedCards[1].charAt(3) && selectedCards[0].charAt(3)===selectedCards[2].charAt(3);
        let numberDiff = selectedCards[0].charAt(3)!==selectedCards[1].charAt(3) && selectedCards[0].charAt(3)!==selectedCards[2].charAt(3) && selectedCards[1].charAt(3)!==selectedCards[2].charAt(3);
               
        return {
            bool: (colorSim||colorDiff) && (shapeSim || shapeDiff) && (shadingSim||shadingDiff) && (numberSim||numberDiff),
            information:{
                color: colorSim? selectedCards[0].charAt(0):-1,
                shape: shapeSim? selectedCards[0].charAt(1):-1,
                shade: shadingSim? selectedCards[0].charAt(2):-1,
                number: numberSim? selectedCards[0].charAt(3):-1
            }   
        }
    },

    newRandomGameCode(num, size) {
        let s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    },

    //receive an array of cards and return a random cardCode that is not in the array 
    //(return cardCode)
    NewCardNumber(arrCards){
        let randoms=[];
        let {shape,shade,color,number}=this.objConstParameters;

        [shape,shade,color,number].map(value=>{
            value===undefined?randoms.push(true):randoms.push(false);
        })
        do{
            randoms[0]&&(shape=Math.floor(Math.random() * 3));
            randoms[1]&&(shade=Math.floor(Math.random() * 3));
            randoms[2]&&(color=Math.floor(Math.random() * 3));
            randoms[3]&&(number=Math.floor(Math.random() * 3));
        }while(arrCards.includes(`${shape}${shade}${color}${number}`))
        return `${shape}${shade}${color}${number}`; 
    },

    //receive an array of cards and check if there is at least one set inside
    //(return t/f)
    IsArrayHasSet(currCards){
        for (let a=0;a<currCards.length-2;a++){
            for(let b=a+1;b<currCards.length-1;b++){
                for(let c=b+1;c<currCards.length;c++){
                    if(this.isSetBoolFunction([currCards[a],currCards[b],currCards[c]]).bool){
                        console.log('only the first set at ', a,b,c)
                        return true;
                        }
                    }
                }
            }
        return false;
    },

    // מקבל את מספר הקלפים שהוא צריך להחזיר, ומספר מערכים שהוא צריך לקחת בחשבון ומחזיר מערך של קלפים ששונים אחד מהשני ויש ביניהם סט אחד לפחות
    //(return arr)
    newCurrentCards(x,arrCardsOnBoard,arrUsedCards){
        let currCards=[];
        do{
            for(let i=0;i<x;i++){
                currCards.push(this.NewCardNumber([...currCards,...arrCardsOnBoard,...arrUsedCards]));
            }
        }while(!this.IsArrayHasSet([...currCards,...arrCardsOnBoard]));

        return currCards;  
    },

    //pull x cardCodes out of an arry and enter to the array new random x cardCodes Creating a situation in which there is a set
    //return arr (the new array) 
    pullXCardsAndEnterNewXCards(x,currCards,selectedCards, usedCards){
        let currentCardsDuplicate=Array.from(currCards);
        let newCards=[];
        let indexRemovedCards=[];

        selectedCards.map((card,n)=>{
            let index=currCards.indexOf(card);
            indexRemovedCards.push(index);
        });
        indexRemovedCards.map((index,n)=>{
            currCards[index]=undefined;
            currentCardsDuplicate.splice(index-n,1);
        });

        newCards=this.newCurrentCards(x,currentCardsDuplicate,usedCards);

        indexRemovedCards.map((index,n)=>{
            currCards[index]=newCards[n];
        });
        return currCards;
    },

    // translate cardCode into src of pictures 
    //(return src)
    cardNameStringFromNumbersCode(str) {
        let shape = this.getShapeFromCode(str[0],"en");
        let shade=this.getShadeFromCode(str[1],"en");
        let color=this.getColorFromCode(str[2],"en");
        let num = str[3];
        if (str[3]==="0"){
            num=null; 
        }
        if(num){
            return `${shape}_${shade}_${color}_${num}.png`;
        }
        return `${shape}_${shade}_${color}.png`;
    },

    //convert shapeCode to string 
    getShapeFromCode(code,lang)
    {
        let shape;
        if(lang=="en")
        {
            switch (code) {
                case "0":
                    shape = "diamond";
                    break;
                case "1":
                    shape = "oval";
                    break;
                case "2":
                    shape = "squiggle";
                    break;
                default:
                    break;
            }
        }
        if(lang=="he")
        {
            switch (code) {
                case "0":
                    shape = "יהלום";
                    break;
                case "1":
                    shape = "אליפסה";
                    break;
                case "2":
                    shape = "גלים";
                    break;
                default:
                    break;
            }
        }
        return shape;
    },

    //convert shadeCode to string 
    getShadeFromCode(code,lang){

        let shade;
        if(lang==='en'){
            switch (code) {
                case "0":
                    shade = "open";
                    break;
                case "1":
                    shade = "solid";
                    break;
                case "2":
                    shade = "striped";
                    break;
                default:
                    
                    break;
            }
        }
        if(lang==='he'){
            switch (code) {
                case "0":
                    shade = "ריק";
                    break;
                case "1":
                    shade = "מלא";
                    break;
                case "2":
                    shade = "פסים";
                    break;
                default:
                    break;
            }
        }
        return shade;  
    },

    //convert colorCode to string 
    getColorFromCode(code,lang){

        let color;
        if(lang==='en'){
            switch (code) {
                case "0":
                    color = "blue";
                    break;
                case "1":
                    color = "green";
                    break;
                case "2":
                    color = "red";
                    break;
                default:
                    break;
            }
    
        }
        if(lang==='he'){
            switch (code) {
                case "0":
                    color = "כחול";
                    break;
                case "1":
                    color = "ירוק";
                    break;
                case "2":
                    color = "אדום";
                    break;
                default:
                    break;
            }
        }
        return color;  
    },
    getInfoFromCode:{
        
    }
};

export default setFunctions;
