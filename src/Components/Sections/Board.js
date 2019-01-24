import React, { Component } from 'react';
import Card from '../Small_Components/Card';
import firebaseObj from '../../firebase/firebaseObj';
import setFunctions from '../../SetGame/setFunctions.js';
import Variables from '../../SetGame/Variables';
import EndGame from '../Screen_Components/EndGame';
import GeneralFunctions from '../../SetGame/GeneralFunctions';


let timeStartGame, timeNewCards, timeClickOnChooseSet, timeChooseSet, _timeOut;

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.moveThroughPages = this.props.moveThroughPages;
        this.gameCode = Variables.gameCode;
        this.state = {
            currentCards: this.props.info.currentCards,
            selectedCards: [],
            isSet: undefined,
            usedCards: this.props.info.usedCards,
            gameOver: false,
            game_Participants: [],
            currentPlayerName: '',
            stageOfTheGame: 0
            /*
            stageOfTheGame values:
            0 - only "set" button clickable, waiting for button to be clicked
            1 - cards availible to be chosen, stay for 10 seconds after button is clicked
            2 - the button is on "next", displaying 3 chosen cards
            3-Another player is playing. lock state
             */
        }
        window.history.pushState('boa','','board');
        window.onpopstate = (event) => {
            switch (event.state) {
                case "newGame":
                case "existGame":
                    window.history.back();
                    break;
            }
        }
    }

    componentWillMount() {
        firebaseObj.updatingGameIdInFB();
        firebaseObj.listenerOnFirebase(this.handleGameObjFromFirebase, `Games/${this.gameCode}`)
        firebaseObj.listenerOnFirebase(this.reciveCurrentUserIdFromFirebase, `Games/${this.gameCode}/currentPlayerID`);

        timeStartGame = timeNewCards = performance.now();
    }
    //callback functions for listeners on firebase
    /////////////////////////////////////////////////////////////////////////////////////////
    handleGameObjFromFirebase = (gameObj) => {
        let { Game_Participants,
            currentCards: newCurrentCards,
            selectedCards: newSelectedCards } = gameObj ? gameObj : {};

        //Game_Participants
        let ArrParticipants = Game_Participants ? Object.entries(Game_Participants).map(val => {
            if (val[1].isConnected)
                return (val[0] === Variables.userId) ? 'את/ה' : val[1].Name;
        }) : [];
        ArrParticipants = ArrParticipants.filter(val => val !== undefined);
        this.setState({ game_Participants: ArrParticipants });
        (!ArrParticipants.length) &&
            firebaseObj.removeDataFromDB(`Games/${this.gameCode}`);

        //selected cards
        if (JSON.stringify(this.state.selectedCards) !== JSON.stringify(newSelectedCards)) {
            if (!newSelectedCards)
                newSelectedCards = [];
            if (newSelectedCards.length === 3)
                this.setState({ isSet: setFunctions.isSetBoolFunction(newSelectedCards).bool });

            this.setState({ selectedCards: newSelectedCards });
        }

        //currentCards
        if (JSON.stringify(this.state.currentCards) !== JSON.stringify(newCurrentCards)) {
            this.setState({ currentCards: newCurrentCards });
        }

    }

    reciveCurrentUserIdFromFirebase = (userIdFromFirebase) => {
        (userIdFromFirebase && userIdFromFirebase != Variables.userId) ?
            this.setState({ stageOfTheGame: 3, isSet: undefined }) : this.setState({ stageOfTheGame: 0, isSet: undefined });
        if (userIdFromFirebase) {
            firebaseObj._db.ref(`PlayersInfo/${userIdFromFirebase}/Name`).once('value')
                .then(snap => this.setState({ currentPlayerName: Variables.userId === userIdFromFirebase ? "את/ה" : snap.val() }))
        }
        else
            this.setState({ currentPlayerName: '' });
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    selectCardFunction = (cardCode) => {
        let selectedCards = this.state.selectedCards;
        console.log('cardCode', cardCode, selectedCards)

        if (selectedCards.length < 3) {
            (!selectedCards.includes(cardCode)) ?
                selectedCards.push(cardCode) : selectedCards = selectedCards.filter(value => value !== cardCode);
        }

        if (selectedCards.length === 3) {
            timeChooseSet = performance.now();
            clearTimeout(_timeOut);
            console.log('cleared timeout');

            let isSet = setFunctions.isSetBoolFunction(this.state.selectedCards);
            firebaseObj.pushCorrectOrWrongSetToDB(isSet);
            this.setState({ isSet: isSet.bool, stageOfTheGame: 2 });
        }
        this.setState({ selectedCards: selectedCards });
        firebaseObj.settingValueInDataBase(`Games/${this.gameCode}/selectedCards`, selectedCards);
    }

    clickButtonEvent = () => {
        //this.setState({stageOfTheGame: (this.state.stageOfTheGame+1)%3});
        if (this.state.stageOfTheGame === 0) {
            timeClickOnChooseSet = performance.now();
            _timeOut = setTimeout(() => {
                console.log("inside setTimeOut")
                if (this.state.selectedCards.length < 3 && this.state.stageOfTheGame === 1) {
                    this.setState({ stageOfTheGame: 0, selectedCards: [] });

                    ['selectedCards', 'currentPlayerID'].map(destination => {
                        firebaseObj.removeDataFromDB(`Games/${this.gameCode}/${destination}`);
                    })
                    firebaseObj.pushToFirebase(`Players/${Variables.userId}/MissedSets/${GeneralFunctions.timeAndDate('date')}:${Variables.day_numberedGame}`,
                        { timeOut: Variables._timer, timeMissedOut: ((performance.now() - timeStartGame) / 1000).toFixed(2) });
                }
            }, Variables._timer * 1000);
            firebaseObj.settingValueInDataBase(`Games/${this.gameCode}/currentPlayerID`, Variables.userId)
            this.setState({ stageOfTheGame: 1 });
        }

        if (this.state.stageOfTheGame === 2) {
            if (this.state.isSet) {
                let objPullCards = setFunctions.pullXCardsAndEnterNewXCards(3, this.state.currentCards, this.state.selectedCards, this.state.usedCards);
                if (objPullCards.gameOver) {
                    this.setState({ gameOver: true });
                    firebaseObj.removeDataFromDB(`Games/${this.gameCode}/currentCards`);
                }
                else {
                    this.setState({currentCards: objPullCards.currentCards,
                        usedCards: [...this.state.usedCards, ...this.state.selectedCards],
                        stageOfTheGame: 0, selectedCards: []});
                    
                    firebaseObj.updatingValueInDataBase(`Games/${this.gameCode}`,
                        {currentCards: objPullCards.currentCards,
                        usedCards: [...this.state.usedCards, ...this.state.selectedCards]});
                }
                timeNewCards = performance.now();
            }
            this.setState({ isSet: undefined })
            firebaseObj.removeDataFromDB(`Games/${this.gameCode}/selectedCards`);
            firebaseObj.removeDataFromDB(`Games/${this.gameCode}/currentPlayerID`);
        }
    }
    exitGame = () => {
        this.moveThroughPages('sel');
        firebaseObj.updatingValueInDataBase(`Games/${Variables.gameCode}/Game_Participants/${Variables.userId}`, { isConnected: false });
    }

    render() {
        if (this.state.currentCards.length) {
            return (
                <div id="board" className='page'>
                    <UpperBar game_Participants={GeneralFunctions.string_From_List(this.state.game_Participants, `המשתתפים במשחק:`)}
                        currentPlayerName={this.state.currentPlayerName}
                        gameCode={this.gameCode}
                        exitGame={this.exitGame} />

                    {!this.state.gameOver &&
                        <div id='cards'>
                            {this.state.currentCards.map((cardCode, i) =>
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
         return <EndGame/>;   
    }
}


const UpperBar = (props) => (
    <div>
        <p>{props.game_Participants}</p>
        {props.currentPlayerName && <label id="play_now">{props.currentPlayerName} משחק עכשיו</label>}
        <label  id="game_code">{props.gameCode} הקוד של המשחק</label>
        <button onClick={props.exitGame} id="exitButton">יציאה מהמשחק</button>
    </div>
);

const LowerBar = (props) => (
    <div id='lower-bar' >
        {!props.gameOver && <button onClick={props.clickButtonEvent} id="main_button"
            disabled={props.stageOfTheGame === 1 || props.stageOfTheGame === 3}>
            {props.stageOfTheGame === 0 ? "מצאתי סט!" :
                props.stageOfTheGame === 1 ? "סט בבחירה" :
                    props.stageOfTheGame === 2 ? "הבא" : "שחקן אחר משחק"
            }
        </button>}
        {props.gameOver&&<EndGame/>}
    </div>
);






export {timeStartGame,timeNewCards,timeClickOnChooseSet,timeChooseSet,_timeOut};
