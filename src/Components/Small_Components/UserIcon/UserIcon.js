import React from 'react';
import './user-icon.css';


let label_style = {
    down: {
        display: 'block',
    },
    left: {
        display: 'inline-block',
        marginBottom:'0'
    }
}

const UserIcon = (props) => (
    <div id='user-icon' className='d-flex flex-row align-items-center mr-1 col-lg-5 col-md-6' >
        <img className='rounded' src={props.src} width="50" height="50" />
        <label style={label_style[props._direction]} >{props.name}</label>
    </div>
);


export default UserIcon;