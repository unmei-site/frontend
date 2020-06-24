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

const setModal = (modal: React.ReactNode | null) => ({
    type: ActionTypes.SET_MODAL,
    modal
});
const hideModal = () => ({
    type: ActionTypes.HIDE_MODAL
})

export { setUser, logout,
         addNotification,
         setModal, hideModal };