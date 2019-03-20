import React, { Component } from 'react';
import './App.css';
import Board from './Components/Sections/Board/Board.js';
import SelectGameType from './Components/Sections/SelectGameType/SelectGameType.js';
import Variables from './SetGame/Variables';
import Entrance from './Components/Sections/Entrance.js';
import firebaseObj from './firebase/firebaseObj';
import LoadingImg from './data/design/loading-img.gif';
import ErrorMes from './Components/Small_Components/ErrorMes';
import NotChrome from './Components/Small_Components/NotChrome/notChrome';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      pageSeen: "load"
      //load-load page
      //ent-EntrancePage
      //sel-SelectGameType
      //boa-Board
    }
    firebaseObj.createAuth();
    firebaseObj.createDataBase();
    firebaseObj.authState(this.handlePlayerAuthState);

    window.onpopstate = (event) => {
      switch (event.state) {
        case 'reg': case 'log': case 'ent':
        case "avgTime": case "numOfSets": case "charts":
        case 'new': case 'exist':
          break;
        case 'sel':
          if (this.state.pageSeen != 'sel')
            this.setState({ pageSeen: 'sel' });
          break;
      }
    }
  }

  handlePlayerAuthState = async (fbUser) => {
    if (fbUser) {
      console.log('fbUser', fbUser);
      Variables.setUserId(fbUser.uid);
      let name = await firebaseObj.readingDataOnFirebaseAsync(`PlayersInfo/${fbUser.uid}/Name`);
      Variables.setPlayerName(name);
      this.moveThroughPages("sel");
    }
    else {
      console.log("not logged in");
      Variables.setUserId(null);
      this.moveThroughPages("ent");
    }
  }

  moveThroughPages = (pageName, info = {}) => {
    this.setState({ pageSeen: pageName, info: info });
  }

  render() {
    // if((!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime))||(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1)){
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
    // }
    // else{
    //   return (

    //     <NotChrome/>
    //     );
    // }
      
    
  }
}

export default App;
