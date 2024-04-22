import React, { useState, createContext, useContext } from 'react';

const RegisterContext = createContext();

export const RegisterProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        password: '',
        userType: 'musician',
        location: '',
        biography: '',
        insturment: '',
        genre:'',
        profilePicture: '',
    });

    console.log('RegisterProvider:', userInfo)

    const register = async () => {
        console.log('Registering:', userInfo);

        const response = await sendRequest('auth/register', requestMethods.POST, {
            userInfo,
        });

        console.log('Response:', response);

        if (response.status === 200) {
            navigation.navigate('ChatStack', {
                screen: 'Chat',
            });
        }
        if (response.error) {
            console.error('Error registering:', response.error);
        } else {
            navigation.navigate('SignIn');
        }
    };

    return (
        <RegisterContext.Provider value={{ userInfo, setUserInfo, register }}>
            {children}
        </RegisterContext.Provider>
    );
};

export const useRegister = () => useContext(RegisterContext);
