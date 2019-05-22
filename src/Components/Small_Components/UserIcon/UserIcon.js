import React from 'react';
import './user-icon.css';
import ReactTooltip from 'react-tooltip';
import UserIconImg from '../../../data/design/userIcon.png';

// identify 2 players with the same default photo 
// (props.src===UserIconImg?'defaultImg':'')

let takesFirstWordInSentence = (sentence) => {
    return sentence.substring(0, sentence.indexOf(" ") !== -1 ? sentence.indexOf(" ") : sentence.length);
}

const UserIcon = (props) => (
    <div id={props.currentPlayer ? 'currentPlayer' : ''} className={'user-icon ' + props._direction} >
        <img className='rounded' src={props.src} width="50" height="50" data-tip={props.name} />
        <label className='mb-0' >
            {props._direction === 'bottom' ? takesFirstWordInSentence(props.name) : props.name}</label>
        {props._direction === 'bottom' &&
            <ReactTooltip className='_tooltip' place="bottom" type="dark" effect="solid" />}
    </div>
);

export default UserIcon;