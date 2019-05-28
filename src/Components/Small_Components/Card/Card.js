import React, { Component } from 'react';
import wrongSetImg from '../../../data/design/wrongIcon.png';
import correctSetImg from '../../../data/design/correctIcon.png';
import './card.css'

function importAll(r) {
    let images = {};
    r.keys().map((card) => { images[card.replace('./', '')] = r(card); });
    return images;
}
const cardImages = importAll(require.context('../../../data/cards', false, /\.(png|jpe?g|svg)$/));


export default class Card extends Component {
    clickOnCard = () => {
        if (this.props.stageOfTheGame === 1) {
            this.props.onclick(this.props.cardCode);
        }
    }

    settingClassNameCard = () => {
        switch (this.props.isSet) {
            case true:
                return 'greenCard';
            case false:
                return 'redCard';
            case undefined:
                return 'greyCard';
        }
    }

    render() {
        let stageOfTheGame = this.props.stageOfTheGame;
        let classNameCard ='';

        if(stageOfTheGame === 0)
        classNameCard ='not-active ';
        if(stageOfTheGame === 1 || stageOfTheGame === 2)
        classNameCard = 'unselectedCard '
        if(stageOfTheGame === 3)
        classNameCard ='not-active another-player ';

        (this.props.isSelected) && (classNameCard += this.settingClassNameCard());
        
        return (
            <div className="_card-div">
                <img
                    onClick={this.props.stageOfTheGame === 1 ? this.clickOnCard : null}
                    className={'_card '+classNameCard}
                    src={cardImages[`${this.props.cardCode}.png`]}
                    alt="card" />

                {(this.props.isSelected && this.props.isSet !== undefined) &&
                    <img
                        className='right-or-wrong_setImg'
                        src={this.props.isSet ? correctSetImg : wrongSetImg}
                        alt={this.props.isSet ? "correctSet" : "wrongSet"} />
                }
            </div>
        );
    }
}