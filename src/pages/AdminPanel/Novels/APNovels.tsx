import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../../ui/Button/Button";
import Group from "../../../ui/Group/Group";
import { fetchNovels } from "../../../api/novels";

type Props = {
    match: { path: string }
};

type State = {
    novels: NovelType[]
};

class APNovels extends React.Component<Props, State> {
    state: State = {
        novels: []
    }

    componentDidMount() {
        fetchNovels().then(novels => this.setState({ novels }));
    }

    render() {
        const { match: { path } } = this.props;
        const { novels } = this.state;

        return (
            <Group title={'Новелы'}>
                <Link to={`${path}/new`}>
                    <Button>Добавить новелу</Button>
                </Link>
                {novels.sort((a, b) => a.id-b.id).map(novel => (
                    <Link to={`${path}/${novel.id}`} key={novel.id}>
                        <div style={{ display: "flex" }}>
                            <div style={{ marginRight: '.5rem', fontWeight: 600 }}>{novel.id}</div>
                            <div>{novel.original_name}</div>
                        </div>
                    </Link>
                ))}
            </Group>
        )
    };
}

export default connect(
    (state: StoreState) => ({
        user: state.currentUser
    })
)(APNovels);
