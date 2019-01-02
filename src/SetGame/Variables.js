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

    checkDay_numberedGame(){
        if(this._date!==setFunctions.timeAndDate("date")){
            this.set_date(setFunctions.timeAndDate('date'));
            this.setDay_numberedGame(0);
        }
    },
    
    setDay_numberedGame(num){
    this.day_numberedGame=
        (this._date===setFunctions.timeAndDate("date"))?num:0;
    },
    set_date(date){
        this._date=date;
    },
    setstartGameTime(time){
        this.startGameTime=time;
    },
    setObjConstParameters(objConstParameters) {
        this.objConstParameters = objConstParameters;
        console.log('objConstParameters var',objConstParameters)
    },
    setGameObj(gameObj) {
        this.gameObj = gameObj;
    },
    setGameCode(gameCode) {
        this.gameCode =gameCode;
        console.log("game code set")
    },
    setUserId(userId) {
        this.userId = userId; 
    },
    setPlayerName(name){
        this.playerName=name;
        console.log('set player name in var')
    },
    set_timer(time){
        this._timer=time;
        console.log('timer',time)
    }

    
}
   

export default Variables;