import setFunctions from '../SetGame/setFunctions';

const Variables={
    objConstParameters: {},
    gameObj:{},
    gameCode:'',
    userId:'',
    playerName:'',
    _timer:10,
    startGameTime:'',
    _date:'',
    day_numberedGame:null,

    setDay_numberedGame(num){
    this.day_numberedGame=num;
    },
    set_date(date){
        this._date=date;
    },
    setstartGameTime(time){
        this.startGameTime=time;
    },
    setObjConstParameters(objConstParameters) {
        this.objConstParameters = objConstParameters?objConstParameters:{};
    },
    setGameObj(gameObj) {
        this.gameObj = gameObj;
    },
    setGameCode(gameCode) {
        this.gameCode =gameCode;
    },
    setUserId(userId) {
        this.userId = userId; 
    },
    setPlayerName(name){
        this.playerName=name;
    },
    set_timer(time){
        this._timer=time;
    }
}
   
export default Variables;