import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 20000,
});

instance.interceptors.request.use((config) => {
    //TODOS: handle token
    return config;
});

instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        switch (error.response?.status) {
            case 401:
                const message401 = error.response.data.error;
                return Promise.reject(message401);
            case 400:
                const message400 = error.response.data.fail || error.response.data;
                return Promise.reject(message400);
            default:
                break;
        }
    }
);

export default instance;
