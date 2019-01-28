import setFunctions from '../SetGame/setFunctions';

const Variables={
    objConstParameters: {},
    gameCode:'',
    userId:'',
    playerName:'',
    _timer:10,
    creationGameTime:'',
    _date:'',
    day_numberedGame:0,
    selPlaceHistory:null,

    set_selPlaceHistory(place){
        this.selPlaceHistory=place
    },

    setDay_numberedGame(num){
        this.day_numberedGame=num;
    },
    set_date(date){
        this._date=date;
    },
    setCreationGameTime(time){
        this.creationGameTime=time;
    },
    setObjConstParameters(objConstParameters) {
        this.objConstParameters = objConstParameters?objConstParameters:{};
    },
    setGameCode(gameCode) {
        this.gameCode =gameCode;
        console.log('set gamecode var',this.gameCode)
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