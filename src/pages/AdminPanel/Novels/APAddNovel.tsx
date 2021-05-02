import React, { ChangeEvent, FormEvent } from "react";
import { connect } from "react-redux";

import './APNovel.sass';

import Input from "../../../ui/Input/Input";
import Button from "../../../ui/Button/Button";
import BBEditor from "../../../ui/BBEditor/BBEditor";
import Title from "../../../ui/Title/Title";
import Group from "../../../ui/Group/Group";
import NotificationMessage from "../../../ui/Notifications/NotificationMessage";

import { createNovel } from "../../../api/novels";
import { fetchGenres } from '../../../api/genres'

import { setModal } from "../../../store/ducks/modal";
import { addNotification } from "../../../store/ducks/notifications";
// @ts-ignore
import parser from 'bbcode-to-react';
import { Helmet } from "react-helmet";

type Props = {
    history: { push: (path: string) => void }
    setPopout: (modal: React.ReactNode | null) => void
    addNotification: (notification: React.ReactNode) => void
};

type State = {
    novel: Unmei.NovelType
    genres: Unmei.GenreType[]

    previewDescription: string
};

class APAddNovel extends React.Component<Props, State> {
    state: State = {
        novel: {} as Unmei.NovelType, genres: [],
        previewDescription: '',
    }
    private description = React.createRef<HTMLTextAreaElement>();

    saveNovel = async(event: FormEvent) => {
        event.preventDefault();

        const { novel } = this.state;
        if(!this.description.current)
            return;

        novel.description = this.description.current.value;
        const { addNotification } = this.props;

        createNovel(novel).then(createdNovel => {
            const notification = (
                <NotificationMessage level={"success"}>
                    Успешно создана новелла с ID {createdNovel.id}!
                </NotificationMessage>
            );
            addNotification(notification);
            this.props.history.push('/');
        });
    }

    componentDidMount() {
        fetchGenres().then(genres => this.setState({ genres }));
    }

    previewDescription = () => {
        if(!this.description.current) return;
        this.setState({ previewDescription: parser.toReact(this.description.current.value) })
    }

    changeOriginalName = (event: ChangeEvent<HTMLInputElement>) => {
        const { novel } = this.state;
        novel.original_name = event.target.value;
        this.setState({ novel: novel });
    }

    changeLocalizedName = (event: ChangeEvent<HTMLInputElement>) => {
        const { novel } = this.state;
        novel.localized_name = event.target.value;
        this.setState({ novel });
    }

    changeGenres = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions);
        console.log(selected.forEach(el => el.value))
    }

    onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const novel = Object.assign({}, this.state.novel);
        const target = event.target;
        // @ts-ignore
        novel[target.name] = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ novel });
    }

    render() {
        const { novel, genres, previewDescription } = this.state;

        return (
            <Group title={'Новая новелла'}>
                <Helmet>
                    <title>{novel.original_name ? `${novel.original_name} / Админ-панель` : 'Новая новелла'}</title>
                </Helmet>

                <form onSubmit={this.saveNovel} className='APNovel'>
                    <Input type="text" placeholder={'Оригинальное название'} value={novel.original_name} onChange={this.changeOriginalName}/>
                    <Input type="text" placeholder={'Имя на русском'} value={novel.localized_name} onChange={this.changeLocalizedName}/>
                    <label>Демо? <Input type="checkbox" checked={novel.is_demo} onChange={this.onChange} name='is_demo'/></label>
                    
                    <label>Жанры:
                        <select multiple onChange={this.changeGenres}>
                            {genres.map(genre => (
                                <option value={genre.id}>{genre.localized_name}</option>
                            ))}
                        </select>
                    </label>

                    <div className={'APNovel__Description'}>
                        <Title>Описание</Title>
                        <BBEditor inputRef={this.description} placeholder={'Описание'}/>
                        {previewDescription.length > 0 && (<>
                            <Title>Предпросмотр</Title>
                            <div>{previewDescription}</div>
                        </>)}
                        <Button type={"button"} onClick={this.previewDescription}>Предпросмотр</Button>
                    </div>

                    <div>
                        <Button style={{ marginRight: '1rem' }}>Сохранить</Button>
                    </div>
                </form>
            </Group>
        )
    }
}

export default connect(null,
    dispatch => ({
        setPopout: (modal: React.ReactNode | null) => dispatch(setModal(modal)),
        addNotification: (notification: React.ReactNode) => dispatch(addNotification(notification))
    })
)(APAddNovel);
