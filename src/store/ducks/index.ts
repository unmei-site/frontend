import { combineReducers } from "redux";
import currentUser from './currentUser'
import modal from "./modal";
import notifications from './notifications'
import userSettings from './userSettings';
import snowfall from './snowfall';
import preloader from './preloader';

export default combineReducers({
    currentUser, modal, notifications, userSettings, snowfall, preloader
});
