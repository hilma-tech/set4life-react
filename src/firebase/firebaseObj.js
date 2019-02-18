import firebase from './Def';
import Variables from '../SetGame/Variables';
import {timeStartGame,timeNewCards,timeClickOnChooseSet,timeChooseSet,_timeOut} from '../Components/Sections/Board/Board';
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
        this._db.ref(path).push(value)
    },
    
    updatingValueInDataBase(path,value){
        this._db.ref(path).update(value);
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
            if(snap.val()!==null){
            if(typeof cb ==='function') cb(snap.val());
            }else{
                if(typeof cb ==='function') cb({});
            }
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