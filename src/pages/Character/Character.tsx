import React from "react";
import { fetchChar, fetchCharNovels } from "../../api/characters";
import './Character.sass'
// @ts-ignore
import parser from 'bbcode-to-react';
import NovelItem from "../../ui/NovelItem/NovelItem";
import NotFoundError from "../../components/NotFound/NotFoundError";
import { connect } from "react-redux";
import { setPreloader } from "../../store/ducks/preloader";
import { Helmet } from "react-helmet";

type Props = {
    match: { params: { charId: number } }
    setPreloader: SetPreloaderStatus
}

type State = {
    char: Unmei.CharacterType | null
    novels: Unmei.NovelType[]
    errorCode: number
};

class Character extends React.Component<Props, State> {
    state: State = {
        char: null, novels: [], errorCode: 0
    };

    componentDidMount = () => {
        const { setPreloader, match: { params: { charId } } } = this.props;

        setPreloader(true);
        fetchChar(charId).then(async char => {
            document.title = char.localized_name ? `${char.original_name} / ${char.localized_name}` : char.original_name;

            const novels = await fetchCharNovels(charId);
            this.setState({ novels, char });
            setPreloader(false);
        }).catch(r => this.setState({ errorCode: r.code }));
    };

    render() {
        const { char, novels, errorCode } = this.state;
        if(errorCode === 100) return <NotFoundError/>;
        if(!char) return null;
        return (
            <div className={'Character'}>
                <Helmet>
                    <title>{char.localized_name && char.localized_name !== char.original_name ? `${char.original_name} / ${char.localized_name}` : char.original_name}</title>
                    <meta name='description' content={char.description}/>
                </Helmet>

                <div className="Character__Main">
                    <img src={char.image} alt={char.original_name} className="Character__Image" />
                    <div className="Character__Info">
                        <div className="Character__Info_Name">
                            {char.original_name !== char.localized_name ? `${char.original_name} / ${char.localized_name}` : char.original_name}
                        </div>
                        <pre className="Character__Info_Description">{parser.toReact(char.description)}</pre>
                    </div>
                </div>
                {novels.length > 0 &&
                <div className="Character__Novels">
                    {novels.map(novel => <NovelItem {...novel} key={novel.id} viewType='grid'/>)}
                </div>}
            </div>
        );
    }
}

export default connect(
    null,
    dispatch => ({
        setPreloader: (s: boolean) => dispatch(setPreloader(s))
    })
)(Character);
