import React,{Component} from 'react';
import './GameType.css';
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

    checkboxsChange=(e)=>{
        let checkboxsInfo=this.state.checkboxsInfo;

        if(!checkboxsInfo[`${e.target.name}Bool`]){
            let dropDownInfo=this.state.dropDownInfo;
            let name=e.target.name.charAt(0).toUpperCase() + e.target.name.slice(1);
            delete dropDownInfo[name];

             checkboxsInfo[`${e.target.name}Bool`]=true;
            this.setState({dropDownInfo:dropDownInfo});
        }
        else{
            if(setFunctions.checkOfValidChecks(checkboxsInfo)>=3)
                checkboxsInfo[`${e.target.name}Bool`]=!checkboxsInfo[`${e.target.name}Bool`];       
        }
        this.setState({checkboxsInfo:checkboxsInfo});    
    }

    settingSpecificParameterForm=(categoryStr)=>{
        categoryStr=categoryStr+'Bool';

        if(!this.state.checkboxsInfo[categoryStr]){
            let arrOptionsHe=[];
            let arrOptionsEn=[];
            categoryStr =categoryStr.replace('Bool', '');
            let categoryStrUpperCase=categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1);

            if(categoryStr==='Number'){
                arrOptionsHe=['1','2','3'];
                arrOptionsEn=['1','2','3'];
            }
            else{
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
        this.props.settingNewGame(this.state.dropDownInfo);
    }

    render(){
        console.log('state',this.state)
        return(
            
            <div id='new-game'>
                    {this.param.map(par=>{
                return(<div>
                    <input type="checkbox" name={par[0]}  checked={this.state.checkboxsInfo[par[0]+'Bool']} onChange={this.checkboxsChange} key={par[0]}/>{par[1]}<br></br>
                    {this.settingSpecificParameterForm(par[0])}
                </div>);
            })}

            <button onClick={this.onClickSendingConstParameters} >התחל משחק חדש</button>
            </div>
        );
    }
} 