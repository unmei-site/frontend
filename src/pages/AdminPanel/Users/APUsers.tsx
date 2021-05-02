import React from "react";
import { connect } from "react-redux";
import { fetchUsers } from "../../../api/users";
import { Link } from "react-router-dom";
import Group from "../../../ui/Group/Group";
import { Helmet } from "react-helmet";

type Props = {
    match: { path: string }
};

type State = {
    users: Unmei.UserType[]
};

class APUsers extends React.Component<Props, State> {
    state: State = {
        users: []
    }

    componentDidMount() {
        fetchUsers().then(users => this.setState({ users }));
    }

    render() {
        const { users } = this.state;
        const { match: { path } } = this.props;

        return (
            <Group title={'Пользователи'}>
                <Helmet>
                    <title>Пользователи</title>
                </Helmet>

                {users.sort((a, b) => a.id - b.id).map(user => (
                    <Link to={`${path}/${user.id}`} key={user.id}>
                        <div style={{ display: "flex" }}>
                            <div style={{ marginRight: '.5rem', fontWeight: 600 }}>{user.id}</div>
                            <div>{user.username}</div>
                        </div>
                    </Link>
                ))}
            </Group>
        )
    }
}

export default connect(
    (state: StoreState) => ({
        user: state.currentUser
    })
)(APUsers);
