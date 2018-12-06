import React,{Component} from 'react';
import setFunctions from '../../SetGame/setFunctions';
import ParametersInfo from '../../data/ParametersInfo.json';
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

    settingNewGame=(constParameters)=>{ 
        let newGameCode;
        let newCurrentCards;
        // do{
        //     newGameCode= setFunctions.newRandomGameCode(6);
        // }while(firebaseObj.readingDataOnFireBase(firebaseObj.checkIfValueExistInDB,`Games/${newGameCode}`));
         //WHILE LOOP NOT WORKING AT ALL!

         newGameCode= setFunctions.newRandomGameCode(6);

        (Object.keys(constParameters).length===2)?
            newCurrentCards=setFunctions.newCurrentCards(9,[],[]) :
            newCurrentCards=setFunctions.newCurrentCards(12,[],[])
        
        let gameObj={cardsOnBoard:newCurrentCards,usedCards:newCurrentCards}

        firebaseObj.setingValueInDataBase(`Games/${newGameCode}`,gameObj);
        //put push to fire base most early as you can do it, to prevent collision
        Variables.setGameCode(newGameCode);
        Variables.setGameObj(gameObj)
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
            let arrOptionsHe=ParametersInfo.cardsParameters[categoryStr][categoryStr+'He'];

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
   
    onClickSendingConstParameters=()=>{
        Variables.setObjConstParameters(this.state.dropDownInfo);
        this.settingNewGame(this.state.dropDownInfo);
        this.props.moveThroughPages("boa");
    }

    setDisableNewGameButton=()=>{
        return !(Object.keys(this.state.dropDownInfo).length+setFunctions.checkOfValidChecks(this.state.checkboxsInfo)===4);
    }

    render(){
        console.log(this.state.dropDownInfo)
        return(
            
            <div id='new-game'>
                {Object.keys(ParametersInfo.cardsParameters).map(par=>{
                    return(<div>
                            <input 
                            type="checkbox" 
                            name={par}  
                            checked={this.state.checkboxsInfo[par+'Bool']} 
                            onChange={this.checkboxsChange} key={par}/>
                            <span>{ParametersInfo.cardsParameters[par].nameHe}</span>
                            
                            {this.settingSpecificParameterForm(par)}
                        </div>);
                    })
                }

            <button 
            disabled={this.setDisableNewGameButton()}  
            onClick={this.onClickSendingConstParameters} 
            >התחל משחק חדש
            </button>

            </div>
        );
    }
} 