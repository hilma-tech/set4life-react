import React, { Component } from 'react';
import './save-game.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import EndGame from '../../Screen_Components/EndGame/EndGame';
import firebaseObj from '../../../firebase/firebaseObj';
import Variables from '../../../SetGame/Variables';


export default class SaveGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choseOption: false
        }
        window.history.pushState('SaveGame', '', 'SaveGame');
        window.onpopstate = (event) => {
            if (event.state === 'EndGame')
                window.history.back();
        };
    }

    toggle = (event) => {
        if (event.target.getAttribute('name') === 'no') {
            ['CorrectSets', 'MissedSets', 'WrongSets'].map(set_type => {
                firebaseObj.removeDataFromDB(`Players/${Variables.userId}/${set_type}/${Variables._date}:${Variables.day_numberedGame}`)
            });
            firebaseObj.removeDataFromDB(`games/${Variables._date}/${Variables.day_numberedGame}`);
        }
        this.props.moveThroughPages('sel');
    }

    render() {
        return <div id='save-game' style={{ height: '100vh' }} className='container' >
            <div className='h-100 d-flex align-items-center justify-content-center'>
                <div className='d-flex flex-column justify-content-around'>
                    <div>
                        <h1 className='display-4'>האם אתה רוצה לשמור את המשחק?</h1>
                        <p className='lead' >במידה ותשמור את תוצאות המשחק, הם יופיעו בגרפים המסכמים את פעילותך באפליקציה.</p>
                    </div>
                    <div id='buttons-container' className='d-flex w-lg-100 w-md-75 align-items-center' >
                        <button className='btn btn-success btn-block text-body' onClick={this.toggle} name='yes'>כן</button>
                        <button className='btn btn-danger btn-block text-body' onClick={this.toggle} name='no'>לא</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

