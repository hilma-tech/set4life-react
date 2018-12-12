import React,{Component} from 'react';
import NewGame from '../Screen_Components/NewGame';
import ExistGame from '../Screen_Components/ExistGame';

export default class GameType extends Component{
    constructor(props){
        super(props);
        this.state={
            GameTypeOptions:null
            //0-new game
            //1-exist game
        }
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
                    <label>אנא בחר את סוג המשחק הרצוי</label>
                    <button onClick={this.onClickGameTypeButton} id='exsitGame' className='game-type-buttons' >משחק קיים</button>
                    <button onClick={this.onClickGameTypeButton} id='newGame' className='game-type-buttons' >משחק חדש</button>
                </div>}

                {this.state.GameTypeOptions===1&&<ExistGame moveThroughPages={this.props.moveThroughPages} />}

                {this.state.GameTypeOptions===0&&<NewGame moveThroughPages={this.props.moveThroughPages} />}
            </div>
        );
    }
}
