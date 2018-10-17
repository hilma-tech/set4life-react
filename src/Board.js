import React, { Component } from 'react';
import Card from './Card';
import './Board.css';


export default class Board extends Component{
    constructor(props){
        super(props)
        this.state={
            currentCards:["1101","1020","1010","1000","0011","0001","0000","0010","0101","1001","1201","1022"],
            selectedCards:[],
            isSet:null

        }
        this.selectCardFunction=this.selectCardFunction.bind(this);
        this.isSetBoolFunction=this.isSetBoolFunction.bind(this);

    }
    //do i have to give a key to

    selectCardFunction(id){ //one click
        console.log("e.target.id: ",id) 
        this.state.selectedCards.push(id);
        console.log("selected cards ",this.state.selectedCards);
        console.log(this.state.selectedCards.length);

        if(this.state.selectedCards.length===3){
            console.log(this.state.selectedCards);
            this.isSetBoolFunction();
            this.setState({selectedCards:[]});

        }
    }

    isSetBoolFunction()
    {
        let selectedCards=this.state.selectedCards;

        let colorSim = selectedCards[0].charAt(0)==selectedCards[1].charAt(0) && selectedCards[0].charAt(0)==selectedCards[2].charAt(0);
        let colorDiff = selectedCards[0].charAt(0)!=selectedCards[1].charAt(0) && selectedCards[0].charAt(0)!=selectedCards[2].charAt(0) && selectedCards[1].charAt(0)!=selectedCards[2].charAt(0);

        let shapeSim = selectedCards[0].charAt(1)==selectedCards[1].charAt(1) && selectedCards[0].charAt(1)==selectedCards[2].charAt(1);
        let shapeDiff = selectedCards[0].charAt(1)!=selectedCards[1].charAt(1) && selectedCards[0].charAt(1)!=selectedCards[2].charAt(1) && selectedCards[1].charAt(1)!=selectedCards[2].charAt(1);

        let shadingSim = selectedCards[0].charAt(2)==selectedCards[1].charAt(2) && selectedCards[0].charAt(2)==selectedCards[2].charAt(2);
        let shadingDiff = selectedCards[0].charAt(2)!=selectedCards[1].charAt(2) && selectedCards[0].charAt(2)!=selectedCards[2].charAt(2) && selectedCards[1].charAt(2)!=selectedCards[2].charAt(2);

        let numberSim = selectedCards[0].charAt(3)==selectedCards[1].charAt(3) && selectedCards[0].charAt(3)==selectedCards[2].charAt(3);
        let numberDiff = selectedCards[0].charAt(3)!=selectedCards[1].charAt(3) && selectedCards[0].charAt(3)!=selectedCards[2].charAt(3) && selectedCards[1].charAt(3)!=selectedCards[2].charAt(3);

        return (colorSim||colorDiff) && (shapeSim || shapeDiff) && (shadingSim||shadingDiff) && (numberSim||numberDiff);
    }


    render(){
        return (
            <div className="board" >

                {this.state.currentCards.map((cardCode, i)=>

                <Card 
                key={i} 
                onClick={this.selectCardFunction} 
                id={cardCode}
                selectedCards={this.state.selectedCards}
                isSet={this.state.isSet}
                 />)}

            </div>
        );
    }

}