import React from "react";
import './Comment.sass'
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
// @ts-ignore
import parser from 'bbcode-to-react';

type Props = {
    user: Unmei.UserType | undefined
    text: string
}

class Comment extends React.Component<Props> {
    render() {
        const { user, text } = this.props;
        if(!user) return <Loading/>;

        return (user &&
            <div className={'Comment'}>
                <img className={'Comment__User_Avatar'} src={user.avatar} alt={user.username}/>
                <div className="Comment__Content">
                    <Link to={`/user/${user.id}`} className="Comment__User_Username">{user.username}</Link>
                    <pre className={'Comment__Text'}>{parser.toReact(text)}</pre>
                </div>
            </div>
        );
    }
}

export default Comment;
