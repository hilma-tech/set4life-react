import React, { Component } from 'react';
import LoginPage from '../Screen_Components/LoginPage.js';
import Registration from '../Screen_Components/Registration.js';

export default class Entrance extends Component{
    constructor(props){
        super(props);
        this.state={
            loading: true,
            EntranceOption:null
            //'log'-login
            //'reg'-Registration
        }
        console.log("entrance");
        window.history.replaceState('ent','','./entrance');
        window.onpopstate=(event)=>{
            console.log("in entrance",event.state);
            switch(event.state){
                case "reg":
                case "log":
                    if(this.state.EntranceOption!=event.state)
                        this.setState({EntranceOption:event.state});
                    break;
                case "ent":
                    this.setState({EntranceOption:null});
            }
        }
    }
  
    onClickEntranceButton=(event)=>{
        event.target.getAttribute('id')==='login'&&this.setState({EntranceOption:'log'});
        event.target.getAttribute('id')==='Registration'&&this.setState({EntranceOption:'reg'});
    }

    render(){
        switch(this.state.EntranceOption){
            case null:
                return (
                    <div className="page" id="entrance-options" >
                        <label>Set4Life</label>
                        <button onClick={this.onClickEntranceButton} id='login'>משתמש קיים </button>
                        <button onClick={this.onClickEntranceButton} id='Registration'>הרשמה</button>
                    </div>);
            case 'log':
                return <LoginPage moveThroughPages={this.props.moveThroughPages}/>;
            case 'reg':
                return <Registration moveThroughPages={this.props.moveThroughPages}/>;
        }
    }
}


