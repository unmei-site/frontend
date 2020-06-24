import React, {ChangeEvent, FormEvent} from "react";
import Group from "../../../ui/Group/Group";
import {connect} from "react-redux";
import NotFoundError from "../../NotFoundError";
import Button from "../../../ui/Button/Button";
import './Settings.sass';
import {fetchUserSettings, updateUserSettings, uploadAvatar} from "../../../api/users";
import {setUser} from "../../../store/actions";

type Props = {
    match: { params: { userId: string } }
    currentUser: UserType
    setUser: (user: UserType) => void
}

type State = {
    // Avatar
    useGravatar: boolean
    avatar: File | null
}

class Settings extends React.Component<Props, State> {
    state: State = {
        useGravatar: false, avatar: null
    }

    componentDidMount() {
        fetchUserSettings().then(settings => {
            this.setState({ useGravatar: settings.use_gravatar })
        })
    }

    onChangeAvatar = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if(!files) return;
        this.setState({ avatar: files[0] });
    }

    saveAvatar = (event: FormEvent) => {
        event.preventDefault();
        const { avatar, useGravatar } = this.state;
        const { setUser } = this.props;

        if(avatar) {
            const formData = new FormData();
            formData.append('avatar', avatar);

            uploadAvatar(formData).then(avatarUrl => {
                updateUserSettings(useGravatar, avatarUrl).then(setUser)
            })
        } else {
            updateUserSettings(useGravatar, '').then(setUser)
        }
    }

    render() {
     const { currentUser, match: { params: { userId } } } = this.props;
     const { useGravatar } = this.state

     if(parseInt(userId) !== currentUser.id) return <NotFoundError/>;

     return (
         <Group title={'Настройки'}>
             <Group title={'Аватар'} className={'Settings_Avatar'}>
                 <form onSubmit={this.saveAvatar}>
                     <label>Использовать Gravatar <input type="checkbox" onChange={event => this.setState({ useGravatar: event.target.checked })} checked={useGravatar}/></label>
                     <label>Загрузить аватар <input type="file" onChange={this.onChangeAvatar} disabled={useGravatar}/></label>
                     <Button>Сохранить</Button>
                 </form>
             </Group>
         </Group>
     );
    }
}

export default connect(
    (state: StoreState) => ({
        currentUser: state.currentUser
    }),
    dispatch => ({
        setUser: (user: UserType) => dispatch(setUser(user))
    })
)(Settings);