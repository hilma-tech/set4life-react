import React, { Component } from 'react';
import NewGame from '../../Screen_Components/NewGame/NewGame.js';
import ExistGame from '../../Screen_Components/ExistGame';
import firebaseObj from '../../../firebase/firebaseObj';
import Variables from '../../../SetGame/Variables';
import ErrorMes from '../../Small_Components/ErrorMes';
import ChartPage from '../../Screen_Components/ChartsPage';
import './select-game.css';

export default class GameType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            GameTypeOptions: 'charts'
            //new-new game
            //exist-exist game
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
        switch (this.state.GameTypeOptions) {
            case 'sel':
                return (
                    <div class="text-center body">
                        <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                            <TopBar id="top-bar" signOut={this.signOut} />

                            <main role="main" class="inner cover">
                                <h1 class="cover-heading">בחר את סוג המשחק שלך:</h1>
                                <p class="lead">
                                    <button class="btn" onClick={this.onClickGameTypeButton} id='existGame'>🎲 משחק קיים</button>
                                    <button class="btn" onClick={this.onClickGameTypeButton} id='newGame'>➕ משחק חדש</button>
                                </p>
                                <button class="btn" onClick={this.onClickGameTypeButton} id='charts'>📈גרפים</button>
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

    <header class="masthead mb-auto">
        <div class="inner">
            <nav class="nav nav-masthead justify-content-center">
                <a id="signout" onClick={props.signOut}>התנתק</a>
            </nav>
            <h3 class="masthead-brand"> ברוכה הבאה, {Variables.playerName}!</h3>

        </div>
    </header>

);
