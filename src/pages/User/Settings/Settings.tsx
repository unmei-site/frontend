import React, {ChangeEvent, FormEvent} from "react";
import Group from "../../../ui/Group/Group";
import {connect} from "react-redux";
import NotFoundError from "../../NotFoundError";
import Button from "../../../ui/Button/Button";
import './Settings.sass';
import {
    fetchUserSettings,
    updateUserAppearanceSettings,
    updateUserGeneralSettings,
    uploadAvatar
} from "../../../api/users";
import {setUser} from "../../../store/actions";
import Tabs from "../../../ui/Tabs/Tabs";
import TabItem from "../../../ui/Tabs/TabItem";

enum TabsNames {
    General,
    Appearance
}

type Props = {
    match: { params: { userId: string } }
    currentUser: UserType
    setUser: (user: UserType) => void
}

type State = {
    // Avatar
    useGravatar: boolean
    avatar: File | null
    theme: Theme

    currentTab: TabsNames
}

class Settings extends React.Component<Props, State> {
    state: State = {
        useGravatar: false, avatar: null, theme: "dark",
        currentTab: TabsNames.General
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

    saveTheme = (event: FormEvent) => {
        event.preventDefault();

        const { theme } = this.state;
        updateUserAppearanceSettings(theme).then(user => {
            setUser(user);

            localStorage.setItem('theme', theme);
            document.body.setAttribute('theme', theme);
        })
    }

    render() {
     const { currentUser, match: { params: { userId } } } = this.props;
     const { useGravatar, currentTab, theme } = this.state

     if(parseInt(userId) !== currentUser.id) return <NotFoundError/>;

     return (
         <Group title={'Настройки'}>
             <Tabs>
                 <TabItem
                    selected={currentTab === TabsNames.General}
                    onClick={() => this.setState({ currentTab: TabsNames.General })}
                 >
                     Главное
                 </TabItem>
                 <TabItem
                     selected={currentTab === TabsNames.Appearance}
                     onClick={() => this.setState({ currentTab: TabsNames.Appearance })}
                 >
                     Внешний вид
                 </TabItem>
             </Tabs>
             {currentTab === TabsNames.General && (
                 <Group title={'Аватар'} className={'Settings_Avatar'}>
                     <form onSubmit={this.saveAvatar}>
                         <label>Использовать Gravatar <input type="checkbox" onChange={event => this.setState({ useGravatar: event.target.checked })} checked={useGravatar}/></label>
                         <label>Загрузить аватар <input type="file" onChange={this.onChangeAvatar} disabled={useGravatar}/></label>
                         <Button>Сохранить</Button>
                     </form>
                 </Group>
             )}
             {currentTab === TabsNames.Appearance && (
                 <Group title={'Тема'} className={'Settings_Avatar'}>
                     <form onSubmit={this.saveTheme}>
                         <select onChange={e => this.setState({ theme: e.target.value as Theme })} value={theme}>
                             <option value="dark">Dark</option>
                             <option value="blue">Blue</option>
                             <option value="red">Red</option>
                             <option value="green">Green</option>
                             <option value="light">Light</option>
                         </select>

                         <Button>Сохранить</Button>
                     </form>
                 </Group>
             )}
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
