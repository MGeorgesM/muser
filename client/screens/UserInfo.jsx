import React from 'react';
import { StyleSheet, Text, TextInput, Image, TouchableOpacity, View } from 'react-native';
// import { TextInput } from 'react-native-gesture-handler';

import { useRegister } from '../contexts/RegisterContext';

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

const UserInfo = ({ navigation }) => {
    const { userInfo, setUserInfo, register } = useRegister();

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
        <View style={styles.container}>
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
                {/* <View style={{ borderBottomWidth: 0.5, marginBottom: 20 }}>
                    <Text style={styles.inputTextProfile}>Location</Text>
                    <Picker
                        style={{ marginHorizontal: -16, marginBottom: -12 }}
                        selectedValue={userInfo.location}
                        onValueChange={(newValue) => handlePickerChange('location', newValue)}
                    >
                        {availableLocations.map((location) => (
                            <Picker.Item key={location} value={location} label={location} />
                        ))}
                    </Picker>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginBottom: 20 }}>
                    <Text style={styles.inputTextProfile}>Instrument</Text>
                    <Picker
                        style={{ marginHorizontal: -16, marginBottom: -12 }}
                        selectedValue={userInfo.instrument}
                        onValueChange={(newValue) => handlePickerChange('instrument', newValue)}
                    >
                        {availableInstruments.map((instrument) => (
                            <Picker.Item key={instrument} value={instrument} label={instrument} />
                        ))}
                    </Picker>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginBottom: 20 }}>
                    <Text style={styles.inputTextProfile}>Music Genres</Text>
                    <Picker
                        style={{ marginHorizontal: -16, marginBottom: -12 }}
                        selectedValue={userInfo.genre}
                        onValueChange={(newValue) => handlePickerChange('genre', newValue)}
                    >
                        {availableGenres.map((genre) => (
                            <Picker.Item key={genre} value={genre} label={genre} />
                        ))}
                    </Picker>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginBottom: 20 }}>
                    <Text style={styles.inputTextProfile}>Experience</Text>
                    <Picker
                        style={{ marginHorizontal: -16, marginBottom: -12 }}
                        selectedValue={userInfo.experience}
                        onValueChange={(newValue) => handlePickerChange('experience', newValue)}
                    >
                        {availableExperiences.map((experience) => (
                            <Picker.Item key={experience} value={experience} label={experience} />
                        ))}
                    </Picker>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginBottom: 20 }}>
                    <Text style={styles.inputTextProfile}>Availability</Text>
                    <Picker
                        style={{ marginHorizontal: -16, marginBottom: -12 }}
                        selectedValue={userInfo.availability}
                        onValueChange={(newValue) => handlePickerChange('availability', newValue)}
                    >
                        {availableAvailabilities.map((availability) => (
                            <Picker.Item key={availability} value={availability} label={availability} />
                        ))}
                    </Picker>
                </View> */}
            </View>
            <View style={styles.bottomInnerContainer}>
                <TouchableOpacity style={styles.primaryBtn}>
                    <Text style={styles.primaryBtnText} onPress={register}>
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default UserInfo;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 20,
        marginTop: 32,
        justifyContent: 'center',
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
        gap: 16,
    },
    headerProfile: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    addPhotoPrompt: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    addPhotoText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputTextProfile: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
    },

    primaryBtn: {
        height: 48,
        borderRadius: 24,
        backgroundColor: '#212529',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    bottomInnerContainer: {
        marginBottom: 64,
    },
});
