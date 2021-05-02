import React from "react";
import { Link } from "react-router-dom";

import Loading from "../../components/Loading";
import NewsPost from "../../ui/NewsPost/NewsPost";

import { fetchNews } from "../../api/news";

type State = {
    news: Unmei.PostType[]
}

class News extends React.Component<{}, State> {
    state: State = {
        news: []
    };

    componentDidMount() {
        fetchNews().then(news => {
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
                {news.slice(0, 3).sort((a, b) => b.id-a.id).map(post => (
                    <Link key={post.id} to={`/news/${post.id}`}>
                        <NewsPost {...post} />
                    </Link>
                ))}
            </div>
        );
    }
}

export default News;
