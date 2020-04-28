import React from "react";
import Loading from "../Loading";
import {getNews} from "../../api/news";

type State = {
    news: PostType[]
}

class AllNews extends React.Component<{}, State> {
    state: State = {
        news: []
    };

    componentDidMount() {
        document.title = 'Новости';
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
                    Новости
                </div>
                {news.map(post => (
                    <div className={'Post'} key={post.id}>
                        <div className="Post__Title">{post.title}</div>
                        <div className="Post__Content">{post.short_post}</div>
                        <div className="Post__Footer">
                            <div>Автор: {post.author}</div>
                            <div>Дата: {post.date.toLocaleDateString()}, {post.date.toLocaleTimeString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default AllNews;