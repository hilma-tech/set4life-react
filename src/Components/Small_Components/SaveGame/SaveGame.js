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
    }

    toggle = (event) => {
        if (event.target.getAttribute('name') === 'no') {
            ['CorrectSets', 'MissedSets', 'WrongSets'].map(set_type => {
                firebaseObj.removeDataFromDB(`Players/${Variables.userId}/${set_type}/${Variables._date}:${Variables.day_numberedGame}`)
            });
            firebaseObj.removeDataFromDB(`games/${Variables._date}/${Variables.day_numberedGame}`);
            this.props.moveThroughPages('sel');
        }

    }

    render() {
        console.log(this.props.moveThroughPages)
        return <div style={{ height: '100vh' }} className='container' id='save-game' >
            <div className='h-100 d-flex align-items-center justify-content-center'>
                <div className='h-lg-50 h-md-75 d-flex flex-column justify-content-around'>
                    <div>
                        <h1 className='display-4'>האם אתה רוצה לשמור את המשחק?</h1>
                        <p className='lead' >במידה ותשמור את תוצאות המשחק, הם יופיעו בגרפים המסכמים את פעילותך באפליקציה.</p>
                    </div>
                    <div className='d-flex flex-lg-row flex-md-column w-lg-100 w-md-75 justify-content-lg-around align-items-md-center my-md-4' >
                        <div className='col-md-10 col-lg-6' >
                            <button className='btn btn-success btn-lg btn-block text-body' onClick={this.toggle} name='yes'>כן</button>
                        </div>
                        <div className='col-md-10 col-lg-6 my-md-3'>
                            <button className='btn btn-danger btn-lg btn-block text-body' onClick={this.toggle} name='no'>לא</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

