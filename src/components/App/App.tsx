import React from 'react';
import {Switch, Route} from "react-router-dom";
import './App.sass';
import Navbar from "../Navbar/Navbar";
import Novel from "../Novel/Novel";
import User from "../User/User";
import Main from "../Main/Main"
import NotFoundError from "../NotFoundError";
import {fetchCurrentUser} from "../../api/users";
import {connect} from "react-redux";
import {setUser} from "../../store/actions";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../LoginModal/RegisterModal";
import Character from "../Character/Character";
// @ts-ignore
import parser from 'bbcode-to-react';
import SpoilerTag from "../Spoiler/SpoilerTag";
import Novels from "../Novels/Novels";
import Footer from '../Footer/Footer';
import UserNovels from '../User/Novels/UserNovels';
import ColorTag from "../Tags/ColorTag";
import ActivateAccount from "../ActivateAccount";
import AllNews from "../News/AllNews";
import Post from "../News/Post";
import AdminPanel from "../AdminPanel/AdminPanel";
import PasswordRestoreGenerate from "../PasswordRestore/PasswordRestoreGenerate";
import PasswordRestore from "../PasswordRestore/PasswordRestore";
import Users from "../Users/Users";
import {getVersion} from "../../api/api";

type Props = {
    notifications: React.ReactNode[]
    setUser: (user: UserType) => void
};

type State = {
    loginModalVisible: boolean
    registerModalVisible: boolean
    error: string
    login: string
    password: string
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loginModalVisible: false, registerModalVisible: false, error: '',
            login: '', password: ''
        };

        const { setUser } = this.props;
        fetchCurrentUser().then(setUser).catch((err: ApiError) => {
            if(err.code !== 3 && err.text) console.error(err.text);
        });

        const theme = localStorage.getItem('theme');
        if(theme)
            document.body.setAttribute('theme', theme);

        parser.registerTag('spoiler', SpoilerTag);
        parser.registerTag('color', ColorTag);

        getVersion().then(res => console.debug(`Current back-end version: ${res.version}`))
    }

    showLoginModal = () => this.setState({ loginModalVisible: true, registerModalVisible: false });
    hideLoginModal = () => this.setState({ loginModalVisible: false });

    showRegisterModal = () => this.setState({ registerModalVisible: true, loginModalVisible: false });
    hideRegisterModal = () => this.setState({ registerModalVisible: false });

    render() {
        const { loginModalVisible, registerModalVisible } = this.state;

        return (
            <>
                <Navbar showLoginModal={this.showLoginModal} showRegisterModal={this.showRegisterModal}/>
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

                        <Route exact path={'/character/:charId'} component={Character}/>

                        <Route exact path={'/activate/:token'} component={ActivateAccount}/>

                        <Route exact path={'/restore'} component={PasswordRestoreGenerate}/>
                        <Route exact path={'/restore/:token'} component={PasswordRestore}/>

                        <Route path={'/kawaii__neko'} component={AdminPanel}/>

                        <Route component={NotFoundError}/>
                    </Switch>

                    {loginModalVisible && (
                        <LoginModal hideModal={this.hideLoginModal} openRegisterModal={this.showRegisterModal}/>
                    )}
                    {registerModalVisible && (
                        <RegisterModal hideModal={this.hideRegisterModal}/>
                    )}
                </div>
                <Footer/>
            </>
        )
    }
}

export default connect(
    (state: StoreState) => ({
        notifications: state.notifications
    }),
    dispatch => ({
        setUser: (userData: UserType) => {
            dispatch(setUser(userData))
        }
    })
)(App);
