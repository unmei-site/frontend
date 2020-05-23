import React from "react";
import './Navbar.sass'
import {connect} from "react-redux";
import {userLogout} from "../../api/users";
import {Link} from "react-router-dom";
import {logout} from "../../store/actions";
import {hasAccessToAdminPanel} from "../../utils";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';

type Props = {
    showRegisterModal: () => void
    showLoginModal: () => void
    logout: () => void
    currentUser: UserType
};

type State = {
    expand: boolean
}

class Navbar extends React.Component<Props, State> {
    state: State = {
        expand: false
    }

    logout = () => {
        this.props.logout();
        localStorage.removeItem('user');
        userLogout().then();
    };

    changeSize = () => {
        this.setState({ expand: !this.state.expand })
    }

    render() {
        const { currentUser, showRegisterModal, showLoginModal } = this.props;
        const { expand } = this.state;

        const isMinimized = window.screen.width <= 1000;

        const links = (
            <div className="Header__Links">
                <Link to="/" className={'Header_Button'}>
                    Главная
                </Link>
                <Link to="/novels" className={'Header_Button'}>
                    Новеллы
                </Link>
                <Link to="/users" className={'Header_Button'}>
                    Пользователи
                </Link>
                {expand && isMinimized && (
                    <div onClick={this.changeSize} className={'Header_Button'} style={{ position: "absolute", right: 0, margin: '.5rem' }}>X</div>
                )}
            </div>
        );

        return (
            <nav className={`Header ${expand ? 'Expanded' : 'Minimized'}`}>
                {expand || !isMinimized ? links : (
                    <div className="Header__Links">
                        <div onClick={this.changeSize} className={'Header_Button'}>
                            <FontAwesomeIcon icon={faBars}/>
                        </div>
                    </div>
                )}
                {currentUser &&
                    (<div className={'Header__User'}>
                        {currentUser.authorized && (
                            <Link to={`/user/${currentUser.id}`} className="Header__User_Profile">
                                <div className={'Header__User_Avatar'} style={{ backgroundImage: `url(${currentUser.avatar})` }}/>
                                <div>{this.props.currentUser.username}</div>
                            </Link>
                        )}
                        {currentUser.group && hasAccessToAdminPanel(currentUser) && (
                            <Link to={'/kawaii__neko'} className={'Header_Button'}>
                                Админ-панель
                            </Link>
                        )}
                        {!currentUser.authorized && (
                            <div className={'Header_Button'} onClick={showRegisterModal}>Регистрация</div>
                        )}
                        {!currentUser.authorized ? (
                            <div className={'Header_Button'} onClick={showLoginModal}>Войти</div>
                        ) : (
                            <div className={'Header_Button'} onClick={this.logout}>Выйти</div>
                        )}
                    </div>)
                }
            </nav>
        )
    }
}

export default connect(
    (state: any) => ({
        currentUser: state.currentUser
    }),
    dispatch => ({
        logout: () => dispatch(logout())
    }))(Navbar);