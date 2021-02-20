import React from "react";
import { fetchNews } from "../../../api/news";
import Group from "../../../ui/Group/Group";
import { Link } from "react-router-dom";
import Button from "../../../ui/Button/Button";

type Props = {
    match: { path: string }
};

type State = {
    news: PostType[]
};

class APNews extends React.Component<Props, State> {
    state: State = {
        news: []
    }

    componentDidMount() {
        fetchNews().then(news => this.setState({ news }));
    }

    render() {
        const { news } = this.state;
        const { match: { path } } = this.props;

        return (
            <Group title={'Новости'}>
                <Link to={`${path}/new`}>
                    <Button>Добавить новость</Button>
                </Link>
                {news.map(post => (
                    <Link to={`${path}/${post.id}`} key={post.id}>
                        <div style={{ display: "flex" }}>
                            <div style={{ marginRight: '.5rem', fontWeight: 600 }}>{post.id}</div>
                            <div>{post.title}</div>
                        </div>
                    </Link>
                ))}
            </Group>
        )
    }
}

export default APNews;
