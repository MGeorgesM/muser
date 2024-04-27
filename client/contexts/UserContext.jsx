import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import { createContext, useContext, useEffect, useState } from 'react';

// import { auth } from '../config/firebase';
// import { signInWithEmailAndPassword } from 'firebase/auth';

import { useNavigation } from '@react-navigation/native';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [userInfo, setUserInfo] = useState({
        name: 'May',
        email: 'may@mail.com',
        password: 'password',
        about: '',
        picture: '',
        location_id: '',
        availability_id: '',
        experience_id: '',
        instrument_id: '',
        role_id: 1,
        genres: [],
    });
    const navigation = useNavigation();
    console.log(userInfo);

    useEffect(() => {
        // const subscriber = auth.onAuthStateChanged(async (user) => {
        //     if (user) {
        //         const token = await user.getIdToken();
        //         await AsyncStorage.setItem('token', token);
        //         console.log('User found:', token);
        //         setCurrentUser(user);
        //     } else {
        //         await AsyncStorage.removeItem('token');
        //         console.log('User not found');
        //         setCurrentUser(null);
        //     }
        // });
        // return subscriber;

        const checkUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                token && setLoggedIn(true);
                console.log('Token in UserContext:', token);
            } catch (error) {
                console.log('Error getting token:', error);
            }
        };
        checkUser();
    }, []);

    const handleSignIn = async () => {
        // try {
        //     const response = await signInWithEmailAndPassword(auth, email, password);
        //     if (response.status === 200) {
        //         navigation.navigate('Feed');
        //     }
        // } catch (error) {
        //     console.error('Error signing in:', error);
        // }
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/login', userInfo);

            if (response.status === 200) {
                await AsyncStorage.setItem('token', response.data.token);
                setLoggedIn(true);
                setCurrentUser(response.data.user);
                setAuthError(null);
                console.log('User login successful:', response.data.user);
                navigation.navigate('Feed');
            }
        } catch (error) {
            console.log('Error signing in:', error);
            setAuthError('Invalid email or password');
        }
    };

    const handleSignUp = async () => {
        const formData = new FormData();

        for (const key in userInfo) {
            if (key === 'picture' && userInfo.picture) {
                formData.append('picture', {
                    uri: userInfo[key].uri,
                    name: userInfo[key].name,
                    type: userInfo[key].type,
                });
            }
            formData.append(key, userInfo[key]);
        }
        console.log('User Info:', userInfo);
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                await AsyncStorage.setItem('token', response.data.token);
                setLoggedIn(true);
                setCurrentUser(response.data.user);
                setAuthError(null);
                navigation.navigate('Feed');
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    const handleSignOut = async () => {
        console.log(navigation.getState())
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/logout');
            if (response.status !== 200) throw new Error('Failed to log out');
            setCurrentUser(null);
            setLoggedIn(false);
            await AsyncStorage.removeItem('token');
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'Authentication' }, // Ensure this is the correct name of your auth stack or screen
                    ],
                })
            );
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <UserContext.Provider
            value={{
                loggedIn,
                userInfo,
                authError,
                currentUser,
                handleSignIn,
                handleSignUp,
                handleSignOut,
                setUserInfo,
                setCurrentUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
