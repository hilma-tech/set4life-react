import React, { Component } from 'react';
import Variables from '../../../SetGame/Variables.js';
import firebaseObj from '../../../firebase/firebaseObj';
import GameData from '../../../data/GameData.json';
import LoadingImg from '../../../data/design/loading-img.gif';
import Generalfunctions from '../../../SetGame/GeneralFunctions';
import close from './../../../data/design/close.svg'
import './login.css'

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginInfo: {
                loginEmail: '',
                loginPsw: ''
            },
            resetPWOpen: null,
            resetPWErr: null,
            resetPWEmail: null,
            loginStateInfo: ' ',
            _loadingImg: false
        };
        window.history.pushState('log', '', 'Login');
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
                    });
                }, error =>
                    this.setState({ loginStateInfo: GameData.errorLogin[error.code], _loadingImg: false })
                );
        else
            this.setState({
                loginStateInfo: Generalfunctions.string_From_List(emptyFilesArr, 'שכחת למלא את השדות: '),
                _loadingImg: false
            });
    }
    changePW = () => {
        if (this.state.resetPWErr) return
        firebaseObj._auth.sendPasswordResetEmail(this.state.resetPWEmail).then(function () {
            // Email sent.
            console.log("sent!")
        }).catch(function (error) {
            // An error happened.
        });
        this.setState({ resetPWOpen: false })
    }
    validateEmail = () => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let valid = re.test(String(this.state.resetPWEmail).toLowerCase());
        if (!valid) { this.setState({ resetPWErr: true }) }
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
                            className='d-block form-control'
                            name='loginEmail'
                            type='text'
                            placeholder="הכנס אימייל"
                            value={this.state.loginEmail}
                            onChange={this.inputChange} />

                        <input
                            className='d-block form-control'
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
                    {this.state.resetPWOpen && <div className="grey-bg" onClick={() => this.setState({ resetPWOpen: false })}></div>}
                    {this.state.resetPWOpen && <div className="resetPWPopup">
                        <div onClick={() => this.setState({ resetPWOpen: false })} className="close-popup"><img className="close-popup-img clickable" src={close} /></div>
                        נא להכניס כתובת מייל:
                        <br />
                        <input onFocus={() => this.setState({ resetPWErr: false })} onBlur={this.validateEmail} onChange={(e) => this.setState({ resetPWEmail: e.target.value })} className={this.state.resetPWErr ? "email-for-new-pw-input err-input" : "email-for-new-pw-input"}></input><br />
                        {this.state.resetPWErr && <div className="incorrect-pw">המייל שהזנת שגוי</div>}
                        <div className={this.state.resetPWErr ? "btn btn-primary btn-lg new-pw-go grayscale" : "btn btn-primary btn-lg new-pw-go"} onClick={this.changePW} >סיסמא חדשה</div>
                        <div className="will-be-sent-msg">מייל יישלח לשינוי סיסמא</div>
                    </div>}


                    <a className="clickable" onClick={this.props.moveBetweenEntOptions} moveTo='reg' >עוד לא נרשמת?</a>
                    <a onClick={() => this.setState({ resetPWOpen: true, resetPWErr: false })} className='mt-2 forgot-pw clickable'>שכחתי סיסמא</a>
                    <label className='mt-2 text-danger'>{this.state.loginStateInfo}</label>

                </div>
            </div>
        );
    }
}
