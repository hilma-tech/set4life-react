import React, { Component } from "react";
import firebaseObj from "../../../firebase/firebaseObj";
import GameData from "../../../data/GameData.json";
import GeneralFunctions from '../../../SetGame/GeneralFunctions';
import './registration.css';
import userIcon from '../../../data/design/userIcon.png';
import cardsRight from '../../../data/design/cardsRight.png';
import cardsLeft from '../../../data/design/cardsLeft.png';


export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personalInfo: {
                fullName: '',
                phoneNum: '',
                email: '',
                password: '',
                passwordAgain: ''
            },
            registStateInfo: '',
            profilePic: null
        }
        window.history.pushState('reg', '', 'registration');
    }


    registrationValidation = () => {
        let personalInfo = this.state.personalInfo;
        let phoneNum = personalInfo.phoneNum.match(/^05\d([-]{0,1})\d{7}$/) ? true : false;
        return {
            phoneNum: phoneNum,
            passwordAgain: personalInfo.password === personalInfo.passwordAgain,
        }
    }

    inputChange = (event) => {
        console.log(event.target.name)
        let personalInfo = this.state.personalInfo;
        personalInfo[event.target.name] = event.target.value;
        this.setState({ personalInfo: personalInfo, registStateInfo: '' })
    }

    updating_PlayerInfo_fb = (userId, profilePic = null) => {
        firebaseObj.settingValueInDataBase(`PlayersInfo/${userId}`,
            {
                Name: this.state.personalInfo.fullName,
                phoneNum: this.state.personalInfo.phoneNum,
                ProfilePic: profilePic ? profilePic : userIcon
            });
    }

    onClickRegisterButton = () => {
        let emptyFilesArr = [];
        let personalInfo = this.state.personalInfo;

        Object.values(personalInfo).map((val, i) =>
            (!val) && emptyFilesArr.push(GameData.registration[i]));

        if (!emptyFilesArr.length) {
            let _valid = this.registrationValidation()
            if (_valid.phoneNum&& _valid.passwordAgain) {
                firebaseObj._auth.createUserWithEmailAndPassword(personalInfo.email, personalInfo.password)
                    .then(fbUser => {
                        this.setState({ registStateInfo: 'נרשמת בהצלחה' });
                        if (this.state.profilePic) {
                            let task = firebaseObj._storage.ref(`ProfilePics/${fbUser.user.uid}`).put(this.state.profilePic);
                            task.on('state_changed', () => { }, () => { },
                                function finish() {
                                    firebaseObj._storage.ref(`ProfilePics/${fbUser.user.uid}`).getDownloadURL().then(url => {
                                        this.updating_PlayerInfo_fb(fbUser.user.uid, url);
                                    });
                                });
                        }
                        else this.updating_PlayerInfo_fb(fbUser.user.uid);

                    },
                        error => {
                            this.setState({ registStateInfo: GameData.errorRegistration[error.code] })
                            console.log("error code", error.code)
                        });
            }
            else {
                let arr=[];
                if(!_valid.phoneNum)
                    arr.push(GameData.errorRegistration.phoneNum);
                if(!_valid.passwordAgain)
                    arr.push(GameData.errorRegistration.passwordAgain);
                this.setState({ registStateInfo: GeneralFunctions.string_From_List(arr) });
            }
        }
        else
            this.setState({ registStateInfo: GeneralFunctions.string_From_List(emptyFilesArr, 'שכחת למלא את השדות:') });
    }

    keypressed = (e) => {
        if (e.key === "Enter")
            this.onClickRegisterButton();
    }

    uploadProfilePic = (event) => {
        if (event.target.files[0]) {
            this.setState({ profilePic: event.target.files[0] })
        }
    }

    render() {
        return (
            <div id="reg" onKeyPress={this.keypressed}>
                <div className="top">
                    <img src={cardsRight} alt="cards" id="cardsRight" />
                    <h1 className="header">Set<span>4</span>Life</h1>
                    <img src={cardsLeft} alt="cards" id="cardsLeft" />
                </div>
                <h1 className="regHeader">הרשמה</h1>
                <div className="bottomReg">

                    <label>שם מלא</label>
                    <input name='fullName' type='text' placeholder="הכנס שם מלא"
                        onChange={this.inputChange}></input>

                    <label>מספר טלפון</label>
                    <input name='phoneNum' type="text" placeholder="הכנס מספר טלפון"
                    onChange={this.inputChange} />

                    <label>אימייל</label>
                    <input name="email" type='text'
                        onChange={this.inputChange}></input>

                    <label>סיסמא</label>
                    <input name='password' type="password"
                        onChange={this.inputChange}></input>

                    <label>אימות סיסמא</label>
                    <input name='passwordAgain' type="password"
                        onChange={this.inputChange}></input>
                        
                    <label>תמונת פרופיל</label>
                    <input name='uplode_pic' type="file"
                        onChange={this.uploadProfilePic}></input>
                </div>
                <button className='btn' onClick={this.onClickRegisterButton}>הבא</button>
                {this.state.registStateInfo !== '' && <label>{this.state.registStateInfo}</label>}
            </div>
        );
    }
}