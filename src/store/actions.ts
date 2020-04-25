import ActionTypes from "./actionTypes";
import React from "react";

const setUser = (userData: UserType) => ({
    type: ActionTypes.SET_USER,
    payload: { userData }
});
const logout = () => ({
    type: ActionTypes.LOGOUT
});

const addNotification = (notification: React.ReactNode) => ({
    type: ActionTypes.ADD_NOTIFICATION,
    payload: { notification }
});

export { setUser, logout,
         addNotification };