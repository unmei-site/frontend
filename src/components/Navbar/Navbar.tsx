import React from "react";
import './Navbar.sass'
import {connect} from "react-redux";
import {userLogout} from "../../api/users";
import {Link} from "react-router-dom";
import {logout} from "../../store/actions";

type Props = {
    showRegisterModal: () => void
    showLoginModal: () => void
    logout: () => void
    currentUser: UserType
};

class Navbar extends React.Component<Props> {
    logout = () => {
        this.props.logout();
        localStorage.removeItem('user');
        userLogout().then(console.log).catch(console.error);
    };

    render() {
        const { currentUser } = this.props;
        return (
            <nav className={'Header'}>
                <div className="Header_Links">
                    <Link to="/">
                        <button className={'Header_Button'}>
                            Главная
                        </button>
                    </Link>
                    <Link to="/novels">
                        <button className={'Header_Button'}>
                            Новеллы
                        </button>
                    </Link>
                    <Link to="/">
                        <button className={'Header_Button'}>
                            Пользователи
                        </button>
                    </Link>
                </div>
                {this.props.currentUser &&
                <div className={'Header_User'}>
                    {this.props.currentUser.authorized &&
                    <Link to={`/user/${currentUser.id}`}>
                        <button className="Header__User_Profile">
                            <div className={'Header__User_Avatar'} style={{ backgroundImage: `url(${currentUser.avatar})` }}/>
                            <div>{this.props.currentUser.username}</div>
                        </button>
                    </Link>}
                    {!currentUser.authorized && <button className={'Header_Button'} onClick={this.props.showRegisterModal}>Регистрация</button>}
                    {!currentUser.authorized
                        ? <button className={'Header_Button'} onClick={this.props.showLoginModal}>Войти</button>
                        : <button className={'Header_Button'} onClick={this.logout}>Выйти</button>}
                </div>}
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