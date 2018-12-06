import React, {Component} from "react";
import firebaseObj from "../../firebase/firebaseObj";
import setFunctions from '../../SetGame/setFunctions';
import Variables from '../../SetGame/Variables';

export default class Registration extends Component{
    constructor(props){
        super(props);
        this.state={
            fullName:'',
            phoneNum:'',
            password:null,
            email:''
        }
        firebaseObj.createDataBase();
    }

    inputChange=(event)=>{
        this.setState({[event.target.name]:event.target.value})
    }

    onClickRegisterButton=()=>{
        ////////need to write check if the code exist in db
        let playerCode=setFunctions.newRandomGameCode(6);
        Variables.setUserId(playerCode);

        firebaseObj.setingValueInDataBase(`players/${playerCode}`,this.state)
        this.props.moveThroughPages("sel")
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
            </div>
        );
    }
}