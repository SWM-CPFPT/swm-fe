const commentReducer = (state, action) => {
    switch (action.type) {
        case 'GET_COMMENTS':
            return {
                ...state,
                comments: action.payload,
                loading: action.loading,
            };
        default:
            return state;
    }
};

export default commentReducer;
