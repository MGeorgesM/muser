import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { colors, utilities } from '../../styles/utilities';
import { profilePicturesUrl } from '../../core/tools/apiRequest';

import InstrumentIcon from '../InstrumentIcon/InstrumentIcon';

const FeedMemberCard = ({ user, height = 256, navigation }) => {
    const imageUrl = `${profilePicturesUrl + user.picture}`;
    return (
        <TouchableOpacity
            style={[styles.cardContainer, { height: height }]}
            onPress={() => navigation.navigate('ProfileDetails', { userId: user.id })}
        >
            <Image source={{ uri: imageUrl }} style={styles.photo} />
            <View style={styles.overlay}>
                <Text style={styles.username}>{user.name}</Text>
                <InstrumentIcon instrument={user.instrument} size={12} />
            </View>
        </TouchableOpacity>
    );
};

export default FeedMemberCard;

const styles = StyleSheet.create({
    cardContainer: {
        width: 180,
        borderRadius: utilities.borderRadius.s,
        overflow: 'hidden',
        margin: 4,
    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.blackTrsp,
        padding: 10,
    },
    username: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        textAlign: 'center',
    },
});
