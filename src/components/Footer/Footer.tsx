import React from 'react';
import './Footer.sass';
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faVk, faTelegramPlane } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => (
    <div className='Footer'>
        <footer className='Footer__Tabs'>
            <div className="Footer__Tab">
                <div className="Footer__Tab_Title">Команда</div>
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

export default Footer;

