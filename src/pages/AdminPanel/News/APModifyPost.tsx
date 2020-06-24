import React, {ChangeEvent, FormEvent} from "react";
import Group from "../../../ui/Group/Group";
import NotFoundError from "../../NotFoundError";
import {fetchPost, updatePost} from "../../../api/news";
import './APNews.sass';
import '../../../ui/TextField/TextField.sass'
import Input from "../../../ui/Input/Input";
import Button from "../../../ui/Button/Button";
import BBEditor from "../../../ui/BBEditor/BBEditor";
// @ts-ignore
import parser from 'bbcode-to-react';
import Title from "../../../ui/Title/Title";

type Props = {
    postId: number
    //addNotification: (notification: React.ReactNode) => void
};

type State = {
    post: PostType | null
    title: string

    previewShort: string
    previewFull: string
};

class APModifyPost extends React.Component<Props, State> {
    private shortPost = React.createRef<HTMLTextAreaElement>();
    private fullPost = React.createRef<HTMLTextAreaElement>();

    state: State = {
        post: null, title: '',
        previewShort: '', previewFull: ''
    }

    componentDidMount() {
        const { postId } = this.props;
        fetchPost(postId).then((post: PostType) => {
            this.setState({ post, title: post.title });
        });
    }

    savePost = async (event: FormEvent) => {
        event.preventDefault();

        const post = this.state.post;
        if(!post) return;
        if(!this.shortPost.current || !this.fullPost.current) return;

        post.short_post = this.shortPost.current.value;
        post.full_post = this.fullPost.current.value;

        await updatePost(post);
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if(prevState.post) return;
        if(!this.state.post) return;
        if(!this.shortPost.current || !this.fullPost.current) return;
        this.shortPost.current.value = this.state.post.short_post;
        this.fullPost.current.value = this.state.post.full_post;
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
        const post = this.state.post;
        if(!post) return;
        post.title = event.target.value;
        this.setState({ post });
    }

    render() {
        const { post, title, previewShort, previewFull } = this.state;

        if(!post) return <NotFoundError/>;
        return (
            <Group title={title}>
                <form onSubmit={this.savePost} className={'APPost'}>
                    <Input type="text" placeholder={'Заголовок'} value={post.title} onChange={this.changeTitle}/>

                    <div className={'APPost__Short'}>
                        <Title>Короткая новость</Title>
                        <BBEditor inputRef={this.shortPost} placeholder={'Короткая новость'} />
                        {previewShort.length > 0 && (<>
                            <Title>Предпросмотр</Title>
                            <div className={'APPost__Short_Preview TextField'}>{previewShort}</div>
                        </>)}
                        <Button type={"button"} onClick={this.previewShort}>Предпросмотр</Button>
                    </div>

                    <div className={'APPost__Full'}>
                        <Title>Полная новость</Title>
                        <BBEditor inputRef={this.fullPost} placeholder={'Полная новость'} />
                        {previewFull.length > 0 && (<>
                            <Title>Предпросмотр</Title>
                            <div className={'APPost__Full_Preview TextField'}>{previewFull}</div>
                        </>)}
                        <Button type={"button"} onClick={this.previewFull}>Предпросмотр</Button>
                    </div>

                    <div>
                        <Button>Сохранить</Button>
                        <Button type={"button"} style={{ color: 'var(--error) '}}>Удалить</Button>
                    </div>
                </form>
            </Group>
        )
    }
}

export default APModifyPost;