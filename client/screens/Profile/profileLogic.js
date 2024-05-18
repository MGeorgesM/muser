import React, { useEffect, useState, useLayoutEffect } from 'react';
import { ChevronLeft, LogOut } from 'lucide-react-native';
import { colors } from '../../styles/utilities';
import { sendRequest, requestMethods } from '../../core/tools/apiRequest';
import { useUser } from '../../core/data/contexts/UserContext';
import { useUserInfoLogic } from '../Auth/userInfoLogic';
import { useNavigation } from '@react-navigation/native';

const useProfileLogic = (currentUser) => {
    const [isEditing, setIsEditing] = useState({
        details: false,
        credentials: false,
    });

    const { handleSignOut } = useUser();
    const { handleProceed, setUserInfo } = useUserInfoLogic();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: isEditing.credentials
                ? 'Edit Login Details'
                : isEditing.details
                ? 'Edit your Profile'
                : 'Profile',
            headerStyle: {
                backgroundColor: colors.bgDarkest,
                shadowColor: 'transparent',
                elevation: 0,
                height: 128,
            },

            headerTitleStyle: {
                fontFamily: 'Montserrat-Regular',
                color: colors.white,
                fontSize: 20,
            },

            headerLeft: () => (
                <ChevronLeft size={24} color="white" onPress={handleBackPress} style={{ marginLeft: 20 }} />
            ),

            headerRight: () => <LogOut size={24} color={'white'} style={{ marginEnd: 20 }} onPress={handleSignOut} />,
        });
    }, [isEditing]);

    useEffect(() => {
        getUserInfo();
    }, [currentUser]);

    const getUserInfo = async () => {
        try {
            const response = await sendRequest(requestMethods.GET, 'auth/me?flat=true', null);
            if (response.status !== 200) throw new Error('Error getting user info');
            setUserInfo((prev) => ({ ...prev, ...response.data }));
        } catch (error) {
            console.log('Error getting user info:', error);
        }
    };

    const handleBackPress = () => {
        setIsEditing((prev) => {
            if (prev.details || prev.credentials) {
                return { details: false, credentials: false };
            } else {
                navigation.goBack();
                return prev;
            }
        });
    };

    const handleSave = async () => {
        const success = await handleProceed(true);
        if (success) {
            setIsEditing({ details: false, credentials: false });
        }
    };

    return {
        isEditing,
        setIsEditing,
        handleSave,
    };
};

export default useProfileLogic;
