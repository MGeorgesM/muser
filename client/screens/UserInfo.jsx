import React from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';

import { CirclePlus, Plus } from 'lucide-react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';

import { useRegister } from '../contexts/RegisterContext';

const UserInfo = () => {
    const availableInstruments = ['Guitar', 'Bass', 'Drums', 'Vocals', 'Keyboard', 'Strings', 'Other'];
    const availableVenues = ['Bar', 'Club', 'Restaurant', 'Cafe', 'Hotel', 'Other'];
    const availableExperiences = ['Beginner', 'Intermediate', 'Advanced'];
    const availableAvailabilities = ['Morning', 'Afternoon', 'Evening'];
    const availableLocations = ['North', 'South', 'Beirut', 'Mount Lebanon', 'Bekaa', 'Baalbek-Hermel', 'Other'];
    const availableGenres = [
        'Rock',
        'Pop',
        'Jazz',
        'Blues',
        'Metal',
        'Folk',
        'Country',
        'Classical',
        'Electronic',
        'Hip-Hop',
        'Rap',
        'Reggae',
        'R&B',
        'Soul',
        'Punk',
        'Indie',
        'Other',
    ];

    const { userInfo, setUserInfo, register } = useRegister();

    return (
        <View style={styles.container}>
            <Text style={styles.headerProfile}>Complete Your Profile</Text>
            <View style={styles.addPhotoPrompt}>
                <Text style={styles.addPhotoText}>Add a Photo</Text>
                <TouchableOpacity>
                    <CirclePlus size={50} color={'black'} />
                </TouchableOpacity>
                {/* Add a circle with the plus icon inside of it when clicked should open up the phone gallery */}
            </View>
            <View>
                <Text style={styles.inputTextProfile}>Bio</Text>
                <TextInput placeholder="Tell us about yourself!" style={{ marginBottom: 20 }} />
                <View style={{ borderBottomWidth: 0.5, marginBottom: 20 }}>
                    <Text style={styles.inputTextProfile}>Location</Text>
                    <Picker style={{ marginHorizontal: -16, marginBottom: -12 }} selectedValue={userInfo.location} onValueChange={}>
                        {availableLocations.map((location) => (
                            <Picker.Item key={location} value={location} />
                        ))}
                    </Picker>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginBottom: 20 }}>
                    <Text style={styles.inputTextProfile}>Instrument</Text>
                    <Picker style={{ marginHorizontal: -16, marginBottom: -12 }} selectedValue={userInfo.location} onValueChange={}>
                        {availableInstruments.map((instrument) => (
                            <Picker.Item key={instrument} value={instrument} />
                        ))}
                    </Picker>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginBottom: 20 }}>
                    <Text style={styles.inputTextProfile}>Music Genres</Text>
                    <Picker style={{ marginHorizontal: -16, marginBottom: -12 }} selectedValue={userInfo.location} onValueChange={}>
                        {availableGenres.map((genre) => (
                            <Picker.Item key={genre} value={genre} />
                        ))}
                    </Picker>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginBottom: 20 }}>
                    <Text style={styles.inputTextProfile}>Experience</Text>
                    <Picker style={{ marginHorizontal: -16, marginBottom: -12 }} selectedValue={userInfo.location} onValueChange={}>
                        {availableExperiences.map((experience) => (
                            <Picker.Item key={experience} value={experience} />
                        ))}
                    </Picker>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginBottom: 20 }}>
                    <Text style={styles.inputTextProfile}>Availability</Text>
                    <Picker style={{ marginHorizontal: -16, marginBottom: -12 }} selectedValue={userInfo.location} onValueChange={}>
                        {availableAvailabilities.map((availability) => (
                            <Picker.Item key={availability} value={availability} />
                        ))}
                    </Picker>
                </View>
            </View>
            <View style={styles.bottomInnerContainer}>
                <TouchableOpacity style={styles.primaryBtn}>
                    <Text style={styles.primaryBtnText}>Register</Text>
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
        justifyContent: 'center',
    },
    headerProfile: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 32,
    },
    addPhotoPrompt: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
