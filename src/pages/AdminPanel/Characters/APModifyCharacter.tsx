import React, { ChangeEvent } from "react";
import Input from "../../../ui/Input/Input";
import Title from "../../../ui/Title/Title";
import BBEditor from "../../../ui/BBEditor/BBEditor";
import Button from "../../../ui/Button/Button";
import Group from "../../../ui/Group/Group";
import NotFoundError from "../../../components/NotFound/NotFoundError";
// @ts-ignore
import parser from 'bbcode-to-react';
import ConfirmPopout from "../../../ui/ConfirmPopout/ConfirmPopout";
import { deleteChar, fetchChar, updateChar } from "../../../api/characters";
import './APCharacters.sass';
import { connect } from "react-redux";
import { setPreloader } from "../../../store/ducks/preloader";
import { setModal } from "../../../store/ducks/modal";
import { addNotification } from "../../../store/ducks/notifications";
import NotificationMessage from "../../../ui/Notifications/NotificationMessage";
import TextField from "../../../ui/TextField/TextField";
import errors from "../../../api/errors";
import { Helmet } from "react-helmet";

type Props = {
    match: { params: { id: number } }
    history: { push: (path: string) => void }
    setPopout: SetModal
    addNotification: AddNotification
    setPreloader: SetPreloaderStatus
};

type State = {
    char: Unmei.CharacterType | null
    originalName: string
    previewDescription: string
};

class APModifyCharacter extends React.Component<Props, State> {
    state: State = {
        char: null, originalName: '', previewDescription: ''
    }
    private description = React.createRef<HTMLTextAreaElement>();

    componentDidMount() {
        const { match: { params: { id } }, setPreloader } = this.props;

        setPreloader(true);
        fetchChar(id).then(char => {
            this.setState({ char });
            setPreloader(false);
        });
    }

    saveCharacter = (e: React.FormEvent) => {
        const { char } = this.state;
        const { addNotification } = this.props;

        e.preventDefault();
        if(!char) {
            addNotification(
                <NotificationMessage>
                    Персонаж - null!
                </NotificationMessage>
            );
            return;
        }
        updateChar(char).then(char => {
            addNotification(
                <NotificationMessage level={'success'}>
                    Персонаж #{char.id} сохранён!
                </NotificationMessage>
            );
            this.setState({ char });
        }).catch((err: Unmei.ApiError) => {
            addNotification(
                <NotificationMessage level={'error'}>
                    {errors[err.code] ?? err.text}
                </NotificationMessage>
            );
        });
    }

    onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const char = Object.assign({}, this.state.char);
        const target = event.target;
        // @ts-ignore
        char[target.name] = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ char });
    }

    previewDescription = () => {
        if(!this.description.current) return;
        this.setState({ previewDescription: parser.toReact(this.description.current.value) })
    }

    deleteChar = async (postId: number) => {
        await deleteChar(postId);
        this.props.history.push('/');
    }

    _deleteChar = () => {
        const { match: { params: { id} }, setPopout } = this.props;

        const popout = (
            <ConfirmPopout onConfirm={() => this.deleteChar(id)}>
                Вы уверены?
            </ConfirmPopout>
        );

        setPopout(popout);
    }

    render() {
        const { char, originalName, previewDescription } = this.state;

        if(!char) return <NotFoundError/>;
        return (
            <Group title={originalName}>
                <Helmet>
                    <title>{char.original_name} / Админ-панель</title>
                </Helmet>

                <form onSubmit={this.saveCharacter} className={'APCharacter'}>
                    <Input type="text" placeholder={'Оригинальное имя'} value={char.original_name} onChange={this.onChange} name={'original_name'}/>

                    <div className={'APCharacter__Description'}>
                        <Title>Описание</Title>
                        <BBEditor inputRef={this.description} value={char.description} onChange={this.onChange} placeholder={'Описание'} name={'description'}/>
                        {previewDescription.length > 0 && (<>
                            <Title>Предпросмотр</Title>
                            <TextField className={'APCharacter__Description_Preview'} value={previewDescription} onChange={()=>{}}/>
                        </>)}
                        <Button type={"button"} onClick={this.previewDescription}>Предпросмотр</Button>
                    </div>

                    <div>
                        <Button style={{ marginRight: '1rem' }}>Сохранить</Button>
                        <Button type={"button"} style={{ color: 'var(--error-bg-color)' }} onClick={this._deleteChar}>Удалить</Button>
                    </div>
                </form>
            </Group>
        );
    }
}

export default connect(
    null,
    dispatch => ({
        setPreloader: (s: boolean) => dispatch(setPreloader(s)),
        setPopout: (modal: React.ReactNode | null) => dispatch(setModal(modal)),
        addNotification: (notification: React.ReactNode) => dispatch(addNotification(notification))
    })
)(APModifyCharacter);
