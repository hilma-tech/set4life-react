import React,{Component} from 'react';
import setFunctions from '../SetGame/setFunctions';


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
            let arrOptionsHe=[];
            let arrOptionsEn=[];

            if(categoryStr==='number'){
                arrOptionsHe=['1','2','3'];
                arrOptionsEn=['1','2','3'];
            }
            else{
                let categoryStrUpperCase=categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1);
                for(let i=0;i<3;i++){
                    arrOptionsHe[i]=setFunctions[`get${categoryStrUpperCase}FromCode`](i.toString(),'he');
                    arrOptionsEn[i]=setFunctions[`get${categoryStrUpperCase}FromCode`](i.toString(),'en');
                }
            }
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
        setFunctions.setobjConstParameters(this.state.dropDownInfo);
        this.props.settingNewGame(this.state.dropDownInfo);
    }

    render(){
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