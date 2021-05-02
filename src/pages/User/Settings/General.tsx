import React, { ChangeEvent, FormEvent } from "react";
import Button from "../../../ui/Button/Button";
import Group from "../../../ui/Group/Group";
import { updateUserGeneralSettings, uploadAvatar } from "../../../api/users";
import { connect } from "react-redux";
import { hasPermission } from "../../../utils";

type Props = {
    user: Unmei.UserType
    setUser: SetUser
    settings: Unmei.UserSettingsType
}

type State = {
    // Avatar
    useGravatar: boolean
    avatar: File | null

    error: string
}

class General extends React.Component<Props, State> {
    state: State = {
        useGravatar: this.props.settings.use_gravatar, avatar: null,
        error: ''
    }

    onChangeAvatar = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if(!files) return;
        this.setState({ avatar: files[0] });
    }

    saveAvatar = (event: FormEvent) => {
        event.preventDefault();
        const { avatar, useGravatar } = this.state;
        const { setUser, user } = this.props;

        let allowedTypes = ['image/png', 'image/jpeg'];
        if(avatar) {
            if(hasPermission(user, 'gif')) allowedTypes.push('image/gif');
            if(!allowedTypes.includes(avatar.type)) {
                this.setState({ error: 'GIF аватары доступны только людям, с группой Supporter!' });
                return;
            }
            const formData = new FormData();
            formData.append('avatar', avatar);

            uploadAvatar(formData).then(avatarUrl => {
                updateUserGeneralSettings(useGravatar, avatarUrl).then(setUser);
            })
        } else {
            updateUserGeneralSettings(useGravatar, '').then(setUser)
        }
    }

    render() {
        const { useGravatar, error } = this.state;

        return (
            <Group title={'Аватар'} className={'Settings_Group'}>
                {error.length > 0 && (
                    <div>{error}</div>
                )}
                <form onSubmit={this.saveAvatar}>
                    <label>
                        Использовать Gravatar
                        <input type="checkbox" onChange={event => this.setState({ useGravatar: event.target.checked })} checked={useGravatar}/>
                    </label>
                    <label>
                        Загрузить аватар
                        <input type="file" onChange={this.onChangeAvatar} disabled={useGravatar}/>
                    </label>
                    <Button>Сохранить</Button>
                </form>
            </Group>
        );
    }
}

export default connect(
    (state: StoreState) => ({
        settings: state.userSettings,
        user: state.currentUser
    })
)(General);
