import React, {Component} from 'react';
import Variables from '../../SetGame/Variables.js';
import firebaseObj from '../../firebase/firebaseObj';
import GameData from '../../data/GameData.json';


export default class LoginPage extends Component{
    constructor(props){
        super(props);
        this.state={
            loginInfo:{
                loginEmail:'',
                loginPsw:''
            },
            loginStateInfo:''
        };
        firebaseObj.createAuth();
    }
    componentDidMount(){
        firebaseObj.fb_auth.onAuthStateChanged(fbUser=>{
            if(fbUser)
                console.log('user',fbUser)
            else
                console.log("not logged in")
       });
    }

    inputChange=(event)=>{
        let loginInfo=this.state.loginInfo;
        loginInfo[event.target.name]=event.target.value;
        this.setState({loginInfo:loginInfo});
    }

    clickLoginButtonEvent=()=>{
        let loginInfo=this.state.loginInfo;
        let flag=true;

        Object.values(loginInfo).map(val=>{
            flag=flag&&val?true:false;
            if(!flag)return;
        })

        if(flag)
            firebaseObj.fb_auth.signInWithEmailAndPassword(loginInfo.loginEmail,loginInfo.loginPsw)
            .then(()=>this.props.moveThroughPages("sel"),error=>this.setState({loginStateInfo:error.message}));
        else{
            let loginStateInfo='שכחת למלא את השדות';

            Object.values(loginInfo).map((val,i)=>{
                if(!val)loginStateInfo+=(i!==0?' ,':': ')+GameData.registration[2+i];
            })
            this.setState({loginStateInfo:loginStateInfo})
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
                <label>{this.state.loginStateInfo}</label>
            </div>
        );
    }
}
