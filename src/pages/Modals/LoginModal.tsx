import React, { ChangeEvent, FormEvent } from "react";
import Modal from "../../ui/Modal/Modal";
import { login } from "../../api/auth";
import { connect } from "react-redux";
import './LoginModal.sass'
import { Link } from "react-router-dom";
import errors from "../../api/errors";
import NotificationMessage from "../../ui/Notifications/NotificationMessage";
import Recaptcha from '../../ui/Recaptcha/Recaptcha'
import Button from "../../ui/Button/Button";
import RegisterModal from "./RegisterModal";
import Input from "../../ui/Input/Input";
import { setUser } from "../../store/ducks/currentUser";
import { addNotification } from "../../store/ducks/notifications";
import { hideModal, setModal } from "../../store/ducks/modal";
import { fetchUserSettings } from "../../api/users";
import { setSettings } from "../../store/ducks/userSettings";

type Props = {
    setUser: SetUser
    addNotification: AddNotification
    setModal: SetModal
    hideModal: HideModal
    setSettings: SetSettings
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
        const { setUser, addNotification, setModal, setSettings } = this.props;
        const { login: log, password, recaptcha } = this.state;

        login(log, password, recaptcha).then(user => {
            if(!user) return;

            setUser(user);
            const successful = (
                <NotificationMessage level={"success"} position={"center"}>
                    Ты успешно вошел!
                </NotificationMessage>
            );
            addNotification(successful);
            setModal(null);

            fetchUserSettings().then(settings => {
                localStorage.setItem('theme', settings.theme);
                document.body.setAttribute('theme', settings.theme);
                setSettings(settings);
            });
        }).catch((r: ApiError) => {
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
        setSettings: (settings: UserSettingsType) => dispatch(setSettings(settings)),
        addNotification: (notification: React.ReactNode) => dispatch(addNotification(notification)),
        setModal: (modal: React.ReactNode | null) => dispatch(setModal(modal)),
        hideModal: () => dispatch(hideModal())
    })
)(LoginModal);
