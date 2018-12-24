import React, {Component} from "react";
import firebaseObj from "../../firebase/firebaseObj";
import GameData from "../../data/GameData.json";
import Variables from "../../SetGame/Variables";


export default class Registration extends Component{
    constructor(props){
        super(props);
        this.state={
            personalInfo:{
                fullName:'',
                phoneNum:'',
                password:'',
                email:''
            },
            registStateInfo:''
        }
    }

    inputChange=(event)=>{
        let personalInfo=this.state.personalInfo;
        personalInfo[event.target.name]=event.target.value;
        this.setState({personalInfo:personalInfo,registStateInfo:''})
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
                firebaseObj.settingValueInDataBase(`PlayersInfo/${fbUser.user.uid}`,
                    {Name:personalInfo.fullName,phoneNum:personalInfo.phoneNum});            
                },
                error=>this.setState({registStateInfo:error.message}));
        }
        else{
            let registStateInfo='שכחת למלא את השדות';
            emptyFilesArr.map((val,i)=>{
                registStateInfo+=(!i?': ':
                    (i===emptyFilesArr.length-1?' ו':" ,"))+val;
            });
            this.setState({registStateInfo:registStateInfo});
        }
           
    }

    render(){
        return(
            <div id="reg">
                <h2>הרשמה</h2>
                <label>שם מלא</label>
                <input name='fullName' type='text' placeholder="אנא הכנס את שמך המלא"
                onChange={this.inputChange}></input>
                
                <label>מספר טלפון</label>
                <input name='phoneNum' type="text" placeholder="אנא הכנס את מספר הטלפון שלך"
                onChange={this.inputChange}></input>
                
                <label>סיסמא</label>
                <input name='password' type="password"
                onChange={this.inputChange}></input>
                
                <label>אימות סיסמא</label>
                <input name='passwordValidation' type="password"
                onChange={this.inputChange}></input>

                <label>קוד</label>
                <input name='code' type='text' 
                onChange={this.inputChange}></input>

                <label>אימייל</label>
                <input name="email" type='text' 
                onChange={this.inputChange}></input>

                <button onClick={this.onClickRegisterButton} >הבא</button>
                {this.state.registStateInfo!==''&&<label>{this.state.registStateInfo}</label>}
            </div>
        );
    }
}