import React from "react";
import {getNews} from "../../api/news";
import Loading from "../Loading";
import {Link} from "react-router-dom";

type State = {
    news: PostType[]
}

class News extends React.Component<{}, State> {
    state: State = {
        news: []
    };

    componentDidMount() {
        getNews().then((news: PostType[]) => {
            news.forEach(p => p.date = new Date(p.date));
            this.setState({ news })
        });
    }

    render() {
        const { news } = this.state;

        if(news.length === 0) return <Loading/>;
        return (
            <div className="News">
                <div className="News__Title">
                    <div>Новости</div>
                    <Link to={'/news'}>Все новости</Link>
                </div>
                {news.slice(0, 5).map(post => (
                    <div className={'Post'} key={post.id}>
                        <div className="Post__Title"><Link to={`/news/${post.id }`}>{post.title}</Link></div>
                        <div className="Post__Content">{post.short_post}</div>
                        <div className="Post__Footer">
                            <div>
                                Автор: <Link to={`/user/${post.author_id}`}>{post.author}</Link>
                            </div>
                            <div>Дата: {post.date.toLocaleDateString()}, {post.date.toLocaleTimeString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default News;