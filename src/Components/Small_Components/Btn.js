import React from 'react';

const Btn=(props)=>(
    <button 
    style={`font-size:${props.fontSize};
        width:${props.width};
        height:${props.height};`}
    className='btn'
    onClick={props.onClick}>{props.text}</button>
);