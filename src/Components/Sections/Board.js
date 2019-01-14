import React, { Component } from 'react';
import Card from '../Small_Components/Card';
import firebaseObj from '../../firebase/firebaseObj';
import setFunctions from '../../SetGame/setFunctions.js';
import Variables from '../../SetGame/Variables';
import EndGame from '../Screen_Components/EndGame';
import GeneralFunctions from '../../SetGame/GeneralFunctions';
import ErrorMes from '../Small_Components/ErrorMes';

let timeStartGame,timeNewCards,timeClickOnChooseSet,timeChooseSet,_timeOut;

export default class Board extends Component{
    constructor(props){
        super(props);
        this.moveThroughPages=this.props.moveThroughPages;
        this.gameCode=Variables.gameCode;

        this.state={
            currentCards:Variables.gameObj.currentCards,
            selectedCards:[],
            isSet:undefined,
            usedCards:Variables.gameObj.usedCards,
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
        firebaseObj.updatingGameIdInFB();
        firebaseObj.listenerOnFirebase(this.handleGameObjFromFirebase,`Games/${this.gameCode}`)
        firebaseObj.listenerOnFirebase(this.reciveCurrentUserIdFromFirebase,`Games/${this.gameCode}/currentPlayerID`);

        timeStartGame=timeNewCards=performance.now();
    }

    /////////////////////////
    componentWillUnmount(){
        firebaseObj.removeDataFromDB(`Games/${this.gameCode}/Game_Participants/${Variables.userId}`);
    }
    
    componentWillUpdate(){
        window.onbeforeunload = (event) =>{
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
    handleGameObjFromFirebase=(gameObj)=>{

        let {Game_Participants,
            currentCards:newCurrentCards,
            selectedCards:newSelectedCards}=gameObj?gameObj:{};

        //Game_Participants
        if(!Game_Participants)
            firebaseObj.removeDataFromDB(`Games/${this.gameCode}`);
        else{
            let particList=[];
            Object.entries(Game_Participants).map(val=>{
                console.log('val game partic',val)
                particList.push((val[0]===Variables.userId)?'אתה':val[1].Name);   
            })
            this.setState({game_Participants:particList})
        }

        //selected cards
        if(JSON.stringify(this.state.selectedCards)!==JSON.stringify(newSelectedCards))
        {
            if(!newSelectedCards)
                newSelectedCards=[];
            if(newSelectedCards.length===3)
                this.setState({isSet:setFunctions.isSetBoolFunction(newSelectedCards).bool});

            this.setState({selectedCards:newSelectedCards});
        }

        //currentCards
        (JSON.stringify(this.state.currentCards)!==JSON.stringify(newCurrentCards))&&
            this.setState({currentCards:newCurrentCards});
    }

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
            console.log('cleared timeout');

            let isSet=setFunctions.isSetBoolFunction(this.state.selectedCards);
            firebaseObj.pushCorrectOrWrongSetToDB(isSet);
            this.setState({isSet:isSet.bool,  stageOfTheGame: 2 });
        }
        this.setState({selectedCards:selectedCards});
        firebaseObj.settingValueInDataBase(`Games/${this.gameCode}/selectedCards`,selectedCards);
    }

    clickButtonEvent=()=>{
        //this.setState({stageOfTheGame: (this.state.stageOfTheGame+1)%3});
        if(this.state.stageOfTheGame===0)
        {
            timeClickOnChooseSet=performance.now();
            _timeOut=setTimeout(()=>{
                console.log("inside setTimeOut")
                if(this.state.selectedCards.length<3&&this.state.stageOfTheGame===1){
                    this.setState({stageOfTheGame:0,selectedCards:[]});

                    ['selectedCards','currentPlayerID'].map(destination=>{
                        firebaseObj.removeDataFromDB(`Games/${this.gameCode}/${destination}`);
                    })
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
                    firebaseObj.removeDataFromDB(`Games/${this.gameCode}/currentCards`);
                }
                else{
                    this.setState({currentCards:objPullCards.currentCards, 
                        usedCards:[...this.state.usedCards,...this.state.selectedCards],
                        stageOfTheGame:0, selectedCards:[]}); 
                    firebaseObj.updatingValueInDataBase(`Games/${this.gameCode}`,
                        {currentCards:objPullCards.currentCards
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
        if(this.state.currentCards){
            return (
                <div id="board" className='page'>
                    <UpperBar game_Participants={this.state.game_Participants}
                    currentPlayerName={this.state.currentPlayerName}
                    gameCode={this.gameCode}
                    moveThroughPages={this.moveThroughPages}/>
    
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
                            />)
                        }
                    </div>}
                    
                    <LowerBar stageOfTheGame={this.state.stageOfTheGame} 
                    gameOver={this.state.gameOver} 
                    clickButtonEvent={this.clickButtonEvent} />
                </div>
            );
        }
        else
         return <ErrorMes/>;   
    }
}



const LowerBar=(props)=>( 
    <div id='lower-bar' >
        {!props.gameOver&&<button onClick={props.clickButtonEvent} id="main_button" 
        disabled={props.stageOfTheGame===1||props.stageOfTheGame===3}>
        {props.stageOfTheGame===0?"מצאתי סט!":
            props.stageOfTheGame===1?"סט בבחירה":
                props.stageOfTheGame===2?"הבא":"שחקן אחר משחק"            
            }
        </button>}
        <label>{props.gameOver&&'משחק נגמר'}</label>
    </div>
);


const UpperBar=(props)=>(
    <div>
        {console.log('props.game_Participants',props.game_Participants)}
        <p>{GeneralFunctions.string_From_List(props.game_Participants,`המשתתפים במשחק:`,'')}</p>
        
        {props.currentPlayerName&&<label>{props.currentPlayerName} משחק עכשיו</label>}
        <label  >{props.gameCode} הקוד של המשחק</label>
        <button onClick={()=>setFunctions.exitGame(props.moveThroughPages)} >יציאה מהמשחק</button>
    </div>
);



export {timeStartGame,timeNewCards,timeClickOnChooseSet,timeChooseSet,_timeOut};