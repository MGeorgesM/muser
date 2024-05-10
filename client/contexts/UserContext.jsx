import { createContext, useContext, useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: 'Ariana',
        // email: 'jhonny@mail.com',
        // email: 'anissa.auer@example.org',
        email: 'caitlyn01@example.net',
        password: 'password',
        about: '',
        picture: '',
        location_id: '',
        availability_id: '',
        experience_id: '',
        instrument_id: '',
        venue_type_id: '',
        venue_name: '',
        role_id: '1',
        genres: [],
    });
    const navigation = useNavigation();
    console.log(userInfo);

    useEffect(() => {

        const checkUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');

                if (token && currentUser === null) {
                    const response = await sendRequest(requestMethods.GET, 'auth/me');
                    if (response.status === 200) {
                        setLoggedIn(true);
                        setCurrentUser(response.data);
                    } else {
                        await AsyncStorage.clear();
                        setLoggedIn(false);
                        !loggedIn && navigation.navigate('Authentication');
                    }
                }
                token && setLoggedIn(true);
            } catch (error) {
                console.log('Error getting token:', error);
            }
        };
        checkUser();
    }, []);

    const handleSignOut = async () => {
        console.log(navigation.getState());
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/logout');
            if (response.status !== 200) throw new Error('Failed to log out');
            setLoggedIn(false);
            setCurrentUser(null);
            await AsyncStorage.clear();
            // navigation.dispatch(
            //     CommonActions.reset({
            //         index: 0,
            //         routes: [{ name: 'Welcome' }],
            //     })
            // );
        } catch (error) {
            console.log('Error logging out:', error);
        }
    };

    return (
        <UserContext.Provider
            value={{
                loggedIn,
                userInfo,
                currentUser,
                setUserInfo,
                setLoggedIn,
                handleSignOut,
                setCurrentUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
