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
    const [userInfo, setUserInfo] = useState({
        name: 'May',
        email: 'may@mail.com',
        password: 'password',
        about: 'New to beirut looking for a bass player to play Jazz',
        picture: '',
        location_id:1,
        availability_id: 1,
        experience_id: 3,
        instrument_id: 6,
        venue_type_id: '',
        role_id: 1,
        genres: [1, 3],
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

                if (token && currentUser === null) {
                    const response = await sendRequest(requestMethods.GET, 'auth/me');
                    if (response.status === 200) {
                        setCurrentUser(response.data);
                    } else {
                        await AsyncStorage.removeItem('token');
                        setLoggedIn(false);
                        navigation.navigate('Authentication');
                    }
                }
                token && setLoggedIn(true);
                console.log('Token in UserContext:', token);
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
            setCurrentUser(null);
            setLoggedIn(false);
            await AsyncStorage.removeItem('token');
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'Authentication' },
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
                currentUser,
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
