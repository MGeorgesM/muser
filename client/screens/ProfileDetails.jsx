import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';

import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

import { colors, utilities } from '../styles/utilities';
import { profilePicturesUrl } from '../core/tools/apiRequest';
import { useSelector } from 'react-redux';

import PrimaryBtn from '../components/Elements/PrimaryBtn';
import InstrumentIcon from '../components/Elements/InstrumentIcon/InstrumentIcon';
import DetailsPill from '../components/Elements/DetailsPill/DetailsPill';

const ProfileDetails = ({ route }) => {
    const { userId } = route.params;
    const { currentUser } = useUser();
    const navigation = useNavigation();

    const [user, setUser] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    const feedUsers = useSelector((global) => global.usersSlice.feedUsers);
    const connectedUsers = useSelector((global) => global.usersSlice.connectedUsers);

    const chatId = [currentUser.id, userId].sort().join('-');

    console.log(chatId);

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
    }, [userId]);

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
                            <Text style={[utilities.textXL, utilities.myFontBold, { marginTop: 12, marginBottom:-2 }]}>{user.name}</Text>
                            <Text style={[utilities.textS, utilities.myFontRegular, { color: colors.gray }]}>
                                {user.instrument.name}
                            </Text>
                            <Text
                                style={[utilities.textS, utilities.myFontRegular, { color: colors.gray }]}
                            >{`${user.location.name}, Lebanon`}</Text>
                        </View>
                        <View style={{ marginTop: 12 }}>
                            <InstrumentIcon instrument={user.instrument} />
                        </View>
                    </View>
                    <View>
                        <Text style={[utilities.textS, utilities.myFontRegular, styles.profileDetailsHeader]}>
                            About Me
                        </Text>
                        <Text style={[utilities.textS, utilities.myFontRegular, { color: colors.gray }]}>
                            {user.about}
                        </Text>
                        <Text style={[utilities.textS, utilities.myFontRegular, styles.profileDetailsHeader]}>
                            My Details
                        </Text>
                        <View style={[utilities.flexRow, utilities.flexWrap, { marginTop: 8, gap: 4}]}>
                            <DetailsPill item={user?.instrument} />
                            <DetailsPill item={user?.experience} />
                            {user?.genres && user.genres.map((genre) => <DetailsPill key={genre.id} item={genre} />)}
                        </View>
                    </View>

                    <PrimaryBtn
                        text={isConnected ? 'Chat' : 'Say Hello!'}
                        marginTop={'auto'}
                        marginBottom={20}
                        handlePress={() =>
                            navigation.navigate('Chat', {
                                screen: 'ChatDetails',
                                params: {
                                    id: chatId,
                                    chatParticipants: [{ id: user.id, name: user.name, picture: user.picture }],
                                },
                            })
                        }
                    />
                </View>
            </View>
        );
};

export default ProfileDetails;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
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
