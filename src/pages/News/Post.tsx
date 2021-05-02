import React from "react";
import { fetchPost } from "../../api/news";
import Loading from "../../components/Loading";
import NotFoundError from "../../components/NotFound/NotFoundError";
import './Post.sass'
import { Link } from "react-router-dom";
// @ts-ignore
import parser from 'bbcode-to-react';
import { connect } from "react-redux";
import { setPreloader } from "../../store/ducks/preloader";
import { Helmet } from "react-helmet";

type Props = {
    match: { params: { postId: number } }
    setPreloader: SetPreloaderStatus
};

type State = {
    post: Unmei.PostType | null
    code: number
};

class Post extends React.Component<Props, State> {
    state: State = {
        post: null, code: 0
    };

    componentDidMount(): void {
        const { match: { params: { postId } }, setPreloader } = this.props;

        setPreloader(true);
        fetchPost(postId).then(post => {
            post.date = new Date(post.date);
            this.setState({ post });
            setPreloader(false);
        }).catch((err: Unmei.ApiError) => {
            this.setState({ code: err.code })
        });
    }

    render() {
        const { post, code } = this.state;

        if(code === 100) return <NotFoundError/>;
        if(!post) return <Loading/>;
        return (
            <div className={'Post'}>
                <Helmet>
                    <title>{post.title}</title>
                    <meta name='description' content={post.short_post}/>

                    <meta property="og:title" content={post.title} />
                    <meta property="og:description" content={post.short_post} />
                </Helmet>

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

export default connect(
    null,
    dispatch => ({
        setPreloader: (s: boolean) => dispatch(setPreloader(s))
    })
)(Post);
