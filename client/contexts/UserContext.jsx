import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useContext, useEffect, useState } from 'react';

// import { auth } from '../config/firebase';
// import { signInWithEmailAndPassword } from 'firebase/auth';

import { useNavigation } from '@react-navigation/native';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [signUpForm, setSignUpForm] = useState({
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
        role_id: 1,
        genres: [],
    });
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
                console.log('Token in UserContext:', token);
            } catch (error) {
                console.log('Error getting token:', error);
            }
        };
        checkUser();
    }, []);

    const handleSignIn = async (signInForm) => {
        // try {
        //     const response = await signInWithEmailAndPassword(auth, email, password);
        //     if (response.status === 200) {
        //         navigation.navigate('Feed');
        //     }
        // } catch (error) {
        //     console.error('Error signing in:', error);
        // }

        try {
            const response = await sendRequest(requestMethods.POST, 'auth/login', { signInForm });
            if (response.status === 200) {
                await AsyncStorage.setItem('token', response.data.token);
                setCurrentUser(response.data.user);
                navigation.navigate('Feed');
            }
        } catch (error) {
            console.error(response);
        }
    };

    const handleSignUp = async (signUpForm) => {
        const response = await sendRequest(requestMethods.POST, 'auth/register', signUpForm);
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
        <UserContext.Provider
            value={{
                signUpForm,
                currentUser,
                setSignUpForm,
                setCurrentUser,
                handleSignIn,
                handleSignUp,
                handleSignOut,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
