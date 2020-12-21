import Button from "../../../ui/Button/Button";
import Group from "../../../ui/Group/Group";
import React, { FormEvent } from "react";
import { updateUserAppearanceSettings } from "../../../api/users";
import { connect } from "react-redux";
import { setUser } from "../../../store/ducks/currentUser";
import { setSnowflakeCount, setSnowfallStatus } from "../../../store/ducks/snowfall";

type Props = {
    setUser: SetUser
    settings: UserSettingsType

    snowfallSettings: Snowfall
    setSnowflakeCount: SetSnowflakeCount
    setSnowfallStatus: SetSnowflakeStatus
}

type State = {
    theme: Theme
    colorName: boolean
    snowflakeCount: 0
}

class Appearance extends React.Component<Props, State> {
    state: State = {
        theme: this.props.settings.theme,
        colorName: JSON.parse(localStorage.getItem('color-name') || 'false'),
        snowflakeCount: JSON.parse(localStorage.getItem('snowflakeCount') ?? '250')
    }

    saveTheme = (event: FormEvent) => {
        event.preventDefault();

        const { theme } = this.state;
        const { setUser } = this.props;

        localStorage.setItem('theme', theme);
        document.body.setAttribute('theme', theme);

        updateUserAppearanceSettings(theme).then(user => {
            setUser(user);
        });
    }

    render() {
        const { snowfallSettings, setSnowflakeCount, setSnowfallStatus } = this.props;
        const { theme, colorName } = this.state;

        return (<>
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
            <Group title={'Остальное'}>
                <label>
                    Выделять ник цветом группы
                    <input
                        type="checkbox"
                        onChange={e => {
                            localStorage.setItem('color-name', JSON.stringify(e.target.checked));
                            this.setState({ colorName: e.target.checked });
                        }}
                        checked={colorName}
                    />
                </label>
            </Group>
            <Group title={'Снег'}>
                <label>
                    Включить снег
                    <input
                        type={'checkbox'}
                        checked={snowfallSettings.snowfallStatus}
                        onChange={e => {
                            setSnowfallStatus(e.target.checked);
                            localStorage.setItem('snowfallStatus', JSON.stringify(e.target.checked));
                        }}
                    />
                </label>

                <label style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                        Количество снежинок {snowfallSettings.snowflakeCount}
                        {snowfallSettings.snowflakeCount > 700 && (
                            <span style={{ color: 'red' }}> (использование большого количества снежинок может негативно сказаться на производительности!)</span>
                        )}
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={1000}
                        value={snowfallSettings.snowflakeCount}
                        onChange={e => {
                            const value = JSON.parse(e.target.value);
                            setSnowflakeCount(value);
                            localStorage.setItem('snowflakeCount', value);
                        }}
                    />
                </label>
            </Group>
        </>);
    }
}

export default connect(
    (state: StoreState) => ({
        settings: state.userSettings,
        snowfallSettings: state.snowfall
    }),
    dispatch => ({
        setUser: (user: UserType) => dispatch(setUser(user)),
        setSnowflakeCount: (count: number) => dispatch(setSnowflakeCount(count)),
        setSnowfallStatus: (status: boolean) => dispatch(setSnowfallStatus(status))
    })
)(Appearance);
