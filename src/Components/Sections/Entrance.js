import React, { Component } from 'react';
import LoginPage from '../Screen_Components/LoginPage.js';
import Registration from '../Screen_Components/Registration.js';
import firebaseObj from "../../firebase/firebaseObj";
import Variables from "../../SetGame/Variables";

export default class Entrance extends Component{
    constructor(props){
        super(props);
        this.state={
            loading: true,
            EntranceOption:null
            //'log'-login
            //'reg'-Registration
        }
    }
  
    onClickEntranceButton=(event)=>{
        event.target.getAttribute('id')==='login'&&this.setState({EntranceOption:'log'});
        event.target.getAttribute('id')==='Registration'&&this.setState({EntranceOption:'reg'});
    }

    render(){
        return(
            <div id="entrance" className="page" >
                {!this.state.EntranceOption&&
                <div id="entrance-options" >
                <div>
                    <label>Set4Life</label>
                   </div>
                   <div id="entrance-buttons">
                    <button onClick={this.onClickEntranceButton} id='login'>משתמש קיים </button>
                    <button onClick={this.onClickEntranceButton} id='Registration'>הרשמה</button>
                    </div>
                </div>
                }

                {this.state.EntranceOption==='log'&&<LoginPage moveThroughPages={this.props.moveThroughPages} />}
                
                {this.state.EntranceOption==='reg'&&<Registration moveThroughPages={this.props.moveThroughPages}/>}

            </div>
            
        );
    }
}


