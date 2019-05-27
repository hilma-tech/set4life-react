import React, { Component } from 'react';
import Variables from '../../../SetGame/Variables.js';
import firebaseObj from '../../../firebase/firebaseObj';
import GameData from '../../../data/GameData.json';
import LoadingImg from '../../../data/design/loading-img.gif';
import Generalfunctions from '../../../SetGame/GeneralFunctions';
import './login.css'


export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginInfo: {
                loginEmail: '',
                loginPsw: ''
            },
            loginStateInfo: ' ',
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
            <div id='login-page' className='container-fluid d-flex flex-column justify-content-center' onKeyPress={this.keypressed} style={{ height: '100vh' }}>
                <div className='d-flex flex-column align-items-center'>

                    <h1>
                        <span className='display-4 font-weight-bold' >Set</span>
                        <span className='display-4 font-weight-bold' style={{ color: 'var(--_1)' }}>4</span>
                        <span className='display-4 font-weight-bold'>Life</span>
                    </h1>

                    <div>
                        <input
                            className='d-block'
                            name='loginEmail'
                            type='text'
                            placeholder="הכנס אימייל"
                            value={this.state.loginEmail}
                            onChange={this.inputChange} />

                        <input
                            className='d-block'
                            name='loginPsw'
                            type='password'
                            placeholder="הכנס סיסמא"
                            value={this.state.loginPsw}
                            onChange={this.inputChange} />
                    </div>

                    {this.state._loadingImg ?
                        <img className='loading-sm' src={LoadingImg} alt='loading' /> :
                        <button className='btn btn-primary btn-lg' onClick={this.clickLoginButtonEvent} >היכנס</button>
                    }
                    <a className='' href='#' onClick={this.props.moveToRegistration}>עוד לא נרשמת?</a>
                    <label className='mt-2 text-danger'>{this.state.loginStateInfo}</label>
                </div>
            </div>
        );
    }
}
