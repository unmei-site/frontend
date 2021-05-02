import React, { lazy, Suspense } from "react";
import './Main.sass';
import { Helmet } from "react-helmet";
import Loading from "../../ui/Loading";

const News = lazy(() => import('./News'));

class Main extends React.Component {
    render() {
        return (
            <div className={'Main'}>
                <Helmet>
                    <title>Unmei</title>
                </Helmet>

                <Suspense fallback={<Loading/>}>
                    <News/>
                </Suspense>
            </div>
        );
    }
}

export default Main;
