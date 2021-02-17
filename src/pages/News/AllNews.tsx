import React from "react";
import Loading from "../../ui/Loading";
import { fetchNews } from "../../api/news";
import NewsPost from "../../ui/NewsPost/NewsPost";
import { Link } from "react-router-dom";

type State = {
    news: PostType[]
}

class AllNews extends React.Component<{}, State> {
    state: State = {
        news: []
    };

    componentDidMount() {
        document.title = 'Новости';
        fetchNews().then((news: PostType[]) => {
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
                {/*{<RoundProgressBar progress={50} alternative color={'red'}/>}*/}
                {news.map(post => (
                    <Link key={post.id} to={`/post/${post.id}`}>
                        <NewsPost {...post} />
                    </Link>
                ))}
            </div>
        );
    }
}

export default AllNews;
