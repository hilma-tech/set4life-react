import React from 'react';
import LoadingImg from '../../../data/design/loading-img.gif';
import './loading-page.css';


const LoadingPage=()=>(
    <div id='loading-page' style={{height:'100vh',width:'100vw'}}>
        <img src={LoadingImg} alt='loading'/>
    </div>
);


export default LoadingPage;