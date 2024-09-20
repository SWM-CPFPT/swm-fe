import { createContext, useReducer, useEffect } from 'react';
import subjectReducer from '../reducers/subjectReducer';
import { getAllSubjectService } from '../services/subjectService';

const initialState = {
    subjects: [],
};

export const SubjectContext = createContext(null);

const SubjectProvider = ({ children }) => {
    const [state, dispatch] = useReducer(subjectReducer, initialState);

    useEffect(() => {
        const getAllSubject = async () => {
            const response = await getAllSubjectService();
            dispatch({
                type: 'GET_SUBJECTS',
                payload: response?.data,
            });
        };
        getAllSubject();
    }, []);

    return <SubjectContext.Provider value={{ subjects: state.subjects }}>{children}</SubjectContext.Provider>;
};

export default SubjectProvider;
