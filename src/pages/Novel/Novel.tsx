import React, { Suspense } from "react";
import './Novel.sass'
import NotFoundError from "../../components/NotFound/NotFoundError";
import { connect } from "react-redux";
import {
    createUserNovel,
    deleteUserNovel,
    fetchNovel,
    fetchNovelCharacters,
    fetchNovelComments,
    fetchUserNovel,
    postNovelComment,
    updateUserNovel
} from "../../api/novels";
import { TranslateExitStatus, TranslatePlatform, TranslateStatus } from "../../api/api";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { hideModal, setModal } from "../../store/ducks/modal";
import { hasPermission } from "../../utils";
import { setPreloader } from "../../store/ducks/preloader";
import { Helmet } from "react-helmet";
import { Title } from "../../ui/ui";
const Comments = React.lazy(() => import('../Comments/Comments'));

type Props = {
    currentUser: Unmei.UserType
    setModal: SetModal
    hideModal: HideModal
    setPreloader: SetPreloaderStatus
    match: { params: { novelId: number } }
};

type State = {
    novel: Unmei.NovelType | null
    characters: Unmei.CharacterType[]

    errorCode: number | null
    userData: Unmei.UserNovelType | null
    statusExpanded: boolean

    comments: Unmei.CommentType[]
    commentsLoaded: boolean
    commentsOffset: number
    hasMoreComments: boolean
}

class Novel extends React.Component<Props, State> {
    state: State = {
        novel: null, characters: [],
        errorCode: null, userData: null, statusExpanded: false,
        comments: [], commentsLoaded: false, commentsOffset: 5, hasMoreComments: true
    };

    countNovelDuration = (t: number) => {
        const h = Math.round(t / 60);
        const m = t - (t * 60);

        if(h === 0) return `${m} мин`;
        else return `${h} ч`;
    }

    updateNovelMark = (mark: number) => {
        const { match: { params }, currentUser, setPreloader } = this.props;
        const { userData } = this.state;

        if(!userData) return;
        if(userData.mark === mark) return;
        setPreloader(true);
        updateUserNovel(currentUser.id, params.novelId, { mark }).then(async userData => {
            const novel = await fetchNovel(params.novelId)
            novel.release_date = new Date(novel.release_date);
            this.setState({ novel, userData });
            setPreloader(false);
        });
    }

    updateNovelStatus = (status: string) => {
        const { match: { params }, currentUser, setPreloader } = this.props;
        const { userData } = this.state;

        setPreloader(true);
        if(userData) {
            updateUserNovel(currentUser.id, params.novelId, { status }).then(r => {
                this.setState({ userData: r, statusExpanded: false });
                setPreloader(false);
            }).catch(console.error);
        } else {
            createUserNovel(currentUser.id, params.novelId, status).then(r => {
                this.setState({ userData: r, statusExpanded: false });
                setPreloader(false);
            }).catch(console.error);
        }
    };

    deleteNovelStatus = () => {
        const { match: { params }, currentUser, setPreloader } = this.props;

        setPreloader(true);
        deleteUserNovel(currentUser.id, params.novelId).then(() => {
            this.setState({ userData: null, statusExpanded: false });
            setPreloader(false);
        });
    };

    sendComment = (text: string) => {
        const { match: { params: { novelId } } } = this.props;
        postNovelComment(novelId, text).then(comment => {
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
            this.setState({ comments: [...r.comments.reverse(), ...comments], hasMoreComments, commentsOffset });
        });
    };

    componentDidUpdate(prevProps: any) {
        const { match: { params }, currentUser } = this.props;
        const { currentUser: prevUser } = prevProps;

        if(!prevUser.authorized && currentUser.authorized) {
            fetchUserNovel(currentUser.id, params.novelId).then(userData => {
                this.setState({ userData });
            }).catch((err: Unmei.ApiError) => {
                if(err.code !== 100)
                    console.error(err.text);
            });
        }
        else if(prevUser.authorized && !currentUser.authorized)
            this.setState({ userData: null })
    }

    async componentDidMount() {
        const { match: { params }, currentUser, setPreloader } = this.props;

        setPreloader(true);
        fetchNovel(params.novelId).then(async novel => {
            novel.release_date = new Date(novel.release_date);
            const r = await fetchNovelComments(params.novelId);
            const hasMoreComments = r.count > 5;

            const characters = await fetchNovelCharacters(params.novelId);
            this.setState({ novel, characters, comments: r.comments.reverse(), hasMoreComments, commentsLoaded: true });

            setPreloader(false);
        }).catch((err: Unmei.ApiError) => {
            this.setState({ errorCode: err.code });
            setPreloader(false);
        });

        if(currentUser.authorized) {
            fetchUserNovel(currentUser.id, params.novelId).then((userData: Unmei.UserNovelType) => {
                this.setState({ userData });
            }).catch((err: Unmei.ApiError) => {
                if(err.code !== 100) console.error(err.text);
            });
        }
    }

    render() {
        const { errorCode, novel, comments, commentsLoaded, characters, userData, statusExpanded, hasMoreComments } = this.state;
        const { currentUser } = this.props;

        if(errorCode === 100) return <NotFoundError/>;
        if(!novel) return <Loading/>;
        const maxRating = Math.max(...novel.rating_all.map(r => r.count));
        const maxStatus = Math.max(...novel.status_all.map(r => r.count));
        return (
            <div className={'Novel'}>
                <Helmet>
                    <title>{novel.localized_name ? `${novel.original_name} / ${novel.localized_name}` : novel.original_name}</title>
                    <meta name='description' content={novel.description}/>

                    <meta property="og:title" content={novel.localized_name ? `${novel.original_name} / ${novel.localized_name}` : novel.original_name} />
                    <meta property="og:description" content={novel.description} />
                    <meta property="og:image" content={novel.image} />
                </Helmet>

                <div className="Novel__Main">
                    <div className={'Novel__Main_Left'}>
                        {novel.image
                            ? <img src={novel.image} className={"Novel__Main_Image"} alt={novel.original_name}/>
                            : <img src={"/static/img/no-image.png"} className={"Novel__Main_Image"} alt=""/>}
                        {currentUser.authorized &&
                        <div className={'Novel__Main_Status'}>
                            <div className="Novel__Main_Status_Primary">
                                {!userData
                                    ? <div className={'Novel__Main_Status_Element'} onClick={() => this.updateNovelStatus('planned')}>Добавить в список</div>
                                    : <div className={"Novel__Main_Status_Element"}>{TranslateStatus[userData.status]}</div>}
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
                                    <div key={eng} className="Novel__Main_Status_Element" onClick={() => this.updateNovelStatus(eng)}>{rus}</div>
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

                            {novel.walkthrough.length > 0 && <div className="Novel__Main_Status_Mark">
                                <a className="Novel__Main_Status_Mark_Element" target='_blank' rel='noreferrer' href={novel.walkthrough}>Прохождение</a>
                            </div>}

                            {novel.links.length > 0 && <div className="Novel__Main_Status_Mark">
                                {novel.links.map(link => (
                                    <a className="Novel__Main_Status_Mark_Element" target='_blank' rel='noreferrer' href={link.link} key={link.name}>{link.name}</a>
                                ))}
                            </div>}

                            {hasPermission(currentUser, 'novel') && (
                                <div className="Novel__Main_Status_Mark">
                                    <Link className="Novel__Main_Status_Mark_Element" to={`/kawaii__neko/novels/${novel.id}`}>Изменить</Link>
                                </div>
                            )}
                        </div>}
                    </div>
                    <div className={'Novel__Main_Info'}>
                        <div className={'Novel__Main_Info_Title'}>{novel.is_demo && <div className='Novel__Main_Info_Demo'>Demo</div>} {novel.localized_name || novel.original_name}</div>
                        {novel.localized_name && <div className="Novel__Main_Info_OriginalName">
                            <strong>Оригинальное название</strong>: {novel.original_name}
                        </div>}
                        {novel.genres.length > 0 &&
                        <div className="Novel__Main_Info_Genres">
                            <strong>Жанры</strong>: {novel.genres.map(genre => <div className={'Genre'} key={genre.id}>{genre.localized_name}</div>)}
                        </div>}
                        <div>
                            <strong>Год выхода</strong>: {novel.release_date.toLocaleDateString()}
                        </div>
                        <div>
                            <strong>Статус</strong>: {TranslateExitStatus[novel.exit_status]}
                        </div>
                        {novel.duration > 0 && <div>
                            <strong>Продолжительность</strong>: {this.countNovelDuration(novel.duration)}
                        </div>}
                        {novel.platforms && <div>
                            <strong>Платформы</strong>: {novel.platforms.split(',').map(platform => TranslatePlatform[platform]).join(', ')}
                        </div>}
                        <div>
                            <strong>Ср. оценка</strong>: {novel.rating.toFixed(2)}
                        </div>
                        <pre className={'Novel__Main_Info_Description'}>{novel.description}</pre>
                    </div>
                    <div className="Novel__Main_Rating">
                        <div className="Novel__Main_Rating_All">
                            {novel.rating_all.length > 0 && <Title>Оценки людей</Title>}
                            {novel.rating_all.sort((a, b) => b.count-a.count).map(rating => (
                                <div key={rating.mark} className={'Novel__Main_Rating_All_Mark'} style={{ width: `${rating.count / maxRating*100}%` }}>
                                    <div>{rating.mark}</div>
                                    <div>{rating.count}</div>
                                </div>
                            ))}
                            {novel.status_all.length > 0 && <Title>В списках</Title>}
                            {novel.status_all.sort((a, b) => b.count-a.count).map(status => (
                                <div key={status.status} className={'Novel__Main_Rating_All_Mark'} style={{ width: `${status.count / maxStatus*100}%`, backgroundColor: `var(--${status.status}-bg-color` }}>
                                    <div style={{ overflow: 'hidden' }}>{TranslateStatus[status.status]}</div>
                                    <div style={{ marginLeft: 4 }}>{status.count}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {characters && characters.length > 0 &&
                <div className="Novel__Characters">
                    <div className="Novel__Characters_Title">Главные герои:</div>
                    <div className="Novel__Characters_List">
                        {this.state.characters.filter(char => char.main).map(char =>
                            <Link to={`/character/${char.id}`} className={'Novel__Character'} key={char.id}>
                                <div className='Character_Image' style={{ backgroundImage: `url(${char.image})` }}/>
                                <div className={'Novel__Character_Name'}>{char.localized_name}</div>
                            </Link>)}
                    </div>
                </div>}
                <Suspense fallback={<Loading/>}>
                    <Comments user={currentUser} comments={comments} commentsLoaded={commentsLoaded} sendComment={this.sendComment} loadMore={this.loadMoreComments} hasMore={hasMoreComments}/>
                </Suspense>
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
        hideModal: () => dispatch(hideModal()),
        setPreloader: (status: boolean) => dispatch(setPreloader(status))
    })
)(Novel);
