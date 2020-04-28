import React from "react";
import {getPost} from "../../api/news";
import Loading from "../Loading";
import NotFoundError from "../NotFoundError";
import './Post.sass';

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

        getPost(postId).then(post => {
            this.setState({ post })
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
                <div className={'Post__Title'}>{post.title}</div>
                <div className="Post__Content">
                    {post.full_post}
                </div>
                <div className="Post__Footer">
                    Автор: {post.author}
                </div>
            </div>
        )
    }
}

export default Post;