import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchNovels } from "../../../api/novels";
import Group from "../../../ui/Group/Group";
import Button from "../../../ui/Button/Button";
import { Helmet } from "react-helmet";

type Props = {
    match: { path: string }
};

type State = {
    novels: Unmei.NovelType[]
};

class APNovels extends React.Component<Props, State> {
    state: State = {
        novels: []
    }

    componentDidMount() {
        fetchNovels().then(novels => this.setState({ novels }));
    }

    render() {
        const { novels } = this.state;
        const { match: { path } } = this.props;

        return (
            <Group title={'Новеллы'}>
                <Helmet>
                    <title>Новеллы</title>
                </Helmet>

                <Link to={`${path}/new`}>
                    <Button>Добавить новеллу</Button>
                </Link>
                {novels.sort((a, b) => a.id - b.id).map(novel => (
                    <Link to={`${path}/${novel.id}`} key={novel.id}>
                        <div style={{ display: "flex" }}>
                            <div style={{ marginRight: '.5rem', fontWeight: 600 }}>{novel.id}</div>
                            <div style={{ marginRight: '2rem' }}>{novel.original_name}</div>
                            <div>{novel.localized_name}</div>
                        </div>
                    </Link>
                ))}
            </Group>
        )
    }
}

export default connect(
    (state: StoreState) => ({
        user: state.currentUser
    })
)(APNovels);
