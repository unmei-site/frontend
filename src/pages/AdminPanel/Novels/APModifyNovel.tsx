import React, { ChangeEvent, FormEvent } from "react";
import { connect } from "react-redux";

import './APNovel.sass';

import Loading from "../../../components/Loading";

import { addNotification } from "../../../store/ducks/notifications";
import { setPreloader } from "../../../store/ducks/preloader";

import { fetchNovel, updateNovel, uploadNovelCover } from "../../../api/novels";

import NotificationMessage from "../../../ui/Notifications/NotificationMessage";
import Button from "../../../ui/Button/Button";
import Title from "../../../ui/Title/Title";
import BBEditor from "../../../ui/BBEditor/BBEditor";
import Group from "../../../ui/Group/Group";
import Input from "../../../ui/Input/Input";
import Select from "../../../ui/Select/Select";
import Option from "../../../ui/Select/Option";

import { fetchGenres } from "../../../api/genres";
// @ts-ignore
import parser from 'bbcode-to-react';
import { Helmet } from "react-helmet";

type Props = {
    match: { params: { id: number } }
    addNotification: (notification: React.ReactNode) => void
    setPreloader: SetPreloaderStatus
};

type State = {
    novel: Unmei.NovelType | null
    genres: Unmei.GenreType[]
    cover: File | null
    originalName: string
    previewDescription: string
};

class APModifyNovel extends React.Component<Props, State> {
    state: State = {
        novel: null, originalName: '',
        genres: [], cover: null,
        previewDescription: ''
    }
    private description = React.createRef<HTMLTextAreaElement>();

    componentDidMount() {
        const { match: { params: { id } }, setPreloader } = this.props;

        setPreloader(true);
        fetchNovel(id).then(async novel => {
            novel.release_date = new Date(novel.release_date);
            const genres = await fetchGenres();
            this.setState({ novel, genres, originalName: novel.original_name });
            setPreloader(false);
        });
    }

    onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const novel = Object.assign({}, this.state.novel);
        const target = event.target;
        // @ts-ignore
        novel[target.name] = target.type === 'checkbox' ? target.checked : target.value;
        if(target.type === 'date')
            novel.release_date = new Date(novel.release_date);
        this.setState({ novel });
    }

    onChangeCover = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if(!files) return;
        this.setState({ cover: files[0] });
    }

    saveCover = () => {
        const { novel, cover } = this.state;
        if(cover && novel) {
            const formData = new FormData();
            formData.append('cover', cover);
            uploadNovelCover(novel.id, formData).then(console.log)
        }
    }

    onSubmit = (event: FormEvent) => {
        event.preventDefault();
        const { novel } = this.state;
        const { addNotification } = this.props;

        if(novel === null) {
            const notification = (
                <NotificationMessage level={"error"}>
                    Новелла - null!
                </NotificationMessage>
            );
            addNotification(notification);
            return;
        }
        updateNovel(novel).then(() => {
            this.saveCover();
            const notification = (
                <NotificationMessage level={"success"}>
                    Новелла успешно изменена
                </NotificationMessage>
            );
            addNotification(notification)
        });
    }

    changeGenres = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions);
        const { novel, genres } = this.state;
        if(!novel) return;
        const selectedGenres = selected.map(el => genres.filter(genre => genre.id === parseInt(el.value))[0]);
        novel.genres = selectedGenres;
        this.setState({ novel });
    }

    previewDescription = () => {
        if(!this.description.current) return;
        this.setState({ previewDescription: parser.toReact(this.description.current.value) });
    }

    render() {
        const { novel, genres, originalName, previewDescription } = this.state;

        if(!novel) return <Loading/>;
        return (
            <Group title={originalName}>
                <Helmet>
                    <title>{novel.original_name} / Админ-панель</title>
                </Helmet>

                <form className={'APNovel'} onSubmit={this.onSubmit}>
                    <Input type="text" onChange={this.onChange} name={'original_name'} value={novel.original_name}/>
                    <Input type='text' onChange={this.onChange} name={'localized_name'} value={novel.localized_name}/>
                    <label>Демо? <Input type="checkbox" checked={novel.is_demo} onChange={this.onChange} name='is_demo'/></label>
                    <label><Input type="file" onChange={this.onChangeCover}/></label>
                    <label>Дата выхода: <Input type="date" name='release_date' value={novel.release_date.toISOString().substring(0, 10)} onChange={this.onChange}/></label>

                    <label>Жанры:
                        <Select multiple onChange={this.changeGenres} value={novel.genres.map(g => g.id.toString())}>
                            {genres.map(genre => (
                                <Option value={genre.id} key={genre.id}>{genre.localized_name}</Option>
                            ))}
                        </Select>
                    </label>

                    <div className={'APNovel_Description'}>
                        <Title>Описание</Title>
                        <BBEditor inputRef={this.description} value={novel.description} name={'description'} onChange={this.onChange} placeholder={'Описание'}/>
                        {previewDescription.length > 0 && (<>
                            <Title>Предпросмотр</Title>
                            <div>{previewDescription}</div>
                        </>)}
                        <Button type={"button"} onClick={this.previewDescription}>Предпросмотр</Button>
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <Button>Сохранить!</Button>
                    </div>
                </form>
            </Group>
        );
    }
}

export default connect(
    (state: StoreState) => ({
        user: state.currentUser
    }),
    (dispatch) => ({
        addNotification: (notification: React.ReactNode) => dispatch(addNotification(notification)),
        setPreloader: (status: boolean) => dispatch(setPreloader(status))
    })
)(APModifyNovel);
