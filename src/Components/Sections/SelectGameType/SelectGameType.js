import React, { Component } from 'react';
import NewGame from '../../Screen_Components/NewGame/NewGame.js';
import ExistGame from '../../Screen_Components/ExistGame';
import firebaseObj from '../../../firebase/firebaseObj';
import Variables from '../../../SetGame/Variables';
import ErrorMes from '../../Small_Components/ErrorMes';
import ChartPage from '../../Screen_Components/chartsPage/ChartsPage';
import './select-game.css';

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
        Variables.set_selPlaceHistory(window.history.length);
        window.addEventListener('popstate',(event) => {
            console.log('inside popstate sel', event.state)
            switch (event.state) {
                case "newGame":case "existGame":
                case 'charts':
                case "sel":case '':
                    if (this.state.GameTypeOptions != event.state)
                        this.setState({ GameTypeOptions: event.state});
                    break;
                default:
                    window.history.pushState('sel', '', 'gameType');
            }

        });
    }

    onClickGameTypeButton = (event) => {
        this.setState({ GameTypeOptions: event.target.getAttribute('id') });
    }

    signOut = () => {
        firebaseObj._auth.signOut();
        this.props.moveThroughPages("ent");
    }

    render() {
        console.log('this.state.GameTypeOptions',this.state.GameTypeOptions)
        switch (this.state.GameTypeOptions) {
            case 'sel':
                return (
                    <div className="text-center body">
                        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                            <TopBar id="top-bar" signOut={this.signOut} />

                            <main role="main" className="inner cover">
                                <h1 className="cover-heading">בחר את סוג המשחק שלך:</h1>
                                <p className="lead">
                                    <button className="btn" onClick={this.onClickGameTypeButton} id='existGame'><i className="fas fa-dice fa-1x"></i> משחק קיים</button>
                                    <button className="btn" onClick={this.onClickGameTypeButton} id='newGame'><i className="fas fa-plus fa-1x"></i> משחק חדש</button>
                                </p>
                                <button className="btn" onClick={this.onClickGameTypeButton} id='charts'><i className="fas fa-chart-line fa-1x"></i> גרפים</button>
                            </main>
                        </div>

                    </div>

                );
            case 'existGame':
                return <ExistGame moveThroughPages={this.props.moveThroughPages} />;
            case 'newGame':
                return <NewGame moveThroughPages={this.props.moveThroughPages} />;
            case 'charts':
                return <ChartPage />
            default:
                return <ErrorMes />;
        }
    }
}


const TopBar = (props) => (
    <header className="masthead mb-auto">
        <div className="inner">
            <nav className="nav nav-masthead justify-content-center">
                <a id="signout" onClick={props.signOut}>התנתק</a>
            </nav>
            <h3 className="masthead-brand"> ברוכה הבאה, {Variables.playerName}!</h3>

        </div>
    </header>

);
