import { connect } from "react-redux";
import React from "react";
import NotFoundError from "../../components/NotFound/NotFoundError";
import { hasAccessToAdminPanel } from "../../utils";
import './AdminPanel.sass';
import { Link, Route, Switch } from "react-router-dom";
import APNews from "./News/APNews";
import APModifyPost from "./News/APModifyPost";
import APAddPost from "./News/APAddPost";
import APNovels from "./Novels/APNovels";
import APUsers from "./Users/APUsers";
import APModifyUser from "./Users/APModifyUser";
import APModifyNovel from "./Novels/APModifyNovel";
import APCharacters from "./Characters/APCharacters";
import APModifyCharacter from "./Characters/APModifyCharacter";
import APMain from "./Main/APMain";
import APAddNovel from "./Novels/APAddNovel";

type Props = {
    user: Unmei.UserType
    match: { path: string }
}

type State = {}

class AdminPanel extends React.Component<Props, State> {
    render() {
        const { user, match: { path } } = this.props;
        if(!user || !user.group) return <NotFoundError/>;
        if(!hasAccessToAdminPanel(user)) return <NotFoundError/>;

        return (
            <div className={'AdminPanel'}>
                <div className="AdminPanel__Title">Админ панель</div>

                <div className="AdminPanel__Router">
                    <Link to={path}>Главная</Link>
                    <Link to={`${path}/users`}>Пользователи</Link>
                    <Link to={`${path}/novels`}>Новелы</Link>
                    <Link to={`${path}/news`}>Новости</Link>
                    <Link to={`${path}/characters`}>Персонажи</Link>
                </div>

                <Switch>
                    <Route exact path={path} component={APMain}/>

                    <Route exact path={`${path}/news`} component={APNews}/>
                    <Route exact path={`${path}/news/new`} component={APAddPost}/>
                    <Route exact path={`${path}/news/:id`} component={APModifyPost}/>

                    <Route exact path={`${path}/novels`} component={APNovels}/>
                    <Route exact path={`${path}/novels/new`} component={APAddNovel}/>
                    <Route exact path={`${path}/novels/:id`} component={APModifyNovel}/>

                    <Route exact path={`${path}/users`} component={APUsers}/>
                    <Route exact path={`${path}/users/new`} component={NotFoundError}/>
                    <Route exact path={`${path}/users/:id`} component={APModifyUser}/>

                    <Route exact path={`${path}/characters`} component={APCharacters}/>
                    <Route exact path={`${path}/characters/:id`} component={APModifyCharacter}/>
                </Switch>
            </div>
        );
    }
}

export default connect(
    (state: StoreState) => ({
        user: state.currentUser
    })
)(AdminPanel);
