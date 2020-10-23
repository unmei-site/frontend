import React from "react";
import Group from "../../../ui/Group/Group";
import Input from "../../../ui/Input/Input";
import Button from "../../../ui/Button/Button";
import { changeEmail, changePassword } from "../../../api/auth";
import { connect } from "react-redux";
import { addNotification } from "../../../store/ducks/notifications";
import NotificationMessage from "../../../ui/Notifications/NotificationMessage";
import errors from "../../../api/errors";

type Props = {
    addNotification: AddNotification
}

type State = {
    oldEmail: string
    email1: string
    email2: string
    emailError: string

    oldPassword: string
    password1: string
    password2: string
    passwordError: string
}

class Security extends React.Component<Props, State> {
    state: State = {
        oldEmail: '', email1: '', email2: '',
        oldPassword: '', password1: '', password2: '',
        emailError: '', passwordError: ''
    }

    changeEmail = (e: React.FormEvent) => {
        e.preventDefault();
        const { oldEmail, email1, email2 } = this.state;
        const { addNotification } = this.props;

        let error = '';
        if(!oldEmail) error += 'Введите старый E-mail\n';
        if(!email1) error += 'Введите новый E-mail\n';
        if(!email2) error += 'Введите повтор нового E-mail\n';
        if(email1 !== email2) error += 'E-mail не совпадают\n';
        if(oldEmail === email1) error += 'Старый и новый E-mail не должны совпадать';

        if(error) {
            this.setState({ emailError: error });
        } else {
            changeEmail(oldEmail, email1).then(() => {
                addNotification(
                    <NotificationMessage>
                        E-mail успешно сменен!
                    </NotificationMessage>
                );
                this.setState({
                    oldEmail: '', email1: '', email2: ''
                });
            }).catch((err: ApiError) => {
                this.setState({ emailError: errors[err.code] })
            });
        }
    }

    changePassword = (e: React.FormEvent) => {
        e.preventDefault();

        const { oldPassword, password1, password2 } = this.state;
        const { addNotification } = this.props;

        let error = '';
        if(!oldPassword) error += 'Введите старый пароль\n';
        if(!password1) error += 'Введите новый пароль\n';
        if(!password2) error += 'Введите повтор нового пароля\n';
        if(password1 !== password2) error += 'Пароли не совпадают\n';
        if(oldPassword === password1) error += 'Старый и новый пароль не должны совпадать';

        if(error) {
            this.setState({ passwordError: error });
        } else {
            changePassword(oldPassword, password1).then(() => {
                addNotification(
                    <NotificationMessage>
                        Пароль успешно сменен!
                    </NotificationMessage>
                );
                this.setState({
                    oldPassword: '', password1: '', password2: ''
                });
            }).catch((err: ApiError) => {
                this.setState({ passwordError: errors[err.code] })
            });
        }
    }

    render() {
        const {
            oldEmail, email1, email2,
            oldPassword, password1, password2,
            emailError, passwordError
        } = this.state;

        return (<>
            <Group title={'Смена E-mail'} className={'Settings_Group'}>
                {emailError && <pre className={'Error'}>{emailError}</pre>}
                <form onSubmit={this.changeEmail}>
                    <Input
                        placeholder={'Старый E-mail'}
                        type={'email'}
                        value={oldEmail}
                        onChange={e => this.setState({ oldEmail: e.target.value })}
                    />
                    <Input
                        placeholder={'Новый E-mail'}
                        type={'email'}
                        value={email1}
                        onChange={e => this.setState({ email1: e.target.value })}
                    />
                    <Input
                        placeholder={'Новый E-mail ещё раз'}
                        type={'email'}
                        value={email2}
                        onChange={e => this.setState({ email2: e.target.value })}
                    />
                    <Button>Сохранить</Button>
                </form>
            </Group>

            <Group title={'Смена пароля'} className={'Settings_Group'}>
                {passwordError && <pre className={'Error'}>{passwordError}</pre>}
                <form onSubmit={this.changePassword}>
                    <Input
                        placeholder={'Старый пароль'}
                        type={'password'}
                        value={oldPassword}
                        onChange={e => this.setState({ oldPassword: e.target.value })}
                    />
                    <Input
                        placeholder={'Новый пароль'}
                        type={'password'}
                        value={password1}
                        onChange={e => this.setState({ password1: e.target.value })}
                    />
                    <Input
                        placeholder={'Новый пароль ещё раз'}
                        type={'password'}
                        value={password2}
                        onChange={e => this.setState({ password2: e.target.value })}
                    />
                    <Button>Сохранить</Button>
                </form>
            </Group>
        </>);
    }
}

export default connect(
    null,
    dispatch => ({
        addNotification: (notification: React.ReactNode) => dispatch(addNotification(notification))
    })
)(Security);
