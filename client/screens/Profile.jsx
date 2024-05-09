import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';

import { useUser } from '../contexts/UserContext';

import { colors, utilities } from '../styles/utilities';
import { profilePicturesUrl } from '../core/tools/apiRequest';

import { UserRoundCog, LockKeyhole, ChevronRight } from 'lucide-react-native';

import DetailsPill from '../components/Elements/DetailsPill/DetailsPill';
import SettingsCard from '../components/Cards/SettingsCard/SettingsCard';

const Profile = ({ navigation }) => {
    const { currentUser } = useUser();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Profile',
        });
    }, [navigation]);

    return currentUser ? (
        <View style={[utilities.flexed, { backgroundColor: colors.bgDarkest }]}>
            <View style={styles.topProfileView}>
                <View style={styles.profilePicture}>
                    <Image
                        source={{ uri: profilePicturesUrl + currentUser.picture }}
                        style={[styles.profileDetailsPicture]}
                    />
                </View>
            </View>
            <View style={styles.profileNameSecton}>
                <Text style={[utilities.textL, utilities.myFontBold]}>{currentUser.name}</Text>
                <Text style={[utilities.textM, utilities.myFontRegular, { color: colors.gray }]}>
                    {currentUser.email}
                </Text>
            </View>
            <View style={styles.profileDetailsSection}>
                <Text style={[utilities.textM, utilities.myFontMedium]}>Bio</Text>
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
            </View>
            <View style={styles.editProfileModal}>
                <SettingsCard iconComponent={<UserRoundCog color={'white'} />} text={'Edit Profile'} />
                <SettingsCard iconComponent={<LockKeyhole color={'white'} />} text={'Edit Login Details'} />
            </View>
        </View>
    ) : (
        <View style={[utilities.flexed, utilities.center, { backgroundColor: colors.bgDark }]}>
            <Text>Loading...</Text>
        </View>
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
        paddingTop: 24,
        paddingHorizontal: 20,
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
});
