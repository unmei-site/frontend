const SET_USER = 'unmei/currentUser/SET_USER';
const LOGOUT = 'unmei/currentUser/LOGOUT';

const initialState = {
    authorized: false
};
type Action = {
    type: string
    userData: Unmei.UserType
};
const reducer = (state = initialState, action: Action) => {
    switch(action.type) {
        case SET_USER:
            if(action.userData) {
                state = Object.assign({}, state, action.userData);
                state.authorized = true;
            }
            return state;
        case LOGOUT:
            state = {
                authorized: false
            };
            return state;
        default:
            return state
    }
}

const setUser = (userData: Unmei.UserType) => ({
    type: SET_USER,
    userData
});
const logout = () => ({
    type: LOGOUT
});

export default reducer;
export { setUser, logout }
