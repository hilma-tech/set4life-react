import React, { Component } from "react";
import firebaseObj from "../../../firebase/firebaseObj";
import GameData from "../../../data/GameData.json";
import GeneralFunctions from '../../../SetGame/GeneralFunctions';
import './registration.css';


export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personalInfo: {
                fullName: '',
                phoneNum: '',
                email: '',
                password: ''

            },
            registStateInfo: '',
            pic_percentage: 0,
            pic: null
        }
        window.history.pushState('reg', '', 'registration');
        firebaseObj.createStorage();
    }

    inputChange = (event) => {
        let personalInfo = this.state.personalInfo;
        personalInfo[event.target.name] = event.target.value;
        this.setState({ personalInfo: personalInfo, registStateInfo: '' })
    }


    onClickRegisterButton=async()=>{
        let emptyFilesArr=[];
        let personalInfo=this.state.personalInfo;
        
        Object.values(personalInfo).map((val,i)=>
            (!val)&&emptyFilesArr.push(GameData.registration[i]));
        
        if(!emptyFilesArr.length){
            firebaseObj._auth.createUserWithEmailAndPassword(personalInfo.email,personalInfo.password)
            .then(fbUser=>{
                this.setState({registStateInfo:'נרשמת בהצלחה'});
                let task = firebaseObj._storage.ref(`ProfilePics/${fbUser.user.uid}`).put(this.state.pic);
                task.on('state_changed', (snap) => {console.log('task',task.snapshot.downloadURL) },
                    function error(err) {
                        console.log('ERROR', err)
                    },
                    ()=> {
                        console.log('task complete',task.snapshot.downloadURL)
                        firebaseObj._storage.ref(`ProfilePics/${fbUser.user.uid}`).getDownloadURL().then(url => {
                            firebaseObj.settingValueInDataBase(`PlayersInfo/${fbUser.user.uid}`,
                    { Name: personalInfo.fullName, phoneNum: personalInfo.phoneNum,ProfilePic:url });
                            firebaseObj.pushToFirebase(`PlayersInfo/${fbUser.user.uid}`, {ProfilePic:url})
                        });
                    });
                },
                error=>{
                    this.setState({registStateInfo:GameData.errorRegistration[error.code]})
                    console.log("error code", error.code)
                });
        }
        else
            this.setState({registStateInfo:GeneralFunctions.string_From_List(emptyFilesArr,'שכחת למלא את השדות:')});       
    }

    keypressed=(e)=>{
        if(e.key==="Enter")
            this.onClickRegisterButton();
    }

    render(){
        return(
            <div id="reg" className='page' onKeyPress={this.keypressed}>
                <h1 style={{fontWeight:700}} >הרשמה</h1>
                <label>שם מלא</label>
                <input name='fullName' type='text' placeholder="אנא הכנס את שמך המלא"
                    onChange={this.inputChange}></input>

                <label>מספר טלפון</label>
                <input name='phoneNum' type="text" placeholder="אנא הכנס את מספר הטלפון שלך"
                    onChange={this.inputChange}></input>

                <label>אימייל</label>
                <input name="email" type='text'
                    onChange={this.inputChange}></input>

                <label>סיסמא</label>
                <input name='password' type="password"
                    onChange={this.inputChange}></input>

                <label>אימות סיסמא</label>
                <input name='passwordValidation' type="password"
                    onChange={this.inputChange}></input>

                <label>תמונת פרופיל</label>
                <label>{this.state.pic_percentage}</label>
                <input name='uplode_pic' type="file"
                    onChange={this.uploadProfilePic}></input>

                <button className='btn' onClick={this.onClickRegisterButton} >הבא</button>
                {this.state.registStateInfo !== '' && <label>{this.state.registStateInfo}</label>}
            </div>
        );
    }
}