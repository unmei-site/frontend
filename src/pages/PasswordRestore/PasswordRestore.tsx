import React from "react";
import {restore} from "../../api/auth";
import errors from "../../api/errors";
import './PasswordRestore.sass';
import Button from "../../ui/Button/Button";

type Props = {
    match: { params: { token: string } }
}

type State = {
    p1: string
    p2: string
    error: string
    message: string
}

class PasswordRestore extends React.Component<Props, State> {
    state = {
        p1: '', p2: '', error: '', message: ''
    }
    timeout: NodeJS.Timeout | null = null;

    onSubmit = (event: React.FormEvent) => {
        const { token } = this.props.match.params;
        const { p1, p2 } = this.state;
        event.preventDefault();
        if(p1 !== p2) {
            this.setState({ error: 'Пароли не совпадают!' })
            return;
        }
        restore(token, p1).then(res => {
            if(res === 'ok') {
                this.setState({ message: 'Успешно!\nВы будете пренаправлены на главную через 3 секунды!' })
                this.timeout = setTimeout(() => {

                }, 3000)
            }
        }).catch((err: ApiError) => {
            const error = errors[err.code];
            if(error) this.setState({ error });
            else this.setState({ error: `Произошла ошибка! Сообщите номер и текст разработчику!\nКод: ${err.code}\nТекст: ${err.text}` })
        })
    }

    componentWillUnmount() {
        if(this.timeout) clearInterval(this.timeout);
    }

    render() {
        const { p1, p2, error, message } = this.state;

        return (
            <form onSubmit={this.onSubmit} className={'PasswordRestore'}>
                {error && <pre className="Error">{error}</pre>}
                {message && <pre className="Successful">{message}</pre>}
                <input
                    type="password"
                    placeholder={'Новый пароль'}
                    minLength={6}
                    value={p1}
                    onChange={event => this.setState({ p1: event.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder={'Повторите пароль'}
                    minLength={6}
                    value={p2}
                    onChange={event => this.setState({ p2: event.target.value })}
                    required
                />
                <Button>Сменить</Button>
            </form>
        )
    }
}

export default PasswordRestore;