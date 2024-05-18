import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { sendRequest, requestMethods } from '../core/tools/apiRequest';

const UserContext = createContext();

const initialUserInfo = {
    name: '',
    email: 'ariana@mail.com',
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
};

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [userInfo, setUserInfo] = useState(initialUserInfo);

    const navigation = useNavigation();

    useEffect(() => {
        checkUser();
    }, []);

    const updateUserFcmtoken = async (token) => {
        try {
            const response = await sendRequest(requestMethods.POST, 'notifications/fcmtoken', {
                fcmtoken: token,
            });
            if (response.status !== 200) throw new Error('Failed to update user fcm token');
        } catch (error) {
            console.log('Error updating user fcm token:', error);
        }
    };

    const getAndSaveFcmToken = async () => {
        try {
            await messaging().registerDeviceForRemoteMessages();
            const token = await messaging().getToken();
            updateUserFcmtoken(token);
        } catch (error) {
            console.log('Error getting fcm token:', error);
        }
    };

    const setupAuthenticatedUser = async (response) => {
        try {
            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('streamToken', response.data.stream_token);
            await getAndSaveFcmToken();
            setLoggedIn(true);
            setAuthError(null);
            setUserInfo(initialUserInfo);
            setCurrentUser(response.data.user);
        } catch (error) {
            console.log('Error setting up authenticated user:', error);
        }
    };

    const checkUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token && currentUser === null) {
                const response = await sendRequest(requestMethods.GET, 'auth/me');
                if (response.status === 200) {
                    await getAndSaveFcmToken();
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

    const handleSignIn = async () => {
        setAuthError(null);
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/login', userInfo);
            if (response.status === 200) {
                await setupAuthenticatedUser(response);
            }
        } catch (authError) {
            console.log('authError signing in:', authError);
            setAuthError('Invalid email or password');
        }
    };

    const handleSignOut = async () => {
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/logout');
            if (response.status !== 200) throw new authError('Failed to log out');
            setLoggedIn(false);
            setCurrentUser(null);
            setUserInfo(initialUserInfo);
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
                await setupAuthenticatedUser(response);
            }
        } catch (error) {
            console.error('Error registering:', error);
            setAuthError('Failed to register user');
        }
    };

    const handleUpdate = async (formData) => {
        console.log('here');

        try {
            const response = await sendRequest(requestMethods.POST, 'users/', formData);
            if (response.status !== 200) throw new Error('Error updating user info');
            setCurrentUser(response.data.user);
            setAuthError(null);
        } catch (error) {
            console.log('Error updating user info:', error);
            setAuthError(error.response?.data?.message);
            throw error;
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
                handleUpdate,
                setCurrentUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
