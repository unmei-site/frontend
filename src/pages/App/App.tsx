import React from 'react';
import { Route, Switch } from "react-router-dom";
import './App.sass';
import Navbar from "../Navbar/Navbar";
import Novel from "../Novel/Novel";
import User from "../User/User";
import Main from "../Main/Main"
import NotFoundError from "../NotFoundError";
import { fetchCurrentUser, fetchUserSettings } from "../../api/users";
import { connect } from "react-redux";
import Character from "../Character/Character";
import SpoilerTag from "../../ui/Spoiler/SpoilerTag";
import Novels from "../Novels/Novels";
import Footer from '../Footer/Footer';
import UserNovels from '../User/Novels/UserNovels';
import ColorTag from "../../ui/Tags/ColorTag";
import ActivateAccount from "../ActivateAccount";
import AllNews from "../News/AllNews";
import Post from "../News/Post";
import AdminPanel from "../AdminPanel/AdminPanel";
import PasswordRestoreGenerate from "../PasswordRestore/PasswordRestoreGenerate";
import PasswordRestore from "../PasswordRestore/PasswordRestore";
import Users from "../Users/Users";
import { getVersion, version } from "../../api/api";
import Settings from "../User/Settings/Settings";
import { setUser } from "../../store/ducks/currentUser";
import { setSettings } from "../../store/ducks/userSettings";
import { withProfiler } from "@sentry/react";
import { hasPermission } from "../../utils";
import Club from "../Club/Club";
import Snowfall from "react-snowfall";
// @ts-ignore
import eruda from 'eruda';
// @ts-ignore
import parser from 'bbcode-to-react';
import Clubs from "../Clubs/Clubs";

type Props = {
    notifications: React.ReactNode[]
    modal: React.ReactNode
    setUser: SetUser
    setSettings: SetSettings
    snowfall: Snowfall
};

type State = {
    user: UserType | null
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

    componentDidMount() {
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
        }).catch((err: ApiError) => {
            if(err.code !== 3 && err.text)
                console.error(err.text);
        });

        getVersion().then(res => {
            if(version !== res.version && !/(dev\..+)/.test(window.location.href)) {
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
        const { modal, snowfall } = this.props;
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
                <Navbar/>
                {snowfall.snowfallStatus && (
                    <Snowfall color={'white'} snowflakeCount={snowfall.snowflakeCount} style={{ zIndex: 1000, position: "fixed" }}/>
                )}
                <div className={'Container'}>
                    <div className="Notifications">
                        {this.props.notifications.map((n, i) => (
                            <React.Fragment key={i}>
                                {n}
                            </React.Fragment>
                        ))}
                    </div>
                    <Switch>
                        <Route exact path={'/'} component={Main}/>

                        <Route exact path={'/news'} component={AllNews}/>
                        <Route exact path={'/news/:postId'} component={Post}/>

                        <Route exact path={'/novels'} component={Novels}/>
                        <Route exact path={'/novels/:novelId'} component={Novel}/>

                        <Route exact path={'/clubs'} component={Clubs}/>
                        <Route exact path={'/clubs/:clubId'} component={Club}/>

                        <Route exact path={'/users'} component={Users}/>
                        <Route exact path={'/user/:userId'} component={User}/>
                        <Route exact path={'/user/:userId/novels'} component={UserNovels}/>
                        <Route exact path={'/user/:userId/settings'} component={Settings}/>

                        <Route exact path={'/character/:charId'} component={Character}/>

                        <Route exact path={'/activate/:token'} component={ActivateAccount}/>

                        <Route exact path={'/restore'} component={PasswordRestoreGenerate}/>
                        <Route exact path={'/restore/:token'} component={PasswordRestore}/>

                        <Route path={'/kawaii__neko'} component={AdminPanel}/>

                        <Route component={NotFoundError}/>
                    </Switch>

                    {modal && modal}
                </div>
                <Footer/>
            </>
        )
    }
}

export default connect(
    (state: StoreState) => ({
        notifications: state.notifications,
        modal: state.modal,
        snowfall: state.snowfall
    }),
    dispatch => ({
        setUser: (userData: UserType) => dispatch(setUser(userData)),
        setSettings: (settings: UserSettingsType) => dispatch(setSettings(settings))
    })
)(withProfiler(App));
