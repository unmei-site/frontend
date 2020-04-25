import React from 'react';
import './Footer.sass';
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faVk, faTelegramPlane } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
    const secretChangeTheme = () => {
        const theme = localStorage.getItem('theme');
        if(theme == null) {
            localStorage.setItem('theme', 'light');
            document.body.setAttribute('theme', 'light')
        } else if(theme === 'light') {
            localStorage.setItem('theme', 'dark');
            document.body.setAttribute('theme', 'dark')
        } else if(theme === 'dark') {
            localStorage.setItem('theme', 'light');
            document.body.setAttribute('theme', 'light')
        }
        if(theme !== 'light') {
            console.log('Светлая тема находится в разработке! Не все может корректно отображаться.\nК тому же, эта кнопка секретная. Ты знал, на что шел ;)');
        }
    }

    return (
        <div className='Footer'>
            <footer className='Footer__Tabs'>
                <div className="Footer__Tab">
                    <div className="Footer__Tab_Title" onClick={secretChangeTheme}>Команда</div>
                    <Link to={'/user/1'} className={'Link'}>Nix13</Link>
                </div>
                <div className="Footer__Tab">
                    <div className="Footer__Tab_Title">Соцсети</div>

                    <div className="Links">
                        <a href="https://vk.com/unmei_site">
                            <div className="Link"><FontAwesomeIcon icon={faVk}/></div>
                        </a>
                        <a href="https://discord.gg/GMMymRU">
                            <div className="Link"><FontAwesomeIcon icon={faDiscord}/></div>
                        </a>
                        <a href="https://t.me/unmei_site">
                            <div className="Link"><FontAwesomeIcon icon={faTelegramPlane}/></div>
                        </a>
                    </div>
                </div>
            </footer>
            <div className="Footer__Bottom">
                Unmei © 2019-2020
            </div>
        </div>
    );
};

export default Footer;

