import React, { Suspense } from 'react';
import { connect } from "react-redux";
import { withProfiler } from "@sentry/react";

import './App.sass';

import { fetchCurrentUser, fetchUserSettings } from "../../api/users";
import { build, getVersion} from "../../api/api";

import { setUser } from "../../store/ducks/currentUser";
import { setSettings } from "../../store/ducks/userSettings";

import { SpoilerTag, ColorTag } from "../../ui/ui";
import { hasPermission } from "../../utils";
import Preloader from "../Preloader/Preloader";
import Router from "./Router";
// @ts-ignore
import eruda from 'eruda';
// @ts-ignore
import parser from 'bbcode-to-react';
import Navbar from "../Navbar/Navbar";

const Snowfall = React.lazy(() => import("react-snowfall"));
// const Sidebar = React.lazy(() => import("../Sidebar/Sidebar"));
const Footer = React.lazy(() => import('../Footer/Footer'));

type Props = {
    notifications: React.ReactNode[]
    modal: React.ReactNode
    setUser: SetUser
    setSettings: SetSettings
    snowfall: Snowfall
    preloader: boolean
};

type State = {
    user: Unmei.UserType | null
};

class App extends React.Component<Props, State> {
    state: State = {
        user: null
    };

    constructor(props: Props) {
        super(props);

        parser.registerTag('spoiler', SpoilerTag);
        parser.registerTag('color', ColorTag);
    }

    async componentDidMount() {
        const { setUser, setSettings } = this.props;

        const cachedTheme = localStorage.getItem('theme');
        if(cachedTheme) {
            if(cachedTheme === 'custom') {
                const customTheme = localStorage.getItem('customTheme') ?? '';

                customTheme.split('\n').forEach(line => {
                    const [name, value] = line.split(':');
                    document.body.style.setProperty(name, value);
                });
            } else
                document.body.setAttribute('theme', cachedTheme);
        }

        const accentColor = localStorage.getItem('accentColor');
        if(accentColor)
            document.body.style.setProperty('--accent-color', accentColor);

        fetchCurrentUser().then(user => {
            setUser(user);
            this.setState({ user });
            localStorage.setItem('banned', JSON.stringify(user.is_banned));

            fetchUserSettings().then(settings => {
                setSettings(settings);
                if(settings.theme !== cachedTheme) {
                    localStorage.setItem('theme', settings.theme);
                    document.body.setAttribute('theme', settings.theme);
                }
            });
            if(hasPermission(user, 'mobile_debug'))
                eruda.init();
        }).catch((err: Unmei.ApiError) => {
            if(err.code !== 3 && err.text)
                console.error(err.text);
        });

        getVersion().then(res => {
            if(build !== res.build && !/(dev\..+)/.test(window.location.href)) {
                console.debug(`Current back-end version: ${res.version}. Clearing cache`);

                caches.keys().then(names => {
                    names.forEach(name => caches.delete(name).catch(console.error))
                }).then(() => {
                    window.location.reload();
                });
            } else if(/(dev\..+)/.test(window.location.href)) {
                caches.keys().then(names => {
                    names.forEach(name => caches.delete(name).catch(console.error))
                });
            }
        });
    }

    render() {
        const { modal, snowfall, preloader } = this.props;
        const { user } = this.state;
        const isBanned = user?.is_banned || JSON.parse(localStorage.getItem('banned') ?? 'false');

        if(isBanned) {
            return (
                <div style={{ display: 'flex', height: '100%', justifyContent: "center", alignItems: "center", fontSize: '2rem' }}>
                    Вы были забанены!
                </div>
            );
        }

        return (
            <>
                {preloader && <Preloader/>}
                <Suspense fallback={null}>
                    <Navbar/>
                </Suspense>
                <Suspense fallback={null}>
                    {snowfall.snowfallStatus && (
                        <Snowfall color={'white'} snowflakeCount={snowfall.snowflakeCount} style={{ zIndex: 1000, position: "fixed" }}/>
                    )}
                </Suspense>
                <div className={'Container'}>
                    <div className="Notifications">
                        {this.props.notifications.map((n, i) => (
                            <React.Fragment key={i}>
                                {n}
                            </React.Fragment>
                        ))}
                    </div>
                    {Router}

                    {modal && modal}
                </div>
                <Suspense fallback={null}>
                    <Footer/>
                </Suspense>
            </>
        )
    }
}

export default connect(
    (state: StoreState) => ({
        notifications: state.notifications,
        modal: state.modal,
        snowfall: state.snowfall,
        preloader: state.preloader
    }),
    dispatch => ({
        setUser: (userData: Unmei.UserType) => dispatch(setUser(userData)),
        setSettings: (settings: Unmei.UserSettingsType) => dispatch(setSettings(settings))
    })
)(withProfiler(App));
