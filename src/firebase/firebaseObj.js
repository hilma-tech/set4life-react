import firebase from './Def';

const firebaseObj={
    fb_db:null,
    fb_auth:null,

    createDataBase(){
        this.fb_db=firebase.database();
    },
    createAuth(){
        this.fb_auth=firebase.auth();
    },
 
    settingValueInDataBase(path,value){
        this.fb_db.ref(path).set(value)
    },

    pushToFirebase(path,value){
        this.fb_db.ref(path).push(value);
    },
    
    updatingValueInDataBase(path,value){
        this.fb_db.ref(path).update(value);
    },
    removeDataFromDB(path){
        let ref=this.fb_db.ref(path);
        ref.remove();
    },
    
    listenerOnFirebase(cb,path){
        let ref=this.fb_db.ref(path);
        ref.on('value',snap=>{
            if(typeof cb ==='function') cb(snap.val());
        })
    },

    readingDataOnFirebaseCB(cb,path){
        let ref=this.fb_db.ref(path);
        ref.once('value',snap=>{
            if(typeof cb ==='function') cb(snap.val());
        })
    },

    async readingDataOnFirebaseAsync(path){
        let data;
        let ref=this.fb_db.ref(path);
        await ref.once('value',async (snap)=>{
            data=snap.val();
        })
        return await data;
    }
}

export default firebaseObj;