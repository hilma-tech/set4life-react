import React, { Component } from 'react';
import setFunctions from '../../SetGame/setFunctions.js';
import wrongSetImg from '../../data/design/wrongIcon.png'
import correctSetImg from '../../data/design/correctIcon.png'

function importAll(r) {
    let images = {};
    r.keys().map((card) => { images[card.replace('./', '')] = r(card); });
    return images;
}
const cardImages = importAll(require.context('../../data/cards', false, /\.(png|jpe?g|svg)$/));


export default class Card extends Component {
    clickOnCard=()=>{
       if(this.props.stageOfTheGame===1){
        this.props.onclick(this.props.cardCode);
       }
    }

    settingClassNameCard=()=>{
        let classNameCard='card';
        switch(this.props.isSet){
            case true:
                classNameCard+=' greenCard';
                break;
            case false:
                classNameCard+=' redCard';
                break;
            case undefined:
                classNameCard+=' greyCard';
                break;
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
            <div>
            <img 
            onClick={this.props.stageOfTheGame===1?this.clickOnCard:null}
            className={classNameCard}
            src={cardImages[`${this.props.cardCode}.png`]} 
            alt="card" />

            <img 
            className={`wrongOrRight ${(this.props.isSet&&this.props.isSelected)?'visible':'notVisible'}`}
            src={correctSetImg} 
            alt="correctSet"/>

            <img 
            className={`wrongOrRight ${(this.props.isSet==false&&this.props.isSelected)?'visible':'notVisible'}`}
            src={wrongSetImg} 
            alt="wrongSet" />
            </div>
        );
    }
}