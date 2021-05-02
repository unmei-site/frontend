import React, { useMemo, useState } from 'react';
import './Footer.sass';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTelegramPlane, faVk } from '@fortawesome/free-brands-svg-icons';
import { build, version, getVersion } from "../../api/api";

const Footer: React.FC = () => {
    const [backend, setVersion] = useState<Unmei.VersionResponse>({ version: '', build: 0 });
    useMemo(() => {
        getVersion().then(setVersion);
    }, []);

    return (
        <div className='Footer'>
            <footer className='Footer__Tabs'>
                <div className="Footer__Tab">
                    <div className="Footer__Tab_Title">Команда</div>
                    <Link to={'/user/1'} className={'Link'}>Nix13</Link>
                    <Link to={'/user/6'} className={'Link'}>RonFall</Link>
                </div>
                <div className="Footer__Tab">
                    <div className="Footer__Tab_Title">Соцсети</div>

                    <div className="Links">
                        <a href="https://vk.com/unmei_site">
                            <div className="Link"><FontAwesomeIcon icon={faVk} title='VK' /></div>
                        </a>
                        <a href="https://discord.gg/4CA8Cju">
                            <div className="Link"><FontAwesomeIcon icon={faDiscord} title='Discord'/></div>
                        </a>
                        <a href="https://t.me/unmei_site">
                            <div className="Link"><FontAwesomeIcon icon={faTelegramPlane} title='Telegram'/></div>
                        </a>
                    </div>
                </div>
            </footer>
            <div className="Footer__Bottom">
                <div>Unmei © 2019-2021</div>
                <div>
                    Frontend version: <span style={{ color: backend.build === build ? "green" : "red" }}>{version} ({build})</span>;
                    Backend version: <span style={{ color: backend.build === build ? "green" : "red" }}>{backend.version} ({backend.build})</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;

