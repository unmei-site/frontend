import React, { Suspense } from "react";
import Loading from "../../components/Loading";
import { fetchNews } from "../../api/news";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
const NewsPost = React.lazy(() => import('../../ui/NewsPost/NewsPost'));

type State = {
    news: Unmei.PostType[]
}

class AllNews extends React.Component<{}, State> {
    state: State = {
        news: []
    };

    componentDidMount() {
        document.title = 'Новости';
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
                <Helmet>
                    <title>Новости</title>
                </Helmet>

                <div className="News__Title">
                    Новости
                </div>

                <Suspense fallback={<Loading/>}>
                    {news.map(post => (
                        <Link key={post.id} to={`/news/${post.id}`}>
                            <NewsPost {...post} />
                        </Link>
                    ))}
                </Suspense>
            </div>
        );
    }
}

export default AllNews;
