import React, {FormEvent, ChangeEvent} from "react";
import Modal from "../../ui/Modal/Modal";
import {login} from "../../api/users";
import {connect} from "react-redux";
import {addNotification, hideModal, setModal, setUser} from "../../store/actions";
import './LoginModal.sass'
import {Link} from "react-router-dom";
import errors from "../../api/errors";
import NotificationMessage from "../../ui/Notifications/NotificationMessage";
import Recaptcha from '../../ui/Recaptcha/Recaptcha'
import Button from "../../ui/Button/Button";
import RegisterModal from "./RegisterModal";
import Input from "../../ui/Input/Input";

type Props = {
    setUser: (user: UserType) => void
    addNotification: (notification: React.ReactNode) => void
    setModal: (modal: React.ReactNode | null) => void
    hideModal: () => void
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
        const { setUser, addNotification, setModal } = this.props;
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
            setModal(null);
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
        const { hideModal, setModal } = this.props;

        return (
            <Modal className={'LoginModal'} title={'Авторизация'}>
                {error && <div className="LoginModal__Error">{error}</div>}
                <form className={'LoginModal__Form'} onSubmit={this.loginAndFetchToken}>
                    <Input
                        type="text"
                        name={'login'}
                        placeholder={'Логин'}
                        className={'LoginModal__Field'}
                        onChange={this.handleLoginChange}
                        value={login}
                    />
                    <Input
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
                    <Button className={'LoginModal__Submit'}>Войти</Button>
                </form>
                <div className="LoginModal__Links">
                    <Link to={'/restore'} onClick={hideModal}>Забыли пароль?</Link>
                    <p>|</p>
                    <Link to={''} onClick={() => setModal(<RegisterModal/>)}>Регистрация</Link>
                </div>
            </Modal>
        )
    }
}

export default connect(null,
    dispatch => ({
        setUser: (user: UserType) => dispatch(setUser(user)),
        addNotification: (notification: React.ReactNode) => dispatch(addNotification(notification)),
        setModal: (modal: React.ReactNode | null) => dispatch(setModal(modal)),
        hideModal: () => dispatch(hideModal())
    })
)(LoginModal);