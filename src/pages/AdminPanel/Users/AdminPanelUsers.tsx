import React from "react";
import {connect} from "react-redux";
import {fetchUsers} from "../../../api/users";
import {Link} from "react-router-dom";

type Props = {
    path: string
};

type State = {
    users: UserType[]
};

class AdminPanelUsers extends React.Component<Props, State> {
    state: State = {
        users: []
    }

    componentDidMount() {
        fetchUsers().then(users => this.setState({ users }));
    }

    render() {
        const { users } = this.state;
        const { path } = this.props;

        return (
            <div>
                <div style={{ textAlign: "center", fontWeight: 600, fontSize: '1.5rem' }}>Пользователи</div>
                <div>
                    {users.sort((a, b) => a.id - b.id).map(user => (
                        <Link to={`${path}/${user.id}`} key={user.id}>
                            <div style={{ display: "flex" }}>
                                <div style={{ marginRight: '.5rem', fontWeight: 600 }}>{user.id}</div>
                                <div>{user.username}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )
    }
}

export default connect(
    (state: StoreState) => ({
        user: state.currentUser
    })
)(AdminPanelUsers);
