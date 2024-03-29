import React, { Suspense } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBold,
    faExclamationTriangle,
    faItalic,
    faStrikethrough,
    faTint,
    faUnderline
} from "@fortawesome/free-solid-svg-icons";
import './Comments.sass';
import Loading from "../../components/Loading";
import { fetchUser } from "../../api/users";
import { connect } from "react-redux";
import NotificationMessage from "../../ui/Notifications/NotificationMessage";
import Button from "../../ui/Button/Button";
import { addNotification } from "../../store/ducks/notifications";

const Comment = React.lazy(() => import('../../ui/Comment/Comment'));

type Props = {
    comments: Unmei.CommentType[]
    commentsLoaded: boolean
    hasMore: boolean
    user: Unmei.UserType
    loadMore: () => void
    sendComment: (text: string) => void
    addNotification: (notification: React.ReactNode) => void
};

type State = {
    commentText: string
    users: Map<number, Unmei.UserType>
};

class Comments extends React.Component<Props, State> {
    input: HTMLTextAreaElement | null = null;
    state: State = {
        commentText: '', users: new Map()
    };

    addTagToComment = (event: React.MouseEvent, tag: string, defaultValue?: string) => {
        event.preventDefault();
        if(!this.input) {
            console.error('Input not initialized!');
            return;
        }
        let { commentText } = this.state;
        const [start, end] = [this.input.selectionStart, this.input.selectionEnd];

        const openTag = `${tag}${defaultValue ? `=${defaultValue}` : ''}`;
        this.setState({ commentText: `${commentText.slice(0, start)}[${openTag}]${commentText.slice(start, end)}[/${tag}]${commentText.slice(end, commentText.length)}` });
        this.input.focus();
    };

    sendComment = (event: React.FormEvent) => {
        event.preventDefault();
        const { sendComment, addNotification } = this.props;
        const { commentText } = this.state;

        if(commentText === '') {
            const notification = (
                <NotificationMessage level={"error"}>
                    Пустой комментарий
                </NotificationMessage>
            );
            addNotification(notification);
        } else {
            sendComment(commentText);
            this.setState({ commentText: '' });
        }
    };

    componentDidUpdate(prevProps: Readonly<Props>) {
        const { comments } = this.props;

        if(prevProps.comments.length !== comments.length) {
            let { users } = this.state;

            comments.forEach(async comment => {
                if(!users.has(comment.user_id)) {
                    const user = await fetchUser(comment.user_id);
                    users = users.set(comment.user_id, user);
                    this.setState({ users });
                }
            });
        }
    }

    async componentDidMount() {
        const { comments } = this.props;
        let { users } = this.state;

        for(let comment of comments)
            if(!users.has(comment.user_id))
                users = users.set(comment.user_id, await fetchUser(comment.user_id));
        this.setState({ users });
    }

    render() {
        const { user, comments, commentsLoaded, hasMore, loadMore } = this.props;
        const { users, commentText } = this.state;
        if(!user)
            return <Loading/>;

        return (
            <div className="Comments">
                {user.authorized &&
                <form onSubmit={this.sendComment}>
                    <div className="Comments_BBCodes">
                        <FontAwesomeIcon onClick={event => this.addTagToComment(event, 'b')} icon={faBold}/>
                        <FontAwesomeIcon onClick={event => this.addTagToComment(event, 'i')} icon={faItalic}/>
                        <FontAwesomeIcon onClick={event => this.addTagToComment(event, 'u')} icon={faUnderline}/>
                        <FontAwesomeIcon onClick={event => this.addTagToComment(event, 's')} icon={faStrikethrough}/>
                        <FontAwesomeIcon onClick={event => this.addTagToComment(event, 'spoiler')}
                                         icon={faExclamationTriangle}/>
                        <FontAwesomeIcon onClick={event => this.addTagToComment(event, 'color', 'white')}
                                         icon={faTint}/>
                    </div>
                    <textarea
                        className={'Comments_TextArea'}
                        placeholder={'Текст комментария'}
                        value={commentText}
                        onChange={(event) => this.setState({ commentText: event.target.value })}
                        ref={ref => this.input = ref}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Button type="submit" className={'Comments_Submit'}>Написать</Button>
                        </div>
                        {hasMore && <Button onClick={loadMore} role={'button'}>Загрузить ещё</Button>}
                    </div>
                </form>}
                {!commentsLoaded && <Loading/>}
                {comments.length > 0 ? (<Suspense fallback={<Loading/>}>
                    {comments.map(comment => (
                        <Comment text={comment.text} key={comment.id} user={users.get(comment.user_id)}/>
                    ))}
                </Suspense>) : (
                    'Никто не оставил комментарий к этой новелле... :c'
                )}
            </div>
        );
    }
}

export default connect(null,
    dispatch => ({
        addNotification: (notification: React.ReactNode) => dispatch(addNotification(notification))
    })
)(Comments);
