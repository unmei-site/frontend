// Actions
const SET_PRELOADER_STATUS = 'unmei/notifications/SET_PRELOADER_STATUS';

// Reducer
const initialState = false;
type Action = {
    type: string
    status: boolean
};
const reducer = (state = initialState, action: Action) => {
    switch(action.type) {
        case SET_PRELOADER_STATUS:
            return action.status;
        default:
            return state;
    }
}

// Actions creator
const setPreloader = (status: boolean) => ({
    type: SET_PRELOADER_STATUS,
    status
});

export default reducer;
export { setPreloader };
