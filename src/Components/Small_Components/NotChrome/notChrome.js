import React, { Component } from 'react';
import warning from '../../../data/design/warning.png';
import ChromePopUp from '../../../data/design/Chrome_Pop-Up.png';

import './NotChrome.css'


class NotChrome extends Component{
    render(){
        console.log("not chrome")
        return(
            <div>
                <img id="ChromePopUp" src={ChromePopUp} alt='Chrome'/>
            </div>
        );
    }
}

export default NotChrome;
