import React from 'react';
import defaultImg from '../../data/design/userIconDef.png';

const UserIcon=(props)=>(
    <div>
        <img src={defaultImg} width="50" /><br></br>
        <label>{props.name}</label>
    </div>
);


export default UserIcon;