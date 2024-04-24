import { StyleSheet, Text, View, Image, ScrollView, FlatList } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';

import { colors, utilities, borderRadius } from '../styles/utilities';

import { Guitar } from 'lucide-react-native';

const avatar = require('../assets/avatar.png');

import randomUsers from '../core/tools/fakeUsers';

const Feed = ({ navigation }) => {
    const [users, setUsers] = useState(randomUsers);

    const CustomHeader = ({ username, avatar }) => {
        return (
            <View style={styles.headerContainer}>
                <Image source={avatar} style={styles.avatar} />
                <View style={styles.textContainer}>
                    <Text style={[styles.welcomeDisplay, utilities.textM, utilities.noMb]}>Welcome</Text>
                    <Text style={[utilities.textL, utilities.textBold]}>{username}</Text>
                </View>
            </View>
        );
    };

    const MemberCard = ({ username, photo, height }) => {
        return (
            <View style={[styles.cardContainer, { height: height || 180 }]}>
                <Image source={photo} style={styles.photo} />
                <View style={styles.overlay}>
                    <Text style={styles.username}>{username}</Text>
                    <Guitar size={20} color="white" />
                </View>
            </View>
        );
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <CustomHeader username="Johny Mouawad" avatar={avatar} />,
        });
    });

    return (
        // <View style={styles.cardsContainer}>
        //     {users && users.length > 0 && users.map((user) =>
        //         (<MemberCard key={user.firebaseUserId} username={user.name} photo={user.profilePicture} />)
        //     )}
        // </View>

        <FlatList
            data={users}
            renderItem={({ item }) => {
                const randomHeight = Math.random() < 0.5 ? 290 : 180;
                return <MemberCard username={item.name} photo={item.profilePicture} height={randomHeight} />;
            }}
            keyExtractor={(item) => item.firebaseUserId}
            numColumns={2}
            style={{ flex: 1 }}
            contentContainerStyle={styles.cardsContainer}
        />
    );
};

export default Feed;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 8,
    },
    welcomeDisplay: {
        marginBottom: -2,
    },

    cardsContainer: {
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        // justifyContent: 'center',
        // gap: 16,

        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    cardContainer: {
        width: 170,
        borderRadius: utilities.borderRadius.m,
        overflow: 'hidden',
        margin: 8,
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
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.blackTrsp,
        padding: 10,
    },
    username: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});
