import React, { Component } from 'react';
import Card from '../Small_Components/Card';
import firebaseObj from '../../firebase/firebaseObj';
import setFunctions from '../../SetGame/setFunctions.js';
import Variables from '../../SetGame/Variables';

let time0,timeClickOnChooseSet,timeChooseSet,_timeOut;

export default class Board extends Component{
    constructor(props){
        super(props);
        this.state={
            currentCards:[],
            selectedCards:[],
            isSet:undefined,
            usedCards:[],
            gameOver:false,
            shouldUpdate:true,
            stageOfTheGame: 0
            /*
            stageOfTheGame values:
            0 - only "set" button clickable, waiting for button to be clicked
            1 - cards availible to be chosen, stay for 10 seconds after button is clicked
            2 - the button is on "next", displaying 3 chosen cards
            3-Another player is playing. lock state
             */
        }
    }
    
    // componentWillUnmount(){
    //     let userStateInGame= Window.confirm('אתה בטוח שאתה רוצה לצאת?');
    //     if(userStateInGame){
    //         firebaseObj.removeDataFromDB(`Games/${Variables.gameCode}/Game_Participants/${Variables.userId}`)
    //         this.props.moveThroughPages('sel');
    //     }
    //     else
    //         this.setState({shouldUpdate:false});
    // }

    // shouldComponentUpdate(){
    //     return this.state.shouldUpdate;
    // }
    componentWillMount(){
        time0=performance.now();
        Variables.set_date(setFunctions.timeAndDate('date'));
        // firebaseObj.readingDataOnFirebasePromise(`Players/${Variables.userId}/games`).then(snap=>{
        //     let leng=Object.keys(snap.val()).length;
        //     firebaseObj.updatingValueInDataBase(`Players/${Variables.userId}/games/${Variables._date}`,
        //         {[leng+1]:{startGameTime:Variables.startGameTime,gameCode:Variables.gameCode}});
        // })
        firebaseObj.listenerOnFirebase(this.reciveCurrentUserIdFromFirebase,`Games/${Variables.gameCode}/currentPlayerID`);
        firebaseObj.listenerOnFirebase(this.updateCurrentCards,`Games/${Variables.gameCode}/cardsOnBoard`);
        firebaseObj.listenerOnFirebase(this.updateSelectedCards,`Games/${Variables.gameCode}/selectedCards`);
        firebaseObj.listenerOnFirebase(this.handleGameParticipants,`Games/${Variables.gameCode}/Game_Participants`);
        firebaseObj.updatingValueInDataBase(`Games/${Variables.gameCode}/Game_Participants`,{[Variables.userId]:{[Variables.playerName]:true}})

        this.setState({currentCards:Variables.gameObj.cardsOnBoard, usedCards:Variables.gameObj.usedCards})
    }

     //callback functions for listeners on firebase
    /////////////////////////////////////////////////////////////////////////////////////////
    reciveCurrentUserIdFromFirebase=(userIdFromFirebase)=>{
        (userIdFromFirebase && userIdFromFirebase!=Variables.userId)?
            this.setState({stageOfTheGame:3}) : this.setState({stageOfTheGame:0});
    }

    updateCurrentCards=(newCurrentCards)=>{
        (JSON.stringify(this.state.currentCards)!==JSON.stringify(newCurrentCards))&&
            this.setState({currentCards:newCurrentCards})
    }

    updateSelectedCards=(newSelectedCards)=>{
        if(JSON.stringify(this.state.selectedCards)!==JSON.stringify(newSelectedCards))
        {
            if(newSelectedCards===null){
                newSelectedCards=[];
            }
            if(newSelectedCards.length===3){
                this.setState({isSet:setFunctions.isSetBoolFunction(newSelectedCards).bool});
            }
            this.setState({selectedCards:newSelectedCards});
        }
    }

    handleGameParticipants=(gameParticObj)=>{
        if(!gameParticObj)
            firebaseObj.removeDataFromDB(`Games/${Variables.gameCode}`);
    }
    /////////////////////////////////////////////////////////////////////////////////////////

    selectCardFunction=(cardCode)=>{
        let selectedCards=this.state.selectedCards;

        if(selectedCards.length<3)
            (!selectedCards.includes(cardCode))?
                selectedCards.push(cardCode) : selectedCards=selectedCards.filter(value=>value!==cardCode);
        
        if(selectedCards.length===3){
            timeChooseSet=performance.now();
            clearTimeout(_timeOut);
            console.log('cleared timeout')

            let isSet=setFunctions.isSetBoolFunction(this.state.selectedCards);
            this.setState({isSet:isSet.bool,  stageOfTheGame: 2 });

            firebaseObj.pushToFirebase(`Players/${Variables.userId}/${Variables.gameCode}/${isSet.bool?'CorrectSets':'WrongSets'}`,
            {...isSet.information,
            timeTillChoosingSet: ((timeChooseSet-timeClickOnChooseSet)/1000).toFixed(2),
            timeTillClickOnButton: ((timeClickOnChooseSet-time0)/1000).toFixed(2)});
        }

        this.setState({selectedCards:selectedCards});
        firebaseObj.settingValueInDataBase(`Games/${Variables.gameCode}/selectedCards`,selectedCards);
    }

   
    clickButtonEvent=(e)=>{
        //this.setState({stageOfTheGame: (this.state.stageOfTheGame+1)%3});
        if(this.state.stageOfTheGame===0)
        {
            timeClickOnChooseSet=performance.now();

            _timeOut=setTimeout(()=>{
                console.log("inside setTimeOut")
                if(this.state.selectedCards.length<3&&this.state.stageOfTheGame===1)
                    this.setState({stageOfTheGame:0,selectedCards:[]});
            },Variables._timer*1000);

            firebaseObj.settingValueInDataBase(`Games/${Variables.gameCode}/currentPlayerID`,Variables.userId)
            this.setState({stageOfTheGame: 1});
        }

        if(this.state.stageOfTheGame===2){
            if(this.state.isSet){
                let objPullCards=setFunctions.pullXCardsAndEnterNewXCards(3,this.state.currentCards,this.state.selectedCards, this.state.usedCards);
                if(objPullCards.gameOver){
                    this.setState({gameOver:true});
                    firebaseObj.removeDataFromDB(`Games/${Variables.gameCode}/cardsOnBoard`);
                }
                else{
                    this.setState({currentCards:objPullCards.currentCards, 
                        usedCards:[...this.state.usedCards,...this.state.selectedCards],
                        stageOfTheGame:0, selectedCards:[]}); 
                    firebaseObj.settingValueInDataBase(`Games/${Variables.gameCode}`,
                        {cardsOnBoard:objPullCards.currentCards
                        ,usedCards:[...this.state.usedCards,...this.state.selectedCards]});
                }
                time0=performance.now();
            }
            this.setState({isSet:undefined})
            firebaseObj.removeDataFromDB(`Games/${Variables.gameCode}/selectedCards`);
            firebaseObj.removeDataFromDB(`Games/${Variables.gameCode}/currentPlayerID`);
        }
    }
    
    render(){
        return (
            <div id="board" className='page'>
                <label  >{Variables.gameCode} הקוד של המשחק</label>
                <button onClick={()=>setFunctions.exitGame(this.props.moveThroughPages)} >יציאה מהמשחק</button>
                {!this.state.gameOver&&
                <div id='cards'>
                    {this.state.currentCards.map((cardCode, i)=>
                        <Card 
                        className='card'
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
                </div>}

                <div id='lower-bar' >
                        {!this.state.gameOver&&<button onClick={this.clickButtonEvent} id="main_button" 
                        disabled={this.state.stageOfTheGame===1||this.state.stageOfTheGame===3}>
                        {this.state.stageOfTheGame===0?"מצאתי סט!":
                            this.state.stageOfTheGame===1?"סט בבחירה":
                                this.state.stageOfTheGame===2?"הבא":"שחקן אחר משחק"            
                            }
                        </button>}
                </div>
                <label>{this.state.gameOver&&'משחק נגמר'}</label>
            </div>
        );
    }
}