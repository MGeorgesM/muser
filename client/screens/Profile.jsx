import React, { useLayoutEffect, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TextInput,
    Pressable,
    ScrollView,
    SafeAreaView,
} from 'react-native';

import { useUser } from '../contexts/UserContext';

import { colors, utilities } from '../styles/utilities';
import { profilePicturesUrl } from '../core/tools/apiRequest';

import { UserRoundCog, LockKeyhole, ChevronRight, Scroll } from 'lucide-react-native';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

import DetailsPill from '../components/Elements/DetailsPill/DetailsPill';
import SettingsCard from '../components/Cards/SettingsCard/SettingsCard';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import ProfileDetailsPicker from '../components/ProfileDetailsPicker/ProfileDetailsPicker';
import { useUserInfoLogic } from './userInfoLogic';
import UserInfoForm from '../components/AuthenticationForms/UserInfoForm';
import PrimaryBtn from '../components/Elements/PrimaryBtn';

const Profile = ({ navigation }) => {
    const { currentUser, setCurrentUser } = useUser();
    const [switchHandler, setSwitchHandler] = useState(false);
    const {
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

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, 'auth/me?flat=true', null);
                if (response.status !== 200) throw new Error('Error getting user info');
                setUserInfo((prev) => ({ ...prev, ...response.data }));
            } catch (error) {
                console.log('Error getting user info:', error);
            }
        };

        const genresArray = currentUser.genres.map((genre) => genre.id);
        console.log('Genres Array:', genresArray);

        getUserInfo();
        setUserInfo((prev) => ({ ...prev, genres: genresArray }));
        setSelectedPicture(currentUser.picture)

        setSwitchHandler(false);
        console.log('Current User:', currentUser);
        console.log('User Info:', userInfo);
    }, [currentUser]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Profile',
        });
    }, [navigation]);

    const updateUser = async (formData) => {
        try {
            const response = await sendRequest(requestMethods.PUT, 'users/', formData);
            if (response.status !== 200) throw new Error('Error updating user info');
            setCurrentUser(response.data);
            console.log('Updated User:', response.data);
            setSwitchHandler(false);
        } catch (error) {
            console.log('Error updating user info:', error);
        }
    };

    return currentUser ? (
        <View style={[utilities.flexed, { backgroundColor: colors.bgDarkest }]}>
            <View style={styles.topProfileView}>
                <Pressable style={styles.profilePicture} onPress={handleImagePicker}>
                    <Image
                        source={{ uri: profilePicturesUrl + currentUser.picture }}
                        style={[styles.profileDetailsPicture]}
                    />
                </Pressable>
            </View>
            <View style={styles.profileNameSecton}>
                <Text style={[utilities.textL, utilities.myFontBold]}>{currentUser.name}</Text>
                <Text style={[utilities.textM, utilities.myFontRegular, { color: colors.gray }]}>
                    {currentUser.email}
                </Text>
            </View>
            <View style={styles.profileDetailsSection}>
                {!switchHandler ? (
                    <>
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
                        {currentUser && currentUser.role.id === 1 && (
                            <View style={[utilities.flexRow, utilities.flexWrap, { marginTop: 16, gap: 4 }]}>
                                <DetailsPill item={currentUser?.instrument} />
                                <DetailsPill item={currentUser?.experience} />
                                {currentUser?.genres &&
                                    currentUser.genres.map((genre) => <DetailsPill key={genre.id} item={genre} />)}
                            </View>
                        )}
                    </>
                ) : (
                    <>
                        <ScrollView>
                            <UserInfoForm
                                userInfo={userInfo}
                                setUserInfo={setUserInfo}
                                profileProperties={profileProperties}
                                handlePress={handlePress}
                                handlePickerChange={handlePickerChange}
                            />
                        </ScrollView>

                        <PrimaryBtn text={'Save'} marginTop={12} handlePress={() => handleProceed(updateUser)} />
                    </>
                )}
            </View>
            {!switchHandler && (
                <View style={styles.editProfileModal}>
                    <SettingsCard
                        iconComponent={<UserRoundCog color={'white'} />}
                        text={'Edit Profile'}
                        onPress={() => setSwitchHandler(!switchHandler)}
                    />
                    <SettingsCard iconComponent={<LockKeyhole color={'white'} />} text={'Edit Login Details'} />
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
    topProfileView: {
        alignItems: 'center',
        position: 'relative',
        height: height * 0.11,
        backgroundColor: colors.bgDarkest,
    },

    profilePicture: {
        position: 'absolute',
        bottom: -80,
        left: 0,
        right: 0,
        alignItems: 'center',
    },

    profileDetailsPicture: {
        height: 160,
        width: 160,
        borderRadius: 80,
    },

    profileNameSecton: {
        alignItems: 'center',
        paddingTop: 96,
    },

    profileDetailsSection: {
        flex: 1,
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 0,
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
