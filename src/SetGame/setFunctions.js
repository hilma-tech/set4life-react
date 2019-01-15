
import GameData from '../data/GameData.json';
import Variables from './Variables.js';

const setFunctions = {

    flag_pullXCards:false,

    //return a number with help to know if valid number of checkboxs is checked
    checkOfValidChecks(obj) {
        let objArr = Object.values(obj);
        let count = 4;
        for (let i = 0; i < objArr.length; i++) !objArr[i] && count--;
        return count;
    },

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
            if(Variables.objConstParameters&&Variables.objConstParameters.hasOwnProperty(info[index]))
                result.information[info[index]]=parseInt(Variables.objConstParameters[info[index]],10)+3;
            else{
                result.information[info[index]] =tempResult.bool?(tempResult.isSimilar ? selectedCards[0].charAt(index): -1):-2;
                flag&&(flag = flag && tempResult.bool);  
            }
        }
        result.bool = flag;
        return  result; 
    },

    newRandomGameCode(size) {
        let num=Math.floor(Math.random()*(Math.pow(10,size)));
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    },

    //receive an array of cards and return a random cardCode that is not in the array 
    //(return cardCode)
    NewCardNumber(arrCards) {
        let randoms=[];
        let { shape, shade, color, number } =Variables.objConstParameters;

        [shape,shade,color,number].map(value=>{
            value===undefined?randoms.push(true):randoms.push(false);
        });

        /// why cant i use (typeof shape==='undefiend') instead random[0]?
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
    IsArrayHasSet(currCards) {
        for (let a = 0; a < currCards.length - 2; a++) {
            for (let b = a + 1; b < currCards.length - 1; b++) {
                for (let c = b + 1; c < currCards.length; c++) {
                    if (this.isSetBoolFunction([currCards[a], currCards[b], currCards[c]]).bool) {
                        console.log('only the first set at ', a, b, c)
                        return true;
                    }
                }
            }
        }
        return false;
    },

    // מקבל את מספר הקלפים שהוא צריך להחזיר, ומספר מערכים שהוא צריך לקחת בחשבון ומחזיר מערך של קלפים ששונים אחד מהשני ויש ביניהם סט אחד לפחות
    //(return arr)
    newCurrentCards(x, arrcurrentCards, arrUsedCards,constParameters=null) {
        let currCards = [];
        do {
            for (let i = 0; i < x; i++) 
                currCards.push(this.NewCardNumber([...currCards, ...arrcurrentCards, ...arrUsedCards])); 
        } while (!this.IsArrayHasSet([...currCards, ...arrcurrentCards]));

        return currCards;
    },

    //pull x cardCodes out of an arry and enter to the array new random x cardCodes Creating a situation in which there is a set
    //return arr (the new array) 
    pullXCardsAndEnterNewXCards(x, currCards, selectedCards, usedCards) {
        let parmObjLength=Object.keys(Variables.objConstParameters).length;
        let gameOver=false
        
        if(this.flag_pullXCards||usedCards.length===(81/(Math.pow(3,parmObjLength)))){
            this.flag_pullXCards=true;
            currCards=currCards.filter(card=>!selectedCards.includes(card));
            if(!this.IsArrayHasSet(currCards))gameOver=true;             
        }
        else{
            let newCards =this.newCurrentCards(x, currCards, usedCards); 
            selectedCards.map((card,i) => {
                let index = currCards.indexOf(card);
                currCards[index] = newCards[i];
            });
        }
        return{
            currentCards:currCards,
            gameOver:gameOver
        };
    },

    // translate cardCode into src of pictures 
    //(return src)
    cardNameStringFromNumbersCode(str) {
        let shape = this.getShapeFromCode(str[0], "en");
        let shade = this.getShadeFromCode(str[1], "en");
        let color = this.getColorFromCode(str[2], "en");
        let number = str[3]==='0'?'':str[3];

        return (`${shape}_${shade}_${color}${number?"_"+number:''}.png`);  
    },

    //convert shapeCode to string 
    getShapeFromCode(code, lang) {
        return lang ==="en"?GameData.cardsParameters.shape.shapeEn[code]:
            GameData.cardsParameters.shape.shapeHe[code];
    },

    //convert shadeCode to string 
    getShadeFromCode(code, lang) {
        return lang ==="en"?GameData.cardsParameters.shade.shadeEn[code]:
        GameData.cardsParameters.shade.shadeHe[code];
    },

    //convert colorCode to string 
    getColorFromCode(code, lang) {
        return (lang ==="en")?GameData.cardsParameters.color.colorEn[code]:
            GameData.cardsParameters.color.colorHe[code];;
    },
};

export default setFunctions;
