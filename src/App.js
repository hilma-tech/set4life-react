import React, { Component } from 'react';
import './App.css';
import Board from './Components/Screen_Components/Board.js';
import LoginPage from './Components/Screen_Components/LoginPage.js';
import GameType from './Components/Screen_Components/GameType.js';
import Variables from './SetGame/Variables.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      pageSeen:1
      //1-LoginPage
      //2-GameType
      //3-Board
    }
  }

  moveThroughPages=()=>{
     this.setState({pageSeen:this.state.pageSeen<3?this.state.pageSeen+1:3})
  }

  render() {
    return (
      <div id="App" className='page'>
      {this.state.pageSeen===1&&<LoginPage moveThroughPages={this.moveThroughPages} />}
      {this.state.pageSeen===2&&<GameType moveThroughPages={this.moveThroughPages} />}
      {this.state.pageSeen===3&&<Board  gameObj={Variables.gameObj} gameCode={Variables.gameCode}  userId={Variables.userId} />} 
      </div>
    );
  }
}

export default App;
