import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBsWiCgq9LRIxlYshqwSu-ImhQlB5oqqbw",
    authDomain: "set4life-1e18e.firebaseapp.com",
    databaseURL: "https://set4life-1e18e.firebaseio.com",
    projectId: "set4life-1e18e",
    storageBucket: "set4life-1e18e.appspot.com",
    messagingSenderId: "507778967665"
  };
  
  export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app()[0];