import React,{Component} from 'react';
import './GameType.css';
import firebaseObj from '../firebase/firebaseObj';
import setFunctions from '../SetGame/setFunctions';

export default class GameType extends Component{
    constructor(props){
        super(props);
        this.state={
            gameCode:'',
            existsGame:false,
            unvalidGameCode:false
        }
    }

    findingGameCode=(gameCodeObj)=>{
        if(gameCodeObj===null)
            this.setState({unvalidGameCode:true});  
        else{
            firebaseObj.returnRef(`Games/${this.state.gameCode}/selectedCards`).remove();
            firebaseObj.returnRef(`Games/${this.state.gameCode}/currentPlayerID`).remove();

            this.props.gettingGameCodeObj(this.state.gameCode,gameCodeObj);
        }
            
    }

    onClickExistGame=()=>{
        this.setState({existsGame:true});
    }

    onClickNewGame=()=>{
        let newGameCode;
        do{
            newGameCode= setFunctions.pad(Math.floor(Math.random()*1000000),6);
        }while(firebaseObj.checkIfValueExistInDB(`Games/${newGameCode}`))

        let newCurrentCards=setFunctions.newCurrentCards(12,[],[])
        let gameCodeObj={cardsOnBoard:newCurrentCards,usedCards:newCurrentCards}

        firebaseObj.setingValueInDataBase(`Games/${newGameCode}`,gameCodeObj);
        this.props.gettingGameCodeObj(newGameCode,gameCodeObj);
    }

    inputChange=(e)=>{
        this.setState({gameCode:e.target.value.toString(),unvalidGameCode:false});
        //console.log(e.target.value);
    }

    onClickGameCodeButton=()=>{
        if(this.state.gameCode!==''){
            firebaseObj.readingDataOnFireBase(this.findingGameCode, `Games/${this.state.gameCode}`);

            //this.props.gettingGameCodeObj(this.state.gameCode);
        }
    }

    render(){
        return(
            <div>
                <button onClick={this.onClickExistGame} id='exsitsGame' >משחק קיים</button>
                <button onClick={this.onClickNewGame} id='newGame' >משחק חדש</button>

                {this.state.existsGame&&
                <input
                id="input"
                 name='gameCode' 
                 type='text'
                 placeholder="enter the Game Code"
                 value={this.state.gameCode}
                 onChange={this.inputChange}/>
                }



                {this.state.existsGame && <button onClick={this.onClickGameCodeButton} id='continue' >המשך</button>}

                {this.state.unvalidGameCode&& <div id='game-not-exist' >המשחק אינו קיים. אנא נסה שנית</div>}
            </div>
        );
    }
}