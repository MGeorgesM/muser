import React from 'react';
import { Text, TextInput, Image, TouchableOpacity, View } from 'react-native';

import { useUserInfoLogic } from './userInfoLogic';

import { colors } from '../../styles/utilities';
import { CirclePlus, ChevronLeft } from 'lucide-react-native';

import PrimaryBtn from '../../components/Elements/PrimaryBtn';
import DetailsPill from '../../components/Elements/DetailsPill/DetailsPill';
import ProfileDetailsPicker from '../../components/ProfileDetailsPicker/ProfileDetailsPicker';

const { styles } = require('../../components/AuthenticationForms/styles');

const UserInfo = ({ navigation }) => {
    const {
        error,
        userInfo,
        authError,
        setUserInfo,
        handlePress,
        handleProceed,
        selectedPicture,
        handleImagePicker,
        profileProperties,
        handlePickerChange,
    } = useUserInfoLogic();

    return (
        <View style={styles.userInfoContainer}>
            <View>
                <View style={styles.userInfoHeaderContainer}>
                    <ChevronLeft size={24} color={'white'} onPress={() => navigation.goBack()} />

                    <Text style={styles.headerProfile}>Complete Your Profile</Text>
                </View>
                <View style={[styles.addPhotoPrompt, { marginVertical: selectedPicture ? 32 : 48 }]}>
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
                        key={'about'}
                        placeholder="Tell us about yourself!"
                        placeholderTextColor={colors.gray}
                        cursorColor={colors.primary}
                        style={{ marginBottom: 20, color: colors.lightGray }}
                        value={userInfo.about}
                        onChangeText={(text) => setUserInfo((prev) => ({ ...prev, about: text }))}
                    />
                    {userInfo.role_id == 2 && (
                        <>
                            <Text style={styles.inputTextProfile}>Venue Name</Text>
                            <TextInput
                                key={'venue_name'}
                                placeholder="Venue Name"
                                placeholderTextColor={colors.gray}
                                cursorColor={colors.primary}
                                style={{ marginBottom: 20 }}
                                value={userInfo.venue_name}
                                onChangeText={(text) => setUserInfo((prev) => ({ ...prev, venue_name: text }))}
                            />
                        </>
                    )}

                    <View>
                        {Object.keys(profileProperties).map((key) => {
                            if (key === 'Music Genres') {
                                return (
                                    <View key={profileProperties[key]}>
                                        <Text style={styles.inputTextProfile}>Music Genres</Text>
                                        <View style={styles.genresContainer}>
                                            {profileProperties[key] &&
                                                profileProperties[key].length > 0 &&
                                                profileProperties[key].map((genre) => (
                                                    <DetailsPill
                                                        key={genre.id.toString()}
                                                        item={genre}
                                                        handlePress={handlePress}
                                                        isSelected={userInfo.genres.includes(genre.id)}
                                                    />
                                                ))}
                                        </View>
                                    </View>
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
            <Text style={[styles.errorText, { marginTop: 24 }]}>{error || authError}</Text>
            <PrimaryBtn text="Register" handlePress={handleProceed} marginBottom={56} />
        </View>
    );
};

export default UserInfo;
