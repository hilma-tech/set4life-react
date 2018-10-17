import React, { Component } from 'react';
import './Board.css';


function importAll(r) {
    let images = {};
    r.keys().map((card, index) => { images[card.replace('./', '')] = r(card); });
    return images;
}

const cardImages = importAll(require.context('./data/cards', false, /\.(png|jpe?g|svg)$/));



export default class Card extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSelected:false
        }

        this.WhichCard = this.WhichCard.bind(this);
        this.selectedCardsCSSchange=this.selectedCardsCSSchange.bind(this);
    }


    WhichCard(str) {
        let shape = "", shade = "", color = "", num = "";

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
            //console.log(`${shape}_${shade}_${color}_${num}.png`)
            return `${shape}_${shade}_${color}_${num}.png`;
        }
        //console.log(`${shape}_${shade}_${color}.png`)
        return `${shape}_${shade}_${color}.png`;
    }

    selectedCardsCSSchange(e){
       this.setState({isSelected:!this.state.isSelected});
       this.props.onClick(this.props.id);

       if(this.props.selectedCards.length===3){
           if(this.props.isSet){
                e.target.className="set"
           }
           else{
                e.target.className="unset"

           }
       }
         
    }


    render() {
        return (
            <img onClick={this.selectedCardsCSSchange}
            className={this.state.isSelected?"selectedCard":"unselectedCard"
         }
            width="100px" 
            height="100px" 
            src={cardImages[this.WhichCard(this.props.id)]} alt="card" />
        );

    }
}