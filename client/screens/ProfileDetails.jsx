import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';

import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

import { colors, utilities } from '../styles/utilities';
import { profilePicturesUrl } from '../core/tools/apiRequest';
import { useSelector } from 'react-redux';
import PrimaryBtn from '../components/Elements/PrimaryBtn';

const ProfileDetails = ({ route }) => {
    const { userId } = route.params;
    const navigation = useNavigation();

    const { currentUser } = useUser();
    const [user, setUser] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    const feedUsers = useSelector((global) => global.usersSlice.feedUsers);
    const connectedUsers = useSelector((global) => global.usersSlice.connectedUsers);

    useEffect(() => {
        if (userId) {
            const foundUser = feedUsers.find((user) => user.id === userId);
            if (foundUser) return setUser(foundUser);
            const foundConnectedUser = connectedUsers.find((user) => user.id === userId);
            if (foundConnectedUser) {
                setIsConnected(true);
                return setUser(foundConnectedUser);
            }
        }
    }, [userId, feedUsers, connectedUsers]);

    const imageUrl = `${profilePicturesUrl + user.picture}`;

    if (user.name)
        return (
            <View style={utilities.flexed}>
                <Image source={{ uri: imageUrl }} style={[styles.profileDetailsPicture]} />
                <View style={[styles.detailContainer]}>
                    <View>
                        <Text style={[utilities.textXL, utilities.myFontBold, { marginTop: 12 }]}>{user.name}</Text>
                        <Text style={[utilities.textS, utilities.myFontRegular, { color: colors.lightGray }]}>{user.instrument.name}</Text>
                        <Text style={[utilities.textXS, utilities.myFontRegular, { color: colors.gray }]}>{user.location.name}</Text>
                    </View>
                    <View>
                        <Text style={[utilities.textS, utilities.myFontRegular, utilities.textBold, styles.profileDetailsHeader]}>Bio</Text>
                        <Text style={[utilities.textM, utilities.myFontRegular, { color: colors.lightGray }]}>{user.about}</Text>
                        <Text style={[utilities.textS, utilities.myFontRegular, utilities.textBold, styles.profileDetailsHeader]}>Details</Text>
                        <Text style={[utilities.textM, utilities.myFontRegular, { color: colors.lightGray }]}>Skils and Details</Text>
                    </View>
                    {/* <TouchableOpacity style={[utilities.secondaryBtn, { marginTop: 32 }]}>
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
                    </TouchableOpacity> */}
                    <PrimaryBtn text={'Say Hello!'} marginTop={'auto'} />
                </View>
            </View>
        );
};

export default ProfileDetails;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     overflow: 'visible',
    // },
    profileDetailsPicture: {
        width: '100%',
        height: height * 0.6,
        resizeMode: 'cover',
    },
    detailContainer: {
        flex: 1,
        marginTop: -36,
        paddingTop: 16,
        paddingHorizontal: 20,
        height: height * 0.5,
        elevation: 1,
        backgroundColor: colors.bgDark,
        borderTopLeftRadius: utilities.borderRadius.xl,
        borderTopEndRadius: utilities.borderRadius.xl,
    },
    username: {
        fontSize: 24,
    },
    profileDetailsHeader: {
        marginTop: 12,
        marginBottom: 0,
    },
});
