import React, { Component } from 'react';
import Card from '../../Small_Components/Card';
import firebaseObj from '../../../firebase/firebaseObj';
import setFunctions from '../../../SetGame/setFunctions.js';
import Variables from '../../../SetGame/Variables';
import EndGame from '../../Screen_Components/EndGame';
import GeneralFunctions from '../../../SetGame/GeneralFunctions';
import ErrorMes from '../../Small_Components/ErrorMes';
import './board.css';
import Home from '../../../data/design/home.png'

//timeStartGame- the time when the game start
//timeNewCards- the time when new cards are showen in the board (3 new cards after correct set or the new cards in the beginning of the game)
//timeClickOnChooseSet- the time when the player press the btn with "בחר סט" written on it.
//timeChooseSet- the time when we choose set
let timeStartGame, timeNewCards, timeClickOnChooseSet, timeChooseSet,
    _timeOutChoosingSet, _timeOutNextBtn;

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
            disableBeforeNext: false,
            game_Participants: [],
            currentPlayerName: '',
            stageOfTheGame: 0
            /*
            stageOfTheGame values:
            0 - only "set" button clickable, waiting for button to be clicked
            1 - cards availble to be chosen, stay for 10 seconds (default) after button is clicked
            2 - the button is on "next", displaying 3 chosen cards
            3-Another player is playing. lock state.
             */
        }
        window.history.pushState('boa', '', 'board');
        window.onpopstate = (event) => {
            console.log('popstate boa')
            if (event.state !== 'boa') {
                window.history.pushState('boa', '', 'board');
                if (window.confirm("אתה בטוח שאתה רוצה לצאת?")) {
                    switch (event.state) {
                        case "newGame":
                        case "existGame":
                            window.onbeforeunload = () => { };
                            window.onpopstate = () => { };
                            firebaseObj.updatingValueInDataBase(`Games/${Variables.gameCode}/Game_Participants/${Variables.userId}`, { isConnected: false });
                            this.moveThroughPages('sel')
                            break;
                    }
                }
            }
        }
    }

    componentWillMount() {
        firebaseObj.updatingGameIdInFB();
        firebaseObj.listenerOnFirebase(this.handleGameObjFromFirebase, `Games/${this.gameCode}`)
        firebaseObj.listenerOnFirebase(this.reciveCurrentUserIdFromFirebase, `Games/${this.gameCode}/currentPlayerID`);

        timeStartGame = timeNewCards = performance.now();
    }

    componentDidMount() {
        window.onbeforeunload = (event) => {
            event.preventDefault();
            console.log("leave??");
            return "leave??";
        };

        window.onunload = e => {
            firebaseObj.updatingValueInDataBase(
                `Games/${Variables.gameCode}/Game_Participants/${Variables.userId}`,
                { isConnected: false });
        }
    }

    //callback functions for listeners on firebase////////////////////////////////////////////
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
    ////////////////////////////////////////////////////////////////////////////////////////

    selectCardFunction = (cardCode) => {
        let selectedCards = this.state.selectedCards;

        if (selectedCards.length < 3) {
            (!selectedCards.includes(cardCode)) ?
                selectedCards.push(cardCode) : selectedCards = selectedCards.filter(value => value !== cardCode);
        }

        if (selectedCards.length === 3) {
            timeChooseSet = performance.now();
            // this.setState({disableBeforeNext:true})
            clearTimeout(_timeOutChoosingSet);
            console.log('cleared timeout');

            let isSet = setFunctions.isSetBoolFunction(this.state.selectedCards);
            firebaseObj.pushCorrectOrWrongSetToDB(isSet);
            //timeout of the "next" btn
            this.setState({ isSet: isSet.bool, stageOfTheGame: 2 }, () => {
                _timeOutNextBtn = setTimeout(() => {
                    this.setState({ stageOfTheGame: 0, selectedCards: [] })
                }, 60000)
            });
            //timeout of the disable "next" btn
            // setTimeout(()=>this.setState({disableBeforeNext:false}),5000)
        }
        this.setState({ selectedCards: selectedCards });
        firebaseObj.settingValueInDataBase(`Games/${this.gameCode}/selectedCards`, selectedCards);
    }

    clickButtonEvent = () => {
        if (this.state.stageOfTheGame === 0) {
            timeClickOnChooseSet = performance.now();
            _timeOutChoosingSet = setTimeout(() => {
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
            clearTimeout(_timeOutNextBtn);
            if (this.state.isSet) {
                let objPullCards = setFunctions.pullXCardsAndEnterNewXCards(3, this.state.currentCards, this.state.selectedCards, this.state.usedCards);
                if (objPullCards.gameOver) {
                    this.setState({ gameOver: true });
                }
                else {
                    this.setState({
                        currentCards: objPullCards.currentCards,
                        usedCards: [...this.state.usedCards, ...objPullCards.newCards], stageOfTheGame: 0, selectedCards: []
                    });
                    firebaseObj.updatingValueInDataBase(`Games/${this.gameCode}`,
                        {
                            currentCards: objPullCards.currentCards,
                            usedCards: [...this.state.usedCards, ...this.state.selectedCards]
                        });
                }
                timeNewCards = performance.now();
            }
            this.setState({ isSet: undefined })
            firebaseObj.removeDataFromDB(`Games/${this.gameCode}/selectedCards`);
            firebaseObj.removeDataFromDB(`Games/${this.gameCode}/currentPlayerID`);
        }
    }
    exitGame = () => {
        window.onbeforeunload = () => { };
        window.onpopstate = () => { };
        firebaseObj.updatingValueInDataBase(`Games/${Variables.gameCode}/Game_Participants/${Variables.userId}`, { isConnected: false });
        this.setState({ gameOver: true });
    }

    render() {
        console.log('usedCards in boa',this.state.usedCards)
        if (!this.state.gameOver) {
            if (this.state.currentCards) {
                return (
                    <div id="board" className='page'>
                        <UpperBar game_Participants={GeneralFunctions.string_From_List(this.state.game_Participants, `המשתתפים במשחק:`)}
                            currentPlayerName={this.state.currentPlayerName}
                            gameCode={this.gameCode}
                            exitGame={this.exitGame} />

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
                                />)}
                        </div>

                        <LowerBar stageOfTheGame={this.state.stageOfTheGame}
                            gameOver={this.state.gameOver}
                            clickButtonEvent={this.clickButtonEvent}
                            disableBeforeNext={this.state.disableBeforeNext} />
                    </div>);
            }
            else return <ErrorMes />;
        }
        else
            return <EndGame moveThroughPages={this.moveThroughPages} />;
    }
}


const UpperBar = (props) => (
    <div id='upper-bar-boa' >
        <div id='nav-bar-boa' >
            <p>{props.game_Participants}</p>
            <label id="game_code">  הקוד של המשחק{props.gameCode}</label>
            <button onClick={props.exitGame} id="exitButton">צא מהמשחק</button>
        </div>
        <label id='current-player' style={{ visibility: props.currentPlayerName ? 'visible' : 'hidden' }}>
            {props.currentPlayerName} משחק עכשיו</label>
    </div>
);



const LowerBar = (props) => (
    <div id='lower-bar-boa' >
        {!props.gameOver && <button className='btn' onClick={props.clickButtonEvent} id={props.stageOfTheGame === 0 ? "Not_fuond_set" : "main_button"}
            disabled={props.stageOfTheGame === 1 || props.stageOfTheGame === 3 || (props.stageOfTheGame === 2 && props.disableBeforeNext)}>
            {props.stageOfTheGame === 0 ? "מצאתי סט!" :
                props.stageOfTheGame === 1 ? "סט בבחירה" :
                    props.stageOfTheGame === 2 ? "הבא" : "שחקן אחר משחק"
            }
        </button>}
    </div>
);






export { timeStartGame, timeNewCards, timeClickOnChooseSet, timeChooseSet, _timeOutChoosingSet };
