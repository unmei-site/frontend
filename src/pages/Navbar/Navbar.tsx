import React from "react";
import './Navbar.sass'
import {connect} from "react-redux";
import {userLogout} from "../../api/auth";
import {Link} from "react-router-dom";
import {hasAccessToAdminPanel} from "../../utils";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import RegisterModal from "../Modals/RegisterModal";
import LoginModal from "../Modals/LoginModal";
import {logout} from "../../store/ducks/currentUser";
import {setModal} from "../../store/ducks/modal";

type Props = {
    setModal: SetModal
    logout: LogoutUser
    currentUser: UserType
};

type State = {
    expand: boolean
    width: number
}

class Navbar extends React.Component<Props, State> {
    state: State = {
        expand: false, width: window.screen.width
    }

    logout = () => {
        this.props.logout();
        localStorage.removeItem('user');
        userLogout().then();
    };

    changeSize = () => {
        this.setState({ expand: !this.state.expand })
    }

    componentDidMount() {
        window.addEventListener("resize", () => {
            if(this.state.width !== window.screen.width)
                this.setState({ width: window.screen.width });
        })
    }

    render() {
        const { currentUser, setModal } = this.props;
        const { expand } = this.state;

        const isMinimized = window.screen.width <= 1000;

        const links = (
            <div className="Navbar__Links">
                <Link to="/" className={'Navbar_Button'}>
                    Главная
                </Link>
                <Link to="/novels" className={'Navbar_Button'}>
                    Новеллы
                </Link>
                {expand && isMinimized && (
                    <div onClick={this.changeSize} className={'Navbar_Button'} style={{ position: "absolute", right: 0, margin: '.5rem' }}>X</div>
                )}
            </div>
        );

        const user = isMinimized ? (
            <div className={'Navbar__Dropdown'}>
                <div className="Navbar__Dropdown_Button Navbar__User_Profile">
                    <div className={'Navbar__User_Avatar'} style={{ backgroundImage: `url(${currentUser.avatar}?s=40&t=${new Date().getTime()})` }}/>
                    <div>{this.props.currentUser.username}</div>
                </div>
                <div className="Navbar__Dropdown_Menu">
                    <Link to={`/user/${currentUser.id}`} className="Navbar__Dropdown_Item">Профиль</Link>
                    {currentUser.group && hasAccessToAdminPanel(currentUser) && (
                        <Link to={'/kawaii__neko'} className={'Navbar__Dropdown_Item'}>
                            Админ-панель
                        </Link>
                    )}
                    <Link className="Navbar__Dropdown_Item" to={`/user/${currentUser.id}/settings`}>Настройки</Link>
                    <div className="Navbar__Dropdown_Item" onClick={this.logout}>Выход</div>
                </div>
            </div>
        ) : (<>
            <Link to={`/user/${currentUser.id}`} className="Navbar__User_Profile">
                <div className={'Navbar__User_Avatar'} style={{ backgroundImage: `url(${currentUser.avatar}?s=40&t=${new Date().getTime()})` }}/>
                <div>{this.props.currentUser.username}</div>
            </Link>
            {currentUser.group && hasAccessToAdminPanel(currentUser) && (
                <Link to={'/kawaii__neko'} className={'Navbar_Button'}>
                    Админ-панель
                </Link>
            )}
            <Link className="Navbar_Button" to={`/user/${currentUser.id}/settings`}>Настройки</Link>
            <div className={'Navbar_Button'} onClick={this.logout}>Выйти</div>
        </>)

        return (
            <nav className={`Navbar ${expand ? 'Expanded' : 'Minimized'}`}>
                {expand || !isMinimized ? links : (
                    <div className="Navbar__Links">
                        <div onClick={this.changeSize} className={'Navbar_Button'}>
                            <FontAwesomeIcon icon={faBars}/>
                        </div>
                    </div>
                )}
                {currentUser &&
                    (<div className={'Navbar__User'}>
                        {currentUser.authorized ? user : (<>
                            <div className={'Navbar_Button'} onClick={() => setModal(<RegisterModal/>)}>Регистрация</div>
                            <div className={'Navbar_Button'} onClick={() => setModal(<LoginModal/>)}>Войти</div>
                        </>)}
                    </div>)
                }
            </nav>
        )
    }
}

export default connect(
    (state: StoreState) => ({
        currentUser: state.currentUser
    }),
    dispatch => ({
        logout: () => dispatch(logout()),
        setModal: (modal: React.ReactNode | null) => dispatch(setModal(modal))
    })
)(Navbar);
