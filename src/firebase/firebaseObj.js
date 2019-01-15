import firebase from './Def';
import Variables from '../SetGame/Variables';
import setFunctions from '../SetGame/setFunctions';
import {timeStartGame,timeNewCards,timeClickOnChooseSet,timeChooseSet,_timeOut} from '../Components/Sections/Board';
import GeneralFunctions from "../SetGame/GeneralFunctions";
import GameData from '../data/GameData'

const firebaseObj={
    _db:null,
    _auth:null,
    _timeOut:null,

    createDataBase(){
        this._db=firebase.database();
    },
    createAuth(){
        this._auth=firebase.auth();
    },
 
    settingValueInDataBase(path,value){
        this._db.ref(path).set(value)
    },

    pushToFirebase(path,value){
        console.log("db",this._db,"path",path,"value",value)
        this._db.ref(path).push(value).then(()=>{
            console.log("then push");
        }).catch((err)=>{
            console.log("error",err)
        });
        console.log("after push syntax")
    },
    
    async updatingValueInDataBase(path,value){
        console.log("in update function");
        let x=0;
        let p = await this._db.ref(path).update(value).then(()=>{
            console.log("then update");
            x=1;
        }).catch((err)=>{
            x=2;
            console.log("error",err)
        });
        console.log("X",x,"p",p);
        return x;
    },
    removeDataFromDB(path){
        let ref=this._db.ref(path);
        ref.remove();
    },
    
    listenerOnFirebase(cb,path){
        let ref=this._db.ref(path);
        ref.on('value',snap=>{
            if(typeof cb ==='function') cb(snap.val());
        })
    },

    readingDataOnFirebaseCB(cb,path){
        let ref=this._db.ref(path);
        ref.once('value',snap=>{
            if(typeof cb ==='function') cb(snap.val());
        })
    },

    authState(cb){
        firebaseObj._auth.onAuthStateChanged(fbUser=>{
            if(typeof cb ==='function') cb(fbUser);
          });
    },

    async readingDataOnFirebaseAsync(path){
        let data;
        let ref=this._db.ref(path);
        await ref.once('value',async (snap)=>{
            data=snap.val();
        })
        return await data;
    },

    updatingGameIdInFB(){
        Variables.set_date(GeneralFunctions.timeAndDate('date'));

        firebaseObj._db.ref(`Players/${Variables.userId}/games/${Variables._date}`).once('value').then(snap=>{
            let leng=snap.val()?Object.keys(snap.val()).length:0;
            Variables.setDay_numberedGame(leng+1);
            firebaseObj.updatingValueInDataBase(`Players/${Variables.userId}/games/${Variables._date}`,
                {[leng+1]:{startGameTime:Variables.creationGameTime,gameCode:Variables.gameCode}});
        });
    },

    pushCorrectOrWrongSetToDB(isSet){
        firebaseObj.pushToFirebase(`Players/${Variables.userId}/${isSet.bool?'CorrectSets':'WrongSets'}/${GeneralFunctions.timeAndDate('date')}:${Variables.day_numberedGame}`,
        {...isSet.information,
        DisplaysNewCards_Till_ClickSet:((timeClickOnChooseSet-timeNewCards)/1000).toFixed(2),
        ClickSet_Till_ChooseSet: ((timeChooseSet-timeClickOnChooseSet)/1000).toFixed(2),
        StartGame_Till_ClickSet: ((timeClickOnChooseSet-timeStartGame)/1000).toFixed(2)});
    }
}

export default firebaseObj;