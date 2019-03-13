import React, { Component } from 'react';
import setFunctions from '../../../SetGame/setFunctions';
import GameData from '../../../data/GameData.json';
import firebaseObj from '../../../firebase/firebaseObj';
import Variables from '../../../SetGame/Variables.js';
import GeneralFunctions from '../../../SetGame/GeneralFunctions';
import './new-game.css';

export default class NewGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkboxsInfo: { colorBool: true, shapeBool: true, shadeBool: true, numberBool: true },
            dropDownInfo: {},
            messageErr: false,
            _timer: 15
        }
        window.history.pushState('newGame', '', 'newGame');
    }

    settingNewGame = async () => {
        let newGameCode;
        do {
            newGameCode = setFunctions.newRandomGameCode(3);
        } while (await firebaseObj.readingDataOnFirebaseAsync(`Games/${newGameCode}`) !== null)

        let startGameTime = GeneralFunctions.timeAndDate('time');

        Object.assign(Variables,{gameCode:newGameCode,
            _timer:this.state._timer,
            objConstParameters:this.state.dropDownInfo,
            creationGameTime:startGameTime});
            
        let constParamLength = Object.keys(this.state.dropDownInfo).length;
        let newCurrentCards = setFunctions.newCurrentCards(constParamLength <= 2 && (constParamLength === 2 ? 9 : 12), [], []);
        
        let gameObj = {
            timeOut_choosingCards:this.state._timer,
            creationTime: startGameTime,
            currentCards: newCurrentCards,
            usedCards: newCurrentCards,
            constParameters: Variables.objConstParameters,
            Game_Participants: { [Variables.userId]: { Name: Variables.playerName, isConnected: true } }
        };

        firebaseObj.settingValueInDataBase(`Games/${Variables.gameCode}`, gameObj);
        this.props.moveThroughPages("boa", gameObj);
    }

    checkboxsChange = (event) => {
        let checkboxsInfo = this.state.checkboxsInfo;

        if (!checkboxsInfo[`${event.target.name}Bool`]) {
            let dropDownInfo = this.state.dropDownInfo;
            delete dropDownInfo[event.target.name];
            this.setState({ dropDownInfo: dropDownInfo });

            checkboxsInfo[`${event.target.name}Bool`] = true;
        }
        else {
            if (setFunctions.checkOfValidChecks(checkboxsInfo) >= 3)
                checkboxsInfo[`${event.target.name}Bool`] = false;
        }
        this.setState({ checkboxsInfo: checkboxsInfo });
    }

    settingConstParametersObj = (event) => {
        let dropDownInfo = this.state.dropDownInfo;
        dropDownInfo[event.target.name] = event.target.options[event.target.selectedIndex].getAttribute('code');
        this.setState({ dropDownInfo: dropDownInfo });
    }

    setDisableNewGameButton = () => {
        return !(Object.keys(this.state.dropDownInfo).length +
            setFunctions.checkOfValidChecks(this.state.checkboxsInfo) === 4) || parseInt(this.state._timer, 10) < 2 || this.state._timer === '';
    }

    settingTimeOut = (event) => {
        if (event.target.value <= 1999)
            this.setState({ _timer: event.target.value })
    }

    render() {
        return (
            <div id='new-game' className='page'>
                <div id='checkbox-param' >
                    {Object.keys(GameData.cardsParameters).map((par, i) => (
                        <div key={i} >
                            <input
                                type="checkbox"
                                name={par}
                                checked={this.state.checkboxsInfo[par + 'Bool']}
                                onChange={this.checkboxsChange} key={par} />
                            <label> {GameData.cardsParameters[par].nameHe}</label>
                            <SelectConstParameter
                                checkboxsInfo={this.state.checkboxsInfo}
                                arrOptionsHe={GameData.cardsParameters[par][par + 'He']}
                                categoryStr={par}
                                settingConstParametersObj={this.settingConstParametersObj} />
                        </div>)
                    )}
                </div>
                <label>טיימר של הכפתור:</label>
                <input
                    type="number"
                    id="timer"
                    min="2"
                    value={this.state._timer}
                    onChange={this.settingTimeOut} />

                <button
                    className='btn'
                    disabled={this.setDisableNewGameButton()}
                    onClick={this.settingNewGame}>התחל משחק חדש
                </button>
            </div>
        );
    }
}





const SelectConstParameter = (props) => (
    <select
        style={{ visibility: (!props.checkboxsInfo[props.categoryStr + 'Bool']) ? 'visible' : 'hidden' }}
        name={props.categoryStr}
        onChange={props.settingConstParametersObj}>
        <option key="-1" disabled="disabled" selected="selected">בחר</option>
        {
            props.arrOptionsHe.map((option, i) =>
                <option code={i} key={i} >{option}</option>)
        }
    </select>);




