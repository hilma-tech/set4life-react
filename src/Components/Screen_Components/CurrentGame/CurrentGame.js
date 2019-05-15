import React, { Component } from 'react';
import firebaseObj from '../../../firebase/firebaseObj';
import Variables from '../../../SetGame/Variables.js';
import './current-game.css';

export default class CurrentGame extends Component {
    enterCurrentGame = () => {
        firebaseObj.readingDataOnFirebaseCB(gameObj => {
            Object.assign(Variables, {
                gameCode: this.props.currentGame.gameCode,
                _timer: gameObj.timeOut_choosingCards,
                constParameters: gameObj.constParameters ? gameObj.constParameters : {},
                creationGameTime: gameObj.creationTime
            });
            this.props.moveThroughPages("boa", gameObj);
        }, `Games/${this.props.currentGame.gameCode}`)
    }

    deleteCurrentGame = () => {

    }

    render() {
        return (
            <div class="modal fade show" tabindex="-1"  aria-labelledby="exampleModalLabel"
            data-backdrop="static" role="dialog" style={{ display: 'block' }}>
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <h1 className='h1 font-weight-light'>עזבת את המשחק באמצע. תרצה לחזור אליו?</h1>
                        </div>
                        <div class="modal-footer d-flex justify-content-around">
                            <button className='btn btn-success col-5' onClick={this.enterCurrentGame}>כן</button>
                            <button className='btn btn-danger col-5' onClick={this.deleteCurrentGame}>לא</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}