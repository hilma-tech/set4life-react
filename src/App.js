import React, { Component } from 'react';
import './App.css';
import Board from './Components/Sections/Board/Board.js';
import SelectGameType from './Components/Sections/SelectGameType/SelectGameType.js';
import Variables from './SetGame/Variables';
import Entrance from './Components/Sections/Entrance.js';
import firebaseObj from './firebase/firebaseObj';
import LoadingImg from './data/design/loading-img.gif';
import ErrorMes from './Components/Small_Components/ErrorMes';

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

    window.addEventListener('popstate',(event)=>{
          switch(event.state){
          case 'reg':case 'log':case 'ent':
          case "avgTime":case "numOfSets":case "charts":
          case 'new':case 'exist':
            break;
          case 'sel':case 'boa':
            if(this.state.pageSeen!=event.state)
              this.setState({pageSeen:event.state});
            break;

        }
      });
  }

  handlePlayerAuthState=async(fbUser)=>{
    if(fbUser){
      console.log('fbUser',fbUser);
      Variables.setUserId(fbUser.uid);
      let name=await firebaseObj.readingDataOnFirebaseAsync(`PlayersInfo/${fbUser.uid}/Name`);
      Variables.setPlayerName(name);
      this.moveThroughPages("sel");
    }
    else{
      console.log("not logged in");
      Variables.setUserId(null);
      this.moveThroughPages("ent");
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
        return <Board info={this.state.info} moveThroughPages={this.moveThroughPages}/>;
      default:
        return <ErrorMes/>;
    }
  }
}

export default App;
