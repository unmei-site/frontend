const SET_SETTINGS = 'unmei/userSettings/SET_SETTINGS';

const reducer = (state = {}, action: Action<{ settings: Unmei.UserSettingsType }>) => {
    switch(action.type) {
        case SET_SETTINGS:
            state = Object.assign({}, state, action.payload.settings);
            return state;
        default:
            return state;
    }
}

const setSettings = (settings: Unmei.UserSettingsType) => ({
    type: SET_SETTINGS,
    payload: { settings }
});

export default reducer;
export { setSettings }
