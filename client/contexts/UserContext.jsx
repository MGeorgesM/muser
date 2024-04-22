import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../config/firebase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            console.log('User:', user);
        });
        return subscriber;
    }, []);

    return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
