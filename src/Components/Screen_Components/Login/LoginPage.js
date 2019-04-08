import React, { Component } from 'react';
import Variables from '../../../SetGame/Variables.js';
import firebaseObj from '../../../firebase/firebaseObj';
import GameData from '../../../data/GameData.json';
import LoadingImg from '../../../data/design/loading-img.gif';
import Generalfunctions from '../../../SetGame/GeneralFunctions';
import cardsRight from '../../../data/design/cardsRight.png';
import cardsLeft from '../../../data/design/cardsLeft.png';
import './login.css'


export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginInfo: {
                loginEmail: '',
                loginPsw: ''
            },
            loginStateInfo: '',
            _loadingImg: false
        };
        window.history.pushState('log', '', 'login');
    }

    inputChange = (event) => {
        let loginInfo = this.state.loginInfo;
        loginInfo[event.target.name] = event.target.value;
        this.setState({ loginInfo: loginInfo });
    }

    clickLoginButtonEvent = () => {
        this.setState({ _loadingImg: true });
        let loginInfo = this.state.loginInfo;
        let emptyFilesArr = [];

        Object.values(loginInfo).map((val, i) =>
            (!val) && emptyFilesArr.push(GameData.registration[2 + i]));

        if (!emptyFilesArr.length)
            firebaseObj._auth.signInWithEmailAndPassword(loginInfo.loginEmail, loginInfo.loginPsw)
                .then(fbUser => {
                    firebaseObj._db.ref(`PlayersInfo/${fbUser.user.uid}/Name`).once('value', snap => {
                        Object.assign(Variables,
                            { playerName: snap.val(), userId: fbUser.user.uid })
                        this.props.moveThroughPages("sel")
                    });
                }, error => {
                    this.setState({ loginStateInfo: GameData.errorLogin[error.code], _loadingImg: false })
                    console.log("error login", error.code)
                });
        else
            this.setState({
                loginStateInfo: Generalfunctions.string_From_List(emptyFilesArr, 'שכחת למלא את השדות: '),
                _loadingImg: false
            });
    }

    keypressed = (e) => {
        if (e.key === "Enter")
            this.clickLoginButtonEvent();
    }

    render() {
        return (
            <div id='login-page' onKeyPress={this.keypressed}>
                <div className="top">
                    <img src={cardsRight} alt="cards" id="cardsRight"/>
                    <h1 className="header">Set<span>4</span>Life</h1>
                    <img src={cardsLeft} alt="cards" id="cardsLeft"/>
                </div>
                <div className="bottom">
                    <div>
                        <label>אימייל</label>
                        <input
                            name='loginEmail'
                            type='text'
                            placeholder="הכנס אימייל"
                            value={this.state.loginEmail}
                            onChange={this.inputChange}>
                        </input>
                    </div>
                    <div>
                        <label>סיסמה</label>
                        <input
                            name='loginPsw'
                            type='password'
                            placeholder="הכנס סיסמא"
                            value={this.state.loginPsw}
                            onChange={this.inputChange}>
                        </input>
                    </div>
                    {this.state._loadingImg ?
                        <img src={LoadingImg} alt='loading' className="loading"/> :
                        <button onClick={this.clickLoginButtonEvent} >היכנס</button>
                    }
                    <div className="fildes">
                        <label>{this.state.loginStateInfo}</label>
                    </div>
                    <a onClick={this.props.moveToRegistration}>עוד לא נרשמת?</a>
                </div>
            </div>
        );
    }
}
