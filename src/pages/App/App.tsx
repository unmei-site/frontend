import React from 'react';
import {Switch, Route} from "react-router-dom";
import './App.sass';
import Navbar from "../Navbar/Navbar";
import Novel from "../Novel/Novel";
import User from "../User/User";
import Main from "../Main/Main"
import NotFoundError from "../NotFoundError";
import {fetchCurrentUser, fetchUserSettings} from "../../api/users";
import {connect} from "react-redux";
import {setUser} from "../../store/actions";
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
import {getVersion, version} from "../../api/api";
import Settings from "../User/Settings/Settings";

type Props = {
    notifications: React.ReactNode[]
    setUser: (user: UserType) => void
    modal: React.ReactNode
};

type State = {}

class App extends React.Component<Props, State> {
    state: State = {}

    constructor(props: Props) {
        super(props);

        const { setUser } = this.props;
        fetchCurrentUser().then((user: UserType) => {
            setUser(user);
            fetchUserSettings().then((settings: UserSettingsType) => {
                document.body.setAttribute('theme', settings.theme);
            });
        }).catch((err: ApiError) => {
            if(err.code !== 3 && err.text) console.error(err.text);
        });

        parser.registerTag('spoiler', SpoilerTag);
        parser.registerTag('color', ColorTag);

        getVersion().then(res => {
            if(version !== res.version) {
                console.log(`Current back-end version: ${res.version}. Clearing cache`);

                caches.keys().then(names => {
                    names.forEach(name => caches.delete(name).catch(console.error))
                });
            }
        });
    }

    render() {
        const { modal } = this.props;
        const notificationWidth = window.screen.width >= 500 ? 500 : window.screen.width;

        return (
            <>
                <Navbar/>
                <div className={'Container'}>
                    <div className="Notifications" style={{ width: notificationWidth }}>
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
        setUser: (userData: UserType) => {
            dispatch(setUser(userData))
        }
    })
)(App);
