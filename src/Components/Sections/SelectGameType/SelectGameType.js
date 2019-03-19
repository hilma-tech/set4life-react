import React, { Component } from 'react';
import NewGame from '../../Screen_Components/NewGame/NewGame.js';
import ExistGame from '../../Screen_Components/existGame/ExistGame';
import firebaseObj from '../../../firebase/firebaseObj';
import Variables from '../../../SetGame/Variables';
import ErrorMes from '../../Small_Components/ErrorMes';
import ChartData from '../../Screen_Components/Charts/ChartData';
import './select-game.css';
import NewGameImg from '../../../data/design/add.png'
import ExistGameImg from '../../../data/design/cards.png'
import chartsImg from '../../../data/design/line-chart.png'
import LogoutImg from '../../../data/design/logout.png';
import UserIcon from '../../Small_Components/UserIcon';


export default class GameType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            GameTypeOptions: 'sel'
            //newGame-new game
            //existGame-exist game
            //sel- current page
            //charts
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

    render() {
        switch (this.state.GameTypeOptions) {
            case 'sel':
                return (
                    <div className="text-center body">
                        <TopBar signOut={this.signOut} />
                        <div id='game-type-container' className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                            <h1 className="cover-heading">בחר את סוג המשחק שלך:</h1>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md text-center">
                                        <button className="btn btn-primary" onClick={this.onClickGameTypeButton} name='existGame'><img name='existGame' src={ExistGameImg} alt="existGame" id="existGameImg"/> משחק קיים</button>

                                    </div>
                                    <div className="col-md text-center">
                                        <button className="btn btn-primary" onClick={this.onClickGameTypeButton} name='newGame'><i name='newGame' className="fas fa-plus fa-1x ml-1"></i> משחק חדש</button>

                                    </div>
                                </div>
                                <div className="row justify-content-center mt-3">
                                    <div className="col">
                                        <button className="btn btn-primary" onClick={this.onClickGameTypeButton} name='charts'><i name='charts' className="fas fa-chart-line fa-1x ml-1"></i> גרפים</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*  */}
                    </div>

                );
            case 'existGame':
                return <ExistGame moveThroughPages={this.props.moveThroughPages} />;
            case 'newGame':
                return <NewGame moveThroughPages={this.props.moveThroughPages} />;
            case 'charts':
                return <ChartData moveThroughPages={this.props.moveThroughPages} />
            default:
                return <ErrorMes />;
        }
    }
}


const TopBar = (props) => (
    <div id='upperbar-gameType' className="upper-bar">
        <UserIcon name={Variables.playerName} src={Variables.profilePicUrl}/>
        <img src={LogoutImg} id="signout" onClick={props.signOut} alt="Logout"/>
    </div>
);
