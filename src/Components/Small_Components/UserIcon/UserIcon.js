import React from 'react';
import './user-icon.css';


const UserIcon = (props) =>{
    return (
    <div id='user-icon' className={'d-flex flex-row align-items-center mr-1 col-lg-5 col-md-6 '+props._direction} >
        <img className={'rounded '+props._direction} src={props.src} width="50" height="50" />
        <label className={props._direction} >{props.name}</label>
    </div>
);}


export default UserIcon;