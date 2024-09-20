const subjectReducer = (state, action) => {
    switch (action.type) {
        case 'GET_SUBJECTS':
            return {
                ...state,
                subjects: action.payload
            }
        default:
            return state;
    }
}

export default subjectReducer