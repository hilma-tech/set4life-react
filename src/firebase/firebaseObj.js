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
    }
}

export default firebaseObj;