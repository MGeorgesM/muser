import React, { useState, useEffect, createContext, useContext } from 'react';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    // const getCurrentUser = async () => {
    //     try {
    //         const response = await sendRequest(requestMethods.GET, '/user');
    //         response.status === 200 && setCurrentUser(response.data.user);
    //     } catch (error) {
    //         setCurrentUser(null);
    //         console.error(error);
    //     }
    // };

    // useEffect(() => {
    //     getCurrentUser();
    // }, []);

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
