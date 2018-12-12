
const Variables={
    objConstParameters: {},
    gameObj:{},
    gameCode:'',
    userId:'',

    setObjConstParameters(objConstParameters) {
        this.objConstParameters = objConstParameters;
        console.log('objConstParameters in var',objConstParameters)
    },
    setGameObj(gameObj) {
        this.gameObj = gameObj;
    },
    setGameCode(gameCode) {
        this.gameCode =gameCode;
    },
    setUserId(userId) {
        this.userId = userId;
    }
}

export default Variables;