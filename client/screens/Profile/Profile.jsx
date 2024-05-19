import React from 'react';
import { Camera } from 'lucide-react-native';
import { useUser } from '../../core/data/contexts/UserContext';
import { useUserInfoLogic } from '../Auth/UserInfo/userInfoLogic';
import { colors, utilities } from '../../styles/utilities';
import { profilePicturesUrl } from '../../core/tools/apiRequest';
import { UserRoundCog, LockKeyhole } from 'lucide-react-native';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

import DetailsPill from '../../components/Misc/DetailsPill/DetailsPill';
import SettingsCard from '../../components/Cards/SettingsCard/SettingsCard';

import UserInfoForm from '../../components/Forms/UserInfoForm';
import PrimaryBtn from '../../components/Misc/PrimaryBtn/PrimaryBtn';
import UserCredentialsForm from '../../components/Forms/UserCredentialsForm';
import useProfileLogic from './profileLogic';

const Profile = () => {
    const { currentUser, authError } = useUser();
    const { isEditing, setIsEditing, handleSave } = useProfileLogic(currentUser);
    const {
        error,
        userInfo,
        setUserInfo,
        handlePress,
        selectedPicture,
        handleImagePicker,
        profileProperties,
        handlePickerChange,
    } = useUserInfoLogic();

    return (
        <View style={[utilities.flexed, { backgroundColor: colors.bgDarkest }]}>
            <View style={styles.profileDetailsSection}>
                {!isEditing.details && !isEditing.credentials && (
                    <>
                        <View style={styles.profilePicture}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{
                                        uri: selectedPicture
                                            ? selectedPicture.assets[0].uri
                                            : profilePicturesUrl + userInfo.picture,
                                    }}
                                    style={styles.profileDetailsPicture}
                                />
                                <View style={styles.cameraIconContainer}>
                                    <Camera size={24} color={'white'} onPress={handleImagePicker} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.profileNameSecton}>
                            <Text style={[utilities.textL, utilities.myFontBold]}>{currentUser.name}</Text>
                            <Text style={[utilities.textM, utilities.myFontRegular, { color: colors.gray }]}>
                                {currentUser.email}
                            </Text>
                        </View>

                        <Text style={[utilities.textM, utilities.myFontMedium]}>About Me</Text>
                        <Text
                            style={[
                                utilities.textM,
                                utilities.myFontRegular,
                                { color: colors.gray, marginTop: 10, marginBottom: 24 },
                            ]}
                        >
                            {currentUser.about}
                        </Text>

                        <Text style={[utilities.textM, utilities.myFontMedium]}>My Details</Text>
                        {currentUser && currentUser.role?.id === 1 && (
                            <View style={[utilities.flexRow, utilities.flexWrap, { marginTop: 16, gap: 4 }]}>
                                <DetailsPill item={currentUser?.instrument} />
                                <DetailsPill item={currentUser?.experience} />
                                {currentUser?.genres &&
                                    currentUser.genres.map((genre) => <DetailsPill key={genre.id} item={genre} />)}
                            </View>
                        )}
                    </>
                )}
                <View style={[utilities.flexed, { marginTop: 12 }]}>
                    {isEditing?.details && (
                        <UserInfoForm
                            userInfo={userInfo}
                            setUserInfo={setUserInfo}
                            profileProperties={profileProperties}
                            handlePress={handlePress}
                            handlePickerChange={handlePickerChange}
                        />
                    )}

                    {isEditing?.credentials && <UserCredentialsForm userInfo={userInfo} setUserInfo={setUserInfo} />}
                </View>
                <Text style={[styles.errorText, { marginTop: 'auto' }]}>{error || authError}</Text>
                <PrimaryBtn text={'Save'} marginTop={12} handlePress={handleSave} />
            </View>
            {!isEditing.credentials && !isEditing.details && (
                <View style={styles.editProfileModal}>
                    <SettingsCard
                        iconComponent={<UserRoundCog color={'white'} />}
                        text={'Edit Profile'}
                        onPress={() => setIsEditing({ details: true, credentials: false })}
                    />
                    <SettingsCard
                        iconComponent={<LockKeyhole color={'white'} />}
                        text={'Edit Login Details'}
                        onPress={() => setIsEditing({ details: false, credentials: true })}
                    />
                </View>
            )}
        </View>
    );
};

export default Profile;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    profileDetailsSection: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 0,
    },

    profilePicture: {
        alignItems: 'center',
        marginTop: 16,
    },

    imageContainer: {
        position: 'relative',
    },

    profileDetailsPicture: {
        height: 160,
        width: 160,
        borderRadius: 80,
    },

    cameraIconContainer: {
        position: 'absolute',
        bottom: 8,
        right: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        padding: 4,
    },

    profileNameSecton: {
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },

    editProfileModal: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        marginTop: 24,
        padding: 20,
        height: height * 0.25,
        justifyContent: 'center',
        backgroundColor: colors.bgDark,
        borderTopEndRadius: utilities.borderRadius.xl,
        borderTopLeftRadius: utilities.borderRadius.xl,
    },

    editBioInput: {
        marginBottom: 20,
        color: colors.lightGray,
        borderBottomColor: colors.gray,
        borderBottomWidth: 0.5,
    },

    genresContainer: {
        marginTop: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 10,
    },
    errorText: {
        color: colors.primary,
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
    },
});
