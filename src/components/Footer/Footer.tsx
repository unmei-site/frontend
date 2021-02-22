import React, { useMemo, useState } from 'react';
import styles  from './Footer.module.sass';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTelegramPlane, faVk } from '@fortawesome/free-brands-svg-icons';
import { build, getVersion, version } from "../../api/api";

const Footer: React.FC = () => {
    const [backend, setVersion] = useState<VersionResponse>({ version: '', build: 0 });
    useMemo(() => {
        getVersion().then(setVersion);
    }, []);

    return (
        <div className={styles.Footer}>
            <footer className={styles.Footer__Tabs}>
                <div className={styles.Footer__Tab}>
                    <div className={styles.Footer__Tab_Title}>Команда</div>
                    <Link to={'/user/1'} className={'Link'}>Nix13</Link>
                    <Link to={'/user/6'} className={'Link'}>RonFall</Link>
                </div>
                <div className={styles.Footer__Tab}>
                    <div className={styles.Footer__Tab_Title}>Соцсети</div>

                    <div className={styles.Links}>
                        <a href="https://vk.com/unmei_site">
                            <div className={styles.Link}><FontAwesomeIcon icon={faVk}/></div>
                        </a>
                        <a href="https://discord.gg/4CA8Cju">
                            <div className={styles.Link}><FontAwesomeIcon icon={faDiscord}/></div>
                        </a>
                        <a href="https://t.me/unmei_site">
                            <div className={styles.Link}><FontAwesomeIcon icon={faTelegramPlane}/></div>
                        </a>
                    </div>
                </div>
            </footer>
            <div className={styles.Footer__Bottom}>
                <div>Unmei © 2019-2021</div>
                <div>
                    Frontend version: <span style={{ color: backend.build == build ? "green" : "red" }}>{version} ({build})</span>;
                    Backend version: <span style={{ color: backend.build == build ? "green" : "red" }}>{backend.version} ({backend.build})</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;

