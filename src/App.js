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
import SaveGame from './Components/Small_Components/SaveGame/SaveGame' 

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
    firebaseObj.createStorage();
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
      firebaseObj.readingDataOnFirebaseCB(info_obj => {
        Object.assign(Variables,
          { userId: fbUser.uid, playerName: info_obj.Name, profilePic: info_obj.ProfilePic });
        this.moveThroughPages("sel");
      }, `PlayersInfo/${fbUser.uid}`);
    }
    else {
      console.log("not logged in");
      Object.assign(Variables,
        { userId: null, playerName: null, profilePic:"default" });
      this.moveThroughPages("ent");
    }
  }

  moveThroughPages = (pageName, info = {}) => {
    this.setState({ pageSeen: pageName, info: info });
  }

  render() {
    return <SaveGame/>
    // if((!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime))||(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1)){
    // switch (this.state.pageSeen) {
    //   case "load":
    //     return <div className='page'><img className="LoadingImg" src={LoadingImg} alt='loading' /></div>;
    //   case 'ent':
    //     return <Entrance moveThroughPages={this.moveThroughPages} />;
    //   case "sel":
    //     return <SelectGameType moveThroughPages={this.moveThroughPages} />;
    //   case "boa":
    //     return <Board info={this.state.info} moveThroughPages={this.moveThroughPages} />;
    //   default:
    //     return <ErrorMes />;
    // }
    // }
    // else{
    //   return (

    //     <NotChrome/>
    //     );
    // }


  }
}

export default App;
