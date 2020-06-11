import React from "react";
import {fetchChar, fetchCharNovels} from "../../api/characters";
import './Character.sass'
// @ts-ignore
import parser from 'bbcode-to-react';
import NovelItem from "../NovelItem/NovelItem";
import Loading from "../Loading";
import NotFoundError from "../NotFoundError";

type Props = {
    match: { params: { charId: number } }
}

type State = {
    char: CharacterType | null
    novels: NovelType[]
    errorCode: number
};

class Character extends React.Component<Props, State> {
    state: State = {
        char: null, novels: [], errorCode: 0
    };

    componentDidMount = () => {
        const { charId } = this.props.match.params;
        fetchChar(charId).then(char => {
            this.setState({ char });
            document.title = char.localized_name ? `${char.original_name} / ${char.localized_name}` : char.original_name;
        }).catch(r => this.setState({ errorCode: r.code }));
        fetchCharNovels(charId).then(novels => this.setState({ novels }));
    };

    render() {
        const { char, novels, errorCode } = this.state;
        if(errorCode === 100) return <NotFoundError/>;
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
                {novels.length > 0 &&
                <div className="Character__Novels">
                    {novels.map(novel => <NovelItem {...novel} key={novel.id} viewType='grid' />)}
                </div>}
            </div>
        );
    }
}

export default Character;