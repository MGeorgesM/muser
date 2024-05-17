import React, { useLayoutEffect, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';

import { useUser } from '../../contexts/UserContext';
import { Camera, ChevronLeft, LogOut } from 'lucide-react-native';
import { colors, utilities } from '../../styles/utilities';
import { profilePicturesUrl, sendRequest, requestMethods } from '../../core/tools/apiRequest';

import { UserRoundCog, LockKeyhole } from 'lucide-react-native';

import DetailsPill from '../../components/Misc/DetailsPill/DetailsPill';
import SettingsCard from '../../components/Cards/SettingsCard/SettingsCard';
import LoadingScreen from '../../components/Misc/LoadingScreen/LoadingScreen';

import { useUserInfoLogic } from '../Auth/userInfoLogic';
import UserInfoForm from '../../components/Forms/UserInfoForm';
import PrimaryBtn from '../../components/Misc/PrimaryBtn/PrimaryBtn';
import UserCredentialsForm from '../../components/Forms/UserCredentialsForm';

const Profile = ({ navigation }) => {
    const { currentUser, authError, handleSignOut } = useUser();
    const [isEditing, setIsEditing] = useState({
        details: false,
        credentials: false,
    });
    const {
        error,
        userInfo,
        setUserInfo,
        handlePress,
        handleProceed,
        selectedPicture,
        setSelectedPicture,
        handleImagePicker,
        profileProperties,
        handlePickerChange,
    } = useUserInfoLogic();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: isEditing.credentials
                ? 'Edit Login Details'
                : isEditing.details
                ? 'Edit your Profile'
                : 'Profile',
            headerStyle: {
                backgroundColor: colors.bgDarkest,
                shadowColor: 'transparent',
                elevation: 0,
                height: 128,
            },

            headerTitleStyle: {
                fontFamily: 'Montserrat-Regular',
                color: colors.white,
                fontSize: 20,
            },

            headerLeft: () => (
                <ChevronLeft size={24} color="white" onPress={handleBackPress} style={{ marginLeft: 20 }} />
            ),

            headerRight: () => (
                <LogOut size={24} color={'white'} style={{ marginEnd: 20 }} onPress={() => handleSignOut(navigation)} />
            ),
        });
    }, [isEditing]);

    console.log('isEditing:', isEditing);

    useEffect(() => {
        getUserInfo();
    }, [currentUser]);

    const getUserInfo = async () => {
        try {
            const response = await sendRequest(requestMethods.GET, 'auth/me?flat=true', null);
            if (response.status !== 200) throw new Error('Error getting user info');
            setUserInfo((prev) => ({ ...prev, ...response.data }));
        } catch (error) {
            console.log('Error getting user info:', error);
        }
    };

    const handleBackPress = () => {
        setIsEditing((prev) => {
            if (prev.details || prev.credentials) {
                return { details: false, credentials: false };
            } else {
                navigation.goBack();
                return prev;
            }
        });
    };

    return currentUser ? (
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
                <View style={[utilities.flexed, {marginTop:12}]}>
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
                <PrimaryBtn text={'Save'} marginTop={12} handlePress={() => handleProceed(true)} />
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
    ) : (
        <LoadingScreen />
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
});
