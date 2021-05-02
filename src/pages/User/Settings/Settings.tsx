import React from "react";
import Group from "../../../ui/Group/Group";
import { connect } from "react-redux";
import NotFoundError from "../../../components/NotFound/NotFoundError";
import './Settings.sass';
import Tabs from "../../../ui/Tabs/Tabs";
import TabItem from "../../../ui/Tabs/TabItem";
import Appearance from "./Appearance";
import General from "./General";
import Security from "./Security";
import { setUser } from "../../../store/ducks/currentUser";
import { Helmet } from "react-helmet";

enum TabsNames {
    General,
    Security,
    Appearance
}

type Props = {
    match: { params: { userId: string } }
    currentUser: Unmei.UserType
    setUser: (user: Unmei.UserType) => void
}

type State = {
    currentTab: TabsNames
}

class Settings extends React.Component<Props, State> {
    state: State = {
        currentTab: TabsNames.General
    }

    render() {
        const { currentUser, match: { params: { userId } }, setUser } = this.props;
        const { currentTab } = this.state

        if(parseInt(userId) !== currentUser.id) return <NotFoundError/>;

        return (
            <Group>
                <Helmet>
                    <title>Настройки</title>
                </Helmet>

                <Tabs>
                    <TabItem
                        selected={currentTab === TabsNames.General}
                        onClick={() => this.setState({ currentTab: TabsNames.General })}
                    >
                        Главное
                    </TabItem>
                    <TabItem
                        selected={currentTab === TabsNames.Security}
                        onClick={() => this.setState({ currentTab: TabsNames.Security })}
                    >
                        Безопастность
                    </TabItem>
                    <TabItem
                        selected={currentTab === TabsNames.Appearance}
                        onClick={() => this.setState({ currentTab: TabsNames.Appearance })}
                    >
                        Внешний вид
                    </TabItem>
                </Tabs>
                {currentTab === TabsNames.General && (
                    <General setUser={setUser}/>
                )}
                {currentTab === TabsNames.Security && (
                    <Security/>
                )}
                {currentTab === TabsNames.Appearance && (
                    <Appearance/>
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
        setUser: (user: Unmei.UserType) => dispatch(setUser(user))
    })
)(Settings);
