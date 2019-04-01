import React, { Component } from 'react';
import setFunctions from '../../../SetGame/setFunctions';
import GameData from '../../../data/GameData.json';
import firebaseObj from '../../../firebase/firebaseObj';
import Variables from '../../../SetGame/Variables.js';
import GeneralFunctions from '../../../SetGame/GeneralFunctions';
import './new-game.css';


let dropdown_refs={
    shape:null,
    shade:null,
    color:null,
    number:null
}

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

        Object.assign(Variables, {
            gameCode: newGameCode,
            _timer: this.state._timer,
            objConstParameters: this.state.dropDownInfo,
            creationGameTime: startGameTime
        });

        let constParamLength = Object.keys(this.state.dropDownInfo).length;
        let newCurrentCards = setFunctions.newCurrentCards(constParamLength <= 2 && (constParamLength === 2 ? 9 : 12), [], []);

        let gameObj = {
            timeOut_choosingCards: this.state._timer,
            creationTime: startGameTime,
            currentCards: newCurrentCards,
            usedCards: newCurrentCards,
            constParameters: Variables.objConstParameters,
            Game_Participants: { [Variables.userId]: { Name: Variables.playerName, ProfilePic: Variables.profilePic, isConnected: true } }
        };

        firebaseObj.settingValueInDataBase(`Games/${Variables.gameCode}`, gameObj);
        this.props.moveThroughPages("boa", gameObj);
    }

    checkboxsChange = (event) => {
        let checkboxsInfo = this.state.checkboxsInfo;

        if (!checkboxsInfo[`${event.target.name}Bool`]) {
            let dropDownInfo = this.state.dropDownInfo;
            delete dropDownInfo[event.target.name];
            dropdown_refs[event.target.name].selectedIndex = 0;
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

    keypressed = (e) => {
        if (e.key === "Enter")
            this.settingNewGame();
    }

    render() {
        return (
            <div id='new-game' className='page' onKeyPress={this.keypressed}>
                <div id='checkbox-param' >
                    {Object.keys(GameData.cardsParameters).map((par_name, i) => (
                        <CheckboxConstParameter
                            par_name={par_name}
                            checkboxsInfo={this.state.checkboxsInfo}
                            i={i}
                            key={i}
                            checkboxsChange={this.checkboxsChange}
                            settingConstParametersObj={this.settingConstParametersObj} />)
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

const CheckboxConstParameter = (props) => (
    <div key={props.i} >
        <input
            type="checkbox"
            name={props.par_name}
            checked={props.checkboxsInfo[props.par_name + 'Bool']}
            onChange={props.checkboxsChange} key={props.par_name} />
        <label> {GameData.cardsParameters[props.par_name].nameHe}</label>
        <SelectConstParameter
            checkboxsInfo={props.checkboxsInfo}
            arrOptionsHe={GameData.cardsParameters[props.par_name][props.par_name + 'He']}
            categoryStr={props.par_name}
            settingConstParametersObj={props.settingConstParametersObj} />
    </div>)



const SelectConstParameter = (props) =>(
    <select
        ref={el=>dropdown_refs[props.categoryStr]=el}
        style={{ visibility: (!props.checkboxsInfo[props.categoryStr + 'Bool']) ? 'visible' : 'hidden' }}
        name={props.categoryStr}
        onChange={props.settingConstParametersObj}>
        <option key="-1" disabled="disabled" selected={true}>בחר</option>
        {
            props.arrOptionsHe.map((option, i) =>
                <option code={i} key={i} >{option}</option>)
        }
    </select>);




