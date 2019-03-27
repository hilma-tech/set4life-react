import React from 'react';
import './user-icon.css';


let label_style = {
    down: {
        display: 'block',

    },
    left: {
        display: 'inline-block',
        margin: '1vw',
        fontSize:'2rem',
        fontWeight:'bold'
    }
}

const UserIcon = (props) => (
    <div id='user-icon' >
        <img src={props.src} width="70" />
        <label style={label_style[props._direction]} >{props.name}</label>
    </div>
);


export default UserIcon;