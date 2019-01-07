import React,{Component} from 'react';
import LoadingImg from '../../data/design/loading-img.gif';
import Variables from '../../SetGame/Variables.js';
import firebaseObj from '../../firebase/firebaseObj';
import GeneralFunctions from '../../SetGame/GeneralFunctions';


export default class ExistGame extends Component{
    constructor(props){
        super(props);
        this.state={
            gameCode:'',
            invalidGameCode:false,
            participants:[],
            loadLocatePartic:false,
            gameObj:{}
        }
    }

    onClickExistGameCodeButton=()=>{
        if(Object.keys(this.state.gameObj).length){
            let gameObj=this.state.gameObj;
            firebaseObj.updatingValueInDataBase(`Games/${this.state.gameCode}/Game_Participants`,
                {[Variables.userId]:{Name:Variables.playerName,isConnected:true}});

            Variables.setstartGameTime(gameObj.creationTime)
            Variables.setGameCode(this.state.gameCode);
            Variables.setGameObj({currentCards:gameObj.currentCards,usedCards:gameObj.usedCards});
            Variables.setObjConstParameters(gameObj.constParameters?gameObj.constParameters:{})
            this.props.moveThroughPages("boa");
        }
        else
            this.setState({invalidGameCode:true});
    }

    inputChange=(event)=>{
        let inputValue=event.target.value;

        if(inputValue.length<=3){
            this.setState({gameCode:inputValue,invalidGameCode:false,participants:[]});
            
            if(inputValue.length===3){
                this.setState({loadLocatePartic:true});
                firebaseObj.readingDataOnFirebaseCB(
                    (gameObj)=>{
                        let arrPartic=[];
                        if(gameObj)
                            gameObj.Game_Participants&&Object.values(gameObj.Game_Participants).map(value=>arrPartic.push(value.Name));
                        
                        this.setState({gameObj:gameObj?gameObj:{},participants:arrPartic,loadLocatePartic:false})
                }
                ,`Games/${inputValue}`);
            }
        }
    }

    render(){
        return(
            <div >
                {this.state.loadLocatePartic?
                    <img src={LoadingImg} alt='loading'/>:
                    <ParticipantsList participants={this.state.participants} />
                }
                <input
                id="input"
                name='gameCode' 
                type='number'
                max="3"
                placeholder="הכנס קוד משחק"
                value={this.state.gameCode}
                onChange={this.inputChange}/>

                <button onClick={this.onClickExistGameCodeButton} id='continue' >המשך</button> 

                {this.state.invalidGameCode&& <div id='game-not-exist' >המשחק אינו קיים. אנא נסה שנית</div>}   
            </div>
        );
    }
}


const ParticipantsList=(props)=>(
    <p>
        {GeneralFunctions.string_From_List(props.participants,'',` ${props.participants.length===1?`משתתף`:`משתתפים`} במשחק כרגע `)}
    </p>
);