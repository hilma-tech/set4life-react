import React from 'react';
  
const UserIcon=(props)=>(
    <div>
        <img src={props.src} className="img-thumbnail" width="50" /><br></br>
        <label>{props.name}</label>
    </div>
);


export default UserIcon;