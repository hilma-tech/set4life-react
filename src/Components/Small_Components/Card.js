import React, { Component } from 'react';
import setFunctions from '../../SetGame/setFunctions.js';


function importAll(r) {
    let images = {};
    r.keys().map((card) => { images[card.replace('./', '')] = r(card); });
    return images;
}
const cardImages = importAll(require.context('../../data/cards', false, /\.(png|jpe?g|svg)$/));

export default class Card extends Component {
    clickOnCard=(e)=>{
       if(this.props.stageOfTheGame===1){
        this.props.onclick(this.props.cardCode);
       }
    }

    settingClassNameCard=()=>{
        let classNameCard='card';
        if(this.props.isSet){
            classNameCard+=' greenCard';
        }else if(this.props.isSet===false){
            classNameCard+=' redCard';
        }else if(this.props.isSet===undefined){
            classNameCard+=' greyCard';
        }
        return classNameCard;  
    }

    render() {
        let stageOfTheGame=this.props.stageOfTheGame;
        let classNameCard='card';
    
        (stageOfTheGame===0||stageOfTheGame===3) && (classNameCard+=' not-active');
        (stageOfTheGame===1||stageOfTheGame===2) && (classNameCard+=' unselectedCard');

        (this.props.isSelected) && (classNameCard+=this.settingClassNameCard());
        
        return (
            <img 
            onClick={this.props.stageOfTheGame===1?this.clickOnCard:null}
            className={classNameCard}
            src={cardImages[setFunctions.cardNameStringFromNumbersCode(this.props.cardCode)]} 
            alt="card" />
        );
    }
}