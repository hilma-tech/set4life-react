import React, { Component } from 'react';


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
            index_card: 0
        }

        this.WhichCard = this.WhichCard.bind(this);
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
            num=""; 
        }
        
        if(num)
            return `${shape}_${shade}_${color}_${num}.png`;
        return `${shape}_${shade}_${color}.png`;
    }


    render() {
        return (
            <img width="100px" height="100px" src={cardImages[this.WhichCard("2221")]} alt="card" />
        );

    }
}