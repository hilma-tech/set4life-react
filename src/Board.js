import React, { Component } from 'react';
import Card from './Card';
import './Board.css';


export default class Board extends Component{
    constructor(props){
        super(props)
        this.state={
            currentCards:["1101","1020","1010","1010","0011","0001","0000","0010","0101","1001","1201","1021"]
        }
    }

    //do i have to give a key to

    render(){
        return (
            <div>
                {this.state.currentCards.map(cardSrc=><Card cardSrc={cardSrc} />)}
            </div>
        );
    }

}