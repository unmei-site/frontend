import React from "react";
import {activateAccount} from "../api/users";
import {connect} from "react-redux";
import {addNotification} from "../store/actions";
import errors from "../api/errors";
import Loading from "../ui/Loading";

type Props = {
    history: { push: (path: string) => void }
    match: { params: { token: string } }
    addNotification: (notification: React.ReactNode) => void
};

type State = {
    msg: string
    error: boolean
};

class ActivateAccount extends React.Component<Props, State> {
    timeout: NodeJS.Timeout | undefined;
    state: State = {
        msg: '', error: false
    };

    componentDidMount() {
        const { token } = this.props.match.params;
        activateAccount(token).then(() => {
            const msg = 'Аккаунт успешно активирован! Вы будете перенаправлены на главную через 3 секунды.';
            this.setState({ msg });
            this.timeout = setTimeout(() => {
                this.props.history.push('/')
            }, 3000)
        }).catch((err: ApiError) => {
            const msg = errors[err.code];
            if(msg) {
                this.setState({ msg, error: true });
            } else {
                this.setState({ msg: 'Во время активации произошла ошибка! Сообщите об этом разработчику!', error: true });
                console.error(err.text);
            }
            if(err.code === 5) {
                this.timeout = setTimeout(() => {
                    this.props.history.push('/')
                }, 3000)
            }
        });
    }

    componentWillUnmount(): void {
        if(this.timeout)
            clearTimeout(this.timeout);
    }

    render() {
        const { msg, error } = this.state;
        if(msg.length === 0) return <Loading/>;
        return (
            <div className={'Error'} style={{ background: error ? 'var(--error-bg-color)' : 'var(--success-bg-color)' }}>{msg}</div>
        );
    }
}

export default connect(null,
    dispatch => ({
        addNotification: (notification: React.ReactNode) => dispatch(addNotification(notification))
    })
)(ActivateAccount);