
const Variables={
    objConstParameters: {},
    gameObj:{},
    gameCode:'',
    userId:'',
    playerName:'',
    _timer:10,
    startGameTime:'',
    _date:'',

    set_date(date){
        this._date=date;
    },
    
    setstartGameTime(time){
        this.startGameTime=time;
    },

    setObjConstParameters(objConstParameters) {
        this.objConstParameters = objConstParameters;
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
        console.log('set palyer name in var')
    },
    set_timer(time){
        this._timer=time;
        console.log('timer',time)
    }
}
   

export default Variables;