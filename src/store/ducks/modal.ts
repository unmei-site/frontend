import React from "react";

// Actions
const SET_MODAL = 'unmei/modal/SET_MODAL';
const HIDE_MODAL = 'unmei/modal/HIDE_MODAL';

// Reducer
const initialState: React.ReactNode | null = null;
type Action = {
    type: string
    modal: React.ReactNode | null
}
const reducer = (state=initialState, action: Action) => {
    switch (action.type) {
        case SET_MODAL: {
            return action.modal;
        }
        case HIDE_MODAL: {
            return null;
        }
        default: return state;
    }
}

// Action creators
const setModal = (modal: React.ReactNode | null) => ({
    type: SET_MODAL,
    modal
});

const hideModal = () => ({
    type: HIDE_MODAL
});

export default reducer;
export { setModal, hideModal }
