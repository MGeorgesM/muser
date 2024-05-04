import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';

import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

import { colors, utilities } from '../styles/utilities';
import { profilePicturesUrl } from '../core/tools/apiRequest';
import { useSelector } from 'react-redux';
import PrimaryBtn from '../components/Elements/PrimaryBtn';
import BackBtn from '../components/Elements/BackBtn';
import InstrumentIcon from '../components/InstrumentIcon/InstrumentIcon';
import DetailsPill from '../components/DetailsPill/DetailsPill';

const ProfileDetails = ({ route }) => {
    const { userId } = route.params;
    const navigation = useNavigation();

    const { currentUser } = useUser();
    const [user, setUser] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    const feedUsers = useSelector((global) => global.usersSlice.feedUsers);
    const connectedUsers = useSelector((global) => global.usersSlice.connectedUsers);

    console.log('user profile', user);

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
                    <View
                        style={[utilities.flexRow, utilities.alignCenter, utilities.spaceBetween, { marginRight: 20 }]}
                    >
                        <View>
                            <Text style={[utilities.textXL, utilities.myFontBold, { marginTop: 12 }]}>{user.name}</Text>
                            <Text style={[utilities.textS, utilities.myFontRegular, { color: colors.white }]}>
                                {user.instrument.name}
                            </Text>
                            <Text
                                style={[utilities.textXS, utilities.myFontRegular, { color: colors.gray }]}
                            >{`${user.location.name}, Lebanon`}</Text>
                        </View>
                        <InstrumentIcon instrument={user.instrument} />
                    </View>
                    <View>
                        <Text
                            style={[
                                utilities.textS,
                                utilities.myFontRegular,
                                utilities.textBold,
                                styles.profileDetailsHeader,
                            ]}
                        >
                            Bio
                        </Text>
                        <Text style={[utilities.textM, utilities.myFontRegular, { color: colors.gray }]}>
                            {user.about}
                        </Text>
                        <Text
                            style={[
                                utilities.textS,
                                utilities.myFontRegular,
                                utilities.textBold,
                                styles.profileDetailsHeader,
                            ]}
                        >
                            Details
                        </Text>
                        <View>
                            <DetailsPill item={user?.instrument} />
                            <DetailsPill item={user?.experience} />
                            {user?.genres && user.genres.map((genre) => <DetailsPill key={genre.id} item={genre} />)}
                        </View>
                    </View>
                    {!isConnected && (
                        <PrimaryBtn
                            text={'Say Hello!'}
                            marginTop={'auto'}
                            handlePress={() =>
                                navigation.navigate('Chat', {
                                    screen: 'ChatDetails',
                                    params: { chatParticipants: [currentUser.id, user.id].sort() },
                                })
                            }
                        />
                    )}
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
