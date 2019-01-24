import React, { Component } from 'react';
import LoginPage from '../Screen_Components/LoginPage.js';
import Registration from '../Screen_Components/Registration.js';
import ErrorMes from '../Small_Components/ErrorMes';

export default class Entrance extends Component{
    constructor(props){
        super(props);
        this.state={
            loading: true,
            EntranceOption:'ent'
            //'log'-login
            //'reg'-Registration
        }
        window.history.replaceState('ent','','./entrance');
        window.onpopstate=(event)=>{
            console.log('event.state ent',event.state)
            switch(event.state){
                case "reg":
                case "log":
                    if(this.state.EntranceOption!=event.state)
                        this.setState({EntranceOption:event.state});
                    break;
                case "ent":
                    this.setState({EntranceOption:'ent'});
            }
        }
    }
  
    onClickEntranceButton=(event)=>{
        this.setState({EntranceOption:event.target.getAttribute('id')});
    }

    render(){
        switch(this.state.EntranceOption){
            case 'ent':
                return (
                    <div className="page" id="entrance-options" >
                        <label>Set4Life</label>
                        <button onClick={this.onClickEntranceButton} id='log'>משתמש קיים </button>
                        <button onClick={this.onClickEntranceButton} id='Reg'>הרשמה</button>
                    </div>);
            case 'log':
                return <LoginPage moveThroughPages={this.props.moveThroughPages}/>;
            case 'reg':
                return <Registration moveThroughPages={this.props.moveThroughPages}/>;
            default:
                return <ErrorMes/>; 
        }
    }
}


