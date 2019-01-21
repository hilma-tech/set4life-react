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
            //new-new game
            //exist-exist game
        }
        window.history.pushState('sel','','gameType');
        window.onpopstate=(event)=>{
            console.log("in select game type",event.state);
            switch(event.state){
                case "new":
                case "exist":
                    if(this.state.GameTypeOptions!=event.state)
                        this.setState({GameTypeOptions:event.state});
                    break;
                case "sel":
                    this.setState({GameTypeOptions:null});
            }
        }
    }

    onClickGameTypeButton=(event)=>{
        event.target.getAttribute('id')==='existGame'&&this.setState({GameTypeOptions:'exist'});
        event.target.getAttribute('id')==='newGame'&&this.setState({GameTypeOptions:'new'});
    }

    signOut=()=>{
        firebaseObj._auth.signOut();
        this.props.moveThroughPages("ent");
    }

    render(){
        switch(this.state.GameTypeOptions){
            case null:
                return (
                <div >
                    <TopBar id="top-bar" signOut={this.signOut} />
                    <h1>אנא בחר את סוג המשחק הרצוי</h1>
                    <div className='game-type-buttons' >
                        <button onClick={this.onClickGameTypeButton} id='existGame'>משחק קיים</button>
                        <button onClick={this.onClickGameTypeButton} id='newGame'>משחק חדש</button>
                    </div>
                </div>);
            case 'exist':
                    return <ExistGame moveThroughPages={this.props.moveThroughPages}/>;
            case 'new':
                    return <NewGame moveThroughPages={this.props.moveThroughPages}/>; 
        }
        
    }
}


const TopBar=(props)=>(
    <div>
        <label>שלום {Variables.playerName}</label>
        <button id="signout" onClick={props.signOut} >התנתק</button>
    </div>
);
