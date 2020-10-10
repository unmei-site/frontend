import {combineReducers} from "redux";
import currentUser from "./currentUser";
import notifications from "./notifications";
import modal from "./modal";

export default combineReducers({ currentUser, notifications, modal })