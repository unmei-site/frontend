import React from "react";
import ActionTypes from "../actionTypes";

const initialState: React.ReactNode[] = [];

type Action = {
    type: string
    payload: {
        notification: React.ReactNode[]
    }
}

export default (state = initialState, action: Action) => {
    switch (action.type) {
        case ActionTypes.ADD_NOTIFICATION: {
            if(state.length === 3)
                return [...state.slice(1), action.payload.notification];
            return [...state, action.payload.notification];
        }
        default: return state;
    }
}