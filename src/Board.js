import React, { Component } from 'react';
import Card from './Card';
import './Board.css';
import firebaseObj from './firebase/firebaseObj';
import setFunctions from './SetGame/setFunctions.js';


let time0,timeClickOnChooseSet,timeChooseSet;

export default class Board extends Component{
    constructor(props){
        super(props);
        this.state={
            currentCards:[],
            selectedCards:[],
            isSet:undefined,
            usedCards:[],
            stageOfTheGame: 0
            /*
            stageOfTheGame values:
            0 - only "set" button clickable, waiting for button to be clicked
            1 - cards availible to be chosen, stage for 10 seconds after button is clicked
            2 - set button is on "next", displaying 3 chosen cards
            3-Another player is playing. lock state
             */
        }
        firebaseObj.createDataBase();
    }
    componentWillMount(){
        time0=performance.now();
        firebaseObj.listenerOnFirebase(this.reciveCurrentUserIdFromFirebase,`Games/${this.props.gameCode}/currentPlayerID`);
        firebaseObj.listenerOnFirebase(this.updateCurrentCards,`Games/${this.props.gameCode}/cardsOnBoard`);
        firebaseObj.listenerOnFirebase(this.updateSelectedCards,`Games/${this.props.gameCode}/selectedCards`);

        this.setState({currentCards:this.props.gameObj.cardsOnBoard, usedCards:this.props.gameObj.usedCards})
    }


    updateCurrentCards=(newCurrentCards)=>{
        if(JSON.stringify(this.state.currentCards)!==JSON.stringify(newCurrentCards))
            this.setState({currentCards:newCurrentCards})
    }

    updateSelectedCards=(newSelectedCards)=>{
        if(JSON.stringify(this.state.selectedCards)!==JSON.stringify(newSelectedCards))
        {
            if(newSelectedCards===null){
                newSelectedCards=[];
            }
            if(newSelectedCards.length===3){
                this.setState({isSet:setFunctions.isSetBoolFunction(newSelectedCards)});
            }
            this.setState({selectedCards:newSelectedCards});
        }
    }

    reciveCurrentUserIdFromFirebase=(userIdFromFirebase)=>{
        if(userIdFromFirebase && userIdFromFirebase!=this.props.userId)
            this.setState({stageOfTheGame:3})
        else 
            this.setState({stageOfTheGame:0});
    }

    selectCardFunction=(cardCode)=>{
        let selectedCards=this.state.selectedCards;
        if(selectedCards.length<3 && !selectedCards.includes(cardCode)){
            selectedCards.push(cardCode);
        }else{
            selectedCards=selectedCards.filter(value=>value!==cardCode)
        }

        this.setState({selectedCards:selectedCards});

        firebaseObj.setingValueInDataBase(`Games/${this.props.gameCode}/selectedCards`,selectedCards);
        
        if(selectedCards.length===3){
            timeChooseSet=performance.now();

            let isSet=setFunctions.isSetBoolFunction(this.state.selectedCards);
            this.setState({isSet:isSet.bool,  stageOfTheGame: 2 });


            firebaseObj.pushToFirebase(`Players/${this.props.userId}/${this.props.gameCode}/${isSet.bool?'CorrectSets':'WrongSets'}`,
            {...isSet.information,
            timeTillChoosingSet: ((timeChooseSet-timeClickOnChooseSet)/1000).toFixed(2),
            timeTillClickOnButton: ((timeClickOnChooseSet-time0)/1000).toFixed(2)});
        }
    }

    ifNoSelect=()=>{
       /*setTimeout(()=>{
             if(this.state.selectedCards.length<3){
                 this.setState({stageOfTheGame:0, playerActive:false, selectedCards:[]});
             }
         }, 5000);*/
    }
    
    clickButtonEvent=(e)=>{
        //this.setState({stageOfTheGame: (this.state.stageOfTheGame+1)%3});
        //this.ifNoSelect();
        if(this.state.stageOfTheGame===0)
        {
            firebaseObj.setingValueInDataBase(`Games/${this.props.gameCode}/currentPlayerID`,this.props.userId)
            this.setState({stageOfTheGame: 1});
            timeClickOnChooseSet=performance.now();
        }
        if(this.state.stageOfTheGame===2){
            if(this.state.isSet){
                let usedCards=[...this.state.usedCards,...this.state.selectedCards];
                let currentCards=setFunctions.pullXCardsAndEnterNewXCards(3,this.state.currentCards,this.state.selectedCards, this.state.usedCards);
                this.setState({currentCards:currentCards, usedCards:usedCards}); 

                setFunctions.IsArrayHasSet(this.state.currentCards);//// only for checking. not nessecerry to the code
                
                firebaseObj.setingValueInDataBase(`Games/${this.props.gameCode}/`,{cardsOnBoard:currentCards,usedCards:usedCards});
            }
            this.setState({stageOfTheGame:0, selectedCards:[], isSet:undefined});
            firebaseObj.setingValueInDataBase(`Games/${this.props.gameCode}/selectedCards`,[]);
            firebaseObj.returnRef(`Games/${this.props.gameCode}/currentPlayerID`).remove();
        }

    }   

   
    render(){
        console.log(this.state.gameCode);
        console.log('currentCards in board',this.state.currentCards)
        return (
            <div className="board" >
                {this.state.currentCards.map((cardCode, i)=>
                    <Card 
                    key={i}
                    onclick={this.selectCardFunction} 
                    cardCode={cardCode}
                    selectedCards={this.state.selectedCards}
                    isSet={this.state.isSet}
                    stageOfTheGame={this.state.stageOfTheGame}
                    isSelected={this.state.selectedCards.includes(cardCode)}
                    />
                    )
                }
                
                <button onClick={this.clickButtonEvent} id="main_button" 
                disabled={this.state.stageOfTheGame===1||this.state.stageOfTheGame===3}>
                {this.state.stageOfTheGame===0?"בחר סט":
                    this.state.stageOfTheGame===1?"סט בבחירה":
                        this.state.stageOfTheGame===2?"הבא":"שחקן אחר משחק"            
                    }
                </button>
            </div>
        );
    }
}