import React from 'react';
import './UserNovels.sass';
import { fetchUserNovels, fetchUser } from '../../../api/users';
import Loading from '../../Loading';
import NovelItem from '../../NovelItem/NovelItem';
import {getRandomInt} from "../../../utils";

type Props = {
    match: { params: { userId: number } }
    history: { push: (path: string) => void }
};
type State = {
    novels: NovelType[]
    user: UserType | null
};

class UserNovels extends React.Component<Props, State> {
    state: State = {
        novels: [], user: null
    };

    getRandomNovel = () => {
        const { history } = this.props;
        const { novels } = this.state;
        const planned = novels.filter(n => n.status === 'planned');
        const index = getRandomInt(0, planned.length-1);
        history.push(`/novels/${planned[index].id}`);
    };

    componentDidMount() {
        const { match: { params: { userId } } } = this.props;

        fetchUserNovels(userId)
            .then(novels => this.setState({ novels }));
        fetchUser(userId)
            .then(user => this.setState({ user }));
    }
    
    render() {
        const { novels, user } = this.state;
        if(!novels || !user) return <Loading/>;

        const planned = novels.filter(n => n.status === 'planned');
        const completed = novels.filter(n => n.status === 'completed');

        return (
            <div className='UserNovels'>
                <div className="UserNovels__Title">
                    Новеллы пользователя {user.username}
                </div>

                {planned.length > 0 &&<div className="UserNovels__List">
                    <div className="UserNovels__List_Title">
                        <div style={{ marginRight: '1rem' }}>Запланированные</div>
                        <button onClick={this.getRandomNovel}>Рандомная новелла</button>
                    </div>
                    <div className="UserNovels__List_Novels">
                        {planned.map(novel => <NovelItem {...novel} key={novel.id}/>)}
                    </div>
                </div>}

                {completed.length > 0 &&<div className="UserNovels__List">
                    <div className="UserNovels__List_Title">
                        Пройденные
                    </div>
                    <div className="UserNovels__List_Novels">
                        {completed.map(novel => <NovelItem {...novel} key={novel.id}/>)}
                    </div>
                </div>}
            </div>
        );
    }
}

export default UserNovels;