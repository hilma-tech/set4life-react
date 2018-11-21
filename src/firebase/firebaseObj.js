import firebase from './Def';

const firebaseObj={
    fb_db:null,

    createDataBase(){
        this.fb_db=firebase.database();
        //console.log("db: ", this.fb_db );
    },

    showWhatInDataBase(){
        console.log("show: ", this.fb_db.ref());
    },

    setingValueInDataBase(path,value){
        this.fb_db.ref(path).set(value);
    },
    updatingValueInDataBase(path,value){
        this.fb_db.ref(path).update(value);
    },

    returnRef(path){
        return this.fb_db.ref(path);
    },
    
    listenerOnFirebase(cb,path){
        let ref=this.returnRef(path);
        ref.on('value',snap=>{
            if(typeof cb ==='function') cb(snap.val());
        })
    },

    pushToFirebase(path,value){
        this.fb_db.ref(path).push(value);
    },

    readingDataOnFireBase(cb,path){
        let ref=this.returnRef(path);
        ref.once('value',snap=>{
            if(typeof cb ==='function') cb(snap.val());
        })
    },

    checkIfValueExistInDB(gameCodeObj){
        if(gameCodeObj){
            console.log('exist')
            return true;}
            console.log('not')

        return false
    },

    removeDataFromDB(path){
        let ref=this.returnRef(path);
        ref.remove();
    }
}

export default firebaseObj;