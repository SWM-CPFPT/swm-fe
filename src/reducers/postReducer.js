const postReducer = (state, action) => {
    switch (action.type) {
        case 'GET_POSTS':
            return {
                ...state,
                posts: action.payload,
                loading: action.loading,
            };
        case 'GET_POST_DETAILS':
            return {
                ...state,
                currentPost: action.payload,
                loading: action.loading,
            };
        default:
            return state;
    }
};

export default postReducer;
