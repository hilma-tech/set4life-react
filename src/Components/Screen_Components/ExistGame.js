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
            loadLocatePartic:null,
            gameObj:{}
        }
        window.history.pushState('exist','','existGame');
    }

    onClickExistGameCodeButton=()=>{
        if(Object.keys(this.state.gameObj).length){
            let gameObj=this.state.gameObj;
            firebaseObj.updatingValueInDataBase(`Games/${this.state.gameCode}/Game_Participants`,
                {[Variables.userId]:{Name:Variables.playerName,isConnected:true}});

            Variables.setCreationGameTime(gameObj.creationTime)
            Variables.setGameCode(this.state.gameCode);
            Variables.setObjConstParameters(gameObj.constParameters);
            this.props.moveThroughPages("boa",gameObj);
        }
        else
            this.setState({invalidGameCode:true});
    }

    inputChange=(event)=>{
        let inputValue=event.target.value;

        if(inputValue.length<=3){
            this.setState({gameCode:inputValue,invalidGameCode:false,participants:[],loadLocatePartic:null});
            
            if(inputValue.length===3){
                this.setState({loadLocatePartic:true});
                firebaseObj.readingDataOnFirebaseCB(
                    (gameObj)=>{
                        let ArrParticipants=gameObj&&gameObj.Game_Participants?
                            Object.entries(gameObj.Game_Participants).map(val=>{
                                if(val[1].isConnected)
                                    return val[1].Name;
                            }):[]
                        ArrParticipants=ArrParticipants.filter(val=>val!==undefined);
                        this.setState({gameObj:gameObj?gameObj:{},participants:ArrParticipants,loadLocatePartic:false})
                    }
                    ,`Games/${inputValue}`);
            }
        }
    }

    render(){
        return(
            <div >
                {this.state.loadLocatePartic?
                    <img src={LoadingImg} alt='loading' className="LoadingImg"/>:
                    this.state.loadLocatePartic!==null&&
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
        {props.participants.length?
        GeneralFunctions.string_From_List(props.participants,'',` ${props.participants.length===1?`משתתף`:`משתתפים`} במשחק כרגע `):
        'המשחק אינו קיים'}
    </p>
);