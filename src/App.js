import React, { Component } from 'react';
import './App.css';
import Board from './Board';
import LoginPage from './LoginPage.js';
import GameType from './GameType/GameType.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      userId:'',
      gameCode:null,
      gameObj:{},
      pageSeen:2
      //1-LoginPage
      //2-GameType
      //3-Board
    }
  }

  gettingUserId=(userId)=>{
    this.setState({pageSeen:2, userId:userId.toString()});
  }

  gettingGameCodeObj=(gameCode,gameObj)=>{
    this.setState({pageSeen:3, gameCode:gameCode,gameObj:gameObj });
  }

  render() {
    return (
      <div id="App" className='page'>
      {this.state.pageSeen===1&&<LoginPage gettingUserId={this.gettingUserId} />}
      {this.state.pageSeen===2&&<GameType gettingGameCodeObj={this.gettingGameCodeObj} />}
      {this.state.pageSeen===3&&<Board  gameObj={this.state.gameObj} gameCode={this.state.gameCode}  userId={this.state.userId} />} 
      </div>
    );
  }
}

export default App;
