import React, { useState, useEffect } from 'react';
import { Platform, Text, TextInput, Image, TouchableOpacity, View } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { useUser } from '../contexts/UserContext';
import { requestMethods, sendRequest } from '../core/tools/apiRequest';

import { CirclePlus, Plus, ArrowLeft } from 'lucide-react-native';

import EditProfilePicker from '../components/EditProfilePicker/EditProfilePicker';

const { styles } = require('../components/AuthenticationForms/styles');

const UserInfo = ({ navigation }) => {
    const [profileProperties, setProfileProperties] = useState({});
    const [selectedPicture, setSelectedPicture] = useState(null);

    const { userInfo, setUserInfo, handleSignUp } = useUser();

    useEffect(() => {
        const getProperties = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, 'auth/properties');
                if (response.status === 200) {
                    setProfileProperties(response.data.general);
                    userInfo.role_id === 1
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
        } else {
            setUserInfo((prev) => ({ ...prev, [`${key.toLowerCase()}_id`]: value }));
        }
    };

    const handleImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access media library was denied');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            // const uri = result.assets[0].uri;
            // const fileType = uri.substring(uri.lastIndexOf('.') + 1);
            // const type = `image/${fileType}`;
            // const name = `picture.${fileType}`;

            const uri = Platform.OS === 'android' ? result.assets[0].uri : result.assets[0].uri.replace('file://', '');
            const filename = result.assets[0].uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const ext = match?.[1];
            const type = match ? `image/${match[1]}` : `image`;
            const name = `image.${ext}`


            console.log('Image:', { uri, name, type });

            setUserInfo((prev) => ({ ...prev, picture: { uri, name, type } }));
        }

        setSelectedPicture(result);
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
                            return (
                                <EditProfilePicker
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
