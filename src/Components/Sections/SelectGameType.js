import React, { Component } from 'react';
import NewGame from '../Screen_Components/NewGame';
import ExistGame from '../Screen_Components/ExistGame';
import firebaseObj from '../../firebase/firebaseObj';
import Variables from '../../SetGame/Variables';
import ErrorMes from '../Small_Components/ErrorMes';
import ChartPage from '../Screen_Components/ChartsPage';
import './select-game.css';



export default class GameType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            GameTypeOptions: 'sel'
            //new-new game
            //exist-exist game
        }
        window.history.pushState('sel', '', 'gameType');
        window.onpopstate = (event) => {
            switch (event.state) {
                case "newGame":
                case 'charts':
                case "existGame":
                case "sel":
                    if (this.state.GameTypeOptions != event.state)
                        this.setState({ GameTypeOptions: event.state });
                    break;
            }
        }
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
                    <div dir="rtl" class="text-center body">
                        <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                            <TopBar id="top-bar" signOut={this.signOut} />

                            <main role="main" class="inner cover">
                                <h1 class="cover-heading">בחר את סוג המשחק שלך:</h1>
                                <p class="lead">bitch</p>
                                <p class="lead">
                                    <button class="btn btn-lg btn-secondary" onClick={this.onClickGameTypeButton} id='existGame'> <i class="fas fa-sign-out-alt"></i> משחק קיים</button>
                                    <button class="btn btn-lg btn-secondary" onClick={this.onClickGameTypeButton} id='newGame'> <i class="fas fa-plus"></i> משחק חדש</button>
                                    <button class="btn btn-lg btn-secondary" onClick={this.onClickGameTypeButton} id='charts'> <i class="fas fa-chart-area"></i> גרפים</button>
                                </p>
                            </main>

                            <footer class="mastfoot mt-auto">
                                <div class="inner">
                                    <p>וואו אחי  <a href="https://getbootstrap.com/">מטורף</a>, מה <a href="https://twitter.com/mdo">כדגכ</a>.</p>
                                </div>
                            </footer>
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
                <a id="signout" onClick={props.signOut} class="nav-link active" href="#">התנתק</a>
                <a class="nav-link" href="#">בלה</a>
                <a class="nav-link" href="#">צור קשר</a>
            </nav>
            <h3 class="masthead-brand"> ברוכה הבאה, {Variables.playerName}!</h3>

        </div>
    </header>

);
