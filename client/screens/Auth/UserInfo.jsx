import React from 'react';
import { Text, TextInput, Image, TouchableOpacity, View } from 'react-native';

import { useUserInfoLogic } from './userInfoLogic';

import { colors } from '../../styles/utilities';
import { CirclePlus, ChevronLeft } from 'lucide-react-native';

import PrimaryBtn from '../../components/Misc/PrimaryBtn/PrimaryBtn';
import DetailsPill from '../../components/Misc/DetailsPill/DetailsPill';
import ProfileDetailsPicker from '../../components/Misc/ProfileDetailsPicker/ProfileDetailsPicker';
import UserInfoForm from '../../components/Forms/UserInfoForm';

const { styles } = require('../../components/Forms/styles');

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
                <UserInfoForm
                    handlePickerChange={handlePickerChange}
                    handlePress={handlePress}
                    setUserInfo={setUserInfo}
                    userInfo={userInfo}
                    profileProperties={profileProperties}
                />
            </View>
            <Text style={[styles.errorText, { marginTop: 24 }]}>{error || authError}</Text>
            <PrimaryBtn text="Register" handlePress={handleProceed} marginBottom={56} />
        </View>
    );
};

export default UserInfo;
