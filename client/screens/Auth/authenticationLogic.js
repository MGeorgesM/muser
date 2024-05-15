import { useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { sendRequest, requestMethods } from '../../core/tools/apiRequest';

export const useAuthenticationLogic = () => {
    const navigation = useNavigation();
    const [error, setError] = useState(null);
    const [switchHandler, setSwitchHandler] = useState(false);
    const { userInfo, setUserInfo, authError, setAuthError, handleSignIn } = useUser();

    useEffect(() => {
        if ((!userInfo.email.includes('@') || !userInfo.email.includes('.')) && userInfo.email.length > 0) {
            setError('Please enter a valid email address');
        } else if (userInfo.password.length < 6 && userInfo.password.length > 0) {
            setError('Password must be at least 6 characters long');
        } else {
            setError(null);
            setAuthError(null);
        }
    }, [userInfo, switchHandler]);

    const checkEmail = async () => {
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/register/email', { email: userInfo.email });
            if (response.status === 200) {
                return false;
            } else if (response.status === 401) {
                setError('Email already in use');
                return true;
            }
        } catch (error) {
            setError('Email already in use');
            return true;
        }
    };

    const handleProceed = async () => {
        setError(null);
        if (switchHandler) {
            if (userInfo.email.length < 1 || userInfo.password.length < 1 || userInfo.name.length < 1) {
                setError('Please fill out all fields');
                return;
            }
            const emailExists = await checkEmail();
            if (!emailExists) {
                navigation.navigate('UserRole');
            }
        } else {
            handleSignIn();
        }
    };

    return {
        error,
        setError,
        userInfo,
        authError,
        setUserInfo,
        setAuthError,
        handleProceed,
        switchHandler,
        setSwitchHandler,
    };
};

export default useAuthenticationLogic;
