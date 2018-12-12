import React, { Component } from 'react';
import LoginPage from '../Screen_Components/LoginPage.js';
import Registration from '../Screen_Components/Registration.js';

export default class Entrance extends Component{
    constructor(props){
        super(props);
        this.state={
            EntranceOption:null
            //1-login
            //2-Registration
        }
    }
    
    onClickEntranceButton=(event)=>{
        event.target.getAttribute('id')==='login'&&this.setState({EntranceOption:1});
        event.target.getAttribute('id')==='Registration'&&this.setState({EntranceOption:2});
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

                {this.state.EntranceOption===1&&<LoginPage moveThroughPages={this.props.moveThroughPages} />}
                
                {this.state.EntranceOption===2&&<Registration moveThroughPages={this.props.moveThroughPages}/>}

            </div>
            
        );
    }
}


