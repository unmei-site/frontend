import {connect} from "react-redux";
import React from "react";
import NotFoundError from "../../NotFoundError";
import {hasPermission} from "../../../utils";

type Props = {
    user: UserType
}

type State = {

}

class AdminPanel extends React.Component<Props, State> {
    render() {
        const { user } = this.props;
        if(!user || !user.group) return <NotFoundError/>;
        if(!user.is_superuser && !user.group.is_superuser && !hasPermission(user, 'admin_panel')) return <NotFoundError/>;

        return (
            <div>Админ панель, ёпта</div>
        )
    }
}

export default connect(
    (state: StoreState) => ({
        user: state.currentUser
    })
)(AdminPanel);