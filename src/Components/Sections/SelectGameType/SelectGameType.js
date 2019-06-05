import React, { Component } from 'react';
import NewGame from '../../Screen_Components/NewGame/NewGame.js';
import ExistGame from '../../Screen_Components/existGame/ExistGame';
import CurrentGame from '../../Screen_Components/CurrentGame/CurrentGame';
import firebaseObj from '../../../firebase/firebaseObj';
import Variables from '../../../SetGame/Variables';
import ErrorMes from '../../Small_Components/ErrorMes';
import ChartData from '../../Screen_Components/Charts/ChartData';
import './select-game.css';
import NewGameImg from '../../../data/design/add.png'
import ExistGameImg from '../../../data/design/cards.png'
import chartsImg from '../../../data/design/line-chart.png'
import LogoutImg from '../../../data/design/logout.png';
import UserIcon from '../../Small_Components/UserIcon/UserIcon';
import LoadingImg from '../../../data/design/loading-img.gif';
import LoadingPage from '../../Screen_Components/LoadingPage/LoadingPage';


export default class GameType extends Component {
    constructor(props) {
        super(props);
        this.checkCurrentGame();
        this.state = {
            currentGame: null,
            GameTypeOptions: 'sel'
            //newGame-new game
            //existGame-exist game
            //sel- current page
            //charts
            //currentGame
        }
        window.history.pushState('sel', '', 'gameType');
        window.onbeforeunload = () => {};
        let last_screen='';

        window.addEventListener('popstate', (event) => {
            console.log(`%c pop sel- ${event.state}`, 'color: green;')

            switch (event.state) {
                case "newGame": case "existGame":
                case 'charts':
                case "sel": case '':
                    if (this.state.GameTypeOptions != event.state)
                        this.setState({ GameTypeOptions: event.state });
                    break;
                default:
                    if(event.state!=='EndGame'||event.state!=='SaveGame')
                        window.history.pushState('sel', '', 'gameType');
            }

            last_screen=event.state;
        });
    }

    onClickGameTypeButton = (event) => {
        this.setState({ GameTypeOptions: event.target.getAttribute('name') });
    }

    signOut = () => {
        firebaseObj._auth.signOut();
        this.props.moveThroughPages("ent");
    }

    checkCurrentGame = () => {
        firebaseObj.readingDataOnFirebaseCB(currentGame => {
            this.setState({ currentGame: currentGame, GameTypeOptions: 'sel' });
        }, `Players/${Variables.userId}/currentGame`);
    }

    deleteCurrentGameInSel = () => {
        this.setState({ currentGame: null });
    }

    render() {
        switch (this.state.GameTypeOptions) {
            case 'sel':
                return (
                    <div id='sel' className="container-fluid d-flex flex-column"
                        style={{ height: '100vh', width: '100vw' }}>
                       
                        <TopBar signOut={this.signOut} />
                        <div className='container-fluid h-75 d-flex flex-column  justify-content-center'>
                            
                            <h1 className='display-4' >בחר את סוג המשחק</h1>
                            <div className='w-100 mt-md-2 mt-lg-1'>

                                <button
                                    className="btn btn-primary btn-lg col-lg-5 mr-lg-4 mb-md-3"
                                    onClick={this.onClickGameTypeButton}
                                    name='existGame' >
                                    <img
                                        name='existGame'
                                        src={ExistGameImg}
                                        alt="existGame"
                                        className="buttonsIcons exist" /> משחק קיים
                                    </button>

                                <button
                                    className="btn btn-primary btn-lg col-lg-5 mb-md-3"
                                    onClick={this.onClickGameTypeButton}
                                    name='newGame' >
                                    <img
                                        name='newGame'
                                        src={NewGameImg}
                                        alt="new game"
                                        className="buttonsIcons new" /> משחק חדש
                                    </button>

                                <button
                                    className="btn btn-primary btn-lg col-lg-5  mb-md-3"
                                    style={{backgroundColor:'#9fc8d0',borderColor:'#9fc8d0'}}
                                    onClick={this.onClickGameTypeButton}
                                    name='charts'>
                                    <img
                                        name='charts'
                                        src={chartsImg}
                                        alt="charts"
                                        className="buttonsIcons" />  גרפים
                                    </button>
                            </div>
                        </div>
                        {this.state.currentGame && Object.keys(this.state.currentGame).length ?
                            <CurrentGame deleteCurrentGameInSel={this.deleteCurrentGameInSel} currentGame={this.state.currentGame} moveThroughPages={this.props.moveThroughPages} /> : ''}
                    </div>
                );
            case 'existGame':
                return <ExistGame moveThroughPages={this.props.moveThroughPages} onClickGameTypeButton={this.onClickGameTypeButton} />;
            case 'newGame':
                return <NewGame moveThroughPages={this.props.moveThroughPages} onClickGameTypeButton={this.onClickGameTypeButton} />;
            case 'load':
                return <LoadingPage/>
            case 'charts':
                return <ChartData onClickGameTypeButton={this.onClickGameTypeButton} />
            default:
                return <ErrorMes />;
        }
    }
}


const TopBar = (props) => (
    <nav className='navbar d-flex flex-row justify-content-between p-lg-2 p-md-3'>
        <UserIcon _direction='left' name={Variables.playerName} src={Variables.profilePic} />
        <img className='upper-bar-icon' src={LogoutImg} onClick={props.signOut} alt="Logout" />
    </nav>
);
