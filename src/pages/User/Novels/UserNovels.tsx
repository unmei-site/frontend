import React, { Suspense } from 'react';
import './UserNovels.sass';
import { fetchUser, fetchUserNovels } from '../../../api/users';
import Loading from '../../../components/Loading';
import { capitalize, generateClassName, getRandomInt } from "../../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignJustify, faThLarge } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../ui/Button/Button";
import { Helmet } from "react-helmet";
const NovelItem = React.lazy(() => import('../../../ui/NovelItem/NovelItem'));

type Props = {
    match: { params: { userId: number } }
    history: { push: (path: string) => void }
};
type State = {
    novels: Unmei.NovelType[]
    user: Unmei.UserType | null
    viewType: string
};

class UserNovels extends React.Component<Props, State> {
    state: State = {
        novels: [], user: null, viewType: 'grid'
    };

    getRandomNovel = () => {
        const { history } = this.props;
        const { novels } = this.state;
        const planned = novels.filter(n => n.status === 'planned');
        const index = getRandomInt(0, planned.length - 1);
        history.push(`/novels/${planned[index].id}`);
    };

    componentDidMount() {
        const { match: { params: { userId } } } = this.props;

        fetchUserNovels(userId).then(novels => this.setState({ novels }));

        fetchUser(userId).then(user => this.setState({ user }));

        const viewType = localStorage.getItem('viewType');
        if(viewType) {
            if(viewType !== 'grid' && viewType !== 'table') {
                console.warn('Тип был неизвестен... Сбрасываю...');
                localStorage.setItem('viewType', 'grid')
            } else {
                this.setState({ viewType });
            }
        }
    };

    changeViewType = (type: 'grid' | 'table') => {
        this.setState({ viewType: type });
        localStorage.setItem('viewType', type);
    }

    render() {
        const { novels, user, viewType } = this.state;
        if(!novels || !user) return <Loading/>;

        const planned = novels.filter(n => n.status === 'planned');
        const completed = novels.filter(n => n.status === 'completed');
        const in_progress = novels.filter(n => n.status === 'in_progress');

        return (
            <div className='UserNovels'>
                <Helmet>
                    <title>{user.username} / Новеллы</title>
                </Helmet>

                <div className="UserNovels__Title">
                    Новеллы пользователя {user.username}
                    <FontAwesomeIcon icon={faThLarge} onClick={() => this.changeViewType('grid')}/>
                    <FontAwesomeIcon icon={faAlignJustify} onClick={() => this.changeViewType('table')}/>
                </div>

                {planned.length > 0 && <div className={'UserNovels__List'}>
                    <div className="UserNovels__List_Title">
                        <div style={{ marginRight: '1rem' }}>Запланированные</div>
                        <Button onClick={this.getRandomNovel}>Рандомная новелла</Button>
                    </div>
                    <div className={generateClassName("UserNovels__List_Novels", capitalize(viewType) || 'Grid')}>
                        <Suspense fallback={<Loading/>}>
                            {planned.map((novel, id) => <NovelItem {...novel} key={novel.id} novelId={id + 1} viewType={viewType}/>)}
                        </Suspense>
                    </div>
                </div>}

                {completed.length > 0 && <div className={'UserNovels__List'}>
                    <div className="UserNovels__List_Title">
                        Пройденные
                    </div>
                    <div className={generateClassName("UserNovels__List_Novels", capitalize(viewType) || 'Grid')}>
                        <Suspense fallback={<Loading/>}>
                            {completed.map((novel, id) => <NovelItem {...novel} key={novel.id} novelId={id + 1} viewType={viewType}/>)}
                        </Suspense>
                    </div>
                </div>}

                {in_progress.length > 0 && <div className={'UserNovels__List'}>
                    <div className="UserNovels__List_Title">
                        Прохожу
                    </div>
                    <div className={generateClassName("UserNovels__List_Novels", capitalize(viewType) || 'Grid')}>
                        <Suspense fallback={<Loading/>}>
                            {in_progress.map((novel, id) => <NovelItem {...novel} key={novel.id} novelId={id + 1} viewType={viewType}/>)}
                        </Suspense>
                    </div>
                </div>}
            </div>
        );
    }
}

export default UserNovels;
