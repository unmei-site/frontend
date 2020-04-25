import React from "react";
import {fetchChar, fetchCharNovels} from "../../api/characters";
import './Character.sass'
// @ts-ignore
import parser from 'bbcode-to-react';
import NovelItem from "../NovelItem/NovelItem";
import Loading from "../Loading";

type Props = {
    match: { params: { id: number } }
}

type State = {
    char: CharacterType | null
    novels: NovelType[] | null
};

class Character extends React.Component<Props, State> {
    state: State = {
        char: null, novels: null
    };

    componentDidMount = () => {
        const { id } = this.props.match.params;
        fetchChar(id).then(char => {
            this.setState({ char });
            document.title = char.localized_name ? `${char.original_name} / ${char.localized_name}` : char.original_name;
        });
        fetchCharNovels(id).then(novels => this.setState({ novels }));
    };

    render() {
        const { char, novels } = this.state;
        if(!char) return <Loading/>;
        return (
            <div className={'Character'}>
                <div className="Character__Main">
                    <div style={{ backgroundImage: `url(${char.image})` }} className="Character__Image"/>
                    <div className="Character__Info">
                        <div className="Character__Info_Name">
                            {char.original_name !== char.localized_name ? (
                                `${char.original_name} / ${char.localized_name}`
                            ) : char.original_name}
                        </div>
                        <pre className="Character__Info_Description">{parser.toReact(char.description)}</pre>
                    </div>
                </div>
                {novels &&
                <div className="Character__Novels">
                    {novels.map(novel => <NovelItem {...novel} key={novel.id} />)}
                </div>}
            </div>
        );
    }
}

export default Character;