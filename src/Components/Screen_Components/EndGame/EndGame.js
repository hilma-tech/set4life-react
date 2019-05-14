import React, { Component } from 'react';
import firebaseObj from "../../../firebase/firebaseObj"
import Variables from "../../../SetGame/Variables"
import SaveGame from '../../Small_Components/SaveGame/SaveGame';
import Party_Popper from '../../../data/design/party-popper2.png';
import Hands_Clapping from '../../../data/design/hands-clapping.png';
import './end-game.css';



class EndGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avgTime: 0,
            numCorrectSet: 0,
            numWrongSet: 0,
            moveTo_SaveGame: false
        }
        window.onbeforeunload = () => { };
        window.onpopstate = () => { };
        firebaseObj.updatingValueInDataBase(`Games/${Variables.gameCode}/Game_Participants/${Variables.userId}`, { isConnected: false });
    }
    componentDidMount() {
        firebaseObj.removeDataFromDB(`Players/${Variables.userId}/currentGame`);
        firebaseObj.readingDataOnFirebaseCB((playerObj) => {
            let correctSet = playerObj.CorrectSets ? playerObj.CorrectSets[`${Variables._date}:${Variables.day_numberedGame}`] : null;
            let wrongSet = playerObj.WrongSets ? playerObj.WrongSets[`${Variables._date}:${Variables.day_numberedGame}`] : null;

            let numCorrectSets = correctSet ? Object.keys(correctSet).length : 0;
            let numWrongSets = wrongSet ? Object.keys(wrongSet).length : 0;
            let avgTime = 0;

            if (correctSet) {
                Object.values(correctSet).forEach((val) =>
                    avgTime += (parseFloat(val.DisplaysNewCards_Till_ClickSet) + parseFloat(val.ClickSet_Till_ChooseSet)));
                avgTime = (avgTime / numCorrectSets);
            }
            avgTime = ((Math.floor(avgTime * 10)) / 10);

            this.setState({ numCorrectSet: numCorrectSets, numWrongSet: numWrongSets, avgTime: avgTime });
        }, `Players/${Variables.userId}`);
    }

    render() {
        if (!this.state.moveTo_SaveGame) {
            return (
                <div style={{ height: '100vh' }} className="container-fluid" id="endGame">
                    <div className=' h-100 d-flex align-items-center justify-content-center'>
                        <div className='"d-flex flex-column'>
                            <h1 className='display-1' >כל הכבוד!</h1>
                            <h2 className="lead" >ניצחת</h2>
                            <img className="img-fluid w-25 my-2" src={Party_Popper} style={{ backgroundColor: 'none' }} />
                            <div>
                                <ul className="list-group d-inline-block justify-content-end w-sm-75 w-md-50 list-group-flush">
                                    <li className="list-group-item">מספר הסטים <span style={{ color: '#28a745' }}>הנכונים</span> שלך:  <span className='info-text'>{this.state.numCorrectSet}</span></li>
                                    <li className="list-group-item">מספר הסטים <span style={{ color: '#dc3545' }}>הלא נכונים</span> שלך:  <span className='info-text'>{this.state.numWrongSet}</span></li>
                                    <li className="list-group-item">זמן ממוצע לבחירת סט:  <span className='info-text'>{this.state.avgTime} </span> שניות</li>
                                </ul>
                            </div>
                            <button className='btn btn-primary my-3 w-25 h-25' onClick={() => this.setState({ moveTo_SaveGame: true })} >המשך</button>
                        </div>

                    </div>
                </div>
            );
        }
        else return <SaveGame moveThroughPages={this.props.moveThroughPages} />
    }
}

export default EndGame;