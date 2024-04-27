import React from 'react';
import { Text, TextInput, Image, TouchableOpacity, View } from 'react-native';

import { useUser } from '../contexts/UserContext';

import { CirclePlus, Plus, ArrowLeft } from 'lucide-react-native';

import EditProfilePicker from '../components/EditProfilePicker/EditProfilePicker';

import * as ImagePicker from 'expo-image-picker';

import {
    availableLocations,
    availableInstruments,
    availableGenres,
    availableExperiences,
    availableAvailabilities,
} from '../core/enums/userDetails';

const { styles } = require('../components/AuthenticationForms/styles');


const UserInfo = ({ navigation }) => {
    const { userInfo, setUserInfo, handleSignUp } = useUser();
    const [profileProperties, setProfileProperties] = useState([

    ]);

    const handlePickerChange = (key, value) => {
        setUserInfo((prev) => ({ ...prev, [key]: value }));
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

        console.log(result);

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setUserInfo((prev) => ({ ...prev, profilePicture: uri }));
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
                {userInfo.profilePicture ? (
                    <>
                        <Image
                            source={{ uri: userInfo.profilePicture }}
                            style={{ width: 100, height: 100, borderRadius: 50 }}
                        />
                        <TouchableOpacity onPress={handleImagePicker}>
                            <CirclePlus size={50} color={'black'} />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.addPhotoText}>Add a Photo</Text>
                        <TouchableOpacity onPress={handleImagePicker}>
                            <CirclePlus size={50} color={'black'} />
                        </TouchableOpacity>
                    </>
                )}
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
                    <EditProfilePicker
                        label="Location"
                        items={availableLocations}
                        selectedValue={userInfo.location}
                        onValueChange={(value) => handlePickerChange('location', value)}
                    />
                    <EditProfilePicker
                        label="Instrument"
                        items={availableInstruments}
                        selectedValue={userInfo.instrument}
                        onValueChange={(value) => handlePickerChange('instrument', value)}
                    />
                    <EditProfilePicker
                        label="Music Genres"
                        items={availableGenres}
                        selectedValue={userInfo.genre}
                        onValueChange={(value) => handlePickerChange('genre', value)}
                    />
                    <EditProfilePicker
                        label="Experience"
                        items={availableExperiences}
                        selectedValue={userInfo.experience}
                        onValueChange={(value) => handlePickerChange('experience', value)}
                    />
                    <EditProfilePicker
                        label="Availability"
                        items={availableAvailabilities}
                        selectedValue={userInfo.availability}
                        onValueChange={(value) => handlePickerChange('availability', value)}
                    />
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
