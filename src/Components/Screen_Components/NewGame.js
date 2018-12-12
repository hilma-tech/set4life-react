import React,{Component} from 'react';
import setFunctions from '../../SetGame/setFunctions';
import GameData from '../../data/GameData.json';
import firebaseObj from '../../firebase/firebaseObj';
import Variables from '../../SetGame/Variables.js'

export default class NewGame extends Component{
    constructor(props){
        super(props);
        this.state={
            checkboxsInfo:{colorBool:true,shapeBool:true,shadeBool:true,numberBool:true},
            dropDownInfo:{},
            messageErr:false
        }
        firebaseObj.createDataBase();
    }


    settingNewGame=async()=>{ 
        let newGameCode;

        do{
            newGameCode= setFunctions.newRandomGameCode(6);
        }while(await firebaseObj.readingDataOnFirebaseAsync(`Games/${newGameCode}`)!==null)

        await Variables.setGameCode(newGameCode);

        let newCurrentCards=setFunctions.newCurrentCards(Object.keys(this.state.dropDownInfo).length===2?9:12,[],[]);
        let gameObj={cardsOnBoard:newCurrentCards,usedCards:newCurrentCards, constParameters:this.state.dropDownInfo};
        
        Variables.setGameObj(gameObj);
        Variables.setObjConstParameters(this.state.dropDownInfo);
        firebaseObj.settingValueInDataBase(`Games/${Variables.gameCode}`,gameObj);

        this.props.moveThroughPages("boa");          
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
                <select name={categoryStr} onChange={this.settingConstParametersObj}>
                    <option disabled="disabled" selected="selected">בחר</option>
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
        return !(Object.keys(this.state.dropDownInfo).length+setFunctions.checkOfValidChecks(this.state.checkboxsInfo)===4);
    }

    render(){
        return(
            
            <div id='new-game'>
                {Object.keys(GameData.cardsParameters).map(par=>{
                    return(<div>
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

            <button 
            disabled={this.setDisableNewGameButton()}  
            onClick={this.settingNewGame} 
            >התחל משחק חדש
            </button>

            </div>
        );
    }
} 