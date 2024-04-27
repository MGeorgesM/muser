import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '../store/Users';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

import { Guitar } from 'lucide-react-native';
import { colors, utilities } from '../styles/utilities';
import MasonryList from '@react-native-seoul/masonry-list';
import { useUser } from '../contexts/UserContext';

const avatar = require('../assets/avatar.png');

const Feed = ({ navigation }) => {
    const dispatch = useDispatch();
    const users = useSelector((global) => global.usersSlice.users);

    useLayoutEffect(() => {
        const getUsers = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, 'users/type/musician', null);
                if (response.status !== 200) throw new Error('Failed to fetch users');
                dispatch(setUsers(response.data));
                console.log('Users fetched:', response.data);
            } catch (error) {
                console.log('Error fetching users:', error);
            }
        };
        getUsers();
    }, []);

    const CustomHeader = () => {
        const { currentUser } = useUser();
        return (
            <View style={styles.headerContainer}>
                <Image source={avatar} style={styles.avatar} />
                <View style={styles.textContainer}>
                    <Text style={[styles.welcomeDisplay, utilities.textM, utilities.noMb]}>Welcome</Text>
                    <Text style={[utilities.textL, utilities.textBold]}>{currentUser?.name}</Text>
                </View>
            </View>
        );
    };

    const MemberCard = ({ user, height, navigation }) => {
        console.log('userpicture',user.picture)
        return (
            <TouchableOpacity
                style={[styles.cardContainer, { height: height || 180 }]}
                onPress={() => navigation.navigate('ProfileDetails', { username, photo })}
            >
                <Image
                    source={`http://192.168.1.107:8000/profile-pictures/musician.jpg`}
                    style={styles.photo}
                />
                <View style={styles.overlay}>
                    <Text style={styles.username}>{user.name}</Text>
                    <Guitar size={20} color="white" />
                </View>
            </TouchableOpacity>
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

        users.length > 0 && (
            <MasonryList
                data={users}
                renderItem={({ item }) => {
                    const randomHeight = Math.random() < 0.4 ? 290 : 180;
                    return <MemberCard user={item} height={randomHeight} navigation={navigation} />;
                }}
                keyExtractor={(item) => item.firebaseUserId}
                numColumns={2}
                style={{ flex: 1 }}
                contentContainerStyle={styles.cardsContainer}
            />
        )
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
