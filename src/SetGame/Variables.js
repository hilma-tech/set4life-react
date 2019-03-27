import setFunctions from '../SetGame/setFunctions';

const Variables={
    objConstParameters: {},
    gameCode:'',
    userId:'',
    playerName:'',
    _timer:15,
    creationGameTime:'',
    _date:'',
    day_numberedGame:0,
    profilePic:null,
    ParticipantsPics_url:[],

    setUserId(userId) {
        this.userId = userId; 
    },
    setPlayerName(name){
        this.playerName=name;
    }
}

export default Variables;