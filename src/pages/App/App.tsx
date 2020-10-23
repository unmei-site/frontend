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
// @ts-ignore
import parser from 'bbcode-to-react';
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

type Props = {
    notifications: React.ReactNode[]
    modal: React.ReactNode
    setUser: SetUser
    setSettings: SetSettings
};

type State = {}

class App extends React.Component<Props, State> {
    state: State = {}

    constructor(props: Props) {
        super(props);

        parser.registerTag('spoiler', SpoilerTag);
        parser.registerTag('color', ColorTag);
    }

    componentDidMount() {
        const { setUser, setSettings } = this.props;

        const cachedTheme = localStorage.getItem('theme');
        if(cachedTheme)
            document.body.setAttribute('theme', cachedTheme);

        fetchCurrentUser().then(user => {
            setUser(user);
            fetchUserSettings().then(settings => {
                setSettings(settings);
                if(settings.theme !== cachedTheme) {
                    localStorage.setItem('theme', settings.theme);
                    document.body.setAttribute('theme', settings.theme);
                }
            });
        }).catch((err: ApiError) => {
            if(err.code !== 3 && err.text)
                console.error(err.text);
        });

        getVersion().then(res => {
            if(version !== res.version) {
                console.debug(`Current back-end version: ${res.version}. Clearing cache`);

                caches.keys().then(names => {
                    names.forEach(name => caches.delete(name).catch(console.error))
                }).then(() => {
                    window.location.reload();
                });
            }
        });
    }

    render() {
        const { modal } = this.props;

        return (
            <>
                <Navbar/>
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
        modal: state.modal
    }),
    dispatch => ({
        setUser: (userData: UserType) => dispatch(setUser(userData)),
        setSettings: (settings: UserSettingsType) => dispatch(setSettings(settings))
    })
)(App);
