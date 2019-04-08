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
import UserIcon from '../../Small_Components/UserIcon/UserIcon';


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
        console.log("in onClickGameTypeButton",event.target.getAttribute('name') )
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
                    <div id="sel-body">
                        <TopBar signOut={this.signOut} />
                        <div id='game-type-container'>
                            <h1>בחר את סוג המשחק שלך</h1>
                            <div>
                                <div className="gameType">
                                    <button onClick={this.onClickGameTypeButton} name='existGame' className="gameTypeButtons buttons">
                                    <img name='existGame' src={ExistGameImg} alt="existGame" className="buttonsIcons" /> משחק קיים</button>
                                    <button onClick={this.onClickGameTypeButton} name='newGame' className="gameTypeButtons buttons"><img name='newGame' src={NewGameImg} alt="new game" className="buttonsIcons" /> משחק חדש</button>
                                </div>
                                    <button onClick={this.onClickGameTypeButton} name='charts' className="graphButton buttons"><img name='charts' src={chartsImg} alt="charts" className="graphsIcon" /> <span>גרפים</span> </button>
                            </div>
                        </div>
                    </div>

                );
            case 'existGame':
                return <ExistGame moveThroughPages={this.props.moveThroughPages} onClickGameTypeButton={this.onClickGameTypeButton}/>;
            case 'newGame':
                return <NewGame moveThroughPages={this.props.moveThroughPages} onClickGameTypeButton={this.onClickGameTypeButton}/>;
            case 'charts':
                return <ChartData moveThroughPages={this.props.moveThroughPages} />
            default:
                return <ErrorMes />;
        }
    }
}


const TopBar = (props) => (
    <div className='upperBar'>
        <UserIcon _direction='left' name={Variables.playerName} src={Variables.profilePic}/>
        <img src={LogoutImg} id="signout" onClick={props.signOut} alt="Logout"/>
    </div>
);
