import React, { Component } from 'react';
import './App.css';
import Board from './Components/Sections/Board.js';
import SelectGameType from './Components/Sections/SelectGameType.js';
import Variables from './SetGame/Variables';
import Entrance from './Components/Sections/Entrance.js';
import firebaseObj from './firebase/firebaseObj';
import LoadingImg from './data/design/loading-img.gif';
import ErrorBoundary from './Components/Small_Components/ErrorBoundary';
import GeneralFunctions from './SetGame/GeneralFunctions';
import ChartPage from './Components/Screen_Components/ChartsPage';


class App extends Component {
  constructor(props){
    super(props);
    this.state={
      info:{},
      pageSeen:"ChartPage"
      //load-load page
      //ent-EntrancePage
      //sel-SelectGameType
      //boa-Board
    }
    firebaseObj.createAuth();
    firebaseObj.createDataBase();
    // firebaseObj.authState(this.handlePlayerAuthState);

    // window.addEventListener('popstate',(event)=>{
    //   console.log('inside popstate app',event.state)
    //   switch(event.state){
    //     case 'reg':
    //     case 'log':
    //     case 'ent':
    //       break;
    //     case 'new':
    //     case 'exist':
    //       //window.history.back();
    //       break;
    //     case 'sel':
    //       if(this.state.pageSeen!='sel')
    //         this.setState({pageSeen:'sel'});
    //       break;
    //   }
    //   });
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
      case 'ChartPage':
        return <ChartPage/>;
      case "load":
        return <div className='page'><img className="LoadingImg" src={LoadingImg} alt='loading'/></div>;
      case 'ent':
        return <Entrance screenSeenInside={this.state.screenSeenInside} moveThroughPages={this.moveThroughPages}/>;
      case "sel":
        return <SelectGameType screenSeenInside={this.state.screenSeenInside} moveThroughPages={this.moveThroughPages}/>;
      case "boa":
        return <Board info={this.state.info}  moveThroughPages={this.moveThroughPages}/>;
    }
  }
}

export default App;
