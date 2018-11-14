import React, { Component } from 'react';
import './App.css';
import Board from './Board';
import LoginPage from './LoginPage/LoginPage.js';
import firebaseObj from './firebase/firebaseObj.js';
import GameType from './GameType/GameType.js';
import setFunctions from './SetGame/setFunctions';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      userID:'',
      gameCode:-1,
      gameObj:{},
      pageSeen:1
      //1-LoginPage
      //2-GameType
      //3-Board
    }
    firebaseObj.createDataBase();
  }

  gettingUserId=(infoFromPage)=>{
    this.setState({pageSeen:2, userID:infoFromPage.toString()});
  }

  gettingGameCodeObj=(gameCode,gameObj)=>{
    this.setState({pageSeen:3, gameCode:gameCode,gameObj:gameObj });
  }

  render() {
    console.log('gameCode',this.state.gameCode,'gameObj',this.state.gameObj)

    return (
      <div className="App">
      {this.state.pageSeen===1&&<LoginPage gettingUserId={this.gettingUserId} />}
      {this.state.pageSeen===2&&<GameType gettingGameCodeObj={this.gettingGameCodeObj} />}
      {this.state.pageSeen===3&&<Board gameObj={this.state.gameObj} gameCode={this.state.gameCode}  userId={this.state.userID} />} 
      </div>
    );
  }
}

export default App;
