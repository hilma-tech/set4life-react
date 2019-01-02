import React, { Component } from 'react';
import './App.css';
import Board from './Components/Sections/Board.js';
import SelectGameType from './Components/Sections/SelectGameType.js';
import Variables from './SetGame/Variables';
import Entrance from './Components/Sections/Entrance.js';
import firebaseObj from './firebase/firebaseObj';
import LoadingImg from './data/design/loading-img.gif';



class App extends Component {
  constructor(props){
    super(props);
    this.state={
      pageSeen:"load"
      //load-load page
      //ent-EntrancePage
      //sel-SelectGameType
      //boa-Board
    }
    firebaseObj.createAuth();
    firebaseObj.createDataBase();
    firebaseObj.authState(this.handlePlayerAuthState);
  }

  handlePlayerAuthState=async(fbUser)=>{
    if(fbUser){
      console.log('fbUser',fbUser);
      Variables.setUserId(fbUser.uid);
      let name=await firebaseObj.readingDataOnFirebaseAsync(`PlayersInfo/${fbUser.uid}/Name`);
      Variables.setPlayerName(name);
      this.setState({pageSeen:"sel"},()=>console.log('move to sel'));
    }
    else{
      console.log("not logged in");
      this.setState({pageSeen:"ent"});
    }
  }

  // componentDidMount(){
  //   let userStateInGame= window.confirm('אתה בטוח שאתה רוצה לצאת?');
  //   this.setState({pageSeen:userStateInGame?'sel':'boa'});
  // }

  moveThroughPages=(pageName)=>{
     this.setState({pageSeen:pageName});
  }

  render() {
    console.log(Variables.playerName,this.state.pageSeen)
    return (
      <div id="App" className='page'>
        {this.state.pageSeen==="load"&&<div className='page'><img src={LoadingImg} alt='loading'/></div>}
        {this.state.pageSeen==="ent"&&<Entrance moveThroughPages={this.moveThroughPages}/>}
        {this.state.pageSeen==="sel"&&<SelectGameType moveThroughPages={this.moveThroughPages}/>}
        {this.state.pageSeen==="boa"&&<Board moveThroughPages={this.moveThroughPages}/>} 
      </div>
    );
  }
}

export default App;
