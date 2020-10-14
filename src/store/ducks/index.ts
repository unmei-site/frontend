import { combineReducers } from "redux";
import currentUser from './currentUser'
import modal from "./modal";
import notifications from './notifications'
import userSettings from './userSettings';

export default combineReducers({ currentUser, modal, notifications, userSettings })
