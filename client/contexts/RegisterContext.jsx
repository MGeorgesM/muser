import React, { useState, createContext, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { sendRequest, requestMethods } from '../core/tools/apiRequest';

const RegisterContext = createContext();

export const RegisterProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
        name: null,
        email: '',
        password: '',
        userType: 'musician',
        about: '',
        venueType: '',
        location: '',
        instrument: '',
        genre: '',
        experience: '',
        availability: '',
        profilePicture: '',
    });

    const navigation = useNavigation();

    console.log('RegisterProvider:', userInfo);

    const register = async () => {
        console.log('Registering:', userInfo);

        const response = await sendRequest(requestMethods.POST, 'auth/register', userInfo);

        console.log('Response:', response);

        if (response.status === 201) {
            navigation.navigate('Chat');
        } else if (response.error) {
            console.error('Error registering:', response.error);
            navigation.navigate('SignIn');
        }
    };

    return <RegisterContext.Provider value={{ userInfo, setUserInfo, register }}>{children}</RegisterContext.Provider>;
};

export const useRegister = () => useContext(RegisterContext);