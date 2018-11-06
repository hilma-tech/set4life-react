import React, { Component } from 'react';
import Card from './Card';
import './Board.css';
import firebaseObj from './firebase/firebaseObj';
import setFunctions from './SetGame/setFunctions.js';


export default class Board extends Component{
    constructor(props){
        super(props)
        this.state={
            currentCards:[],
            selectedCards:[],
            isSet:undefined,
            usedCards:[],
            userId:1,
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

    

    componentDidMount(){
        firebaseObj.setingValueInDataBase("Games/000000/cardsOnBoard",this.state.currentCards);
        firebaseObj.setingValueInDataBase("Games/000000/usedCards",this.state.usedCards);
    }

    componentWillMount(){
        firebaseObj.listenerOnFirebase(this.reciveCurrentUserIdFromFirebase,"Games/000000/currentPlayerID");
        firebaseObj.listenerOnFirebase(this.updateCurrentCards,'Games/000000/cardsOnBoard');
        firebaseObj.listenerOnFirebase(this.updateSelectedCards,'Games/000000/selectedCards');

        let currCards=setFunctions.newCurrentCards(12);
        this.setState({currentCards:currCards, usedCards:currCards});
    }

    updateCurrentCards=(CurrentCards)=>{
        this.setState({currentCards:CurrentCards})
    }

    updateSelectedCards=(selectedCards)=>{
        if(selectedCards===null){
            selectedCards=[];
        }
        this.setState({selectedCards:selectedCards});
    }

    reciveCurrentUserIdFromFirebase=(userIdFromFirebase)=>{
        if(this.state.userId===userIdFromFirebase){
            this.setState({stageOfTheGame:0});
        }else if(userIdFromFirebase===null){
            this.setState({stageOfTheGame:0})
        }else{
            this.setState({stageOfTheGame:3});

        }
    }

    selectCardFunction=(id)=>{
        let selectedCards=this.state.selectedCards;
        if(selectedCards.length<3 && !selectedCards.includes(id)){
            selectedCards.push(id);
        }else{
            selectedCards=selectedCards.filter(value=>value!==id)
        }

        this.setState({selectedCards:selectedCards});

        firebaseObj.setingValueInDataBase("Games/000000/selectedCards",selectedCards);
        
        if(selectedCards.length===3){
            this.setState({isSet:setFunctions.isSetBoolFunction(this.state.selectedCards),  stageOfTheGame: 2 });
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
            this.setState({stageOfTheGame: 1});
        }

        if(this.state.stageOfTheGame===2){

            if(this.state.isSet){
                this.setState({currentCards:setFunctions.pullXCardsAndEnterNewXCards(3,this.state.currentCards,this.state.selectedCards, this.state.usedCards),
                    usedCards:[...this.state.usedCards,...this.state.selectedCards]}); 

                setFunctions.IsArrayHasSet(this.state.currentCards);//// only for checking. not nessecerry to the code
                
                firebaseObj.setingValueInDataBase("Games/000000/cardsOnBoard",this.state.currentCards);
                firebaseObj.setingValueInDataBase("Games/000000/usedCards",this.state.usedCards);
            }
            //console.log('currentCards after change',this.state.currentCards)
            this.setState({stageOfTheGame:0, selectedCards:[], isSet:undefined});
            firebaseObj.setingValueInDataBase("Games/000000/selectedCards",[]);
        }

    }   

   
    
    render(){
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