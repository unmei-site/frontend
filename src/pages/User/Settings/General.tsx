import React, {ChangeEvent, FormEvent} from "react";
import Button from "../../../ui/Button/Button";
import Group from "../../../ui/Group/Group";
import {fetchUserSettings, updateUserGeneralSettings, uploadAvatar} from "../../../api/users";

type Props = {
    setUser: (user: UserType) => void
}

type State = {
    // Avatar
    useGravatar: boolean
    avatar: File | null
}

class General extends React.Component<Props, State> {
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
        const { avatar, useGravatar} = this.state;
        const { setUser } = this.props;

        if(avatar) {
            const formData = new FormData();
            formData.append('avatar', avatar);

            uploadAvatar(formData).then(avatarUrl => {
                updateUserGeneralSettings(useGravatar, avatarUrl).then(setUser)
            })
        } else {
            updateUserGeneralSettings(useGravatar, '').then(setUser)
        }
    }

    render() {
        const { useGravatar } = this.state;

        return (
            <Group title={'Аватар'} className={'Settings_Group'}>
                <form onSubmit={this.saveAvatar}>
                    <label>Использовать Gravatar <input type="checkbox" onChange={event => this.setState({ useGravatar: event.target.checked })} checked={useGravatar}/></label>
                    <label>Загрузить аватар <input type="file" onChange={this.onChangeAvatar} disabled={useGravatar}/></label>
                    <Button>Сохранить</Button>
                </form>
            </Group>
        );
    }
}

export default General;
