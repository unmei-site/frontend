import Button from "../../../ui/Button/Button";
import Group from "../../../ui/Group/Group";
import React, {FormEvent} from "react";
import {fetchUserSettings, updateUserAppearanceSettings} from "../../../api/users";
import {connect} from "react-redux";
import {setUser} from "../../../store/ducks/currentUser";

type Props = {
    setUser: SetUser
}

type State = {
    theme: Theme
}

class Appearance extends React.Component<Props, State> {
    state: State = {
        theme: 'dark'
    }

    componentDidMount() {
        fetchUserSettings().then(settings => {
            this.setState({ theme: settings.theme })
        })
    }

    saveTheme = (event: FormEvent) => {
        event.preventDefault();

        const { theme } = this.state;
        const { setUser } = this.props;

        updateUserAppearanceSettings(theme).then(user => {
            setUser(user);

            localStorage.setItem('theme', theme);
            document.body.setAttribute('theme', theme);
        })
    }

    render() {
        const { theme } = this.state;

        return (
            <Group title={'Тема'} className={'Settings_Group'}>
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
        )
    }
}

export default connect(null,
    dispatch => ({
        setUser: (user: UserType) => dispatch(setUser(user))
    })
)(Appearance);
