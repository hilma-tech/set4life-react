import React, { Component } from 'react';
import Card from '../../Small_Components/Card/Card';
import firebaseObj from '../../../firebase/firebaseObj';
import setFunctions from '../../../SetGame/setFunctions.js';
import Variables from '../../../SetGame/Variables';
import EndGame from '../../Screen_Components/EndGame/EndGame';
import GeneralFunctions from '../../../SetGame/GeneralFunctions';
import ErrorMes from '../../Small_Components/ErrorMes';
import './board.css';
import UserIcon from '../../Small_Components/UserIcon/UserIcon';
import { ToastsContainer, ToastsStore } from 'react-toasts';

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
            exitGame: false,
            endGame: false,
            game_Participants:[],
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
            console.log(`%c pop boa- ${event.state}`,'color: pink;')
            
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
            firebaseObj.removeDataFromDB(`Players/${Variables.userId}/currentGame`);
        }
    }

    //callback functions for listeners on firebase////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    handleGameObjFromFirebase = (gameObj) => {
        let { Game_Participants,
            currentCards: newCurrentCards,
            selectedCards: newSelectedCards,
            usedCards } = gameObj ? gameObj : {};

        //Game_Participants
        let ArrParticipants = Game_Participants ? Object.entries(Game_Participants).filter(val =>
            val[1].isConnected) : [];
        this.setState({ game_Participants: ArrParticipants });
        !ArrParticipants.length &&
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
        if (JSON.stringify(this.state.currentCards) !== JSON.stringify(newCurrentCards))
            this.setState({ currentCards: newCurrentCards ? newCurrentCards : [] });




        //usedCards
        if (JSON.stringify(this.state.usedCards) !== JSON.stringify(usedCards))
            this.setState({ usedCards: usedCards });
    }

    //currentPlayerID
    reciveCurrentUserIdFromFirebase = (userIdFromFirebase) => {
        this.setState({
            stageOfTheGame: (userIdFromFirebase && userIdFromFirebase != Variables.userId) ? 3 : 0,
            isSet: undefined, currentPlayerId: userIdFromFirebase
        });
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////

    outOfNextButton = () => {
        if (this.state.isSet) {
            let objPullCards = setFunctions.pullXCardsAndEnterNewXCards(3, this.state.currentCards, this.state.selectedCards, this.state.usedCards);

            if (objPullCards.endGame)
                firebaseObj.removeDataFromDB(`Games/${this.gameCode}`);

            else {
                this.setState({
                    currentCards: objPullCards.currentCards,
                    usedCards: objPullCards.newUsedCards,
                    stageOfTheGame: 0,
                    selectedCards: []
                });

                firebaseObj.updatingValueInDataBase(`Games/${this.gameCode}`,
                    {
                        currentCards: objPullCards.currentCards,
                        usedCards: objPullCards.newUsedCards
                    });
            }
            timeNewCards = performance.now();
        }
        this.setState({ isSet: undefined })
        firebaseObj.removeDataFromDB(`Games/${this.gameCode}/selectedCards`);
        firebaseObj.removeDataFromDB(`Games/${this.gameCode}/currentPlayerID`);
    }


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
                    this.outOfNextButton();
                }, 10000)
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
                    ToastsStore.success("נגמר הזמן!");
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
            this.outOfNextButton();
        }
    }


    exitGame = () => {
        clearTimeout(_timeOutNextBtn);
        if (this.state.isSet) {
            let objPullCards = setFunctions.pullXCardsAndEnterNewXCards(3, this.state.currentCards, this.state.selectedCards, this.state.usedCards);

            if (objPullCards.endGame)
                firebaseObj.removeDataFromDB(`Games/${this.gameCode}`);

            else {
                firebaseObj.updatingValueInDataBase(`Games/${this.gameCode}`,
                    {
                        currentCards: objPullCards.currentCards,
                        usedCards: objPullCards.newUsedCards,
                        selectedCards: [],
                        currentPlayerID: ''
                    });
            }
        }
        this.setState({ exitGame: true })
    }


    render() {
        if ((!this.state.exitGame) && this.state.currentCards.length) {
            return (
                <div id="board" className='container-fluid d-flex flex-column'>
                    <UpperBar game_Participants={this.state.game_Participants}
                        gameCode={this.gameCode}
                        exitGame={this.exitGame}
                        currentPlayerId={this.state.currentPlayerId} />

                    <div className='container my-auto'>
                        <div id='cards' className='container'>
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

                        {this.state.currentCards &&
                            <button id='the-button' className='btn btn-primary' onClick={this.clickButtonEvent} 
                                disabled={this.state.stageOfTheGame === 1 || this.state.stageOfTheGame === 3 || (this.state.stageOfTheGame === 2 && this.state.disableBeforeNext)}>
                                {this.state.stageOfTheGame === 0 ? "מצאתי סט!" :
                                    this.state.stageOfTheGame === 1 ? "סט בבחירה" :
                                        this.state.stageOfTheGame === 2 ? "הבא" : "שחקן אחר משחק"
                                }
                            </button>}

                        <ToastsContainer store={ToastsStore} closeOnClick rtl="true" />

                    </div>
                </div>);
        }
        else
            return <EndGame moveThroughPages={this.moveThroughPages} />
    }
}

const UpperBar = (props) => (
    <nav id='upper-bar' className='navbar d-flex '>

        <div id='participant-list' className='px-0'>
            {props.game_Participants.map(val =>
                <UserIcon currentPlayer={props.currentPlayerId === val[0]} name={(val[0] === Variables.userId) ? 'את/ה' : val[1].Name}
                    src={val[1].ProfilePic} _direction='bottom' />)}
        </div>

        <label id='game-code' className='h4 col-lg-5 col-md-12'>קוד המשחק {props.gameCode}</label>
        <button className='btn btn-primary' onClick={props.exitGame}>יציאה</button>
    </nav>
);


export { timeStartGame, timeNewCards, timeClickOnChooseSet, timeChooseSet, _timeOutChoosingSet };
