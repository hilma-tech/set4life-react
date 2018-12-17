import React, { Component } from 'react';
import LoginPage from '../Screen_Components/LoginPage.js';
import Registration from '../Screen_Components/Registration.js';

export default class Entrance extends Component{
    constructor(props){
        super(props);
        this.state={
            EntranceOption:null
            //'log'-login
            //'reg'-Registration
        }
    }
    
    onClickEntranceButton=(event)=>{
        event.target.getAttribute('id')==='login'&&this.setState({EntranceOption:'log'});
        event.target.getAttribute('id')==='Registration'&&this.setState({EntranceOption:'reg'});
    }

    moveThroughPages=(pageName)=>{
        if(['log','reg',null].includes(pageName))this.setState({EntranceOption:pageName});
        else this.props.moveThroughPages(pageName);
    }
    
    render(){
        return(
            <div id="entrance" className="page" >
                {!this.state.EntranceOption&&
                <div id="entrance-options" >
                <div>
                    <label>Set4Life</label>
                   </div>
                    <button onClick={this.onClickEntranceButton} id='login'>משתמש קיים </button>
                    <button onClick={this.onClickEntranceButton} id='Registration'>הרשמה</button>
                </div>
                }

                {this.state.EntranceOption==='log'&&<LoginPage moveThroughPages={this.moveThroughPages} />}
                
                {this.state.EntranceOption==='reg'&&<Registration moveThroughPages={this.moveThroughPages}/>}

            </div>
            
        );
    }
}


