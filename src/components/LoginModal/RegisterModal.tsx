import React from "react";
import Modal from "../Modal/Modal";
// @ts-ignore
import Recaptcha from 'react-recaptcha'
import './RegisterModal.sass'
import {registerUser} from "../../api/users";
import {connect} from "react-redux";
import {addNotification} from "../../store/actions";
import Notification from "../Notification/Notification";

type Props = {
    addNotification: (notification: React.ReactNode) => void
    hideModal: () => void
}

type State = {
    error: string
    login: string
    password1: string
    password2: string
    email: string
    recaptcha: string
}

class RegisterModal extends React.Component<Props, State> {
    private recaptcha: any;
    state = {
        error: '', login: '', password1: '', password2: '', email: '', recaptcha: ''
    };

    handlePassword1Change = (event: any) => this.setState({ password1: event.target.value });
    handlePassword2Change = (event: any) => this.setState({ password2: event.target.value });
    handleLoginChange = (event: any) => this.setState({ login: event.target.value });
    handleEmailChange = (event: any) => this.setState({ email: event.target.value });

    componentWillUnmount() {
        this.recaptcha.reset()
    }

    submitForm = (e: any) => {
        const { email, login, password1, password2, recaptcha } = this.state;
        e.preventDefault();
        let error = '';
        if(!email) error += 'Вы не ввели E-mail!<br>';
        if(!login) error += 'Вы не ввели логин!<br>';
        if(!password1) error += 'Вы не ввели пароль!<br>';
        if(!password2) error += 'Вы не ввели пароль второй раз<br>';
        if(password1 && password2 && password1 !== password2) error += 'Пароли не совпадают!<br>';
        if(!recaptcha) error += 'Не пройдена проверка ReCaptcha<br>';
        if(error) this.setState({ error });
        else {
            registerUser(login, password1, email, recaptcha).then(() => {
                const notification = (
                    <Notification level={"success"}>
                        Аккаунт успешно создан!
                        Проверьте почту <strong>{email}</strong>. На неё была отправлена ссылка для подтверждения аккаунта.
                    </Notification>
                );
                const { addNotification, hideModal } = this.props;
                addNotification(notification);
                hideModal();
            }).catch(console.error);
        }
    };

    render() {
        const { hideModal } = this.props;
        const { error, email, login, password1, password2 } = this.state;

        return (
            <Modal onCloseRequest={hideModal} className={'RegisterModal'}>
                <h1>Регистрация</h1>
                {error && <div className="RegisterModal__Error" dangerouslySetInnerHTML={{ __html: error }}/>}
                <form className="RegisterModal__Form" onSubmit={this.submitForm}>
                    <input
                        type="text"
                        min={4}
                        max={20}
                        pattern={'[a-zA-Z0-9_-~[]]+'}
                        name={'login'}
                        placeholder={'Логин'}
                        className={'RegisterModal__Field'}
                        onChange={this.handleLoginChange}
                        value={login}/>
                    <input
                        type="email"
                        name={'email'}
                        placeholder={'E-mail'}
                        pattern={'.+@\\w{2,6}\\.\\w{2,3}'}
                        className={'RegisterModal__Field'}
                        onChange={this.handleEmailChange}
                        value={email}/>
                    <input
                        type="password"
                        name={'password1'}
                        placeholder={'Пароль'}
                        className={'RegisterModal__Field'}
                        onChange={this.handlePassword1Change}
                        value={password1}/>
                    <input
                        type="password"
                        name={'password2'}
                        placeholder={'Повтор пароля'}
                        className={'RegisterModal__Field'}
                        onChange={this.handlePassword2Change}
                        value={password2}/>

                    <Recaptcha
                        ref={(e: any) => this.recaptcha = e}
                        className={'RegisterModal__Recaptcha'}
                        verifyCallback={(res: any) => this.setState({ recaptcha: res })}
                        theme={'dark'}
                        badge={'inline'}
                        sitekey={'6LfnDsMUAAAAAEDfD5ubCdFQbNUnKxxJlMWeUMzN'}/>

                    <button className={'RegisterModal__Submit'} type={"submit"}>Регистрация</button>
                </form>
            </Modal>
        )
    }
}

export default connect(null,
    dispatch => ({
        addNotification: (notification: React.ReactNode) => dispatch(addNotification(notification))
    })
)(RegisterModal);