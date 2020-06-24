import React from "react";
import {fetchPost} from "../../api/news";
import Loading from "../../ui/Loading";
import NotFoundError from "../NotFoundError";
import './Post.sass'
import {Link} from "react-router-dom";
// @ts-ignore
import parser from 'bbcode-to-react';

type Props = {
    match: { params: { postId: number } }
};

type State = {
    post: PostType | null
    code: number
};

class Post extends React.Component<Props, State> {
    state: State = {
        post: null, code: 0
    };

    componentDidMount(): void {
        const { match: { params: { postId }} } = this.props;

        fetchPost(postId).then((post: PostType) => {
            post.date = new Date(post.date);
            this.setState({ post });
        }).catch((error: ApiError) => {
            this.setState({ code: error.code })
        });
    }

    render() {
        const { post, code } = this.state;
        
        if(code === 100) return <NotFoundError/>;
        if(!post) return <Loading/>;
        return (
            <div className={'Post'}>
                <div className="Post__Title">{post.title}</div>
                <pre className='Post__Content'>{parser.toReact(post.short_post)}</pre>
                <div className="Post__Footer">
                    <div>
                        Автор: <Link to={`/user/${post.author_id}`}>{post.author}</Link>
                    </div>
                    <div>Дата: {post.date.toLocaleDateString()}, {post.date.toLocaleTimeString()}</div>
                </div>
            </div>
        )
    }
}

export default Post;