import React, { Component } from 'react';
import Card from './Card';
import './Board.css';
import firebaseObj from './firebase/firebaseObj';




export default class Board extends Component{
    constructor(props){
        super(props)
        this.state={
            currentCards:["1101","1020","1010","1000","0011","0001","0000","0010","2101","2001","1201","1022"],
            selectedCards:[],
            isSet:undefined,
            stageOfTheGame: 0 
            /*
            stageOfTheGame values:
            0 - only "set" button clickable, waiting for button to be clicked
            1 - cards availible to be chosen, stage for 10 seconds after button is clicked
            2 - set button is on "next", displaying 3 chosen cards
             */
        }
        firebaseObj.createDataBase();

        this.selectCardFunction=this.selectCardFunction.bind(this);
        this.isSetBoolFunction=this.isSetBoolFunction.bind(this);
        this.clickButtonEvent=this.clickButtonEvent.bind(this);
        this.ifNoSelect=this.ifNoSelect.bind(this);
    }

    componentDidMount(){
        firebaseObj.setingValueInDataBase("Games/000000/cardsOnBoards",this.state.currentCards);
    }

    componentWillMount(){   
        firebaseObj.setingValueInDataBase("Games/000000/cardsChosen",[]);
        firebaseObj.setingValueInDataBase("Games/000000/playerActive",false)
    }

    selectCardFunction(id){
        let selectedCards=this.state.selectedCards;
        if(selectedCards.length<3 && !selectedCards.includes(id)){
            selectedCards.push(id);
        }else{
            selectedCards=selectedCards.filter(value=>value!==id)
        }

        this.setState({selectedCards:selectedCards});

        firebaseObj.setingValueInDataBase("Games/000000/cardsChosen",selectedCards);
        
        if(selectedCards.length===3){
            this.setState({isSet:this.isSetBoolFunction(),  stageOfTheGame: 2 });
        }
    }

    isSetBoolFunction()
    {
        let selectedCards=this.state.selectedCards;

        let colorSim = selectedCards[0].charAt(0)===selectedCards[1].charAt(0) && selectedCards[0].charAt(0)===selectedCards[2].charAt(0);
        let colorDiff = selectedCards[0].charAt(0)!==selectedCards[1].charAt(0) && selectedCards[0].charAt(0)!==selectedCards[2].charAt(0) && selectedCards[1].charAt(0)!==selectedCards[2].charAt(0);

        let shapeSim = selectedCards[0].charAt(1)===selectedCards[1].charAt(1) && selectedCards[0].charAt(1)===selectedCards[2].charAt(1);
        let shapeDiff = selectedCards[0].charAt(1)!==selectedCards[1].charAt(1) && selectedCards[0].charAt(1)!==selectedCards[2].charAt(1) && selectedCards[1].charAt(1)!==selectedCards[2].charAt(1);
        
        let shadingSim = selectedCards[0].charAt(2)===selectedCards[1].charAt(2) && selectedCards[0].charAt(2)===selectedCards[2].charAt(2);
        let shadingDiff = selectedCards[0].charAt(2)!==selectedCards[1].charAt(2) && selectedCards[0].charAt(2)!==selectedCards[2].charAt(2) && selectedCards[1].charAt(2)!==selectedCards[2].charAt(2);

        let numberSim = selectedCards[0].charAt(3)===selectedCards[1].charAt(3) && selectedCards[0].charAt(3)===selectedCards[2].charAt(3);
        let numberDiff = selectedCards[0].charAt(3)!==selectedCards[1].charAt(3) && selectedCards[0].charAt(3)!==selectedCards[2].charAt(3) && selectedCards[1].charAt(3)!==selectedCards[2].charAt(3);
               
        return (colorSim||colorDiff) && (shapeSim || shapeDiff) && (shadingSim||shadingDiff) && (numberSim||numberDiff);
    }

    ifNoSelect(){
       /*setTimeout(()=>{
             if(this.state.selectedCards.length<3){
                 this.setState({stageOfTheGame:0, playerActive:false, selectedCards:[]});
             }
         }, 5000);*/
    }
    

    clickButtonEvent(e){
        //this.setState({stageOfTheGame: (this.state.stageOfTheGame+1)%2});
        this.ifNoSelect();

        if(this.state.stageOfTheGame===0)
        {
            this.setState({stageOfTheGame: 1});
            firebaseObj.setingValueInDataBase("Games/000000/playerActive",true);
        }

        

        if(this.state.stageOfTheGame===2){
            this.setState({stageOfTheGame:0, selectedCards:[], isSet:undefined});

            firebaseObj.setingValueInDataBase("Games/000000/cardsChosen",[]);
            firebaseObj.setingValueInDataBase("Games/000000/playerActive",false);
        }

    }   

    checkIfArrContains(arr,value){
        for(let i=0;i<arr.length;i++){
            if(arr[i]===value){
                return true;
            }
        }
        return false;
    }
    
    render(){
        return (
            <div className="board" >
                {this.state.currentCards.map((cardCode, i)=>
                    <Card 
                    key={i} 
                    onclick={this.selectCardFunction} 
                    cardCode={cardCode}
                    selectedCards={this.state.selectedCards}
                    isSet={this.state.isSet}
                    stageOfTheGame={this.state.stageOfTheGame}
                    isSelected={this.checkIfArrContains(this.state.selectedCards,cardCode)}
                    />
                    )
                }

                
                <button onClick={this.clickButtonEvent} id="button" 
                disabled={this.state.stageOfTheGame===1}>
                {this.state.stageOfTheGame===0?"בחר סט":
                    this.state.stageOfTheGame===1?"סט בבחירה":"הבא"            
                    }
                </button>
            </div>
        );
    }
}