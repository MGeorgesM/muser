import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';

import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

import { colors, utilities } from '../styles/utilities';
import { profilePicturesUrl } from '../core/tools/apiRequest';
import { useSelector } from 'react-redux';

const ProfileDetails = ({ route }) => {
    const { userId } = route.params;
    const navigation = useNavigation();

    const { currentUser } = useUser();
    const [user, setUser] = useState({});

    const feedUsers = useSelector((global) => global.usersSlice.feedUsers);
    const connectedUsers = useSelector((global) => global.usersSlice.connectedUsers);

    useEffect(() => {
        if (userId) {
            const foundUser = feedUsers.find((user) => user.id === userId);
            if (foundUser) return setUser(foundUser);
            const foundConnectedUser = connectedUsers.find((user) => user.id === userId);
            if (foundConnectedUser) return setUser(foundConnectedUser);
        }
    }, [userId, feedUsers, connectedUsers]);

    const imageUrl = `${profilePicturesUrl + user.picture}`;

    if (user.name)
        return (
            <View style={styles.container}>
                <Image source={{ uri: imageUrl }} style={styles.avatar} />
                <View style={[styles.detailContainer]}>
                    <View>
                        <Text style={[utilities.textXL, utilities.textBold, { marginTop: 12 }]}>{user.name}</Text>
                        <Text style={[utilities.textS, { color: colors.darkGray }]}>{user.instrument.name}</Text>
                        <Text style={[utilities.textXS, { color: colors.gray }]}>{user.location.name}</Text>
                    </View>
                    <View>
                        <Text style={[utilities.textS, utilities.textBold, styles.profileDetailsHeader]}>Bio</Text>
                        <Text style={[utilities.textM, { color: colors.darkGray }]}>{user.about}</Text>
                        <Text style={[utilities.textS, utilities.textBold, styles.profileDetailsHeader]}>Details</Text>
                        <Text style={[utilities.textM, { color: colors.darkGray }]}>Skils and Details</Text>
                    </View>
                    <TouchableOpacity style={[utilities.secondaryBtn, { marginTop: 32 }]}>
                        <Text
                            style={utilities.secondaryBtnText}
                            onPress={() =>
                                navigation.navigate('Chat', {
                                    screen: 'ChatDetails',
                                    params: { chatParticipants: [currentUser.id, user.id].sort() },
                                })
                            }
                        >
                            Say Hello!
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
};

export default ProfileDetails;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'visible',
    },
    avatar: {
        width: '100%',
        height: height * 0.6,
        resizeMode: 'cover',
    },
    detailContainer: {
        flex: 1,
        backgroundColor: 'white',
        height: height * 0.5,
        padding: 20,
        marginTop: -36,
        borderTopLeftRadius: utilities.borderRadius.xl,
        borderTopEndRadius: utilities.borderRadius.xl,
        elevation: 20,
        zIndex: 20,
    },
    username: {
        fontSize: 24,
    },

    profileDetailsHeader: {
        marginTop: 12,
        marginBottom: 0,
    },
});
