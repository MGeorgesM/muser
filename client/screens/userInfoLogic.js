import React, { useEffect, useState } from 'react';

import { useUser } from '../contexts/UserContext';
import * as ImagePicker from 'expo-image-picker';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

export const useUserInfoLogic = () => {
    const [profileProperties, setProfileProperties] = useState({});
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [error, setError] = useState(null);

    const { userInfo, setUserInfo, authError, setAuthError, handleSignUp } = useUser();

    useEffect(() => {
        const getProperties = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, 'auth/register/userinfo');
                if (response.status === 200) {
                    console.log('Properties:', response.data);
                    setProfileProperties(response.data.general);
                    userInfo.role_id == 1
                        ? setProfileProperties((prev) => ({ ...prev, ...response.data.musician }))
                        : setProfileProperties((prev) => ({ ...prev, ...response.data.venue }));
                }
            } catch (error) {
                console.error('Error getting properties:', error);
            }
        };
        getProperties();
    }, []);

    const handlePickerChange = (key, value) => {
        if (key === 'Music Genres') {
            setUserInfo((prev) => ({ ...prev, genres: [...prev.genres, value] }));
        } else if (key === 'Venue Type') {
            console.log('here');
            setUserInfo((prev) => ({ ...prev, [`venue_type_id`]: value }));
        } else {
            setUserInfo((prev) => ({ ...prev, [`${key.toLowerCase()}_id`]: value }));
        }
    };

    const handleImagePicker = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            console.error('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (result.canceled) return;
        setError(null);
        setSelectedPicture(result);
        setUserInfo((prev) => ({ ...prev, picture: result.uri }));
    };

    const validateForm = () => {
        setError(null);

        if (!selectedPicture) {
            setError('Please select a profile picture');
            return false;
        }

        if (userInfo.about.length > 40 || userInfo.venue_name.length > 40) {
            setError('Please keep your bio under 40 characters');
            return false;
        }
        if (userInfo.about === '' || userInfo.location_id === '') {
            setError('Please fill in all fields');
            return false;
        }
        if (
            userInfo.role_id == 1 &&
            (userInfo.genres.length === 0 || userInfo.instrument_id === '' || userInfo.experience_id === '')
        ) {
            console.log('here');
            setError('Please fill in all fields');
            return false;
        } else if (userInfo.role_id == 2 && (userInfo.venue_type_id === '' || userInfo.venue_name === '')) {
            setError('Please fill in all fields');
            return false;
        } else {
            setError(null);
            setAuthError(null);
            return true;
        }
    };

    const handleUserInfoInput = () => {
        setError(null);
        const userInputValid = validateForm();

        if (!userInputValid) return;

        const filename = selectedPicture.assets[0].uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const ext = match?.[1];

        const formData = new FormData();

        for (const key in userInfo) {
            if (userInfo[key] === '') continue;
            if (key === 'picture') {
                console.log('here!');
                formData.append('picture', {
                    uri: selectedPicture.assets[0].uri,
                    name: `photo.${ext}`,
                    type: `image/${ext}`,
                });
            } else if (Array.isArray(userInfo[key])) {
                userInfo[key].forEach((item) => {
                    formData.append(`${key}[]`, item);
                });
            } else {
                formData.append(key, userInfo[key]);
            }
        }

        return formData;
    };

    const handlePress = (genreId) => {
        let newGenres = [];
        if (userInfo.genres.includes(genreId)) {
            newGenres = userInfo.genres.filter((id) => id !== genreId);
        } else {
            newGenres = [...userInfo.genres, genreId];
        }
        setUserInfo((prev) => ({ ...prev, genres: newGenres }));
    };

    const handleProceed = async () => {
        const formData = handleUserInfoInput();
        if (!formData) return;
        handleSignUp(formData);
    };

    return {
        error,
        userInfo,
        authError,
        handlePress,
        setUserInfo,
        handleProceed,
        selectedPicture,
        profileProperties,
        handleImagePicker,
        handlePickerChange,
        handleUserInfoInput,
    };
};
