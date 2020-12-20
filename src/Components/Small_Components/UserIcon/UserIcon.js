import React from 'react';
import './user-icon.css';
import ReactTooltip from 'react-tooltip';
import Variables from '../../../SetGame/Variables';


let takesFirstWordInSentence = (sentence) => {
    return sentence.substring(0, sentence.indexOf(" ") !== -1 ? sentence.indexOf(" ") : sentence.length);
}

const UserIcon = (props) =>(
    <div id={props.currentPlayer ? 'currentPlayer' : ''} className={'user-icon ' + props._direction} >
        <img className='rounded' src={props.src} width="50" height="50" data-tip={props.name} />
        <label className='mb-0' >
            {props._direction === 'bottom' ? takesFirstWordInSentence(props.name) : props.name}</label>
        {props._direction === 'bottom' &&
            <ReactTooltip className='_tooltip' place="bottom" type="dark" effect="solid" />}
            {Variables._scoreBoard && props.numOfSets && props.numOfSets.length > 0 ?  <div style={{fontSize:"90%"}}>{`${props.numOfSets.length}`}</div>:null}
    </div>
);

export default UserIcon;