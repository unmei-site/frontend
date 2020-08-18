import ActionTypes from "../actionTypes";

const initialState = {
    authorized: false
};

type Action = {
    type: string
    userData: UserType
}

export default (state = initialState, action: Action) => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            if(action.userData) {
                state = Object.assign({}, state, action.userData);
                state.authorized = true;
            }
            return state;
        case ActionTypes.LOGOUT:
            state = {
                authorized: false
            };
            return state;
        default:
            return state
    }
}