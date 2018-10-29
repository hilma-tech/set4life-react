import React, { Component } from 'react';
import './Card.css';


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

        this.cardNameStringFromNumbersCode = this.cardNameStringFromNumbersCode.bind(this);
        this.clickOnCard=this.clickOnCard.bind(this);
    }

    cardNameStringFromNumbersCode(str) {
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
    }

    
    clickOnCard(e){
        console.log('click on card');
       if(this.props.stageOfTheGame===1){
        console.log('click on card inside if');
        this.props.onclick(this.props.cardCode);
       }
    }

    render() {

            let stageOfTheGame=this.props.stageOfTheGame;
            let classNameCard;
    
            if(stageOfTheGame===0){
                classNameCard='not-active'
            }
            if(stageOfTheGame===1 || stageOfTheGame===2){
                if(this.props.isSelected){
                   console.log('selectedCard ' )
                    if(this.props.isSet){
                        classNameCard='greenCard';
                    }else if(this.props.isSet===false){
                        classNameCard='redCard';
                    }else if(this.props.isSet===undefined){
                        classNameCard='greyCard';
                    }
    
                }
                else{
                    classNameCard='unselectedCard'
                //     if(stageOfTheGame===1)
                //         classNameCard='greyCard';
                //     else
                //         classNameCard='not-active';
                 }
                
            }
        
        // let classOfCard="not-active";

        // if(this.props.isClickableCard){
        //     classOfCard='unselectedCard';
        // }
        // if(this.props.isSelected && this.props.isClickableCard )
        // {
        //     if(this.props.selectedCards.length===3){
        //         if(this.props.isSet===true)
        //         {
        //             classOfCard="greenCard";
        //         }
        //         else if(this.props.isSet===false)
        //         {
        //             classOfCard="redCard";
        //         } 

        //         if (this.props.isSet===null){
        //             classOfCard="greyCard"; 
        //         } 
        
        // }



        return (
            <div>
                <img 
                onClick={this.clickOnCard}
                className={classNameCard}
                width="100px" 
                height="100px" 
                src={cardImages[this.cardNameStringFromNumbersCode(this.props.cardCode)]} 
                alt="card" />
            </div>
        );

    }
}