import React, { ChangeEvent, FormEvent } from "react";
import Group from "../../../ui/Group/Group";
import { createPost } from "../../../api/news";
import './APNews.sass';
import '../../../ui/TextField/TextField.sass'
import Input from "../../../ui/Input/Input";
import Button from "../../../ui/Button/Button";
import BBEditor from "../../../ui/BBEditor/BBEditor";
// @ts-ignore
import parser from 'bbcode-to-react';
import Title from "../../../ui/Title/Title";
import { connect } from "react-redux";
import NotificationMessage from "../../../ui/Notifications/NotificationMessage";
import { setModal } from "../../../store/ducks/modal";
import { addNotification } from "../../../store/ducks/notifications";
import { Helmet } from "react-helmet";

type Props = {
    history: { push: (path: string) => void }
    setPopout: (modal: React.ReactNode | null) => void
    addNotification: (notification: React.ReactNode) => void
};

type State = {
    post: Unmei.PostType

    previewShort: string
    previewFull: string
};

class APAddPost extends React.Component<Props, State> {
    state: State = {
        post: {} as Unmei.PostType,
        previewShort: '', previewFull: ''
    }
    private shortPost = React.createRef<HTMLTextAreaElement>();
    private fullPost = React.createRef<HTMLTextAreaElement>();

    savePost = async(event: FormEvent) => {
        event.preventDefault();

        const { post } = this.state;
        if(!this.shortPost.current || !this.fullPost.current)
            return;

        post.short_post = this.shortPost.current.value;
        post.full_post = this.fullPost.current.value;
        const { addNotification } = this.props;

        createPost(post).then(createdPost => {
            const notification = (
                <NotificationMessage level={"success"}>
                    Успешно создана новость с ID {createdPost.id}!
                </NotificationMessage>
            );
            addNotification(notification);
            this.props.history.push('/');
        });
    }

    previewShort = () => {
        if(!this.shortPost.current) return;
        this.setState({ previewShort: parser.toReact(this.shortPost.current.value) })
    }

    previewFull = () => {
        if(!this.fullPost.current) return;
        this.setState({ previewFull: parser.toReact(this.fullPost.current.value) })
    }

    changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        const { post } = this.state;
        post.title = event.target.value;
        document.title = event.target.value || 'Unmei';
        this.setState({ post });
    }

    render() {
        const { post, previewShort, previewFull } = this.state;

        return (
            <Group title='Новая новость'>
                <Helmet>
                    <title>{post.title ? `${post.title} / Админ-панель` : 'Новая новость'}</title>
                </Helmet>

                <form onSubmit={this.savePost} className={'APPost'}>
                    <Input type="text" placeholder={'Заголовок'} value={post.title ?? ''} onChange={this.changeTitle}/>

                    <div className={'APPost__Short'}>
                        <Title>Короткая новость</Title>
                        <BBEditor inputRef={this.shortPost} placeholder={'Короткая новость'}/>
                        {previewShort.length > 0 && (<>
                            <Title>Предпросмотр</Title>
                            <div className={'APPost__Short_Preview TextField'}>{previewShort}</div>
                        </>)}
                        <Button type={"button"} onClick={this.previewShort}>Предпросмотр</Button>
                    </div>

                    <div className={'APPost__Full'}>
                        <Title>Полная новость</Title>
                        <BBEditor inputRef={this.fullPost} placeholder={'Полная новость'}/>
                        {previewFull.length > 0 && (<>
                            <Title>Предпросмотр</Title>
                            <div className={'APPost__Full_Preview TextField'}>{previewFull}</div>
                        </>)}
                        <Button type={"button"} onClick={this.previewFull}>Предпросмотр</Button>
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
)(APAddPost);
