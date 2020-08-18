import {createStore} from "redux";
import index from "./reducers";
import {composeWithDevTools} from "redux-devtools-extension";

const composeEnhancers = composeWithDevTools({
    trace: true
});
const store = process.env.NODE_ENV === 'development' ? createStore(index, composeEnhancers()) : createStore(index);
export default store;