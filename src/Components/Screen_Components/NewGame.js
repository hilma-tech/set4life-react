import React,{Component} from 'react';
import setFunctions from '../../SetGame/setFunctions';
import ParametersInfo from '../../ParametersInfo.json';
import firebaseObj from '../../firebase/firebaseObj';
import Variables from '../../SetGame/Variables.js'

export default class NewGame extends Component{
    constructor(props){
        super(props);
        this.param=[['color','צבע'],['shade','מרקם'],['number','מספר'],['shape','צורה']];
        this.state={
            checkboxsInfo:{colorBool:true,shapeBool:true,shadeBool:true,numberBool:true},
            dropDownInfo:{},
            messageErr:false
        }
    }

    settingNewGame=(constParameters)=>{
       
        let newGameCode;
        let newCurrentCards;
        do{
            newGameCode= setFunctions.newRandomGameCode(Math.floor(Math.random()*1000000),6);
        }while(firebaseObj.readingDataOnFireBase(firebaseObj.checkIfValueExistInDB,`Games/${newGameCode}`));
         //WHILE LOOP NOT WORKING AT ALL!

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
            let name=event.target.name.charAt(0).toUpperCase() + event.target.name.slice(1);
            delete dropDownInfo[name];

            checkboxsInfo[`${event.target.name}Bool`]=true;
            this.setState({dropDownInfo:dropDownInfo});
        }
        else{
            if(setFunctions.checkOfValidChecks(checkboxsInfo)>=3)
                checkboxsInfo[`${event.target.name}Bool`]=!checkboxsInfo[`${event.target.name}Bool`];       
        }
        this.setState({checkboxsInfo:checkboxsInfo});    
    }

    settingSpecificParameterForm=(categoryStr)=>{
        if(!this.state.checkboxsInfo[categoryStr+'Bool']){

            let arrOptionsHe=ParametersInfo.cardsParameters[categoryStr][categoryStr+'He']

            let arrOptionsEn=ParametersInfo.cardsParameters[categoryStr][categoryStr+'En']

            return (
                <select className={categoryStr} onChange={this.settingConstParameters}>
                    <option disabled="disabled" selected="selected">בחר</option>
                    {     
                        arrOptionsHe.map((option,i)=>
                        <option code={i}  key={arrOptionsEn[i]} >{option}</option>)
                    }
                </select>
            );  
        }
    }

    settingConstParameters=(event)=>{
        let dropDownInfo=this.state.dropDownInfo;
        dropDownInfo[event.target.className]=event.target.options[event.target.selectedIndex].getAttribute('code')
        this.setState({dropDownInfo:dropDownInfo});
    }
   
    onClickSendingConstParameters=()=>{
        setFunctions.setObjConstParameters(this.state.dropDownInfo);
        this.settingNewGame(this.state.dropDownInfo);
        this.props.moveThroughPages();
    }

    render(){
        console.log(this.state.dropDownInfo);
        return(
            
            <div id='new-game'>
                {this.param.map(par=>{
                    return(<div>
                        <input type="checkbox" name={par[0]}  checked={this.state.checkboxsInfo[par[0]+'Bool']} onChange={this.checkboxsChange} key={par[0]}/><span>{par[1]}</span>
                        {this.settingSpecificParameterForm(par[0])}
                    </div>);
                    })
                }

            <button onClick={this.onClickSendingConstParameters} >התחל משחק חדש</button>
            </div>
        );
    }
} 