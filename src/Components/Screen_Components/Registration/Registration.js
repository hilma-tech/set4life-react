import React, { Component } from "react";
import firebaseObj from "../../../firebase/firebaseObj";
import GameData from "../../../data/GameData.json";
import GeneralFunctions from '../../../SetGame/GeneralFunctions';
import './registration.css';
import userIcon from '../../../data/design/userIcon.png';
import PhotoUploader from '../../../data/design/photo-uploader.png';
import Variables from '../../../SetGame/Variables';
import arrow from '../../../data/design/left-arrow.png';
import LoadingImg from '../../../data/design/loading-img.gif';


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
            profilePic: null,
            loadingRegistration: false
        }
        window.history.pushState('reg', '', 'Registration');
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
        if (event.target.name === 'fullName') {
            if (event.target.value.length < 18)
                personalInfo.fullName = event.target.value;
        }
        else if (event.target.name === 'phoneNum') {
            if (event.target.value.match(/^\d+$/)||!event.target.value)
                personalInfo.phoneNum = event.target.value;
        }
        else
            personalInfo[event.target.name] = event.target.value;
        this.setState({ personalInfo: personalInfo, registStateInfo: '' })
    }

    onClickRegisterButton = () => {
        this.setState({ loadingRegistration: true });
        let personalInfo = this.state.personalInfo;
        let emptyFilesArr = [];

        Object.values(personalInfo).map((val, i) =>
            (!val) && emptyFilesArr.push(GameData.registration[i]));

        if (!emptyFilesArr.length) {
            let _valid = this.registrationValidation()

            if (_valid.phoneNum && _valid.passwordAgain) {
                firebaseObj._auth.createUserWithEmailAndPassword(personalInfo.email, personalInfo.password)
                    .then(fbUser => {

                        this.setState({ registStateInfo: 'נרשמת בהצלחה' });

                        let updating_PlayerInfo_fb = (userId, profilePic_downloadUrl = null) => {
                            firebaseObj.settingValueInDataBase(`PlayersInfo/${userId}`,
                                {
                                    Name: this.state.personalInfo.fullName.trim(),
                                    phoneNum: this.state.personalInfo.phoneNum.trim(),
                                    ProfilePic: profilePic_downloadUrl ?
                                        profilePic_downloadUrl : userIcon
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
                        else
                            updating_PlayerInfo_fb(fbUser.user.uid);
                    })
                    .catch(error =>
                        this.setState({
                            registStateInfo: GameData.errorRegistration[error.code],
                            loadingRegistration: false
                        })
                    );
            }
            else {
                let arr = [];
                if (!_valid.phoneNum)
                    arr.push(GameData.errorRegistration.phoneNum);
                if (!_valid.passwordAgain)
                    arr.push(GameData.errorRegistration.passwordAgain);
                this.setState({
                    registStateInfo: GeneralFunctions.string_From_List(arr),
                    loadingRegistration: false
                });
            }
        }
        else
            this.setState({
                registStateInfo: GeneralFunctions.string_From_List(emptyFilesArr, 'שכחת למלא את השדות: '),
                loadingRegistration: false
            });
    }

    keypressed = (e) => {
        if (e.key === "Enter")
            this.onClickRegisterButton();
    }

    uploadProfilePic = (event) => {
        let _img = event.target.files ? event.target.files[0] : null;

        if (_img)
            this.setState({ profilePic: _img });
    }

    render() {
        return (
            <div id='reg' className='page container-fluid d-flex flex-column' onKeyPress={this.keypressed}>
                <nav className='navbar w-100'>
                    <img className="upper-bar-icon mr-auto ml-2" src={arrow} alt="back" onClick={this.props.moveBetweenEntOptions} moveTo='log' />
                </nav>

                <div className='my-auto' >
                    <h1 className="display-2 my-0 py-lg-0">הרשמה</h1>
                    <div className="container w-75" style={{maxWidth:'80vw'}}>
                        <div id='upload_profilePic_container' className='d-flex lg-screen'>
                            <label className="rounded text-right ml-2 my-auto">
                                <input name='uplode_pic' type="file" placeholder='תמונת פרופיל'
                                    onChange={this.uploadProfilePic} />
                                <img id='profile-pic' className='my-auto img-thumbnail' src={this.state.profilePic ? URL.createObjectURL(this.state.profilePic) : PhotoUploader} />
                            </label>
                            <p className='d-inline my-auto'>אנא לחץ על הסמל בשביל להעלות תמונת פרופיל. במידה ולא תעלה תמונה, תופיע תמונת ברירת מחדל.</p>
                        </div>

                        <input className='form-control lg-screen '
                            value={this.state.personalInfo.fullName}
                            name='fullName'
                            type='text'
                            placeholder="שם מלא"
                            onChange={this.inputChange}></input>

                        <input className='form-control lg-screen '
                            value={this.state.personalInfo.phoneNum}
                            name='phoneNum'
                            type="text"
                            pattern="[0-9]"
                            placeholder="מספר טלפון"
                            onChange={this.inputChange} />

                        <input className='form-control d-md-block lg-screen'
                            value={this.state.personalInfo.email}
                            name="email"
                            type='text'
                            placeholder='אימייל'
                            onChange={this.inputChange}></input>

                        <input
                            className='form-control sm-in-lg-screen'
                            value={this.state.personalInfo.password}
                            name='password'
                            type="password"
                            placeholder='סיסמא'
                            onChange={this.inputChange} />

                        <input
                            className='form-control sm-in-lg-screen'
                            value={this.state.personalInfo.passwordAgain}
                            name='passwordAgain'
                            type="password"
                            placeholder='אימות סיסמא'
                            onChange={this.inputChange} />

                    </div>
                    {this.state.loadingRegistration ?
                        <img className='loading-sm' src={LoadingImg} alt='loading' /> :
                        <button className='btn btn-primary btn-lg ' onClick={this.onClickRegisterButton}>הבא</button>
                    }

                    {this.state.registStateInfo !== '' &&
                        <label id='state-info' className='d-block text-danger col-11 mx-auto'>{this.state.registStateInfo}</label>
                    }

                </div>

            </div>
        );
    }
}