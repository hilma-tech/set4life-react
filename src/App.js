import React, { Component } from 'react';
import './App.css';
import Board from './Components/Sections/Board/Board.js';
import SelectGameType from './Components/Sections/SelectGameType/SelectGameType.js';
import Variables from './SetGame/Variables';
import Entrance from './Components/Sections/Entrance.js';
import firebaseObj from './firebase/firebaseObj';
import LoadingPage from './Components/Screen_Components/LoadingPage/LoadingPage';
import ErrorMes from './Components/Small_Components/ErrorMes';
import LodingImg from './data/design/loading-img.gif';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
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

    console.log('app Variables',Variables)

    window.onpopstate = (event) => {
      console.log('app popstate', event.state)
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


  handlePlayerAuthState = (fbUser) => {
    if (fbUser) {
      console.log('fbUser',fbUser)
      if (Variables.profilePic === LodingImg|| (!Variables.playerName.length)) {
        firebaseObj.listenerOnFirebase(info_obj => {
          if (info_obj) {
            Object.assign(Variables,
              { userId: fbUser.uid, profilePic: info_obj.ProfilePic, playerName: info_obj.Name });
          }
          this.moveThroughPages("sel");

        }, `PlayersInfo/${fbUser.uid}`);
      }

      else {
        Variables.userId = fbUser.uid;
        this.moveThroughPages("sel");
      }
    }

    else {
      console.log("not logged in");
      Object.assign(Variables,
        { userId: '', playerName: '', profilePic: LodingImg });
      this.moveThroughPages("ent");
    }
  }


  moveThroughPages = (pageName, info = {}) => {
    this.setState({ pageSeen: pageName, info: info });
  }

  render() {
    switch (this.state.pageSeen) {
      case "load":
        return <LoadingPage />;
      case 'ent':
        return <Entrance />;
      case "sel":
        return <SelectGameType moveThroughPages={this.moveThroughPages} />;
      case "boa":
        return <Board info={this.state.info} moveThroughPages={this.moveThroughPages} />;
      default:
        return <ErrorMes />;
    }
  }
}

