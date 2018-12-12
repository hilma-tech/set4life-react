import React, {Component} from 'react';
import Variables from '../../SetGame/Variables.js';
import firebaseObj from '../../firebase/firebaseObj';

export default class LoginPage extends Component{
    constructor(props){
        super(props);
        this.state={
            userId:'',
            loginEmail:'',
            loginPsw:''
        };
        firebaseObj.createAuth();
    }

    inputChange=(event)=>{
        this.setState({[event.target.name]:event.target.value});
    }

    clickLoginButtonEvent=()=>{
        // if(!Object.values(this.state).includes('')){
        //     firebaseObj.fb_auth.sign
        // }
        if(this.state.userId!==''){
            Variables.setUserId(this.state.userId);
            this.props.moveThroughPages("sel");
        }
    }

    render(){
        return(
            <div id='login-page' className='page' >
                <div >אנא הכנס את קוד השחקן שלך</div>
                <input
                name='userId' 
                type='text'
                placeholder="enter your player ID"
                value={this.state.userId}
                onChange={this.inputChange} >
                </input>

                <label>אימייל</label>
                <input 
                name='loginEmail'
                type='text'
                placeholder="אנא הכנס את האימייל שלך"
                value={this.state.loginEmail}
                onChange={this.inputChange}>
                </input>

                <label>סיסמא</label>
                <input
                name='loginPsw' 
                type='password'
                placeholder="אנא הכנס את הססמא שלך"
                value={this.state.loginPsw}
                onChange={this.inputChange}>
                </input>

                <button onClick={this.clickLoginButtonEvent} >המשך</button>
            </div>
        );
    }
}
