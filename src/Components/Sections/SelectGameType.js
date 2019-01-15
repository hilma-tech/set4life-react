import React,{Component} from 'react';
import NewGame from '../Screen_Components/NewGame';
import ExistGame from '../Screen_Components/ExistGame';
import firebaseObj from '../../firebase/firebaseObj';
import Variables from '../../SetGame/Variables';

export default class GameType extends Component{
    constructor(props){
        super(props);
        this.state={
            GameTypeOptions:null
            //0-new game
            //1-exist game
        }
        window.history.pushState('','','gameType');
    }

    onClickGameTypeButton=(event)=>{
        event.target.getAttribute('id')==='exsitGame'&&this.setState({GameTypeOptions:1});
        event.target.getAttribute('id')==='newGame'&&this.setState({GameTypeOptions:0});
    }

    signOut=()=>{
        firebaseObj._auth.signOut();
        this.props.moveThroughPages("ent");
    }

    render(){
        return(
            <div id='game-type' className='page' >
                {this.state.GameTypeOptions===null&&
                <div>
                    <div id="top-bar">
                        <label>שלום {Variables.playerName}</label>
                        <button id="signout" onClick={this.signOut} >התנתק</button>
                    </div>
                    <h1>אנא בחר את סוג המשחק הרצוי</h1>
                    <div className='game-type-buttons' >
                        <button onClick={this.onClickGameTypeButton} id='exsitGame'>משחק קיים</button>
                        <button onClick={this.onClickGameTypeButton} id='newGame'>משחק חדש</button>
                    </div>
                </div>}

                {this.state.GameTypeOptions===1&&<ExistGame moveThroughPages={this.props.moveThroughPages}/>}
                {this.state.GameTypeOptions===0&&<NewGame moveThroughPages={this.props.moveThroughPages}/>}
            </div>
        );
    }
}
