import React, { useState, useEffect } from 'react';
import { Text, TextInput, Image, TouchableOpacity, View } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { useUser } from '../contexts/UserContext';
import { requestMethods, sendRequest } from '../core/tools/apiRequest';

import { CirclePlus, Plus, ArrowLeft } from 'lucide-react-native';

import ProfileDetailsPicker from '../components/ProfileDetailsPicker/ProfileDetailsPicker';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { styles } = require('../components/AuthenticationForms/styles');

const UserInfo = ({ navigation }) => {
    const [profileProperties, setProfileProperties] = useState({});
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [formTouched, setFormTouched] = useState(false);
    const [error, setError] = useState(null);

    const { userInfo, setUserInfo } = useUser();

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

        setSelectedPicture(result);

        // if (!result.cancelled && result.assets && result.assets.length > 0) {
        //     const uri = result.assets[0].uri;
        //     const fileType = uri.substring(uri.lastIndexOf('.') + 1);
        //     const type = `image/${fileType}`;
        //     const name = `picture.${fileType}`;

        //     console.log('Image:', { uri, name, type });

        //     setUserInfo((prev) => ({ ...prev, picture: { uri, name, type } }));
        //     setSelectedPicture(result);
        // }
    };

    const validateForm = () => {
        if (userInfo.about === '' || userInfo.location_id === '') {
            console.log('here');
            setError('Please fill in all fields');
            return false;
        }
        if (
            userInfo.role_id === 1 &&
            (userInfo.genres.length === 0 || userInfo.instrument_id === '' || userInfo.experience_id === '')
        ) {
            setError('Please fill in all fields');
            return false;
        } else if (userInfo.role_id === 2 && userInfo.venue_type_id === '') {
            setError('Please fill in all fields');
            return false;
        } else {
            setError(null);
            return true;
        }
    };

    const handleSignUp = async () => {
        setError(null);

        const userInputValid = validateForm();

        if (!userInputValid) return;

        console.log('Selected Picture:', selectedPicture);

        const uri = selectedPicture.assets[0].uri;
        const filename = selectedPicture.assets[0].uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const ext = match?.[1];
        const type = match ? `picture/${match[1]}` : `picture`;

        const formData = new FormData();

        for (const key in userInfo) {
            if (key === 'picture' && userInfo.picture) {
                console.log('here!');
                formData.append('picture', {
                    uri: selectedPicture.assets[0].uri,
                    name: `photo.${ext}`, // Ensure the extension is correct
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
        console.log('User Info:', userInfo);
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/register', formData);
            if (response.status === 201) {
                await AsyncStorage.setItem('token', response.data.token);
                setLoggedIn(true);
                setCurrentUser(response.data.user);
                navigation.navigate('Feed');
            }
        } catch (error) {
            console.error('Error registering:', error);
            setError('Failed to register user');
        }
    };

    return (
        <View style={styles.userInfoContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerProfile}>Complete Your Profile</Text>
            </View>
            <View style={styles.addPhotoPrompt}>
                {selectedPicture ? (
                    <>
                        <Image
                            source={{ uri: selectedPicture.assets[0].uri }}
                            style={{ width: 100, height: 100, borderRadius: 50 }}
                        />
                    </>
                ) : (
                    <Text style={styles.addPhotoText}>Add a Photo</Text>
                )}
                <TouchableOpacity onPress={handleImagePicker}>
                    <CirclePlus size={50} color={'black'} />
                </TouchableOpacity>
            </View>
            <View>
                <Text style={styles.inputTextProfile}>{userInfo.userType === 'venue' ? 'Description' : 'Bio'}</Text>
                <TextInput
                    placeholder="Tell us about yourself!"
                    style={{ marginBottom: 20 }}
                    value={userInfo.about}
                    onChangeText={(text) => setUserInfo((prev) => ({ ...prev, about: text }))}
                />
                <View>
                    {Object.keys(profileProperties).length > 0 &&
                        Object.keys(profileProperties).map((key) => {
                            if (key === 'Music Genres') {
                                return;
                            }
                            return (
                                <ProfileDetailsPicker
                                    key={key}
                                    label={key}
                                    items={profileProperties[key]}
                                    selectedValue={userInfo[key.toLowerCase() + '_id']}
                                    onValueChange={(value) => handlePickerChange(key, value)}
                                />
                            );
                        })}
                </View>
            </View>
            <View style={styles.bottomInnerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.primaryBtn}>
                    <Text style={styles.primaryBtnText} onPress={handleSignUp}>
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default UserInfo;
