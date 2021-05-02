import React from "react";
import { fetchUsers } from "../../api/users";
import Loading from "../../components/Loading";
import './Users.sass';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

type Props = {}

type State = {
    users: Unmei.UserType[]
}

class Users extends React.Component<Props, State> {
    state: State = {
        users: []
    }

    componentDidMount() {
        fetchUsers().then(users => this.setState({ users }))
    }

    render() {
        const { users } = this.state;
        if(users.length === 0) return <Loading/>;

        return (
            <div className={'Users'}>
                <Helmet>
                    <title>Пользователи</title>
                </Helmet>

                {users.map(user => (
                    <Link className={'Users__User'} key={user.id} to={`user/${user.id}`}>
                        <div className="Users__User_Avatar"
                             style={{ backgroundImage: `url(${user.avatar}?s=96?t=${new Date().getTime()})` }}/>
                        {user.username}
                    </Link>
                ))}
            </div>
        )
    }
}

export default Users;
