import { createContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { GetInforService } from '../services/userService';

export const UserContext = createContext();
const UserContextProvider = (props) => {
    var authToken = localStorage.getItem('authToken');
    const [cookies] = useCookies(['token']);
    const [user, setUser] = useState('');
    // const [token, setToken] = useState(cookies?.token ? cookies.token : '');
    const [token, setToken] = useState(authToken !=null ? authToken : '');
    const [render, setRender] = useState('');
    const HandleGetInfo = async () => {
        const result = await GetInforService(token);
        if (result?.result?.result?.status === 200) {
            setUser(result?.result?.result.data);
        }
    };

    useEffect(() => {
        if (token) {
            HandleGetInfo();
        }
    }, [render]);

    const onSetUser = (value) => {
        setUser(value.data);
        setToken(value.token);
    };

    const onSetToken = (value) => {
        setToken(value);
    };

    const onSetRender = () => {
        setRender(!render);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                token,
                render,
                onSetRender,
                onSetUser,
                onSetToken,
            }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
