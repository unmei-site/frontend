import React, { ChangeEvent, FormEvent } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import './APUser.sass';

import { fetchUser, updateUser } from "../../../api/users";

import Loading from "../../../components/Loading";
import NotificationMessage from "../../../ui/Notifications/NotificationMessage";
import Button from "../../../ui/Button/Button";

import { addNotification } from "../../../store/ducks/notifications";

type Props = {
    match: { params: { id: number } }
    addNotification: (notification: React.ReactNode) => void
};

type State = {
    user: Unmei.UserType | null
    username: string
};

class APModifyUser extends React.Component<Props, State> {
    state: State = {
        user: null, username: ''
    }

    componentDidMount() {
        const { match: { params: { id } } } = this.props;
        fetchUser(id).then((user: Unmei.UserType) => {
            this.setState({ user, username: user.username });
            document.title = `${user.username} / Админ-панель`;
        })
    }

    onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const user = Object.assign({}, this.state.user);
        const target = event.target;
        // @ts-ignore
        user[target.name] = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ user });
    }

    onSubmit = (event: FormEvent) => {
        event.preventDefault();
        const { user } = this.state;
        const { addNotification } = this.props;

        if(user === null) {
            console.error('Пользователь - null!');
            return;
        }
        updateUser(user).then(() => {
            const notification = (
                <NotificationMessage level={"success"}>
                    Пользователь успешно изменен!
                </NotificationMessage>
            )
            addNotification(notification)
        });
    }

    render() {
        const { user, username } = this.state;

        if(!user) return <Loading/>;
        return (
            <div className={'APUser__Modify'}>
                <Helmet>
                    <title>{user.username} / Админ-панель</title>
                </Helmet>

                <div className={'APUser__Modify_Title'}>{username}</div>
                <form className={'APUser__Modify_Form'} onSubmit={this.onSubmit}>
                    <label>Имя пользователя: <input type="text" onChange={this.onChange} name={'username'}
                                                    value={user.username}/></label>
                    <label>Email: <input type='email' onChange={this.onChange} name={'email'}
                                         value={user.email}/></label>
                    <label>Аватар: <input type='text' onChange={this.onChange} name={'avatar'}
                                          value={user.avatar}/></label>

                    <label>Суперюзер: <input type='checkbox' onChange={this.onChange} name={'is_superuser'}
                                             checked={user.is_superuser}/></label>
                    <label>Активирован: <input type='checkbox' onChange={this.onChange} name={'is_activated'}
                                               checked={user.is_activated}/></label>

                    <div style={{ textAlign: "right" }}>
                        <Button>Сохранить!</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(
    (state: StoreState) => ({
        user: state.currentUser
    }),
    (dispatch) => ({
        addNotification: (notification: React.ReactNode) => {
            dispatch(addNotification(notification))
        }
    })
)(APModifyUser);
