import { createContext, useContext, useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [userInfo, setUserInfo] = useState({
        name: 'Georges',
        email: 'georges@mail.com',
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
            } catch (authError) {
                console.log('authError getting token:', authError);
            }
        };
        checkUser();
    }, []);

    const handleSignIn = async () => {
        setAuthError(null);
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/login', userInfo);

            if (response.status === 200) {
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('streamToken', response.data.stream_token);
                setLoggedIn(true);
                setCurrentUser(response.data.user);
                console.log('User login successful:', response.data.user);
                loggedIn && navigation.navigate('Feed', { screen: 'FeedMain' });
            }
        } catch (authError) {
            console.log('authError signing in:', authError);
            setAuthError('Invalid email or password');
        }
    };

    const handleSignOut = async () => {
        console.log(navigation.getState());
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/logout');
            if (response.status !== 200) throw new authError('Failed to log out');
            setLoggedIn(false);
            setCurrentUser(null);
            await AsyncStorage.clear();
            // navigation.dispatch(
            //     CommonActions.reset({
            //         index: 0,
            //         routes: [{ name: 'Welcome' }],
            //     })
            // );
        } catch (authError) {
            console.log('authError logging out:', authError);
        }
    };

    const handleSignUp = async (formData) => {
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/register', formData);
            if (response.status === 201) {
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('streamToken', response.data.stream_token);
                setLoggedIn(true);
                setCurrentUser(response.data.user);
                loggedIn && navigation.navigate('Feed', { screen: 'FeedMain' });
            }
        } catch (error) {
            console.error('Error registering:', error);
            setAuthError('Failed to register user');
        }
    };

    return (
        <UserContext.Provider
            value={{
                authError,
                loggedIn,
                userInfo,
                currentUser,
                setAuthError,
                setUserInfo,
                setLoggedIn,
                handleSignIn,
                handleSignUp,
                handleSignOut,
                setCurrentUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
