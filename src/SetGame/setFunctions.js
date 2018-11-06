
const setFunctions={

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
               
        return (colorSim||colorDiff) && (shapeSim || shapeDiff) && (shadingSim||shadingDiff) && (numberSim||numberDiff);
    },

    //receive an array of cards and return a random cardCode that is not in the array 
    //(return cardCode)
    NewCardNumber(arrCards){
        let shape,shade,color,num;
        do{
            shape=Math.floor(Math.random() * 3);
            shade=Math.floor(Math.random() * 3);
            color=Math.floor(Math.random() * 3);
            num=Math.floor(Math.random() * 3);
        }while(arrCards.includes(`${shape}${shade}${color}${num}`))
        return `${shape}${shade}${color}${num}`; 
    },

    //receive an array of cards and check if there is at least one set inside
    //(return t/f)
    IsArrayHasSet(currCards){
        for (let a=0;a<currCards.length-2;a++){
            for(let b=a+1;b<currCards.length-1;b++){
                for(let c=b+1;c<currCards.length;c++){
                    if(this.isSetBoolFunction([currCards[a],currCards[b],currCards[c]])){
                        console.log('only the first set at ', a,b,c)
                        return true;
                        }
                    }
                }
            }
        return false;
    },

    // מקבל את מספר הקלפים שהוא צריך להחזיר ומחזיר מערך של קלפים ששונים אחד מהשני ויש ביניהם סט אחד לפחות
    //(return arr)
    newCurrentCards(x){
        let currCards=[];
        do{
            for(let i=0;i<x;i++){
                currCards.push(this.NewCardNumber(currCards));
            }
        }while(!this.IsArrayHasSet(currCards));

        return currCards;
        
    },

    //pull x cardCodes out of an arry and enter to the array new random x cardCodes Creating a situation in which there is a set
    //return arr (the new array) 
    pullXCardsAndEnterNewXCards(x,currCards,selectedCards, usedCards){
        let currentCards=Array.from(currCards);
        let newCards=[];
        let indexRemovedCards=[];
        selectedCards.map((card,n)=>{
            let index=currentCards.indexOf(card);
            indexRemovedCards.push(index);
        });

        indexRemovedCards.sort((a,b)=>{
            if (a<b) {
                return -1;
              }
              if (a>b) {
                return 1;
              }
              // a must be equal to b
              return 0;
            }
        );

        indexRemovedCards.map((index,n)=>{
            currCards.splice(index-n,1);
        });

        do{
            if(newCards.length!==0)newCards=[];
            for(let i=0;i<x;i++){
                newCards.push(this.NewCardNumber([...currCards,...newCards,...usedCards]));
            }
        }while(!setFunctions.IsArrayHasSet([...currCards,...newCards]));

        newCards.map((newCard,i)=>{
            currCards.splice(indexRemovedCards[i],0,newCard)
        });
        return currCards;
    },

    cardNameStringFromNumbersCode(str) {// translate cardCode into src of pictures 
        //(return src)
        let shape = "", shade = "", color = "", num = "";

        //shape
        switch (str[0]) {
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

        //shade
        switch (str[1]) {
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

        //color
        switch (str[2]) {
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

        num = str[3];
        if (str[3]==="0"){
            num=null; 
        }
        
        if(num){
            return `${shape}_${shade}_${color}_${num}.png`;
        }
        return `${shape}_${shade}_${color}.png`;
    },

};

export default setFunctions;