import React from 'react';
import './error-mes.css';
import SadFace from '../../../data/design/anxiety.png'

const ErrorMes = (props) => (
    <div id='error-mes' 
    className='page container d-flex flex-column align-items-center justify-content-center'>
        <h1 className='m-0'>אופס...</h1>
        <h1 className='mt-0'>נראה שהתרחשה שגיאה</h1>
        <img src={SadFace} />
        <h1>אנא רענן את הדף</h1>
    </div>
);

export default ErrorMes;