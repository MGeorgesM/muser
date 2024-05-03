import React, { useState, useEffect } from 'react';
import { Text, TextInput, Image, TouchableOpacity, View, StyleSheet } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { useUser } from '../contexts/UserContext';
import { requestMethods, sendRequest } from '../core/tools/apiRequest';

import { CirclePlus, Plus, ArrowLeft, ChevronLeft } from 'lucide-react-native';

import ProfileDetailsPicker from '../components/ProfileDetailsPicker/ProfileDetailsPicker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, utilities } from '../styles/utilities';
import BackBtn from '../components/Elements/BackBtn';
import DetailsPill from '../components/DetailsPill/DetailsPill';

const { styles } = require('../components/AuthenticationForms/styles');

const UserInfo = ({ navigation }) => {
    const [profileProperties, setProfileProperties] = useState({});
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [formTouched, setFormTouched] = useState(false);
    const [error, setError] = useState(null);

    const { userInfo, setUserInfo, setLoggedIn, setCurrentUser } = useUser();

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
            return true;
        }
    };

    const handleSignUp = async () => {
        setError(null);
        const userInputValid = validateForm();

        if (!userInputValid) return;
        console.log('Signing up:', userInfo);

        const uri = selectedPicture.assets[0].uri;
        const filename = selectedPicture.assets[0].uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const ext = match?.[1];
        const type = match ? `picture/${match[1]}` : `picture`;

        console.log('Selected Picture:', selectedPicture);

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

        console.log('UserInfo:', userInfo);

        try {
            const response = await sendRequest(requestMethods.POST, 'auth/register', formData);
            if (response.status === 201) {
                setLoggedIn(true);
                setCurrentUser(response.data.user);
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('streamToken', response.data.stream_token);
                navigation.navigate('Feed', { screen: 'FeedMain' });
            }
        } catch (error) {
            console.error('Error registering:', error);
            setError('Failed to register user');
        }
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
    return (
        <View style={styles.userInfoContainer}>
            <View>
                <View style={styles.userInfoHeaderContainer}>
                    <ChevronLeft size={24} color={'white'} />
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
                        <CirclePlus size={50} color={'white'} />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.inputTextProfile}>{userInfo.role_id == 2 ? 'Description' : 'Bio'}</Text>
                    <TextInput
                        placeholder="Tell us about yourself!"
                        style={{ marginBottom: 20, color: colors.lightGray }}
                        value={userInfo.about}
                        onChangeText={(text) => setUserInfo((prev) => ({ ...prev, about: text }))}
                    />
                    {userInfo.role_id == 2 && (
                        <>
                            <Text style={styles.inputTextProfile}>Venue Name</Text>
                            <TextInput
                                placeholder="Venue Name"
                                style={{ marginBottom: 20 }}
                                value={userInfo.venue_name}
                                onChangeText={(text) => setUserInfo((prev) => ({ ...prev, venue_name: text }))}
                            />
                        </>
                    )}

                    <View>
                        {Object.keys(profileProperties).length > 0 &&
                            Object.keys(profileProperties).map((key) => {
                                if (key === 'Music Genres') {
                                    return (
                                        <>
                                            <Text style={styles.inputTextProfile}>Music Genres</Text>
                                            <View style={styles.genresContainer}>
                                                {profileProperties[key].map((genre) => (
                                                    <DetailsPill
                                                        key={genre.id}
                                                        item={genre}
                                                        handlePress={handlePress}
                                                        isSelected={userInfo.genres.includes(genre.id)}
                                                    />
                                                ))}
                                            </View>
                                        </>
                                    );
                                }
                                return (
                                    <ProfileDetailsPicker
                                        key={key}
                                        label={key}
                                        items={profileProperties[key]}
                                        selectedValue={
                                            key === 'Venue Type'
                                                ? userInfo['venue_type_id']
                                                : userInfo[key.toLowerCase() + '_id']
                                        }
                                        onValueChange={(value) => handlePickerChange(key, value)}
                                    />
                                );
                            })}
                    </View>
                </View>
            </View>
            <View style={styles.bottomInnerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={[utilities.primaryBtn]}>
                    <Text style={[utilities.primaryBtnText]} onPress={handleSignUp}>
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default UserInfo;
