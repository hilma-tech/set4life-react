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
import arrow from '../../../data/design/left-arrow.png';



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
        personalInfo[event.target.name] = event.target.value.trim();
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
                firebaseObj._auth.createUserWithEmailAndPassword(personalInfo.email, personalInfo.password)
                    .then(fbUser => {
                        this.setState({ registStateInfo: 'נרשמת בהצלחה' });

                        Object.assign(Variables, {
                            playerName: this.state.personalInfo.fullName,
                            profilePic: URL.createObjectURL(this.state.profilePic) ?
                                URL.createObjectURL(this.state.profilePic) : userIcon
                        })

                        let updating_PlayerInfo_fb = (userId, profilePic = null) => {
                            firebaseObj.settingValueInDataBase(`PlayersInfo/${userId}`,
                                {
                                    Name: this.state.personalInfo.fullName,
                                    phoneNum: this.state.personalInfo.phoneNum,
                                    ProfilePic: this.state.profilePic ?
                                        this.state.profilePic : userIcon
                                });
                        }

                        if (this.state.profilePic) {
                            let task = firebaseObj._storage.ref(`ProfilePics/${fbUser.user.uid}`).put(this.state.profilePic);
                            task.on('state_changed', () => { }, () => { },
                                function finish() {
                                    firebaseObj._storage.ref(`ProfilePics/${fbUser.user.uid}`).getDownloadURL().then(url => {
                                        updating_PlayerInfo_fb(fbUser.user.uid, url);
                                    });
                                });
                        }
                        else updating_PlayerInfo_fb(fbUser.user.uid);

                    },
                        error =>
                            this.setState({ registStateInfo: GameData.errorRegistration[error.code] })
                    );
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
            this.setState({ registStateInfo: GeneralFunctions.string_From_List(emptyFilesArr, 'שכחת למלא את השדות: ') });
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
                <nav className='navbar w-100'>
                    <img className="upper-bar-icon mr-auto ml-2" src={arrow} alt="back" onClick={() => window.history.back()} name='ent' />
                </nav>

                <div >
                    <h1 className="display-2 my-0 py-lg-0">הרשמה</h1>
                    <div className="container mb-md-3 mb-lg-1">
                        <div id='upload_profilePic_container' className='d-flex col-md-9 mx-auto col-lg-8 p-0 lg-screen'>
                            <label className="rounded text-right ml-2 my-auto">
                                <input name='uplode_pic' type="file" placeholder='תמונת פרופיל'
                                    onChange={this.uploadProfilePic} />
                                <img id='profile-pic' className='my-auto img-thumbnail' src={this.state.profilePic ? URL.createObjectURL(this.state.profilePic) : PhotoUploader} />
                            </label>
                            <p className='d-inline my-auto'>אנא לחץ על הסמל בשביל להעלות תמונת פרופיל. במידה ולא תעלה תמונה, תופיע תמונת ברירת מחדל.</p>
                        </div>
                        <input className='col-md-9 d-md-block sm-in-lg-screen d-lg-inline' name='fullName' type='text' placeholder="שם מלא"
                            onChange={this.inputChange}></input>

                        <input className='col-md-9 d-md-block sm-in-lg-screen d-lg-inline' name='phoneNum' type="text" placeholder="מספר טלפון"
                            onChange={this.inputChange} />

                        <input className='col-md-9 d-md-block lg-screen' name="email" type='text' placeholder='אימייל'
                            onChange={this.inputChange}></input>

                        <input className='col-md-9 lg-screen d-block' name='password' type="password" placeholder='סיסמא'
                            onChange={this.inputChange} />

                        <input className='col-md-9 lg-screen d-block mb-lg-0' name='passwordAgain' type="password" placeholder='אימות סיסמא'
                            onChange={this.inputChange} />

                    </div>
                    <button className='btn btn-primary btn-lg ' onClick={this.onClickRegisterButton}>הבא</button>
                    {this.state.registStateInfo !== '' &&
                        <label id='state-info' className='d-block text-danger col-11 mx-auto'>{this.state.registStateInfo}</label>
                    }

                </div>

            </div>
        );
    }
}