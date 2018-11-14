import React, {Component} from 'react';
import './LoginPage.css'

export default class LoginPage extends Component{
    constructor(props){
        super(props);
        this.state={
            userID:''
        };
    }

    inputChange=(e)=>{
        this.setState({userID:e.target.value.toString()});
        console.log(e.target.value);
    }
    clickLoginButtonEvent=()=>{

        if(this.state.userID!==''){
            this.props.gettingUserId(this.state.userID);
        }
    }

    render(){
        return(
            <div>
                <div id='request' >אנא הכנס את קוד השחקן שלך</div>
                <input
                name='userID' 
                type='text'
                placeholder="enter your player ID"
                value={this.state.userID}
                onChange={this.inputChange} >
                </input>

                <button onClick={this.clickLoginButtonEvent} >המשך</button>
            </div>
        );
    }
}