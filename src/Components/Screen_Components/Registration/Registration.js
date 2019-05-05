import React, { Component } from "react";
import firebaseObj from "../../../firebase/firebaseObj";
import GameData from "../../../data/GameData.json";
import GeneralFunctions from '../../../SetGame/GeneralFunctions';
import './registration.css';
import userIcon from '../../../data/design/userIcon.png';
import cardsRight from '../../../data/design/cardsRight.png';
import cardsLeft from '../../../data/design/cardsLeft.png';
import PhotoUploader from '../../../data/design/photo-uploader.png';
import Variables from '../../../SetGame/Variables';


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
        let personalInfo = this.state.personalInfo;
        personalInfo[event.target.name] = event.target.value;
        this.setState({ personalInfo: personalInfo, registStateInfo: '' })
    }

    onClickRegisterButton = () => {
        let emptyFilesArr = [];
        let personalInfo = this.state.personalInfo;

        Object.values(personalInfo).map((val, i) =>
            (!val) && emptyFilesArr.push(GameData.registration[i]));

        if (!emptyFilesArr.length) {
            let _valid = this.registrationValidation()
            if (_valid.phoneNum && _valid.passwordAgain) {
                Variables.playerName=this.state.fullName;
                Variables.profilePic=this.state.profilePic ? this.state.profilePic : userIcon;
                firebaseObj._auth.createUserWithEmailAndPassword(personalInfo.email, personalInfo.password)
                    .then(fbUser => {
                        this.setState({ registStateInfo: 'נרשמת בהצלחה' });
                        let updating_PlayerInfo_fb = (userId, profilePic = null) => {
                            firebaseObj.settingValueInDataBase(`PlayersInfo/${userId}`,
                                {
                                    Name: this.state.personalInfo.fullName,
                                    phoneNum: this.state.personalInfo.phoneNum,
                                    ProfilePic: profilePic ? profilePic : userIcon
                                });
                        }
                        if (this.state.profilePic) {
                            let task = firebaseObj._storage.ref(`ProfilePics/${fbUser.user.uid}`).put(this.state.profilePic);
                            task.on('state_changed', () => { }, () => { },
                                function finish() {
                                    firebaseObj._storage.ref(`ProfilePics/${fbUser.user.uid}`).getDownloadURL().then(url => {
                                        updating_PlayerInfo_fb(fbUser.user.uid, url)
                                    });
                                });
                        }
                        else updating_PlayerInfo_fb(fbUser.user.uid);

                    },
                        error => {
                            this.setState({ registStateInfo: GameData.errorRegistration[error.code] })
                            console.log("error code", error.code)
                        });
            }
            else {
                let arr = [];
                if (!_valid.phoneNum)
                    arr.push(GameData.errorRegistration.phoneNum);
                if (!_valid.passwordAgain)
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
            <div id='reg' className='page container-fluid d-flex flex-column' onKeyPress={this.keypressed}>
                <nav className='navbar bg-danger w-100 sticky-top'>
                    <label className='mx-auto'>set4life</label>
                </nav>

                <div className='h-100'>
                    <h1 className="display-1">הרשמה</h1>
                    <div className="container mb-3">
                        <div id='upload_profilePic_container' className='d-flex col-md-9 mx-md-auto col-lg-8 p-0 lg-screen'>
                            <label className="rounded text-right ml-2 my-auto">
                                <input name='uplode_pic' type="file" placeholder='תמונת פרופיל'
                                    onChange={this.uploadProfilePic} />
                                <img id='profile-pic' className='my-auto img-thumbnail' src={this.state.profilePic ? URL.createObjectURL(this.state.profilePic) : PhotoUploader} />
                            </label>
                            <p className='d-inline my-auto'>אנא לחץ על הסמל בשביל להעלות תמונת פרופיל. במידה ולא תעלה תמונה, תופיע תמונת ברירת מחדל.</p>
                        </div>
                        <input className='col-md-9 d-md-block col-lg-4 d-lg-inline mx-lg-0' name='fullName' type='text' placeholder="שם מלא"
                            onChange={this.inputChange}></input>

                        <input className='col-md-9 d-md-block col-lg-4 mr-lg-2 d-lg-inline mx-lg-0' name='phoneNum' type="text" placeholder="מספר טלפון"
                            onChange={this.inputChange} />

                        <input className='col-md-9 col-lg-9 d-md-block lg-screen' name="email" type='text' placeholder='אימייל'
                            onChange={this.inputChange}></input>

                        <input className='col-md-9 lg-screen' name='password' type="password" placeholder='סיסמא'
                            onChange={this.inputChange} />

                        <input className='col-md-9 lg-screen' name='passwordAgain' type="password" placeholder='אימות סיסמא'
                            onChange={this.inputChange} />

                    </div>
                    <button className='btn btn-secondary btn-lg' onClick={this.onClickRegisterButton}>הבא</button>
                    {this.state.registStateInfo !== '' && <label>{this.state.registStateInfo}</label>}

                </div>

            </div>
        );
    }
}