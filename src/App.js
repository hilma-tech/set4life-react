import React, { Component } from 'react';
import './App.css';
import Board from './Board';
import LoginPage from './LoginPage/LoginPage.js';


class App extends Component {
  constructor(props){
    super(props);
    this.state={
      userID:'',
      userIDFromBoard:'',
      userIDFromLogin:'',
      pageSeen:1
      //1-LoginPage
      //2-Board
    }
  }
  gettingUserIDFromLogin=(userIDFromLogin)=>{
    this.setState({pageSeen:2, userID:userIDFromLogin.toString()});
  }

  render() {
    console.log('user id in app', this.state.userID)
    return (
      <div className="App">
      {this.state.pageSeen===1&&<LoginPage gettingUserIDFromLogin={this.gettingUserIDFromLogin} />}
      {this.state.pageSeen===2&&<Board  userId={this.state.userID} />} 
      </div>
    );
  }
}

export default App;
