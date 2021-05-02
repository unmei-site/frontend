import React from "react";
import './Sidebar.sass';
import { connect } from "react-redux";
import { setModal } from "../../store/ducks/modal";
import LoginModal from "../../pages/Modals/LoginModal";
import { logout } from "../../store/ducks/currentUser";
import RegisterModal from "../../pages/Modals/RegisterModal";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignJustify, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { hasAccessToAdminPanel } from "../../utils";

type Props = {
    modal: React.ReactNode | null
    user: Unmei.UserType
    setModal: SetModal
    logout: LogoutUser
}

type State = {
    closed: boolean
}

class Sidebar extends React.Component<Props, State> {
    state: State = {
        closed: true
    }
    private sidebar: HTMLDivElement | null | undefined;

    componentDidMount() {
        window.addEventListener('keyup', this.handleKeyUp, false);
        document.addEventListener('mousedown', this.handleOutsideClick, false);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.handleKeyUp, false);
        document.removeEventListener('mousedown', this.handleOutsideClick, false);
    }

    handleKeyUp = (e: KeyboardEvent) => {
        if(e.code === 'Escape' && !this.props.modal) {
            e.preventDefault();
            this.closeSidebar();
        }
    };

    handleOutsideClick = (e: any) => {
        if(this.sidebar && !this.sidebar.contains(e.target) && !this.props.modal) {
            this.closeSidebar()
        }
    };

    closeSidebar = () => {
        const closeButton = document.getElementById('CloseSidebar');
        if(!this.sidebar) return;
        if(!closeButton) return;

        this.sidebar.classList.add('Sidebar_Hide');
        closeButton.classList.add('Sidebar_Hide');
        setTimeout(() => {
            this.setState({ closed: true });
        }, 450);
    }

    openSidebar = () => {
        this.setState({ closed: false });
    }

    render() {
        const { user, setModal, logout } = this.props;
        const { closed } = this.state;

        const userNameStyle: React.CSSProperties = JSON.parse(localStorage.getItem('color-name') || 'false') && user.group && user.group.id !== 0 ? { color: user.group.color } : {};

        if(closed)
            return <div onClick={this.openSidebar} className='OpenSidebar'><FontAwesomeIcon icon={faAlignJustify}/></div>;
        return (<>
            <div className="Sidebar" ref={ref => this.sidebar=ref}>
                <div onClick={this.closeSidebar} className='CloseSidebar' id='CloseSidebar'><FontAwesomeIcon icon={faTimesCircle}/></div>

                {user.authorized ? (
                    <div className="Sidebar__User">
                        <img className='Sidebar__User_Avatar' src={user.avatar} alt={user.username}/>
                        <div className='Sidebar__User_Info'>
                            <Link to={`/user/${user.id}`} onClick={this.closeSidebar} className='Sidebar__User_Info_Name' style={userNameStyle}>{user.username}</Link>
                            <div className='Sidebar__User_Info_Group' style={{ borderColor: user.group.color }}>
                                {user.group.name}
                            </div>
                            <div className="Sidebar__User_Buttons">
                                <Link to={`/user/${user.id}/settings`} onClick={this.closeSidebar} className={'Sidebar__Button'}>Настройки</Link>
                                {user.group && hasAccessToAdminPanel(user) && <Link to={`/kawaii__neko`} onClick={this.closeSidebar} className={'Sidebar__Button'}>АП</Link>}
                                <button onClick={logout} className={'Sidebar__Button'}>Выход</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="Sidebar__Auth">
                        <button onClick={() => setModal(<LoginModal/>)} className={'Sidebar__Button'}>Войти</button>
                        <button onClick={() => setModal(<RegisterModal/>)} className={'Sidebar__Button'}>Регистрация</button>
                    </div>
                )}
                <div className='Sidebar__Links'>
                    <Link className='Sidebar__Link' to={'/'} onClick={this.closeSidebar}>Главная</Link>
                    <Link className='Sidebar__Link' to={'/novels'} onClick={this.closeSidebar}>Новеллы</Link>
                </div>
            </div>
        </>);
    }
}

export default connect(
    (state: StoreState) => ({
        user: state.currentUser,
        modal: state.modal
    }),
    dispatch => ({
        setModal: (modal: React.ReactNode | null) => dispatch(setModal(modal)),
        logout: () => dispatch(logout())
    })
)(Sidebar);
