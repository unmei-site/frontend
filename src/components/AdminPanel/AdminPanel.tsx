import {connect} from "react-redux";
import React from "react";
import NotFoundError from "../NotFoundError";
import {hasAccessToAdminPanel} from "../../utils";
import './AdminPanel.sass';
import {Link} from "react-router-dom";
import AdminPanelUsers from "./Users/AdminPanelUsers";
import AdminPanelNovels from "./Novels/AdminPanelNovels";
import ModifyUser from "./Users/ModifyUser";

type Props = {
    user: UserType
    match: { path: string }
    location: { pathname: string }
}

type State = {

}

class AdminPanel extends React.Component<Props, State> {
    render() {
        const { user, match: { path }, location: { pathname } } = this.props;
        if(!user || !user.group) return <NotFoundError/>;
        if(!hasAccessToAdminPanel(user)) return <NotFoundError/>;
        const subPath = pathname.slice(path.length+1);
        let component;
        switch(subPath) {
            case 'users': component = <AdminPanelUsers path={`${path}/${subPath}`}/>; break;
            case 'novels': component = <AdminPanelNovels/>; break;
            case 'news': component = <div>Новости</div>; break;
            default: {
                const users = /users\/(\d+)/;

                const userMatch = subPath.match(users);

                if(userMatch)
                    component = <ModifyUser userId={parseInt(userMatch[1])}/>;
            }
        }

        return (
            <div className={'AdminPanel'}>
                <div className="AdminPanel__Title">Админ панель <span style={{ color: 'var(--error-bg-color)' }}>(в разработке)</span></div>
                <div className="AdminPanel__Router">
                    <Link to={path}>Главная</Link>
                    <Link to={`${path}/users`}>Пользователи</Link>
                    <Link to={`${path}/novels`}>Новелы</Link>
                    <Link to={`${path}/news`}>Новости</Link>
                </div>
                {component}
            </div>
        );
    }
}

export default connect(
    (state: StoreState) => ({
        user: state.currentUser
    })
)(AdminPanel);