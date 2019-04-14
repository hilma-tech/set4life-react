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
            avgTime: null,
            numCorrectSet: 0,
            numWrongSet: 0,
            moveTo_SaveGame:false
        }
        window.onbeforeunload = () => { };
        window.onpopstate = () => { };
        firebaseObj.updatingValueInDataBase(`Games/${Variables.gameCode}/Game_Participants/${Variables.userId}`, { isConnected: false });
    }
    componentDidMount() {
        firebaseObj.readingDataOnFirebaseCB((playerObj) => {

            let correctSet = playerObj.CorrectSets?playerObj.CorrectSets[`${Variables._date}:${Variables.day_numberedGame}`]:null;
            let wrongSet = playerObj.WrongSets?playerObj.WrongSets[`${Variables._date}:${Variables.day_numberedGame}`]:null;

            let numCorrectSets=correctSet?correctSet.length:0;
            let numWrongSets=wrongSet?wrongSet.length:0;

            this.setState({ numCorrectSet: numCorrectSets, numWrongSet: numWrongSets });
        }, `Players/${Variables.userId}`);
    }

    render() {
        if(!this.state.moveTo_SaveGame){
            return (
                <div style={{ height: '100vh' }} className="container-fluid" id="endGame">
                    <div className=' h-100 d-flex align-items-center justify-content-center'>
                        <div className='"d-flex flex-column'>
                            <h1 className='display-1' >כל הכבוד!</h1>
                            <h2 className="lead" >ניצחת</h2>
                            <img className="img-fluid w-25 my-2" src={Party_Popper} style={{ backgroundColor: 'none' }} />
                            <div>
                                <ul className="list-group d-inline-block justify-content-end w-sm-75 w-md-50 list-group-flush">
                                    <li className="list-group-item">מספר הסטים <span style={{color:'#28a745'}}>הנכונים</span> שלך: {this.state.numCorrectSet}</li>
                                    <li className="list-group-item">מספר הסטים <span style={{color:'#dc3545'}}>הלא נכונים</span> שלך: {this.state.numWrongSet}</li>
                                    <li className="list-group-item">זמן ממוצע לבחירת סט: {!this.state.avgTime ? 0 : (Math.floor((this.state.avgTime) * 10)) / 10} שניות</li>
                                </ul>
                            </div>
                            <button className='btn btn-primary my-3 w-25 h-25' onClick={()=>this.setState({moveTo_SaveGame:true})} >המשך</button>
                        </div>
    
                    </div>
                </div>
            );
        }
        else return <SaveGame moveThroughPages={this.props.moveThroughPages} />
    }
}

export default EndGame;