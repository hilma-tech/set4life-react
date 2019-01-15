import React, { Component } from 'react';
import './App.css';
import Board from './Components/Sections/Board.js';
import SelectGameType from './Components/Sections/SelectGameType.js';
import Variables from './SetGame/Variables';
import Entrance from './Components/Sections/Entrance.js';
import firebaseObj from './firebase/firebaseObj';
import LoadingImg from './data/design/loading-img.gif';
import ErrorBoundary from './Components/Small_Components/ErrorBoundary';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      info:{},
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

  moveThroughPages=(pageName,info={})=>{
     this.setState({pageSeen:pageName,info:info});
  }

  render() {
    switch(this.state.pageSeen){
      case "load":
        return <div className='page'><img className="LoadingImg" src={LoadingImg} alt='loading'/></div>;
      case 'ent':
        return <Entrance moveThroughPages={this.moveThroughPages}/>;
      case "sel":
        return <SelectGameType moveThroughPages={this.moveThroughPages}/>;
      case "boa":
        return <Board info={this.state.info}  moveThroughPages={this.moveThroughPages}/>;
    }

    // return (
    //   <ErrorBoundary>
    //     <div id="App" >
    //       {this.state.pageSeen==="load"&&<img className="LoadingImg" src={LoadingImg} alt='loading'/>}
    //       {this.state.pageSeen==="ent"&&<Entrance moveThroughPages={this.moveThroughPages}/>}
    //       {this.state.pageSeen==="sel"&&<SelectGameType moveThroughPages={this.moveThroughPages}/>}
    //       {this.state.pageSeen==="boa"&&<Board info={this.state.info}  moveThroughPages={this.moveThroughPages}/>} 
    //     </div>
    //   </ErrorBoundary>
    // );
  }
}

export default App;
