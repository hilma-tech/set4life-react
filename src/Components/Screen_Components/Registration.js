import React, {Component} from "react";
import firebaseObj from "../../firebase/firebaseObj";
import setFunctions from '../../SetGame/setFunctions';
import Variables from '../../SetGame/Variables';
import GameData from "../../data/GameData.json";


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
            errorMess:''
        }
        firebaseObj.createDataBase();
    }

    inputChange=(event)=>{
        let personalInfo=this.state.personalInfo;
        personalInfo[event.target.name]=event.target.value;
        this.setState({personalInfo:personalInfo})
    }

    onClickRegisterButton=async()=>{
        ////////need to write check if the code exist in db
        let flag=true;
        let personalInfo=this.state.personalInfo;

        Object.values(personalInfo).map(val=>{
            flag=flag&&val?true:false;
            if(!flag)return;
        })

        if(flag){

            let newPlayerCode;
            do{
                newPlayerCode=setFunctions.newRandomGameCode(1);
            }while(await firebaseObj.readingDataOnFirebaseAsync(`PlayersPersonalInfo/${newPlayerCode}`)!==null)
    
            Variables.setUserId(newPlayerCode);
    
            firebaseObj.settingValueInDataBase(`PlayersPersonalInfo/${newPlayerCode}`,personalInfo)
            this.props.moveThroughPages("sel")
        }
        else{
            let errorMess='שכחת למלא את השדות';
            Object.values(personalInfo).map((val,i)=>{
                if(!val)errorMess+=(i!==0?' ,':': ')+GameData.registration[i];
            })
            this.setState({errorMess:errorMess})
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
                {this.state.errorMess&&<label>{this.state.errorMess}</label>}
            </div>
        );
    }
}