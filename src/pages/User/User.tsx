import React from "react";
import {fetchUser, fetchUserNovels, generateActivateLink} from "../../api/users";
import './User.sass'
import NotFoundError from "../NotFoundError";
import {Link} from "react-router-dom";
import Loading from "../../ui/Loading";
import NovelItem from "../../ui/NovelItem/NovelItem";
import {connect} from "react-redux";
import Button from "../../ui/Button/Button";
import {addNotification} from "../../store/actions";
import NotificationMessage from "../../ui/Notifications/NotificationMessage";

type Props = {
    match: { params: { userId: string } }
    currentUser: UserType
    addNotification: AddNotification
}

type State = {
    user: UserType | null
    novels: NovelType[]
    errorCode: number | null
}

class User extends React.Component<Props, State> {
    state: State = {
        user: null, novels: [], errorCode: null
    };

    getAndSetUser = (id: number) => {
        fetchUser(id).then(user => {
            this.setState({ user });
            document.title = `${user.username} / Unmei`;

            fetchUserNovels(id).then(novels => {
                this.setState({ novels });
            }).catch((err: ApiError) => console.error(err));
        }).catch((err: ApiError) => this.setState({ errorCode: err.code }));
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, _?: any) {
        const newUserId = parseInt(this.props.match.params.userId);
        const prevUserId = parseInt(prevProps.match.params.userId);

        if(newUserId !== prevUserId) {
            this.getAndSetUser(newUserId);
        }
    }

    componentDidMount() {
        const params = this.props.match.params;

        this.getAndSetUser(parseInt(params.userId))
    }

    sendActivateLink = () => {
        generateActivateLink().then(() => {
            const notification = (
                <NotificationMessage level={"success"}>
                    Сообщение успешно отправлено!
                </NotificationMessage>
            );
            this.props.addNotification(notification);
        }).catch((err: ApiError) => {
            const notification = (
                <NotificationMessage level={"error"}>
                    Произошла ошибка! №{err.code} <br/>
                    {err.text}
                </NotificationMessage>
            );
            this.props.addNotification(notification);

        })
    }

    render() {
        const { currentUser } = this.props;
        const { errorCode, user, novels } = this.state;
        if(errorCode === 100) return <NotFoundError/>;
        if(!user) return <Loading />;

        const style = !user.is_activated ? { marginTop: '1rem' } : {}

        return (
            <div className={'User'}>
                {!user.is_activated && user.id === currentUser.id && (
                    <div className={'User__Activate'}>
                        <h2>Ваш аккаунт не активирован!</h2>
                        <p>Активируйте аккаунт, для доступа ко многим функциям. Так же актвация аккаунта позволит восстановить пароль.</p>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button onClick={this.sendActivateLink} style={{ fontSize: '1.2rem' }}>Активировать!</Button>
                        </div>
                    </div>
                )}

                <div className="User__Info" style={style}>
                    {user.cover ? (
                    <div className="User__Info_Cover User__Info_Main" style={{ backgroundImage: `url(${user.cover})` }}>
                        <div className="User__Info_Avatar" style={{ backgroundImage: `url(${user.avatar}?s=96&t=${new Date().getTime()})` }} />
                        <div>
                            <div className='User__Info_Nick'>{user.username}</div>
                            <div className='User__Info_Group' style={{ borderColor: user.group.color, color: user.group.color }}>{user.group.name}</div>
                        </div>
                    </div>) : (
                        <div className={'User__Info_Main'}>
                            <div className="User__Info_Avatar" style={{ backgroundImage: `url(${user.avatar}?s=96&t=${new Date().getTime()})` }} />
                            <div>
                                <div className='User__Info_Nick'>{user.username}</div>
                                <div className='User__Info_Group' style={{ borderColor: user.group.color, color: user.group.color }}>{user.group.name}</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="User__Statistic">
                    <div className="User__Statistic_Item">
                        <div className="User__Statistic_Title">Новеллы</div>
                        <div className="User__Statistic_Blocks">
                            <div className="User__Statistic_Block Planned" data-count={novels.filter(n => n.status === 'planned').length}>Запланированно</div>
                            <div className="User__Statistic_Block Completed" data-count={novels.filter(n => n.status === 'completed').length}>Пройдено</div>
                            <div className="User__Statistic_Block InProgress" data-count={novels.filter(n => n.status === 'in_progress').length}>Прохожу</div>
                            <div className="User__Statistic_Block Deferred" data-count={novels.filter(n => n.status === 'deferred').length}>Отложено</div>
                            <div className="User__Statistic_Block Dropped" data-count={novels.filter(n => n.status === 'dropped').length}>Брошено</div>
                        </div>
                    </div>
                </div>

                <div className={"User__List"}>
                    <div className={"User__List_Title"}>
                        <div>Список новелл пользователя:</div>
                        <Link to={`/user/${user.id}/novels`}>Все новеллы</Link>
                    </div>
                    <div className="User__List_Items">
                        {novels.length > 0 ?
                            novels.slice(0, 4).map((novel, id) => <NovelItem {...novel} key={novel.id} novelId={id+1} viewType={'grid'} />
                        ) : (
                            <div>У этого пользователя нет новелл!</div>
                        )}
                    </div>
                </div>

                {/*<div className="User__List">
                    <div className="User__List_Title">Список аниме пользователя:</div>
                    <div className="User__List_Items">В разработке...</div>
                </div>
                <div className="User__List">
                    <div className="User__List_Title">Список манги и ранобэ пользователя:</div>
                    <div className="User__List_Items">В разработке...</div>
                </div>
                <div className="User__List">
                    <div className="User__List_Title">Список игр пользователя:</div>
                    <div className="User__List_Items">В разработке...</div>
                </div>
                <div className="User__List">
                    <div className="User__List_Title">Список фильмов пользователя:</div>
                    <div className="User__List_Items">В разработке...</div>
                </div>
                <div className="User__List">
                    <div className="User__List_Title">Список сериалов пользователя:</div>
                    <div className="User__List_Items">В разработке...</div>
                </div>*/}
            </div>
        );
    }
}

export default connect(
    (state: StoreState) => ({
        currentUser: state.currentUser
    }),
    dispatch => ({
        addNotification: (notification: React.ReactNode) => dispatch(addNotification(notification))
    })
)(User);
