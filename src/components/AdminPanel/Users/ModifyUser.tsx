import React, {ChangeEvent, FormEvent} from "react";
import {connect} from "react-redux";
import {fetchUser, updateUser} from "../../../api/users";
import Loading from "../../Loading";
import './APUser.sass';
import {addNotification} from "../../../store/actions";
import Notification from "../../Notification/Notification";

type Props = {
    userId: number
    addNotification: (notification: React.ReactNode) => void
};

type State = {
    user: UserType | null
    username: string
};

class ModifyUser extends React.Component<Props, State> {
    state: State = {
        user: null, username: ''
    }

    componentDidMount() {
        const { userId } = this.props;
        fetchUser(userId).then((user: UserType) => {
            this.setState({ user, username: user.username });
            document.title = `${user.username} / Админ-панель`;
        })
    }

    onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const user = Object.assign({}, this.state.user);
        const target = event.target;
        // @ts-ignore
        user[target.name] = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ user })
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
                <Notification level={"success"}>
                    Пользователь успешно изменен!
                </Notification>
            )
            addNotification(notification)
        });
    }

    render() {
        const { user, username } = this.state;

        if(!user) return <Loading/>;
        return (
            <div className={'APUser__Modify'}>
                <div className={'APUser__Modify_Title'}>{username}</div>
                <form className={'APUser__Modify_Form'} onSubmit={this.onSubmit}>
                    <label>Имя пользователя: <input type="text" onChange={this.onChange} name={'username'} value={user.username}/></label>
                    <label>Email: <input type='email' onChange={this.onChange} name={'email'} value={user.email}/></label>
                    <label>Аватар: <input type='text' onChange={this.onChange} name={'avatar'} value={user.avatar}/></label>

                    <label>Суперюзер: <input type='checkbox' onChange={this.onChange} name={'is_superuser'} checked={user.is_superuser}/></label>
                    <label>Активирован: <input type='checkbox' onChange={this.onChange} name={'is_activated'} checked={user.is_activated}/></label>

                    <div style={{ textAlign: "right" }}>
                        <button>Сохранить!</button>
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
)(ModifyUser);