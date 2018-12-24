import React,{Component} from 'react';
import LoadingImg from '../../data/design/loading-img.gif';
import Variables from '../../SetGame/Variables.js';
import firebaseObj from '../../firebase/firebaseObj';


export default class ExistGame extends Component{
    constructor(props){
        super(props);
        this.state={
            gameCode:'',
            invalidGameCode:false,
            continueToGame:false,
            participants:[],
            loadLocatePartic:false
        }
    }

    findingGameCode=(db_gameObj)=>{
        if(db_gameObj===null)
            this.setState({invalidGameCode:true,continueToGame:false});  
        else{
            firebaseObj.removeDataFromDB(`Games/${this.state.gameCode}/selectedCards`);
            firebaseObj.removeDataFromDB(`Games/${this.state.gameCode}/currentPlayerID`);

            Variables.setGameCode(this.state.gameCode);
            Variables.setGameObj({cardsOnBoard:db_gameObj.cardsOnBoard,usedCards:db_gameObj.usedCards});
            Variables.setObjConstParameters(db_gameObj.constParameters)
            this.props.moveThroughPages("boa");
        }  
    }

    onClickExistGameCodeButton=()=>{
        if(this.state.gameCode!==''){
            this.setState({continueToGame:true})
            firebaseObj.readingDataOnFirebaseCB(this.findingGameCode, `Games/${this.state.gameCode}`);
        }
    }

    inputChange=(event)=>{
        this.setState({gameCode:event.target.value.toString(),invalidGameCode:false,participants:[]});
        
        if(event.target.value.length===3){
            this.setState({loadLocatePartic:true});
            firebaseObj.readingDataOnFirebaseCB(
                (partic)=>
                this.setState({participants:partic?Object.keys(partic):[],loadLocatePartic:false})
            ,`Game_Participants/${event.target.value}`);
        }
    }

    render(){
        return(
            <div >
                {this.state.loadLocatePartic?
                    <img src={LoadingImg} alt='loading'/>:
                    <p>{this.state.participants}</p>
                }
                <input
                id="input"
                name='gameCode' 
                type='text'
                placeholder="הכנס קוד משחק"
                value={this.state.gameCode}
                onChange={this.inputChange}/>

                {this.state.continueToGame?
                <img src={LoadingImg} alt='loading' />:
                <button onClick={this.onClickExistGameCodeButton} id='continue' >המשך</button>}  

                {this.state.invalidGameCode&& <div id='game-not-exist' >המשחק אינו קיים. אנא נסה שנית</div>}   
            </div>
        );
    }
}