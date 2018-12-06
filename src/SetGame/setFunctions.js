
import ParametersInfo from '../data/ParametersInfo.json';
import Variables from './Variables.js';

const setFunctions = {


    //return a number with help to know if valid number of checkboxs is checked
    checkOfValidChecks(obj) {
        let objArr = Object.values(obj);
        let count = 4;
        for (let i = 0; i < objArr.length; i++) !objArr[i] && count--;
        return count;
    },

    isParameterValidSet(selectedCards,index) {
        if(selectedCards.includes("00")) 
            return {bool:false, isSimilar:false};

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
        let info =Object.keys(ParametersInfo.cardsParameters);
        let result = {information:{}};

        if(selectedCards.includes(undefined))
            return false;

        for (let index = 0; index < 4; index++) {
            tempResult = this.isParameterValidSet(selectedCards,index);
            result.information[info[index]] = tempResult.isSimilar ? selectedCards[0].charAt(index) : -1;
            flag = flag && tempResult.bool;
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
        let { shape, shade, color, number } = Variables.objConstParameters;

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
    newCurrentCards(x, arrCardsOnBoard, arrUsedCards) {
        let currCards = [];
        do {
            for (let i = 0; i < x; i++) 
                currCards.push(this.NewCardNumber([...currCards, ...arrCardsOnBoard, ...arrUsedCards])); 
        } while (!this.IsArrayHasSet([...currCards, ...arrCardsOnBoard]));

        return currCards;
    },

    //pull x cardCodes out of an arry and enter to the array new random x cardCodes Creating a situation in which there is a set
    //return arr (the new array) 
    pullXCardsAndEnterNewXCards(x, currCards, selectedCards, usedCards) {
        let parsNum=Object.keys(Variables.objConstParameters).length;
        let newCards,gameOver=false , fullUsedCards=false;

        if(usedCards.length===(81/(Math.pow(3,parsNum)))){
            currCards=currCards.filter(card=>!selectedCards.includes(card))

            this.IsArrayHasSet(currCards)?fullUsedCards=true:gameOver=true;    
        }
        else
        {
            newCards =this.newCurrentCards(x, currCards, usedCards); 
        
            selectedCards.map((card,i) => {
                let index = currCards.indexOf(card);
                currCards[index] = newCards[i]
            });
        }

        return{
            currentCards:currCards,
            gameOver:gameOver,
            fullUsedCards:fullUsedCards
        }

    },

    // translate cardCode into src of pictures 
    //(return src)
    cardNameStringFromNumbersCode(str) {
        if(str==="00"){
            console.log('hereeeee')
            return (`empty_picture.jpg`); 
        }
        let shape = this.getShapeFromCode(str[0], "en");
        let shade = this.getShadeFromCode(str[1], "en");
        let color = this.getColorFromCode(str[2], "en");
        let number = str[3]==='0'?'':str[3];

        return (`${shape}_${shade}_${color}${number?"_"+number:''}.png`);  
    },

    //convert shapeCode to string 
    getShapeFromCode(code, lang) {
        return lang ==="en"?ParametersInfo.cardsParameters.shape.shapeEn[code]:
            ParametersInfo.cardsParameters.shape.shapeHe[code];
    },

    //convert shadeCode to string 
    getShadeFromCode(code, lang) {
        return lang ==="en"?ParametersInfo.cardsParameters.shade.shadeEn[code]:
        ParametersInfo.cardsParameters.shade.shadeHe[code];
    },

    //convert colorCode to string 
    getColorFromCode(code, lang) {
        return (lang ==="en")?ParametersInfo.cardsParameters.color.colorEn[code]:
            ParametersInfo.cardsParameters.color.colorHe[code];;
    },
};

export default setFunctions;
