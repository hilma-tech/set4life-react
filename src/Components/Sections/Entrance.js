import React, { Component } from 'react';
import LoginPage from '../Screen_Components/Login/LoginPage.js';
import Registration from '../Screen_Components/Registration/Registration.js';
import ErrorMes from '../Screen_Components/ErrorMes/ErrorMes';


export default class Entrance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            EntranceOption: 'log'
            //'log'-login
            //'reg'-Registration
        }
        window.history.replaceState('ent', '', 'Entrance');
        window.onpopstate = (event) => {
            console.log(`%c pop ent- ${event.state}, `, 'color: red;')
            switch (event.state) {
                case "reg":
                case "log":
                    if (this.state.EntranceOption != event.state)
                        this.setState({ EntranceOption: event.state });
                    break;
                default:
                    this.setState({ EntranceOption: 'log' });
                    break;

            }
        }
    }

    moveBetweenEntOptions = (event) => {
        this.setState({ EntranceOption: event.target.getAttribute('moveTo') });
    }

    render() {
        switch (this.state.EntranceOption) {
            case 'log':
                return <LoginPage moveBetweenEntOptions={this.moveBetweenEntOptions} />;
            case 'reg':
                return <Registration moveBetweenEntOptions={this.moveBetweenEntOptions} />;
            default:
                return <ErrorMes />;
        }
    }
}


