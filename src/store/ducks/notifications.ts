import React from "react";

// Actions
const ADD_NOTIFICATION = 'unmei/notifications/ADD_NOTIFICATION';

// Reducer
const initialState: React.ReactNode[] = [];
type Action = {
    type: string
    notification: React.ReactNode
};
const reducer = (state = initialState, action: Action) => {
    switch(action.type) {
        case ADD_NOTIFICATION: {
            if(state.length === 3)
                return [...state.slice(1), action.notification];
            return [...state, action.notification];
        }
        default:
            return state;
    }
}

// Actions creator
const addNotification = (notification: React.ReactNode) => ({
    type: ADD_NOTIFICATION,
    notification
});

export default reducer;
export { addNotification };
