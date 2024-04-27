import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useContext, useEffect, useState } from 'react';

// import { auth } from '../config/firebase';
// import { signInWithEmailAndPassword } from 'firebase/auth';

import { useNavigation } from '@react-navigation/native';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

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
                console.log('token in context:', token);
            } catch (error) {
                console.log('Error getting token:', error);
            }
        };
        checkUser();
    }, []);

    const handleSignIn = async (email, password) => {
        // try {
        //     const response = await signInWithEmailAndPassword(auth, email, password);
        //     if (response.status === 200) {
        //         navigation.navigate('Feed');
        //     }
        // } catch (error) {
        //     console.error('Error signing in:', error);
        // }

        if (!email || !password) return

        try {
            const response = await sendRequest(requestMethods.POST, 'auth/login', { email, password });
            if (response.status === 200) {
                await AsyncStorage.setItem('token', response.data.token);
                setCurrentUser(response.data.user);
                navigation.navigate('Feed');
            }
        } catch (error) {
            console.error(response);
        }
    };

    const handleSignUp = async (userInfo) => {
        const response = await sendRequest(requestMethods.POST, 'auth/register', userInfo);
        if (response.status === 201) {
            await AsyncStorage.setItem('token', response.data.token);
            setCurrentUser(response.data.user);
            navigation.navigate('Feed');
        } else if (response.error) {
            console.error('Error registering:', response.error);
        }
    };

    const handleSignOut = async () => {
        await auth.signOut();
        await AsyncStorage.removeItem('token');
        navigation.navigate('SignIn');
    };

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, handleSignIn, handleSignUp, handleSignOut }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
