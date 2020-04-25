import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";

import {Provider} from 'react-redux';
import store from "./store/store";

// import * as Sentry from '@sentry/browser';

import App from './components/App/App';
import * as serviceWorker from './serviceWorker';


//Sentry.init({ dsn: "https://27a5473611834ece9aca26216d79ad86@sentry.io/1810028" });

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
    document.getElementById('root'));

// Better not disable this
serviceWorker.register();
