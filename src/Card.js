import React, { Component } from 'react';
import './Card.css';
import setFunctions from './SetGame/setFunctions.js';


function importAll(r) {
    let images = {};
    r.keys().map((card) => { images[card.replace('./', '')] = r(card); });
    return images;
}
const cardImages = importAll(require.context('./data/cards', false, /\.(png|jpe?g|svg)$/));


export default class Card extends Component {
    constructor(props) {
        super(props)
        this.state = {    
        }
        this.clickOnCard=this.clickOnCard.bind(this);
    }

    clickOnCard(e){
       if(this.props.stageOfTheGame===1){
        this.props.onclick(this.props.cardCode);
       }
    }

    settingClassNameCard=(classNameCard)=>{
        if(this.props.isSet){
            classNameCard=' greenCard';
        }else if(this.props.isSet===false){
            console.log('red')
            classNameCard=' redCard';
        }else if(this.props.isSet===undefined){
            console.log('gray')
            classNameCard=' greyCard';
        }
        return classNameCard;  
    }

    render() {
        let stageOfTheGame=this.props.stageOfTheGame;
        let classNameCard;

        // if(stageOfTheGame===0||stageOfTheGame===3){
        //     classNameCard='not-active'
        // }
        // if(stageOfTheGame===1 || stageOfTheGame===2){
        //     if(this.props.isSelected){
        //         if(this.props.isSet){
        //             classNameCard='greenCard';
        //         }else if(this.props.isSet===false){
        //             classNameCard='redCard';
        //         }else if(this.props.isSet===undefined){
        //             classNameCard='greyCard';
        //         }

        //     }
        //     else{
        //         classNameCard='unselectedCard';
        //         }
        // }
    
        if(stageOfTheGame===0||stageOfTheGame===3)classNameCard='not-active';
            if(stageOfTheGame===1||stageOfTheGame===2)classNameCard='unselectedCard';

            if(this.props.isSelected){
                classNameCard+=this.settingClassNameCard(classNameCard);
            }

        return (
            <div>
                <img 
                onClick={this.props.stageOfTheGame===1?this.clickOnCard:null}
                className={classNameCard}
                width="100px" 
                height="100px" 
                src={cardImages[setFunctions.cardNameStringFromNumbersCode(this.props.cardCode)]} 
                alt="card" />
            </div>
        );

    }
}