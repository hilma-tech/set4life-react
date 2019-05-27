import React, { Component } from 'react';
import LoginPage from '../Screen_Components/Login/LoginPage.js';
import Registration from '../Screen_Components/Registration/Registration.js';
import ErrorMes from '../Small_Components/ErrorMes';


export default class Entrance extends Component{
    constructor(props){
        super(props);
        this.state={
            loading: true,
            EntranceOption:'log'
            //'log'-login
            //'reg'-Registration
        }
        window.onpopstate=(event)=>{
            console.log(`%c pop ent- ${event.state}, `,'color: red;')
            switch(event.state){
                case "reg":
                case "log":
                    if(this.state.EntranceOption!=event.state)
                        this.setState({EntranceOption:event.state});
                    break;
            }
        }
    }

    moveToRegistration=()=>{
        this.setState({EntranceOption:'reg'})
    }

    render(){
        switch(this.state.EntranceOption){
            case 'log':
                return <LoginPage moveToRegistration={this.moveToRegistration} 
                            moveThroughPages={this.props.moveThroughPages}/>;
            case 'reg':
                return <Registration moveThroughPages={this.props.moveThroughPages}/>;
            default:
                return <ErrorMes/>; 
        }
    }
}


