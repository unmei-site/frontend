import React, {FormEvent, ChangeEvent} from "react";
import Modal from "../Modal/Modal";
import {login} from "../../api/users";
import {connect} from "react-redux";
import {addNotification, setUser} from "../../store/actions";
import './LoginModal.sass'
import {Link} from "react-router-dom";
import errors from "../../api/errors";
import Notification from "../Notification/Notification";

type Props = {
    setUser: (user: UserType) => void
    hideModal: () => void
    openRegisterModal: () => void
    addNotification: (notification: React.ReactNode) => void
};

type State = {
    error: string
    login: string
    password: string
};

class LoginModal extends React.Component<Props, State> {
    state: State = {
        error: '', login: '', password: ''
    };

    loginAndFetchToken = (event: FormEvent) => {
        event.preventDefault();
        const { setUser, hideModal, addNotification } = this.props;
        login(this.state.login, this.state.password)
            .then(user => {
                if(user) {
                    setUser(user);
                    const successful = (
                        <Notification level={"success"}>
                            Ты успешно вошел!
                        </Notification>
                    );
                    addNotification(successful);
                    hideModal();
                }
            })
            .catch((r: ApiError) => this.setState({ error: errors[r.code] }));
    };

    handlePasswordChange = (event: ChangeEvent) => this.setState({ password: (event.target as HTMLInputElement).value });
    handleLoginChange = (event: ChangeEvent) => this.setState({ login: (event.target as HTMLInputElement).value });

    render() {
        return (
            <Modal onCloseRequest={this.props.hideModal} className={'LoginModal'}>
                <h1>Авторизация</h1>
                {this.state.error && <div className="LoginModal__Error">{this.state.error}</div>}
                <form className={'LoginModal__Form'} onSubmit={this.loginAndFetchToken}>
                    <input
                        type="text"
                        name={'login'}
                        placeholder={'Логин'}
                        className={'LoginModal__Field'}
                        onChange={this.handleLoginChange}
                        value={this.state.login}/>
                    <input
                        type="password"
                        name={'password'}
                        placeholder={'Пароль'}
                        className={'LoginModal__Field'}
                        onChange={this.handlePasswordChange}
                        value={this.state.password}/>
                    <button className={'LoginModal__Submit'} type={"submit"}>Войти</button>
                </form>
                <div className="LoginModal__Links">
                    <Link to={'/'}>Забыли пароль?</Link>
                    <p>|</p>
                    <Link to={''} onClick={this.props.openRegisterModal}>Регистрация</Link>
                </div>
            </Modal>
        )
    }
}

export default connect(null,
    dispatch => ({
        setUser: (user: UserType) => dispatch(setUser(user)),
        addNotification: (notification: React.ReactNode) => dispatch(addNotification(notification))
    })
)(LoginModal);