import firebase from './Def';

const firebaseObj={
    _db:null,
    _auth:null,

    createDataBase(){
        this._db=firebase.database();
    },
    createAuth(){
        this._auth=firebase.auth();
    },
 
    settingValueInDataBase(path,value){
        this._db.ref(path).set(value)
        console.log('setting value to firebase',value,path);
    },

    pushToFirebase(path,value){
        this._db.ref(path).push(value);
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

    readingDataOnFirebasePromise(path){
        let ref=this._db.ref(path);
        ref.once('value',snap=>snap.val());
    }  
}

export default firebaseObj;