import {createStore} from "redux";
import index from "./reducers";
import {composeWithDevTools} from "redux-devtools-extension";

const composeEnhancers = composeWithDevTools({
    trace: true
});
export default createStore(index, composeEnhancers());