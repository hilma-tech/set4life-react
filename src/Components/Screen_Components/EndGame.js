import React,{Component} from 'react';
import firebaseObj from "../../firebase/firebaseObj"
import Variables from "../../SetGame/Variables"
class EndGame extends Component{
    constructor(props){
        super(props);
        this.state={
            avgTime:null,
            numCorrectSet:0,
            numWrongSet:0
        }
    }
    getcorrectSetLenght=()=>{
        firebaseObj.readingDataOnFirebaseCB(
            (correctSetsdb)=>{
                let avgTime=0,numCorrectSets=0;;
                Object.values(correctSetsdb).forEach((val)=> {
                    avgTime+=(parseFloat(val.DisplaysNewCards_Till_ClickSet)+parseFloat(val.ClickSet_Till_ChooseSet));
                    numCorrectSets++;
                })
                
                this.setState({avgTime:(avgTime/numCorrectSets),numCorrectSet:numCorrectSets})
            },
            `Players/${Variables.userId}/CorrectSets/${Variables._date}:${Variables.day_numberedGame}`
        )                
    }
    getWrongSets=()=>{
        firebaseObj.readingDataOnFirebaseCB(
            (wrongSetsdb)=>{
                if(wrongSetsdb!==null)
                {
                    let numWrongSets=0;
                    Object.keys(wrongSetsdb).forEach((val)=> {
                        numWrongSets++;
                    })
                    this.setState({numWrongSet:numWrongSets})
                }
            },
            `Players/${Variables.userId}/WrongSets/${Variables._date}:${Variables.day_numberedGame}`
        )            
    }

    render(){
        return(
            <div className="page" id="endGame">
                <h1>כל הכבוד</h1>
                <h2>ניצחת</h2>
                <p>מספר הסטים הנכונים שלך: {this.getcorrectSetLenght()}{this.state.numCorrectSet}</p>
                <p>מספר הסטים הלא נכונים שלך: {this.getWrongSets()}{this.state.numWrongSet}</p>
                <p>זמן ממוצע לבחירת סט: {this.state.avgTime}</p>
                
            </div>
        );
    }
}






export default EndGame;