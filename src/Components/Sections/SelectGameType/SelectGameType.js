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
        window.addEventListener('popstate', (event) => {
            console.log('inside popstate sel', event.state)
            switch (event.state) {
                case "newGame": case "existGame":
                case 'charts':
                case "sel": case '':
                    if (this.state.GameTypeOptions != event.state)
                        this.setState({ GameTypeOptions: event.state });
                    break;
                default:
                    window.history.pushState('sel', '', 'gameType');
            }
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
                    <div id="container d-flex flex-column" style={{height:'100vh'}}>
                        <TopBar signOut={this.signOut} />
                        <div className='container h-75 d-flex flex-column  justify-content-center '>
                            <h1 className='display-4' >בחר את סוג המשחק שלך</h1>
                            <div className='container w-75 mt-md-4'>
                                <button className="btn btn-secondary btn-lg col-lg-5 m-2 mr-lg-4 mb-md-3" onClick={this.onClickGameTypeButton} name='existGame' ><img name='existGame' src={ExistGameImg} alt="existGame" className="buttonsIcons" /> משחק קיים</button>
                                <button className="btn btn-secondary btn-lg col-lg-5 m-2 mb-md-3" onClick={this.onClickGameTypeButton} name='newGame' ><img name='newGame' src={NewGameImg} alt="new game" className="buttonsIcons" /> משחק חדש</button>
                                <button className="btn btn-secondary btn-lg col-lg-5  m-2 mb-md-3" onClick={this.onClickGameTypeButton} name='charts'><img name='charts' src={chartsImg} alt="charts" className="buttonsIcons" /> גרפים </button>
                            </div>
                        </div>
                        {this.state.currentGame&&Object.keys(this.state.currentGame).length ?
                            <CurrentGame deleteCurrentGameInSel={this.deleteCurrentGameInSel} currentGame={this.state.currentGame} moveThroughPages={this.props.moveThroughPages} /> : ''}
                    </div>
                );
            case 'existGame':
                return <ExistGame moveThroughPages={this.props.moveThroughPages} onClickGameTypeButton={this.onClickGameTypeButton} />;
            case 'newGame':
                return <NewGame moveThroughPages={this.props.moveThroughPages} onClickGameTypeButton={this.onClickGameTypeButton} />;
            case 'load':
                return <div><img src={LoadingImg} /></div>
            case 'charts':
                return <ChartData moveThroughPages={this.props.moveThroughPages} />
            default:
                return <ErrorMes />;
        }
    }
}


const TopBar = (props) => (
    <nav className='navbar bg-danger d-flex flex-row justify-content-between p-lg-2 p-md-3'>
        <UserIcon _direction='left' name={Variables.playerName} src={Variables.profilePic} />
        <div className='col-1'>
            <img src={LogoutImg} onClick={props.signOut} alt="Logout" width='40' height='40' />
        </div>
    </nav>
);
