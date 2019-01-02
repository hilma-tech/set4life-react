import React, {Component} from 'react';
import Variables from '../../SetGame/Variables.js';
import firebaseObj from '../../firebase/firebaseObj';
import GameData from '../../data/GameData.json';
import LoadingImg from '../../data/design/loading-img.gif';

export default class LoginPage extends Component{
    constructor(props){
        super(props);
        this.state={
            loginInfo:{
                loginEmail:'',
                loginPsw:''
            },
            loginStateInfo:'',
            _loadingImg:false
        };
    }
    
    inputChange=(event)=>{
        let loginInfo=this.state.loginInfo;
        loginInfo[event.target.name]=event.target.value;
        this.setState({loginInfo:loginInfo});
    }

    clickLoginButtonEvent=()=>{
        this.setState({_loadingImg:true});
        let loginInfo=this.state.loginInfo;
        let emptyFilesArr=[];

        Object.values(loginInfo).map((val,i)=>
            (!val)&&emptyFilesArr.push(GameData.registration[2+i]));
        
        if(!emptyFilesArr.length)
            firebaseObj._auth.signInWithEmailAndPassword(loginInfo.loginEmail,loginInfo.loginPsw)
            .then(fbUser=>{
                firebaseObj._db.ref(`PlayersInfo/${fbUser.user.uid}/Name`).once('value',snap=>{
                    Variables.setPlayerName(snap.val());
                    Variables.setUserId(fbUser.user.uid);
                    this.props.moveThroughPages("sel")
                });
            },error=>this.setState({loginStateInfo:error.message,_loadingImg:false}));
        else{
            let loginStateInfo='שכחת למלא את השדות';

            emptyFilesArr.map((val,i)=>{
                loginStateInfo+=(!i?': ':
                    (i===emptyFilesArr.length-1?' ו':" ,"))+val
            });
            this.setState({loginStateInfo:loginStateInfo,_loadingImg:false});
        }
    }

    render(){
        return(
            <div id='login-page' className='page' >
                
                <label>אימייל</label>
                <input 
                name='loginEmail'
                type='text'
                placeholder="אנא הכנס את האימייל שלך"
                value={this.state.loginEmail}
                onChange={this.inputChange}>
                </input>

                <label>סיסמא</label>
                <input
                name='loginPsw' 
                type='password'
                placeholder="אנא הכנס את הססמא שלך"
                value={this.state.loginPsw}
                onChange={this.inputChange}>
                </input>

                <button onClick={this.clickLoginButtonEvent} >המשך</button>
                {this.state._loadingImg&&<img src={LoadingImg} alt='loading'/>}
                <label>{this.state.loginStateInfo}</label>
            </div>
        );
    }
}
