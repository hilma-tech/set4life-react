
const Variables={
    objConstParameters: {},
    gameObj:{},
    gameCode:'',
    userId:'',
    playerName:'',

    setObjConstParameters(objConstParameters) {
        this.objConstParameters = objConstParameters;
        console.log('objConstParameters',objConstParameters)
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
    }
}
   

export default Variables;