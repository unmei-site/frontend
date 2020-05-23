import React from "react";
import {fetchUsers} from "../../api/users";
import Loading from "../Loading";
import './Users.sass';
import {Link} from "react-router-dom";

type Props = {

}

type State = {
    users: UserType[]
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
                {users.map(user => (
                    <Link className={'Users__User'} key={user.id} to={`user/${user.id}`}>
                        <div className="Users__User_Avatar" style={{ backgroundImage: `url(${user.avatar})` }}/>
                        {user.username}
                    </Link>
                ))}
            </div>
        )
    }
}

export default Users;