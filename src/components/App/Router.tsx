import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Preloader from "../Preloader/Preloader";

const Main = React.lazy(() => import('../../pages/Main/Main'));
const AllNews = React.lazy(() => import('../../pages/News/AllNews'));
const Post = React.lazy(() => import('../../pages/News/Post'));
const Novels = React.lazy(() => import('../../pages/Novels/Novels'));
const Novel = React.lazy(() => import('../../pages/Novel/Novel'));
const Clubs = React.lazy(() => import('../../pages/Clubs/Clubs'));
const Club = React.lazy(() => import('../../pages/Club/Club'));
const Users = React.lazy(() => import('../../pages/Users/Users'));
const User = React.lazy(() => import('../../pages/User/User'));
const UserNovels = React.lazy(() => import('../../pages/User/Novels/UserNovels'));
const Settings = React.lazy(() => import('../../pages/User/Settings/Settings'));
const Character = React.lazy(() => import('../../pages/Character/Character'));
const ActivateAccount = React.lazy(() => import('../../pages/ActivateAccount'));
const PasswordRestoreGenerate = React.lazy(() => import('../../pages/PasswordRestore/PasswordRestoreGenerate'));
const PasswordRestore = React.lazy(() => import('../../pages/PasswordRestore/PasswordRestore'));
const AdminPanel = React.lazy(() => import('../../pages/AdminPanel/AdminPanel'));
const VKAuth = React.lazy(() => import('../../pages/VKAuth/VKAuth'));
const NotFoundError = React.lazy(() => import('../NotFound/NotFoundError'));

export default (
    <Suspense fallback={<Preloader/>}>
        <Switch>
            <Route exact path={'/'} component={Main}/>

            <Route exact path={'/news'} component={AllNews}/>
            <Route exact path={'/news/:postId'} component={Post}/>

            <Route exact path={'/novels'} component={Novels}/>
            <Route exact path={'/novels/:novelId'} component={Novel}/>

            <Route exact path={'/clubs'} component={Clubs}/>
            <Route exact path={'/clubs/:clubId'} component={Club}/>

            <Route exact path={'/users'} component={Users}/>
            <Route exact path={'/user/:userId'} component={User}/>
            <Route exact path={'/user/:userId/novels'} component={UserNovels}/>
            <Route exact path={'/user/:userId/settings'} component={Settings}/>

            <Route exact path={'/character/:charId'} component={Character}/>

            <Route exact path={'/activate/:token'} component={ActivateAccount}/>

            <Route exact path={'/restore'} component={PasswordRestoreGenerate}/>
            <Route exact path={'/restore/:token'} component={PasswordRestore}/>

            <Route exact path={'/vk_auth'} component={VKAuth}/>

            <Route path={'/kawaii__neko'} component={AdminPanel}/>

            <Route component={NotFoundError}/>
        </Switch>
    </Suspense>
);
