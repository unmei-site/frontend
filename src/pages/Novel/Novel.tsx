import React from "react";
import './Novel.sass'
import NotFoundError from "../NotFoundError";
import { connect } from "react-redux";
import {
    createUserNovel,
    deleteUserNovel,
    fetchNovel,
    fetchNovelCharacters,
    fetchNovelComments,
    fetchNovelGenres,
    fetchUserNovel,
    postNovelComment,
    updateUserNovel
} from "../../api/novels";
import { Link } from "react-router-dom";
import Loading from "../../ui/Loading";
import { TranslateExitStatus, TranslateStatus } from "../../api/api";
import Comments from "../Comments/Comments";
import LoadingModal from "../Modals/LoadingModal";
import { hideModal, setModal } from "../../store/ducks/modal";

type Props = {
    currentUser: UserType
    setModal: SetModal
    hideModal: HideModal
    match: { params: { novelId: number } }
};

type State = {
    novel: NovelType | null
    characters: CharacterType[]
    genres: GenreType[]

    errorCode: number | null
    userData: UserNovelType | null
    statusExpanded: boolean

    comments: CommentType[]
    commentsOffset: number
    hasMoreComments: boolean
}

class Novel extends React.Component<Props, State> {
    state: State = {
        novel: null, characters: [], genres: [],
        errorCode: null, userData: null, statusExpanded: false,
        comments: [], commentsOffset: 5, hasMoreComments: true
    };

    updateNovelStatus = (status: string) => {
        const { match: { params }, currentUser, setModal, hideModal } = this.props;
        const { userData } = this.state;

        setModal(<LoadingModal/>);
        if(userData) {
            updateUserNovel(currentUser.id, params.novelId, { status }).then(r => {
                this.setState({ userData: r, statusExpanded: false });
                hideModal();
            }).catch(console.error);
        } else {
            createUserNovel(currentUser.id, params.novelId, status).then(r => {
                this.setState({ userData: r, statusExpanded: false });
                hideModal();
            }).catch(console.error);
        }
    };

    deleteNovelStatus = () => {
        const { match: { params }, currentUser, setModal, hideModal } = this.props;

        setModal(<LoadingModal/>);
        deleteUserNovel(currentUser.id, params.novelId).then(() => {
            this.setState({ userData: null, statusExpanded: false });
            hideModal();
        });
    };

    sendComment = (text: string) => {
        const { match: { params: { novelId } } } = this.props;
        postNovelComment(novelId, text).then((comment: CommentType) => {
            const { comments } = this.state;
            this.setState({ comments: [comment, ...comments] });
        }).catch(console.error);
    };

    loadMoreComments = () => {
        const { match: { params } } = this.props;
        let { comments, commentsOffset } = this.state;

        fetchNovelComments(params.novelId, commentsOffset, 10).then(r => {
            const hasMoreComments = r.count <= commentsOffset;
            commentsOffset += 5;
            this.setState({ comments: [...r.comments.reverse(), ...comments], hasMoreComments, commentsOffset })
        });
    };

    componentDidUpdate(prevProps: any) {
        const { match: { params }, currentUser } = this.props;
        const { currentUser: prevUser } = prevProps;

        if(!prevUser.authorized && currentUser.authorized)
            fetchUserNovel(currentUser.id, params.novelId)
                .then(data => this.setState({ userData: data }))
                .catch(err => console.error(err));
        else if(prevUser.authorized && !currentUser.authorized)
            this.setState({ userData: null })
    }

    componentDidMount() {
        const { match: { params }, currentUser } = this.props;

        fetchNovel(params.novelId).then((novel: NovelType) => {
            novel.release_date = new Date(novel.release_date);
            this.setState({ novel });
            document.title = novel.localized_name ? `${novel.original_name} / ${novel.localized_name}` : novel.original_name;

            fetchNovelComments(params.novelId).then(r => {
                const hasMoreComments = r.count > 5;
                this.setState({ comments: r.comments.reverse(), hasMoreComments })
            });
            fetchNovelCharacters(params.novelId).then(characters => this.setState({ characters }));
            fetchNovelGenres(params.novelId).then(genres => this.setState({ genres }));
        }).catch((err: ApiError) => {
            this.setState({ errorCode: err.code });
        });

        if(currentUser.authorized)
            fetchUserNovel(currentUser.id, params.novelId).then((userData: UserNovelType) => {
                this.setState({ userData });
            }).catch((err: ApiError) => {
                if(err.code !== 100) console.error(err.text);
            });
    }

    updateNovelMark = (mark: number) => {
        const { match: { params }, currentUser, hideModal, setModal } = this.props;
        const { userData } = this.state;

        if(userData?.mark === mark) return;
        setModal(<LoadingModal/>);
        updateUserNovel(currentUser.id, params.novelId, { mark }).then(res => {
            userData!!.mark = mark;
            this.setState({ userData: res });
            hideModal();
        });
    }

    countNovelDuration = (t: number) => {
        const h = Math.round(t / 60);
        const m = t - (t * 60);

        if(h === 0) return `${m} мин`;
        else return `${h} ч`;
    }

    render() {
        const { errorCode, novel, comments, characters, genres, userData, statusExpanded, hasMoreComments } = this.state;
        const { currentUser } = this.props;

        if(errorCode === 100) return <NotFoundError/>;
        if(!novel) return <Loading/>;
        return (
            <div className={'Novel'}>
                <div className="Novel__Main">
                    <div className={'Novel__Main_Left'}>
                        {novel.image
                            ? <img src={novel.image} className={"Novel__Main_Image"} alt={novel.original_name}/>
                            : <img src={"/static/img/no-image.png"} className={"Novel__Main_Image"} alt=""/>}
                        {currentUser.authorized &&
                        <div className={'Novel__Main_Status'}>
                            <div className="Novel__Main_Status_Primary">
                                {!userData
                                    ? <div className={'Novel__Main_Status_Element'}
                                           onClick={() => this.updateNovelStatus('planned')}>Добавить в список</div>
                                    : <div
                                        className={"Novel__Main_Status_Element"}>{TranslateStatus[userData.status]}</div>}
                                {userData && (
                                    <div
                                        className={'Novel__Main_Status_Element'}
                                        onClick={() => this.setState({ statusExpanded: !statusExpanded })}
                                        style={{ paddingLeft: 5, borderLeft: '1px solid white' }}
                                    >
                                        +
                                    </div>
                                )}
                            </div>
                            {statusExpanded &&
                            <div className="Novel__Main_Status_Extended">
                                {userData && Object.entries(TranslateStatus).filter(([eng]) => eng !== userData.status).map(([eng, rus]) => (
                                    <div key={eng} className="Novel__Main_Status_Element"
                                         onClick={() => this.updateNovelStatus(eng)}>{rus}</div>
                                ))}
                                <div className={"Novel__Main_Status_Element"} style={{ color: 'red' }}
                                     onClick={this.deleteNovelStatus}>Удалить из списка
                                </div>
                            </div>}
                            <div className={'Novel__Main_Status_Mark'}>
                                {userData && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(mark => (
                                    <div
                                        key={mark}
                                        className={mark === userData.mark && userData.mark !== 0 ? 'Novel__Main_Status_Mark_Element Selected' : 'Novel__Main_Status_Mark_Element'}
                                        onClick={() => this.updateNovelMark(mark)}
                                    >
                                        {mark}
                                    </div>
                                ))}
                            </div>
                        </div>}
                    </div>
                    <div className={'Novel__Info'}>
                        <div className={'Novel__Info_Title'}>{novel.localized_name || novel.original_name}</div>
                        {novel.localized_name && <div className="Novel__Info_OriginalName">
                            <strong>Оригинальное название</strong>: {novel.original_name}
                        </div>}
                        {genres && genres.length > 0 &&
                        <div className="Novel__Info_Genres">
                            <strong>Жанры</strong>: {genres.map(genre => <div className={'Genre'}
                                                                              key={genre.id}>{genre.localized_name}</div>)}
                        </div>}
                        <div>
                            <strong>Год выхода</strong>: {novel.release_date.toLocaleDateString()}
                        </div>
                        <div>
                            <strong>Статус</strong>: {TranslateExitStatus[novel.exit_status]}
                        </div>
                        <div>
                            <strong>Продолжительность</strong>: {this.countNovelDuration(novel.duration)}
                        </div>
                        <div className="Novel__Info_Rating"><strong>Ср. оценка</strong>: {novel.rating.toFixed(2)}</div>
                        <pre className={'Novel__Info_Description'}>{novel.description}</pre>
                    </div>
                </div>
                {characters && characters.length > 0 &&
                <div className="Novel__Characters">
                    <div className="Novel__Characters_Title">Главные герои:</div>
                    <div className="Novel__Characters_List">
                        {this.state.characters.filter(char => char.main).map(char =>
                            <div className={'Novel__Character'} key={char.id}>
                                <div className='Character_Image' style={{ backgroundImage: `url(${char.image})` }}/>
                                <Link to={`/character/${char.id}`}>
                                    <div className={'Novel__Character_Name'}>{char.localized_name}</div>
                                </Link>
                            </div>)}
                    </div>
                </div>}
                <Comments user={currentUser} comments={comments} sendComment={this.sendComment}
                          loadMore={this.loadMoreComments} hasMore={hasMoreComments}/>
            </div>
        );
    }
}

export default connect(
    (state: StoreState) => ({
        currentUser: state.currentUser
    }),
    dispatch => ({
        setModal: (modal: React.ReactNode | null) => dispatch(setModal(modal)),
        hideModal: () => dispatch(hideModal())
    })
)(Novel);
