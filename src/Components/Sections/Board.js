import React, { Component } from 'react';
import Card from '../Small_Components/Card';
import firebaseObj from '../../firebase/firebaseObj';
import setFunctions from '../../SetGame/setFunctions.js';
import Variables from '../../SetGame/Variables';

let timeStartGame,timeNewCards,timeClickOnChooseSet,timeChooseSet,_timeOut;

export default class Board extends Component{
    constructor(props){
        super(props);
        this.moveThroughPages=this.props.moveThroughPages;
        this.gameCode=Variables.gameCode;
        this.state={
            currentCards:[],
            selectedCards:[],
            isSet:undefined,
            usedCards:[],
            gameOver:false,
            game_Participants:[],
            currentPlayerName:'',
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
    
    componentWillMount(){
        window.addEventListener("beforeunload",this.handleBeforeunLoad);
        Variables.set_date(setFunctions.timeAndDate('date'));
        firebaseObj._db.ref(`Players/${Variables.userId}/games/${Variables._date}`).once('value').then(snap=>{
            let leng=snap.val()?Object.keys(snap.val()).length:0;
            Variables.setDay_numberedGame(leng+1);
            firebaseObj.updatingValueInDataBase(`Players/${Variables.userId}/games/${Variables._date}`,
                {[leng+1]:{startGameTime:Variables.startGameTime,gameCode:this.gameCode}});
        })
        firebaseObj.listenerOnFirebase(this.reciveCurrentUserIdFromFirebase,`Games/${this.gameCode}/currentPlayerID`);
        firebaseObj.listenerOnFirebase(this.updateCurrentCards,`Games/${this.gameCode}/cardsOnBoard`);
        firebaseObj.listenerOnFirebase(this.updateSelectedCards,`Games/${this.gameCode}/selectedCards`);
        firebaseObj.listenerOnFirebase(this.handleGameParticipants,`Games/${this.gameCode}/Game_Participants`);
        firebaseObj.updatingValueInDataBase(`Games/${this.gameCode}/Game_Participants`,{[Variables.userId]:{name:Variables.playerName}})

        this.setState({currentCards:Variables.gameObj.cardsOnBoard, usedCards:Variables.gameObj.usedCards});
        timeStartGame=performance.now();
        timeNewCards=timeStartGame;
    }

    componentWillUnmount(){
        firebaseObj.removeDataFromDB(`Games/${this.gameCode}/Game_Participants/${Variables.userId}`);
    }
    
    componentWillUpdate(){
        window.onbeforeunload = (event) =>{
            console.log('im heree',event,event.target)
            if(this.state.gameOver){
                firebaseObj.removeDataFromDB(`Games/${this.gameCode}`);
                Variables.setGameObj('');
                return;
            }
            else
                return true;   
        }
    }

     //callback functions for listeners on firebase
    /////////////////////////////////////////////////////////////////////////////////////////
    reciveCurrentUserIdFromFirebase=(userIdFromFirebase)=>{
        (userIdFromFirebase && userIdFromFirebase!=Variables.userId)?
            this.setState({stageOfTheGame:3,isSet:undefined}) : this.setState({stageOfTheGame:0,isSet:undefined});
        if(userIdFromFirebase){
            firebaseObj._db.ref(`PlayersInfo/${userIdFromFirebase}/Name`).once('value')
                .then(snap=>this.setState({currentPlayerName:snap.val()}))
        }
        else
            this.setState({currentPlayerName:''});
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
        console.log('[gameParticObj',gameParticObj)
        if(!gameParticObj)
            firebaseObj.removeDataFromDB(`Games/${this.gameCode}`);
        else{
            let particList=[];
            Object.values(gameParticObj).map(val=>{
                if(val!==Variables.userId){
                    console.log('val',val,val.name)
                    particList.push(val.name);
                }
            })
            console.log('particList',particList)
            this.setState({game_Participants:particList})
        }
            
    }
    /////////////////////////////////////////////////////////////////////////////////////////

    selectCardFunction=(cardCode)=>{
        let selectedCards=this.state.selectedCards;
        console.log('cardCode',cardCode,selectedCards)

        if(selectedCards.length<3){
            (!selectedCards.includes(cardCode))?
                selectedCards.push(cardCode) : selectedCards=selectedCards.filter(value=>value!==cardCode);
        }

        if(selectedCards.length===3){
            timeChooseSet=performance.now();
            clearTimeout(_timeOut);
            firebaseObj.removeDataFromDB(`Games/${this.gameCode}/selectedCards`);
            console.log('cleared timeout')

            let isSet=setFunctions.isSetBoolFunction(this.state.selectedCards);
            this.setState({isSet:isSet.bool,  stageOfTheGame: 2 });

            Variables.checkDay_numberedGame();
            firebaseObj.pushToFirebase(`Players/${Variables.userId}/${isSet.bool?'CorrectSets':'WrongSets'}/${setFunctions.timeAndDate('date')}:${Variables.day_numberedGame}`,
                {...isSet.information,
                DisplaysNewCards_Till_ClickSet:((timeClickOnChooseSet-timeNewCards)/1000).toFixed(2),
                ClickSet_Till_ChooseSet: ((timeChooseSet-timeClickOnChooseSet)/1000).toFixed(2),
                StartGame_Till_ClickSet: ((timeClickOnChooseSet-timeStartGame)/1000).toFixed(2)});
        }
        this.setState({selectedCards:selectedCards});
        firebaseObj.settingValueInDataBase(`Games/${this.gameCode}/selectedCards`,selectedCards);
    }

    clickButtonEvent=(e)=>{
        //this.setState({stageOfTheGame: (this.state.stageOfTheGame+1)%3});
        if(this.state.stageOfTheGame===0)
        {
            timeClickOnChooseSet=performance.now();
            firebaseObj._db.ref(`Games/${this.gameCode}`).once('value').then(snap=>{

            })
            _timeOut=setTimeout(()=>{
                console.log("inside setTimeOut")
                if(this.state.selectedCards.length<3&&this.state.stageOfTheGame===1){
                    this.setState({stageOfTheGame:0,selectedCards:[]});
                    firebaseObj.removeDataFromDB(`Games/${this.gameCode}/selectedCards`);
                    firebaseObj.removeDataFromDB(`Games/${this.gameCode}/currentPlayerID`);
                    firebaseObj.pushToFirebase(`Players/${Variables.userId}/MissedSets/${setFunctions.timeAndDate('date')}:${Variables.day_numberedGame}`,
                        {timeOut:Variables._timer, timeMissedOut:((performance.now()-timeStartGame)/1000).toFixed(2)});
                }
            },Variables._timer*1000);

            firebaseObj.settingValueInDataBase(`Games/${this.gameCode}/currentPlayerID`,Variables.userId)
            this.setState({stageOfTheGame: 1});
        }

        if(this.state.stageOfTheGame===2){
            if(this.state.isSet){
                let objPullCards=setFunctions.pullXCardsAndEnterNewXCards(3,this.state.currentCards,this.state.selectedCards, this.state.usedCards);
                if(objPullCards.gameOver){
                    this.setState({gameOver:true});
                    firebaseObj.removeDataFromDB(`Games/${this.gameCode}/cardsOnBoard`);
                }
                else{
                    this.setState({currentCards:objPullCards.currentCards, 
                        usedCards:[...this.state.usedCards,...this.state.selectedCards],
                        stageOfTheGame:0, selectedCards:[]}); 
                    firebaseObj.updatingValueInDataBase(`Games/${this.gameCode}`,
                        {cardsOnBoard:objPullCards.currentCards
                        ,usedCards:[...this.state.usedCards,...this.state.selectedCards]});
                }
                timeNewCards=performance.now();
            }
            this.setState({isSet:undefined})
            firebaseObj.removeDataFromDB(`Games/${this.gameCode}/selectedCards`);
            firebaseObj.removeDataFromDB(`Games/${this.gameCode}/currentPlayerID`);
        }
    }
    
    render(){
        console.log("state boa",this.state.currentPlayerName)
        return (
            <div id="board" className='page'>
                <p>המשתתפים במשחק: {this.state.game_Participants}</p>
                {this.state.currentPlayerName&&<label>{this.state.currentPlayerName} משחק עכשיו</label>}
                <label  >{this.gameCode} הקוד של המשחק</label>
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