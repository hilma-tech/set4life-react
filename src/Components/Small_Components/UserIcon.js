import React from 'react';
import defaultImg from '../../data/design/userIconDef.png';

const UserIcon=(props)=>(
    <div className="UserIcon">
        <img src={defaultImg} width="50" className="UserIcon"/><br></br>
        <label className="UserIcon">{props.name}</label>
    </div>
);


export default UserIcon;