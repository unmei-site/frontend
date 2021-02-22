import React, { ChangeEvent, FormEvent } from "react";
import Group from "../../../ui/Group/Group";
import NotFoundError from "../../../components/NotFoundError";
import './APNovels.sass';
import Input from "../../../ui/Input/Input";
import Button from "../../../ui/Button/Button";
import { connect } from "react-redux";
import { setModal } from "../../../store/ducks/modal";
import { addNotification } from "../../../store/ducks/notifications";
import { fetchGenres, fetchNovel, updateNovel } from "../../../api/novels";
// @ts-ignore
import parser from 'bbcode-to-react';
import TextField from "../../../ui/TextField/TextField";
import Select from "../../../ui/Select/Select";

type Props = {
    match: { params: { id: number }, path: string }
    history: { push: (path: string) => void }
    setPopout: (modal: React.ReactNode | null) => void
    addNotification: (notification: React.ReactNode) => void
};

type State = {
    novel: NovelType | null
    genres: GenreType[]
    title: string
};

class APModifyNovel extends React.Component<Props, State> {
    state: State = {
        novel: null, genres: [],
        title: ''
    }

    componentDidMount() {
        const { match } = this.props;

        fetchNovel(match.params.id).then(novel => {
            novel.release_date = new Date(novel.release_date);
            this.setState({ novel, title: novel.original_name });
        });
        fetchGenres().then(genres => this.setState({ genres }));
    }

    changeOriginalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        const { novel } = this.state;
        if(!novel) return;

        const newTitle = e.target.value;
        document.title = `${newTitle} / Админ-панель`;
        novel.original_name = newTitle;
        this.setState({ novel });
    }

    changeLocalizedTitle = (e: ChangeEvent<HTMLInputElement>) => {
        const { novel } = this.state;
        if(!novel) return;

        novel.localized_name = e.target.value;
        this.setState({ novel });
    }

    changeGenres = (e: ChangeEvent<HTMLSelectElement>) => {
        const { novel } = this.state;
        if(!novel) return;

        novel.genres = Array.from(e.target.selectedOptions).map(genre => {
            return this.state.genres.filter(g => g.name === genre.value)[0];
        });
        this.setState({ novel });
    }

    saveNovel = (e: FormEvent) => {
        e.preventDefault();
        const { novel } = this.state;
        if(!novel) return;
        updateNovel(novel).catch(err => {

        });
    }

    render() {
        const { novel, genres, title } = this.state;

        if(!novel) return <NotFoundError/>;
        return (
            <Group title={title}>
                <form className={'APNovel'} onSubmit={this.saveNovel}>
                    <Input type="text" className={'APNovel_Input'} placeholder={'Оригинальное название'} value={novel.original_name} onChange={this.changeOriginalTitle}/>
                    <Input type="text" className={'APNovel_Input'} placeholder={'Название на русском'} value={novel.localized_name} onChange={this.changeLocalizedTitle}/>

                    <TextField className={'APNovel_TextField'} placeholder={'Описание'} style={{ height: 100 }} value={novel.description} onChange={(e) => {
                        novel.description = e.target.value;
                        this.setState({ novel });
                    }}/>

                    <label style={{ display: 'flex', alignItems: "center" }}>
                        <span style={{ marginRight: 8 }}>Жанры:</span>
                        <Select
                            multiple
                            onChange={this.changeGenres}
                            value={novel.genres.map(genre => genre.name)}
                        >
                            {genres.map(genre => (
                                <option
                                    key={genre.id}
                                    value={genre.name}
                                >
                                    {genre.localized_name}
                                </option>
                            ))}
                        </Select>
                    </label>

                    <label>
                        <span style={{ marginRight: 8 }}>Дата выхода:</span>
                        <input
                            type="date"
                            value={novel.release_date.toISOString().substring(0, 10)}
                            onChange={e => {
                                novel.release_date = new Date(e.target.value);
                                this.setState({ novel });
                            }}
                        />
                    </label>

                    <div>
                        <Button style={{ marginRight: '1rem' }} className={'APNovel_Button'}>Сохранить</Button>
                        <Button style={{ color: 'var(--error-bg-color)' }} className={'APNovel_Button'} type={"button"}>Удалить</Button>
                    </div>
                </form>
            </Group>
        );
    }
}

export default connect(null,
    dispatch => ({
        setPopout: (modal: React.ReactNode | null) => dispatch(setModal(modal)),
        addNotification: (notification: React.ReactNode) => dispatch(addNotification(notification))
    })
)(APModifyNovel);
