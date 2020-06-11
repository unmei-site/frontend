import React, {FormEvent, ChangeEvent} from "react";
import Modal from "../Modal/Modal";
import {login} from "../../api/users";
import {connect} from "react-redux";
import {addNotification, setUser} from "../../store/actions";
import './LoginModal.sass'
import {Link} from "react-router-dom";
import errors from "../../api/errors";
import NotificationMessage from "../Notifications/NotificationMessage";
import Recaptcha from '../Recaptcha/Recaptcha'

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
    recaptcha: string
    recaptchaNeeded: boolean
};

class LoginModal extends React.Component<Props, State> {
    state: State = {
        error: '', login: '', password: '', recaptcha: '', recaptchaNeeded: false
    };

    loginAndFetchToken = (event: FormEvent) => {
        event.preventDefault();
        const { setUser, hideModal, addNotification } = this.props;
        const { login: log, password, recaptcha } = this.state;
        login(log, password, recaptcha).then(user => {
            if(!user) return;

            setUser(user);
            const successful = (
                <NotificationMessage level={"success"}>
                    Ты успешно вошел!
                </NotificationMessage>
            );
            addNotification(successful);
            hideModal();
        })
        .catch((r: ApiError) => {
            this.setState({ error: errors[r.code] });
            if(r.code === 9) this.setState({ recaptchaNeeded: true });
        });
    };

    handlePasswordChange = (event: ChangeEvent) => this.setState({ password: (event.target as HTMLInputElement).value });
    handleLoginChange = (event: ChangeEvent) => this.setState({ login: (event.target as HTMLInputElement).value });

    render() {
        const { login, password, error, recaptchaNeeded } = this.state;
        return (
            <Modal onCloseRequest={this.props.hideModal} className={'LoginModal'}>
                <h1>Авторизация</h1>
                {error && <div className="LoginModal__Error">{error}</div>}
                <form className={'LoginModal__Form'} onSubmit={this.loginAndFetchToken}>
                    <input
                        type="text"
                        name={'login'}
                        placeholder={'Логин'}
                        className={'LoginModal__Field'}
                        onChange={this.handleLoginChange}
                        value={login}
                    />
                    <input
                        type="password"
                        name={'password'}
                        placeholder={'Пароль'}
                        className={'LoginModal__Field'}
                        onChange={this.handlePasswordChange}
                        value={password}
                    />
                    {recaptchaNeeded &&
                    <Recaptcha
                        onVerify={(res: any) => this.setState({ recaptcha: res })}
                        theme={'dark'}
                        sitekey={'6LfnDsMUAAAAAEDfD5ubCdFQbNUnKxxJlMWeUMzN'}
                    />}
                    <button className={'LoginModal__Submit'} type={"submit"}>Войти</button>
                </form>
                <div className="LoginModal__Links">
                    <Link to={'/restore'}>Забыли пароль?</Link>
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