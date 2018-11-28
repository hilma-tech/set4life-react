import React,{Component} from 'react';
import firebaseObj from '../../firebase/firebaseObj';
import setFunctions from '../../SetGame/setFunctions';
import NewGame from './NewGame';
import LoadingImg from '../../data/design/loading-img.gif';
import Variables from '../../SetGame/Variables.js'

export default class GameType extends Component{
    constructor(props){
        super(props);
        this.state={
            gameCode:'',
            GameTypeOptions:null
            //0-new game
            //1-exist game
        }
        firebaseObj.createDataBase();
    }

    onClickGameTypeButton=(event)=>{
        event.target.getAttribute('id')==='exsitGame'&&this.setState({GameTypeOptions:1});
        event.target.getAttribute('id')==='newGame'&&this.setState({GameTypeOptions:0});
    }

    render(){
        return(
            <div id='game-type' className='page' >
                {this.state.GameTypeOptions===null&&
                <div>
                    <button onClick={this.onClickGameTypeButton} id='exsitGame' className='game-type-buttons' >משחק קיים</button>
                    <button onClick={this.onClickGameTypeButton} id='newGame' className='game-type-buttons' >משחק חדש</button>
                </div>}

                {this.state.GameTypeOptions===1&&<ExistGame moveThroughPages={this.props.moveThroughPages} />}

                {this.state.GameTypeOptions===0&&<NewGame moveThroughPages={this.props.moveThroughPages} />}
            </div>
        );
    }
}









class ExistGame extends Component{
    constructor(props){
        super(props);
        this.state={
            gameCode:'',
            invalidGameCode:false,
            loadingImg:false
        }
    }

    findingGameCode=(gameObj)=>{
        if(gameObj===null)
            this.setState({invalidGameCode:true,loadingImg:false});  
        else{
            firebaseObj.removeDataFromDB(`Games/${this.state.gameCode}/selectedCards`);
            firebaseObj.removeDataFromDB(`Games/${this.state.gameCode}/currentPlayerID`);

            Variables.setGameCode(this.state.gameCode);
            Variables.setGameObj(gameObj);
            this.props.moveThroughPages();
        }  
    }

    onClickExistGameCodeButton=()=>{
        if(this.state.gameCode!==''){
            this.setState({loadingImg:true})
            firebaseObj.readingDataOnFireBase(this.findingGameCode, `Games/${this.state.gameCode}`);
        }
    }

    inputChange=(event)=>{
        this.setState({gameCode:event.target.value.toString(),invalidGameCode:false});
    }

    render(){
        return(
            <div >
                <input
                id="input"
                name='gameCode' 
                type='text'
                placeholder="הכנס קוד משחק"
                value={this.state.gameCode}
                onChange={this.inputChange}/>

                {this.state.loadingImg?
                <img src={LoadingImg} alt='loading' />:
                <button onClick={this.onClickExistGameCodeButton} id='continue' >המשך</button>}  

                {this.state.invalidGameCode&& <div id='game-not-exist' >המשחק אינו קיים. אנא נסה שנית</div>}   
            </div>
        );
    }
}