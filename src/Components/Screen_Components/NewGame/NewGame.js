import React, { Component } from 'react';
import setFunctions from '../../../SetGame/setFunctions';
import GameData from '../../../data/GameData.json';
import firebaseObj from '../../../firebase/firebaseObj';
import Variables from '../../../SetGame/Variables.js';
import GeneralFunctions from '../../../SetGame/GeneralFunctions';
import './new-game.css';
import arrow from '../../../data/design/left-arrow.png'
import UserIcon from '../../Small_Components/UserIcon/UserIcon';


let dropdown_refs = {
    shape: null,
    shade: null,
    color: null,
    number: null
}

export default class NewGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkboxsInfo: { colorBool: true, shapeBool: true, shadeBool: true, numberBool: true },
            dropDownInfo: {},
            messageErr: false,
            _timer: 15,
            _scoreBoard: true
        }
        window.history.pushState('newGame', '', 'newGame');
    }

    settingNewGame = async () => {
        let newGameCode;
        do {
            newGameCode = setFunctions.add0beforGameCode(3);
        } while (await firebaseObj.readingDataOnFirebaseAsync(`Games/${newGameCode}`) !== null)

        let startGameTime = GeneralFunctions.timeAndDate('time');

        Object.assign(Variables, {
            gameCode: newGameCode,
            _timer: this.state._timer,
            _scoreBoard: this.state._scoreBoard,
            constParameters: this.state.dropDownInfo,
            creationGameTime: startGameTime
        });

        let constParamLength = Object.keys(this.state.dropDownInfo).length;
        let newCurrentCards = setFunctions.createNewCards(constParamLength <= 2 && (constParamLength === 2 ? 9 : 12), [], []);

        let gameObj = {
            timeOut_choosingCards: this.state._timer,
            creationTime: startGameTime,
            currentCards: newCurrentCards,
            usedCards: newCurrentCards,
            constParameters: Variables.constParameters,
            Game_Participants: {
                [Variables.userId]: {
                    Name: Variables.playerName,
                    ProfilePic: Variables.profilePic,
                    isConnected: true,
                    game_id: {
                        _date: Variables._date,
                        day_numberedGame: Variables.day_numberedGame
                    }
                }
            }
        };

        firebaseObj.updatingGameIdInFB(newGameCode);
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
        else if (setFunctions.checkOfValidChecks(checkboxsInfo) >= 3)
            checkboxsInfo[`${event.target.name}Bool`] = false;

        this.setState({ checkboxsInfo: checkboxsInfo });
    }

    settingConstParametersObj = (event) => {
        let dropDownInfo = this.state.dropDownInfo;
        dropDownInfo[event.target.name] = event.target.options[event.target.selectedIndex].getAttribute('code');
        this.setState({ dropDownInfo: dropDownInfo });
    }

    setDisableNewGameButton = () => {
        return !(Object.keys(this.state.dropDownInfo).length +
            setFunctions.checkOfValidChecks(this.state.checkboxsInfo) === 4) ||
            parseInt(this.state._timer, 10) < 2 || this.state._timer === '';
    }

    settingTimeOut = (event) => {
        if (event.target.value <= 1999)
            this.setState({ _timer: event.target.value })
    }

    settingScoreBoard = (event) => {
        this.setState({ _scoreBoard: !this.state._scoreBoard })
    }

    keypressed = (e) => {
        if (e.key === "Enter")
            this.settingNewGame();
    }

    render() {
        return (
            <div id="new-game" className='container-fluid d-flex flex-column' onKeyPress={this.keypressed} style={{ height: '100vh' }}>
                <nav className="navbar">
                    <UserIcon name={Variables.playerName} src={Variables.profilePic} _direction='left' />
                    <img className="upper-bar-icon" src={arrow} alt="back" onClick={this.props.onClickGameTypeButton} name='sel' />
                </nav>


                <div className='container d-flex flex-column'>
                    <h1 className='text-right mr-2'>משחק חדש </h1>
                    <div className="mr-2">
                        <div className='col-lg-11 col-md-12 p-0'>
                            {Object.keys(GameData.cardsParameters).map((par_name, i) => (
                                <CheckboxConstParameter
                                    par_name={par_name}
                                    checkboxsInfo={this.state.checkboxsInfo}
                                    i={i}
                                    key={i}
                                    checkboxsChange={this.checkboxsChange}
                                    settingConstParametersObj={this.settingConstParametersObj} />)
                            )}
                             <div id='checkbox-constParameters' className="container-fluid d-flex align-items-center">
                            <input
                                type="checkbox"
                                checked={this.state._scoreBoard}
                                onChange={this.settingScoreBoard}  />
                            <label className='h4 mr-2 font-weight-light'>הצגת ניקוד</label>
                            </div>
                        </div>
                        <div className='d-flex justify-content-start align-items-center'>
                            <label id='timer-for-set' className='h4 font-weight-light ml-1 text-right'>זמן לבחירת סט:</label>
                            <input
                                className='col-2 p-0'
                                type="number"
                                min="2"
                                value={this.state._timer}
                                onChange={this.settingTimeOut} />
                          

                        </div>
                    </div>

                    <button
                        className='btn btn-primary rounded text-center'
                        disabled={this.setDisableNewGameButton()}
                        onClick={this.settingNewGame}>התחל</button>
                </div>
            </div>
        );
    }
}

const CheckboxConstParameter = (props) =>{ 
    let cathegoryName_HE=GameData.cardsParameters[props.par_name].nameHe;
    let checkbox_label='';

    if(props.checkboxsInfo[props.par_name + 'Bool'])
        checkbox_label=` כל ${cathegoryName_HE}`
        // ${cathegoryName_HE==='צורה'?"רנדומלית":"רנדומלי"}`;
    else
        checkbox_label=`בחר ${cathegoryName_HE} ${cathegoryName_HE==='צורה'?"קבועה":"קבוע"}`;

    return (
    <div id='checkbox-constParameters' key={props.i} className="container-fluid d-flex align-items-center">
        <input
            type="checkbox"
            name={props.par_name}
            checked={props.checkboxsInfo[props.par_name + 'Bool']}
            onChange={props.checkboxsChange}
            key={props.par_name} />

        <label className='h4 mr-2 font-weight-light'>{checkbox_label}
        </label>

        <SelectConstParameter
            checkboxsInfo={props.checkboxsInfo}
            arrOptionsHe={GameData.cardsParameters[props.par_name][props.par_name + 'He']}
            categoryStr={props.par_name}
            settingConstParametersObj={props.settingConstParametersObj} />
    </div>);}



const SelectConstParameter = (props) => (
    <select
        dir="rtl"
        className='mr-auto form-control'
        ref={el => dropdown_refs[props.categoryStr] = el}
        style={{ visibility: (!props.checkboxsInfo[props.categoryStr + 'Bool']) ? 'visible' : 'hidden' }}
        name={props.categoryStr}
        onChange={props.settingConstParametersObj}>
        <option key="-1" disabled="disabled" selected={true}>בחר</option>
        {
            props.arrOptionsHe.map((option, i) =>
                <option code={i} key={i} >{option}</option>)
        }
    </select>);




