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
            loadingParticipants:false,
            participants:[],
            loadLocatePartic:false
        }
    }

    findingGameCode=(db_gameObj)=>{
        if(db_gameObj===null)
            this.setState({invalidGameCode:true,loadingParticipants:false});  
        else{
            firebaseObj.removeDataFromDB(`Games/${this.state.gameCode}/selectedCards`);
            firebaseObj.removeDataFromDB(`Games/${this.state.gameCode}/currentPlayerID`);
            firebaseObj.updatingValueInDataBase(`Games/${this.state.gameCode}/Game_Participants`,{[Variables.userId]:{[Variables.playerName]:true}})

            Variables.setstartGameTime(db_gameObj.creationTime)
            Variables.setGameCode(this.state.gameCode);
            Variables.setGameObj({cardsOnBoard:db_gameObj.cardsOnBoard,usedCards:db_gameObj.usedCards});
            Variables.setObjConstParameters(db_gameObj.constParameters?db_gameObj.constParameters:{})
            this.props.moveThroughPages("boa");
        }  
    }

    onClickExistGameCodeButton=()=>{
        if(this.state.gameCode!==''){
            this.setState({loadingParticipants:true})
            firebaseObj.readingDataOnFirebaseCB(this.findingGameCode, `Games/${this.state.gameCode}`);
        }
    }

    inputChange=(event)=>{
        let str=event.target.value;

        if(str.length<=3){
            this.setState({gameCode:str.toString(),invalidGameCode:false,participants:[]});
            
            if(str.length===3){
                this.setState({loadLocatePartic:true});
                firebaseObj.readingDataOnFirebaseCB(
                    (partic)=>{
                        let arrPartic=[];
                        partic&&Object.values(partic).map(value=>arrPartic.push(value.name));

                    this.setState({participants:arrPartic,loadLocatePartic:false})
                }
                ,`Games/${str}/Game_Participants`);
            }
        }
    }

    render(){
        return(
            <div >
                {this.state.loadLocatePartic?
                    <img src={LoadingImg} alt='loading'/>:
                    <p>{
                        (()=>{
                            let participantsList='';
                            let partic=this.state.participants;
                            partic.map((val,i)=>{
                                participantsList+=((i===partic.length-1&&partic.length!==1)?' ו':(partic.length<=2)?"":" ,")+val
                            });
                            participantsList+=`${partic.length===1?`משתתף`:`משתתפים`} במשחק כרגע `
                            return participantsList;
                            })()
                        }
                    </p>
                }
                <input
                id="input"
                name='gameCode' 
                type='text'
                placeholder="הכנס קוד משחק"
                value={this.state.gameCode}
                onChange={this.inputChange}/>

                {this.state.loadingParticipants?
                <img src={LoadingImg} alt='loading' />:
                <button onClick={this.onClickExistGameCodeButton} id='continue' >המשך</button>}  

                {this.state.invalidGameCode&& <div id='game-not-exist' >המשחק אינו קיים. אנא נסה שנית</div>}   
            </div>
        );
    }
}