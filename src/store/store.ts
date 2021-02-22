import { createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";
import reducers from "./ducks/index";
import * as Sentry from "@sentry/react";

const composeEnhancers = devToolsEnhancer({ trace: true });
const sentryReduxEnhancer = Sentry.createReduxEnhancer({});

const store = process.env.NODE_ENV === 'development'
    ? createStore(reducers, composeEnhancers)
    : createStore(reducers, sentryReduxEnhancer);
export default store;
