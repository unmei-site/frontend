import {createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import reducers from "./ducks/index";

const composeEnhancers = composeWithDevTools({
    trace: true
});
const store = process.env.NODE_ENV === 'development' ? createStore(reducers, composeEnhancers()) : createStore(reducers);
export default store;
