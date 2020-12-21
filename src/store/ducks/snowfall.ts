const SET_SNOWFLAKE_COUNT = 'unmei/snowfall/SET_SNOWFLAKE_COUNT';
const SET_SNOWFALL_STATUS = 'unmei/snowfall/SET_SNOWFALL_STATUS';

const initialState: Snowfall = {
    snowflakeCount: JSON.parse(localStorage.getItem('snowflakeCount') ?? '250'),
    snowfallStatus: true
};

const reducer = (state = initialState, action: Action<Snowfall>) => {
    if(!action.payload) return state;
    const payload = action.payload;
    switch(action.type) {
        case SET_SNOWFLAKE_COUNT:
            localStorage.setItem('snowflakeCount', JSON.stringify(payload.snowflakeCount));
            return Object.assign({}, state, { snowflakeCount: payload.snowflakeCount });
        case SET_SNOWFALL_STATUS:
            return Object.assign({}, state, { snowfallStatus: payload.snowfallStatus });
        default:
            return state
    }
}

const setSnowflakeCount = (snowflakeCount: number) => ({
    type: SET_SNOWFLAKE_COUNT,
    payload: {
        snowflakeCount
    }
});
const setSnowfallStatus = (snowfallStatus: boolean) => ({
    type: SET_SNOWFALL_STATUS,
    payload: {
        snowfallStatus
    }
});

export default reducer;
export { setSnowflakeCount, setSnowfallStatus }
