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