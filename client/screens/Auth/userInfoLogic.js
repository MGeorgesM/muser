import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../core/data/contexts/UserContext';

import { sendRequest, requestMethods } from '../../core/tools/apiRequest';

export const useUserInfoLogic = () => {
    const [profileProperties, setProfileProperties] = useState({});
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [error, setError] = useState(null);
    const { userInfo, setUserInfo, authError, setAuthError, handleSignUp, handleUpdate } = useUser();

    useEffect(() => {
        const getProperties = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, 'auth/register/userinfo');
                if (response.status === 200) {
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
    }, [userInfo.role_id]);

    const handlePickerChange = (key, value) => {
        if (key === 'Music Genres') {
            setUserInfo((prev) => ({ ...prev, genres: [...prev.genres, value] }));
        } else if (key === 'Venue Type') {
            setUserInfo((prev) => ({ ...prev, [`venue_type_id`]: value }));
        } else {
            setUserInfo((prev) => ({ ...prev, [`${key.toLowerCase()}_id`]: value }));
        }
        console.log('User Info LOGIC:', userInfo);
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
        setUserInfo((prev) => ({ ...prev, picture: result.assets[0].uri }));
    };

    const validateForm = (update = false) => {
        setError(null);
        if (!selectedPicture && !update) {
            setError('Please select a profile picture');
            return false;
        }
        if (
            (userInfo.role_id == 1 && userInfo.about.length > 40) ||
            (userInfo.role_id == 2 && userInfo.venue_name.length > 40)
        ) {
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

    const validateCredentials = async () => {
        if (!userInfo.email.length > 0 || !userInfo.email.includes('@') || !userInfo.email.includes('.')) {
            setError('Please enter a valid email address');
            return false;
        } else if (userInfo.new_password && userInfo.new_password.length > 6 && !userInfo.current_password) {
            setError('Please enter your current password');
            return false;
        } else if (userInfo.current_password && userInfo.new_password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        } else {
            setError(null);
            setAuthError(null);
            return true;
        }
    };

    const handleUserPicture = (formData) => {
        const uri = selectedPicture.assets[0].uri;
        const filename = selectedPicture.assets[0].uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const ext = match?.[1];
        const type = match ? `picture/${match[1]}` : `picture`;

        formData.append('picture', {
            uri: selectedPicture.assets[0].uri,
            name: `photo.${ext}`,
            type: `image/${ext}`,
        });
    };

    const handleUserInfoInput = (update = false) => {
        setError(null);
        const userInputValid = validateForm(update);
        if (!userInputValid) return;

        const formData = new FormData();

        for (const key in userInfo) {
            if (!userInfo[key] || userInfo[key] === '') continue;
            if (key === 'email' && update) continue;
            if (key === 'picture') {
                selectedPicture && handleUserPicture(formData);
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

    const handleProceed = async (update = false) => {
        const formData = handleUserInfoInput(update);
        if (!formData) return false;

        try {
            if (update) {
                await handleUpdate(formData);
            } else {
                await handleSignUp(formData);
            }
            console.log('Success');
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
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
        setSelectedPicture,
        handlePickerChange,
        handleUserInfoInput,
    };
};
