import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useContext, useEffect, useState } from 'react';

import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { useNavigation } from '@react-navigation/native';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);
    const navigation = useNavigation();


    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const token = await user.getIdToken();
                await AsyncStorage.setItem('token', token);
                console.log('User found:', token);
                setCurrentUser(user);
            } else {
                await AsyncStorage.removeItem('token');
                console.log('User not found');
                setCurrentUser(null);
            }
        });
        return subscriber;
    }, []);

    const handleSignIn = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('Chat');
            if (response.status === 200) {
                navigation.navigate('Chat');
            }
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    const handleSignUp = async (userInfo) => {
        const response = await sendRequest(requestMethods.POST, 'auth/register', userInfo);
        if (response.status === 201) {
            navigation.navigate('Chat');
        } else if (response.error) {
            console.error('Error registering:', response.error);
            navigation.navigate('SignIn');
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
