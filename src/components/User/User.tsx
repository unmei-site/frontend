import React from "react";
import {fetchUser, fetchUserNovels} from "../../api/users";
import './User.sass'
import NotFoundError from "../NotFoundError";
import {Link} from "react-router-dom";
import Loading from "../Loading";
import NovelItem from "../NovelItem/NovelItem";

type Props = {
    match: { params: { userId: number } }
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

    componentDidMount() {
        const params = this.props.match.params;

        fetchUser(params.userId)
            .then((user: UserType) => {
                this.setState({ user });
                document.title = `${user.username} / Unmei`;
            })
            .catch((err: ApiError) => this.setState({ errorCode: err.code }));

        fetchUserNovels(params.userId).then((novels: NovelType[]) => {
                this.setState({ novels });
            }).catch((err: ApiError) => console.error(err));
    }

    render() {
        const { errorCode, user, novels } = this.state;
        if(errorCode === 100) return <NotFoundError/>;
        if(!user) return <Loading />;

        const style = user.cover ? { backgroundImage: `url(${user.cover})`, height: '20rem' } : {}

        return (
            <div className={'User'}>
                <div className="User__Info" style={style}>
                    <div className="User__Info_Avatar" style={{ backgroundImage: `url(${user.avatar})` }} />
                    <div>
                        <div className='User__Info_Nick'>{user.username}</div>
                        <div className='User__Info_Group' style={{ borderColor: user.group.color, color: user.group.color }}>{user.group.name}</div>
                    </div>
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
                            novels.slice(0, 4).map((novel) => <NovelItem {...novel} key={novel.id} />
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

export default User;