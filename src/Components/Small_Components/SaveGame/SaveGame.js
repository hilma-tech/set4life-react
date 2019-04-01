import React, { Component } from 'react';
import './save-game.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import EndGame from '../../Screen_Components/EndGame';
import firebaseObj from '../../../firebase/firebaseObj';
import Variables from '../../../SetGame/Variables';


export default class SaveGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showen: true,
            clickOption: false
        }
    }

    toggle = (event) => {
        this.setState({
            showen: !this.state.showen,
            clickOption: true
        });

        if (event.target.getAttribute('name') === 'no') {
            ['CorrectSets', 'MissedSets', 'WrongSets'].map(set_type => {
                firebaseObj.removeDataFromDB(`Players/${Variables.userId}/${set_type}/${Variables._date}:${Variables.day_numberedGame}`)
            })
        }

    }

    render() {
        if (!this.state.clickOption) {
            return <div  id='save-game' >
                <Modal size='lg' centered={true} isOpen={this.state.showen} className={this.props.className}>
                    <ModalBody >
                        <h1>האם אתה רוצה לשמור את המשחק?</h1>
                    </ModalBody>
                    <ModalFooter>
                        <div className='d-flex justify-content-center'>
                            <Button className='primary mx-5' style={{ backgroundColor: 'green' }} onClick={this.toggle} name='yes'>כן</Button>
                            <Button className='primary mx-5' style={{ backgroundColor: 'red' }} onClick={this.toggle} name='no'>לא</Button>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        }
        else
            return <EndGame moveThroughPages={this.props.moveThroughPages} />;
    }
}

