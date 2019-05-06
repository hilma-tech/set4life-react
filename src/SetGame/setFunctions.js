
import GameData from '../data/GameData.json';
import Variables from './Variables.js';

const setFunctions = {

    isParameterValidSet(selectedCards,index) {
        let similar = selectedCards[0].charAt(index) === selectedCards[1].charAt(index) &&
            selectedCards[0].charAt(index) === selectedCards[2].charAt(index);
        let difference = selectedCards[0].charAt(index) !== selectedCards[1].charAt(index) &&
            selectedCards[0].charAt(index) !== selectedCards[2].charAt(index) &&
            selectedCards[1].charAt(index) !== selectedCards[2].charAt(index);

        return {
            bool:similar || difference,
            isSimilar:similar
        };
    },

    // receive an array of 3 cardCodes and check if there is a set between them 
    //(return t/f)
    isSetBoolFunction(selectedCards) {
        let flag = true;
        let tempResult; 
        let info =Object.keys(GameData.cardsParameters);
        let result = {information:{}};

        if(selectedCards.includes(undefined))
            return false;

        for (let index = 0; index < 4; index++) {
            tempResult = this.isParameterValidSet(selectedCards,index);
            if(Variables.constParameters&&Variables.constParameters.hasOwnProperty(info[index]))
                result.information[info[index]]=parseInt(Variables.constParameters[info[index]],10)+3;
            else
                result.information[info[index]] =tempResult.bool?(tempResult.isSimilar ? selectedCards[0].charAt(index): -1):-2;  
            flag&&(flag = flag && tempResult.bool);
        }
        result.bool = flag;
        return  result; 
    },

    //receive an array of cards and return a random cardCode that is not in the array 
    //(return cardCode)
    NewCardNumber(arrCards) {
        let randoms=[];
        let { shape, shade, color, number } =Variables.constParameters;

        [shape,shade,color,number].map(value=>{
            value===undefined ? randoms.push(true) : randoms.push(false);
        });

        do {
            randoms[0]&& (shape = Math.floor(Math.random() * 3));
            randoms[1]&& (shade = Math.floor(Math.random() * 3));
            randoms[2]&& (color = Math.floor(Math.random() * 3));
            randoms[3]&& (number = Math.floor(Math.random() * 3));
        } while (arrCards.includes(`${shape}${shade}${color}${number}`))
        return `${shape}${shade}${color}${number}`;
    },

    //receive an array of cards and check if there is at least one set inside
    //(return t/f)
    IsArrayHasSet(currCards,showSet=null) {
        for (let a = 0; a < currCards.length - 2; a++) {
            for (let b = a + 1; b < currCards.length - 1; b++) {
                for (let c = b + 1; c < currCards.length; c++) {
                    if (this.isSetBoolFunction([currCards[a], currCards[b], currCards[c]]).bool) {
                        if(showSet)
                            console.log('set at ', a, b, c)
                        return true;
                    }
                }
            }
        }
        return false;
    },

    // מקבל את מספר הקלפים שהוא צריך להחזיר, ומספר מערכים שהוא צריך לקחת בחשבון ומחזיר מערך של קלפים ששונים אחד מהשני ויש ביניהם סט אחד לפחות
    //(return arr)
    createNewCards(x, filtered_currentCards, usedCards,lastCards) {
        let newCards = [];
        do {
            newCards = [];
            for (let i = 0; i < x; i++) 
                newCards.push(this.NewCardNumber(newCards.concat(filtered_currentCards,usedCards))); 
        } while (!this.IsArrayHasSet([...newCards, ...filtered_currentCards],true)&&!lastCards);
        return newCards;
    },

    //pull x cardCodes out of an arry and enter to the array new random x cardCodes Creating a situation in which there is a set
    //return arr (the new array) 
    pullXCardsAndEnterNewXCards(x, currentCards, selectedCards, usedCards) {
        let constParameters_length=Object.keys(Variables.constParameters).length;
        let newCards=[];
        
        if(usedCards.length===(81/(Math.pow(3,constParameters_length))))
            currentCards=currentCards.filter(card=>!selectedCards.includes(card));

        else{ 
            let newCurrCards=currentCards.filter(card=>!selectedCards.includes(card));
            newCards =this.createNewCards(x, newCurrCards, usedCards,usedCards.length===(81/(Math.pow(3,constParameters_length))-3));
            selectedCards.map((card,i) => {
                let index = currentCards.indexOf(card);
                currentCards[index] = newCards[i];
            });
        }
        let endGame=!this.IsArrayHasSet(currentCards,true);
        return{
            newUsedCards:[...usedCards,...newCards],
            currentCards:currentCards,
            endGame:endGame
        };
    },
    
    newRandomGameCode(size,customize_num=null) {
        let num=customize_num?customize_num:Math.floor(Math.random()*(Math.pow(10,size)));
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    },

     //return a number with help to know if valid number of checkboxs is checked
     checkOfValidChecks(obj) {
        let objArr = Object.values(obj);
        let count = 4;
        for (let i = 0; i < objArr.length; i++) !objArr[i] && count--;
        return count;
    }
};

export default setFunctions;
