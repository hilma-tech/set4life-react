import React, {Component} from 'react';
import Variables from '../../SetGame/Variables.js';

export default class LoginPage extends Component{
    constructor(props){
        super(props);
        this.state={
            userId:''
        };
    }

    inputChange=(e)=>{
        this.setState({userId:e.target.value.toString()});
    }

    clickLoginButtonEvent=()=>{
        if(this.state.userId!==''){
            Variables.setUserId(this.state.userId);
            this.props.moveThroughPages();
        }
    }

    render(){
        return(
            <div id='login-page' className='page' >
                <h1>Set4Life</h1>
                <div >אנא הכנס את קוד השחקן שלך</div>
                <input
                name='userId' 
                type='text'
                placeholder="enter your player ID"
                value={this.state.userId}
                onChange={this.inputChange} >
                </input>

                <button onClick={this.clickLoginButtonEvent} >המשך</button>
            </div>
        );
    }
}
