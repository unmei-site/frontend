import ActionTypes from "./actionTypes";
import React from "react";

const setUser = (userData: UserType) => ({
    type: ActionTypes.SET_USER,
    userData
});
const logout = () => ({
    type: ActionTypes.LOGOUT
});

const addNotification = (notification: React.ReactNode) => ({
    type: ActionTypes.ADD_NOTIFICATION,
    notification
});

export { setUser, logout,
         addNotification };