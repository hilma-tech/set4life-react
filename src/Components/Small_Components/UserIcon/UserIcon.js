import React from 'react';
import './user-icon.css';
import ReactTooltip from 'react-tooltip';
import UserIconImg from '../../../data/design/userIcon.png';


const UserIcon = (props) => {
    console.log(props.src,UserIconImg,props.src===UserIconImg)
    return(
    <div className={'user-icon ' + props._direction} >
        <img className={(props.src===UserIconImg?'defaultImg':'')+' rounded'} src={props.src} width="50" height="50" data-tip={props.name} />
        {props._direction === 'left' ?
            <label>{props.name}</label> :
            <ReactTooltip className='_tooltip' place="bottom" type="dark" effect="solid" />
        }


    </div>
);}

export default UserIcon;