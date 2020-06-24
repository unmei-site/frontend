import React from "react";
import ActionTypes from "../actionTypes";

const initialState: React.ReactNode | null = null;

type Action = {
    type: string
    modal: React.ReactNode | null
}

export default (state=initialState, action: Action) => {
    switch (action.type) {
        case ActionTypes.SET_MODAL: {
            return action.modal;
        }
        case ActionTypes.HIDE_MODAL: {
            return null;
        }
        default: return state;
    }
}