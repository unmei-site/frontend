import { connect } from "react-redux";
import React from "react";
import NotFoundError from "../../components/NotFoundError";
import { hasAccessToAdminPanel } from "../../utils";
import './AdminPanel.sass';
import { Link, Route, Switch } from "react-router-dom";
import APNews from "./News/APNews";
import APModifyPost from "./News/APModifyPost";
import APAddPost from "./News/APAddPost";
import APNovels from "./Novels/APNovels";
import APUsers from "./Users/APUsers";
import APModifyUser from "./Users/APModifyUser";

type Props = {
    user: UserType
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
                <div className="AdminPanel__Title">Админ панель <span style={{ color: 'var(--error-bg-color)' }}>(в разработке)</span>
                </div>
                <div className="AdminPanel__Router">
                    <Link to={path}>Главная</Link>
                    <Link to={`${path}/users`}>Пользователи</Link>
                    <Link to={`${path}/novels`}>Новелы</Link>
                    <Link to={`${path}/news`}>Новости</Link>
                </div>

                <Switch>
                    <Route exact path={`${path}/news`} component={APNews}/>
                    <Route exact path={`${path}/news/new`} component={APAddPost}/>
                    <Route exact path={`${path}/news/:id`} component={APModifyPost}/>

                    <Route exact path={`${path}/novels`} component={APNovels}/>
                    <Route exact path={`${path}/novels/new`} component={NotFoundError}/>
                    <Route exact path={`${path}/novels/:id`} component={NotFoundError}/>

                    <Route exact path={`${path}/users`} component={APUsers}/>
                    <Route exact path={`${path}/users/new`} component={NotFoundError}/>
                    <Route exact path={`${path}/users/:id`} component={APModifyUser}/>
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
