import React,{Component} from 'react';
import firebaseObj from '../firebase/firebaseObj';
import setFunctions from '../SetGame/setFunctions';
import NewGame from './NewGame';
import LoadingImg from '../data/design/loading-img.gif';

export default class GameType extends Component{
    constructor(props){
        super(props);
        this.state={
            gameCode:'',
            GameTypeOptions:null
            //0-new game
            //1-exist game
        }
        firebaseObj.createDataBase();
    }

    settingNewGame=(constParameters)=>{
        //NOT WORKING AT ALL!
        let newGameCode;
        let newCurrentCards;
        do{
            newGameCode= setFunctions.newRandomGameCode(Math.floor(Math.random()*1000000),6);
        }while(firebaseObj.readingDataOnFireBase(firebaseObj.checkIfValueExistInDB,`Games/${newGameCode}`))

        if(Object.keys(constParameters).length===2)
            newCurrentCards=setFunctions.newCurrentCards(9,[],[]) 
        else
            newCurrentCards=setFunctions.newCurrentCards(12,[],[])
        
        let gameCodeObj={cardsOnBoard:newCurrentCards,usedCards:newCurrentCards}

        firebaseObj.setingValueInDataBase(`Games/${newGameCode}`,gameCodeObj);
        this.props.gettingGameCodeObj(newGameCode,gameCodeObj);
    }

    onClickGameTypeButton=(event)=>{
        event.target.getAttribute('id')==='exsitGame'&&this.setState({GameTypeOptions:1});
        event.target.getAttribute('id')==='newGame'&&this.setState({GameTypeOptions:0});
    }

    render(){
        return(
            <div id='game-type' className='page' >
                {this.state.GameTypeOptions===null&&
                <div>
                    <button onClick={this.onClickGameTypeButton} id='exsitGame' className='game-type-buttons' >משחק קיים</button>
                    <button onClick={this.onClickGameTypeButton} id='newGame' className='game-type-buttons' >משחק חדש</button>
                </div>}

                {this.state.GameTypeOptions===1&&<ExistGame gettingGameCodeObj={this.props.gettingGameCodeObj} />}

                {this.state.GameTypeOptions===0&&<NewGame settingNewGame={this.settingNewGame} />}
            </div>
        );
    }
}









class ExistGame extends Component{
    constructor(props){
        super(props);
        this.state={
            gameCode:'',
            invalidGameCode:false,
            loadingImg:false
        }
    }

    findingGameCode=(gameCodeObj)=>{
        if(gameCodeObj===null)
            this.setState({invalidGameCode:true,loadingImg:false});  
        else{
            firebaseObj.removeDataFromDB(`Games/${this.state.gameCode}/selectedCards`);
            firebaseObj.removeDataFromDB(`Games/${this.state.gameCode}/currentPlayerID`);

            this.props.gettingGameCodeObj(this.state.gameCode,gameCodeObj);
        }  
    }

    onClickExistGameCodeButton=()=>{
        if(this.state.gameCode!==''){
            this.setState({loadingImg:true})
            firebaseObj.readingDataOnFireBase(this.findingGameCode, `Games/${this.state.gameCode}`);
        }
    }

    inputChange=(event)=>{
        this.setState({gameCode:event.target.value.toString(),invalidGameCode:false});
    }

    render(){
        return(
            <div >
                <input
                id="input"
                name='gameCode' 
                type='text'
                placeholder="הכנס קוד משחק"
                value={this.state.gameCode}
                onChange={this.inputChange}/>

                {this.state.loadingImg?
                <img src={LoadingImg} alt='loading' />:
                <button onClick={this.onClickExistGameCodeButton} id='continue' >המשך</button>}  

                {this.state.invalidGameCode&& <div id='game-not-exist' >המשחק אינו קיים. אנא נסה שנית</div>}   
            </div>
        );
    }
}