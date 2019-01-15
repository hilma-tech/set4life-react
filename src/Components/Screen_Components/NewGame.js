import React,{Component} from 'react';
import setFunctions from '../../SetGame/setFunctions';
import GameData from '../../data/GameData.json';
import firebaseObj from '../../firebase/firebaseObj';
import Variables from '../../SetGame/Variables.js';
import GeneralFunctions from '../../SetGame/GeneralFunctions';

export default class NewGame extends Component{
    constructor(props){
        super(props);
        this.state={
            checkboxsInfo:{colorBool:true,shapeBool:true,shadeBool:true,numberBool:true},
            dropDownInfo:{},
            messageErr:false,
            _timer:10
        }
        window.history.pushState('','','newGame');
    }

    settingNewGame=async()=>{ 
        let newGameCode;
        do{
            newGameCode= setFunctions.newRandomGameCode(3);
        }while(await firebaseObj.readingDataOnFirebaseAsync(`Games/${newGameCode}`)!==null)
        
        Variables.setGameCode(newGameCode);
        Variables.set_timer(this.state._timer)
        Variables.setObjConstParameters(this.state.dropDownInfo);

        let constParamLength=Object.keys(this.state.dropDownInfo).length;
        let newCurrentCards=setFunctions.newCurrentCards(constParamLength<=2&&(constParamLength===2?9:12),[],[]);
       
        let startGameTime=GeneralFunctions.timeAndDate('time');
        Variables.setCreationGameTime(startGameTime);
        
        let gameObj={creationTime:startGameTime,
            currentCards:newCurrentCards,
            usedCards:newCurrentCards,
            Game_Participants:{[Variables.userId]:{Name:Variables.playerName,isConnected:true}}};
        
        firebaseObj.settingValueInDataBase(`Games/${Variables.gameCode}`,{...gameObj,constParameters:Variables.objConstParameters});
        console.log("game obj update in db",{...gameObj,constParameters:Variables.objConstParameters})

        this.props.moveThroughPages("boa",gameObj);          
    }

    checkboxsChange=(event)=>{
        let checkboxsInfo=this.state.checkboxsInfo;

        if(!checkboxsInfo[`${event.target.name}Bool`]){
            let dropDownInfo=this.state.dropDownInfo;
            delete dropDownInfo[event.target.name];
            this.setState({dropDownInfo:dropDownInfo});

            checkboxsInfo[`${event.target.name}Bool`]=true;
        }
        else{
            if(setFunctions.checkOfValidChecks(checkboxsInfo)>=3)
                checkboxsInfo[`${event.target.name}Bool`]=false;       
        }
        this.setState({checkboxsInfo:checkboxsInfo});    
    }

    settingSpecificParameterForm=(categoryStr)=>{
        if(!this.state.checkboxsInfo[categoryStr+'Bool']){
            let arrOptionsHe=GameData.cardsParameters[categoryStr][categoryStr+'He'];

            return (
                <select  name={categoryStr} onChange={this.settingConstParametersObj}>
                    <option key="-1" disabled="disabled" selected="selected">בחר</option>
                    {     
                        arrOptionsHe.map((option,i)=>
                        <option code={i}  key={i} >{option}</option>)
                    }
                </select>
            );  
        }
    }

    settingConstParametersObj=(event)=>{
        let dropDownInfo=this.state.dropDownInfo;
        dropDownInfo[event.target.name]=event.target.options[event.target.selectedIndex].getAttribute('code')
        this.setState({dropDownInfo:dropDownInfo});
    }

    setDisableNewGameButton=()=>{
        return !(Object.keys(this.state.dropDownInfo).length+
            setFunctions.checkOfValidChecks(this.state.checkboxsInfo)===4)||parseInt(this.state._timer,10)<2||this.state._timer==='';
    }

    render(){
        return(
            <div id='new-game'>
                {Object.keys(GameData.cardsParameters).map((par,i)=>{
                    return(<div key={i} >
                            <input 
                            type="checkbox" 
                            name={par}  
                            checked={this.state.checkboxsInfo[par+'Bool']} 
                            onChange={this.checkboxsChange} key={par}/>
                            <span>{GameData.cardsParameters[par].nameHe}</span>
                            
                            {this.settingSpecificParameterForm(par)}
                        </div>);
                    })
                }

            <input 
            type="number" 
            id="timer" 
            min="2"
            value={this.state._timer}
            onChange={(event)=>this.setState({_timer:event.target.value})}/>

            <button 
            disabled={this.setDisableNewGameButton()}  
            onClick={this.settingNewGame} 
            >התחל משחק חדש
            </button>

            </div>
        );
    }
} 