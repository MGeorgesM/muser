import { createContext, useContext, useEffect, useState } from 'react';

// import { GoogleSignin } from '@react-native-google-signin/google-signin';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import messaging from '@react-native-firebase/messaging';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

const UserContext = createContext();

// GoogleSignin.configure({
//     webClientId: '346495985297-4t75dva7hb428hbs85d4olpvapsh5j7m.apps.googleusercontent.com',
//     offlineAccess: true,
//     forceCodeForRefreshToken: true,
// });

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        password: '',
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
        checkUser();
    }, []);

    const updateUserFcmtoken = async (fcmtoken) => {
        try {
            const response = await sendRequest(requestMethods.POST, 'users', { fcmtoken });
            if (response.status !== 200) throw new Error('Failed to update user fcm token');
        } catch (error) {
            console.log('Error updating user fcm token:', error);
        }
    };

    const getAndSaveFcmToken = async () => {
        // Register the device with FCM
        await messaging().registerDeviceForRemoteMessages();

        // Get the token
        const token = await messaging().getToken();

        // Save the token
        console.log('FCM Token:', token);
        updateUserFcmtoken(token);
    };

    const setupAuthenticatedUser = async () => {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('streamToken', response.data.stream_token);
        await getAndSaveFcmToken();
        setLoggedIn(true);
        setCurrentUser(response.data.user);
        console.log('User login successful:', response.data.user);
        // loggedIn && navigation.navigate('Feed', { screen: 'FeedMain' });
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

    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const token = userInfo.idToken;

            const response = await sendRequest(requestMethods.POST, 'auth/google', { token });
            if (response.status === 200 && response.data.userExists) {
                await setupAuthenticatedUser();
            } else {
                setUserInfo((prevState) => ({
                    ...prevState,
                    name: userInfo.user.name,
                    email: userInfo.user.email,
                }));
                navigation.navigate('CompleteRegistration');
            }
        } catch (error) {
            console.log('Google Sign-In Error:', error);
        }
    };

    const handleSignIn = async () => {
        setAuthError(null);
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/login', userInfo);

            if (response.status === 200) {
                await setupAuthenticatedUser();
                // await AsyncStorage.setItem('token', response.data.token);
                // await AsyncStorage.setItem('streamToken', response.data.stream_token);
                // await getAndSaveFcmToken();
                // setLoggedIn(true);
                // setCurrentUser(response.data.user);
                // console.log('User login successful:', response.data.user);
                // loggedIn && navigation.navigate('Feed', { screen: 'FeedMain' });
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
                await setupAuthenticatedUser();
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
