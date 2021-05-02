import React from "react";
import Group from "../../../ui/Group/Group";
import { Link } from "react-router-dom";
import Button from "../../../ui/Button/Button";
import { fetchChars } from "../../../api/characters";
import { Helmet } from "react-helmet";

type Props = {
    match: { path: string }
}

type State = {
    characters: Unmei.CharacterType[]
}

class APCharacters extends React.Component<Props, State> {
    state: State = {
        characters: []
    }

    componentDidMount() {
        fetchChars().then(characters => this.setState({ characters }));
    }

    render() {
        const { characters } = this.state;
        const { match: { path } } = this.props;

        return (
            <Group title={'Персонажи'}>
                <Helmet>
                    <title>Персонажи</title>
                </Helmet>

                <Link to={`${path}/new`}>
                    <Button>Добавить персонажа</Button>
                </Link>
                {characters.map(char => (
                    <Link to={`${path}/${char.id}`} key={char.id}>
                        <div style={{ display: "flex" }}>
                            <div style={{ marginRight: '.5rem', fontWeight: 600 }}>{char.id}</div>
                            <div>{char.original_name}</div>
                        </div>
                    </Link>
                ))}
            </Group>
        );
    }
}

export default APCharacters;
