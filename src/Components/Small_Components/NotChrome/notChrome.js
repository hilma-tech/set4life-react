import React, { Component } from 'react';
import ChromePopUp from '../../../data/design/Chrome_Pop-Up.png';

import './NotChrome.css'


class NotChrome extends Component{
    render(){
        return(
            <div>
                <img id="ChromePopUp" src={ChromePopUp} alt='Chrome'/>
            </div>
        );
    }
}

export default NotChrome;
