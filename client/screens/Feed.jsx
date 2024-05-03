import React, { useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { setConnectUsers, setFeedUsers, setUsers } from '../store/Users';
import { useUser } from '../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';

import { sendRequest, requestMethods, profilePicturesUrl } from '../core/tools/apiRequest';

import FeedMemberCard from '../components/FeedMemberCard/FeedMemberCard';
import MasonryList from '@react-native-seoul/masonry-list';

import { colors, utilities } from '../styles/utilities';
import { SearchIcon } from 'lucide-react-native';

const avatar = require('../assets/avatar.png');

const Feed = ({ navigation }) => {
    const dispatch = useDispatch();
    const { currentUser } = useUser();
    const users = useSelector((global) => global.usersSlice.feedUsers);

    const getUsers = async () => {
        try {
            const response = await sendRequest(requestMethods.GET, 'users/type/musician', null);
            if (response.status !== 200) throw new Error('Failed to fetch users');
            dispatch(setConnectUsers(response.data.connectedUsers));
            dispatch(setFeedUsers(response.data.feedUsers));
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };
    useEffect(() => {
        getUsers();
    }, [currentUser]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <CustomHeader username={currentUser?.name} avatar={avatar} />,
            headerRight: () => (
                <View
                    style={{
                        marginRight: 16,
                        height: 42,
                        width: 42,
                        borderRadius: 21,
                        borderColor: 'white',
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <SearchIcon size={20} color="white" />
                </View>
            ),
            headerStyle: {
                backgroundColor: colors.bgDark,
                height: 128,
                shadowColor: 'transparent',
                elevation: 0,
            },
        });
    });

    const CustomHeader = () => {
        const { currentUser } = useUser();
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: profilePicturesUrl + currentUser?.picture }} style={styles.avatar} />
                    <View style={styles.textContainer}>
                        <Text style={[styles.welcomeDisplay, utilities.textM, utilities.noMb]}>Welcome</Text>
                        <Text style={[utilities.textL, utilities.textBold, { marginTop: -4, color: 'white' }]}>
                            {currentUser?.name}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    // const MemberCard = ({ user, height, navigation }) => {
    //     const imageUrl = `${profilePicturesUrl + user.picture}`;
    //     return (
    //         <TouchableOpacity
    //             style={[styles.cardContainer, { height: height || 180 }]}
    //             onPress={() => navigation.navigate('ProfileDetails', { user })}
    //         >
    //             <Image source={{ uri: imageUrl }} style={styles.photo} />
    //             <View style={styles.overlay}>
    //                 <Text style={styles.username}>{user.name}</Text>
    //                 <Guitar size={20} color="white" />
    //             </View>
    //         </TouchableOpacity>
    //     );
    // };

    return (
        // <View style={styles.cardsContainer}>
        //     {users && users.length > 0 && users.map((user) =>
        //         (<MemberCard key={user.firebaseUserId} username={user.name} photo={user.profilePicture} />)
        //     )}
        // </View>

        <View style={styles.listContainer}>
            <MasonryList
                data={users}
                renderItem={({ item, i }) => {
                    const itemHeight = Math.floor(Math.random() * (290 - 180 + 1) + 180);
                    return <FeedMemberCard user={item} height={itemHeight} navigation={navigation} />;
                }}
                keyExtractor={(item) => item.id}
                numColumns={2}
                style={{ flex: 1 }}
                contentContainerStyle={styles.cardsContainer}
                onRefresh={getUsers}
            />
        </View>
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

        borderColor: 'white',
        borderWidth: 0.5,
    },

    listContainer: {
        backgroundColor: colors.bgDark,
        flex: 1,
        paddingHorizontal: 16,
    },
    welcomeDisplay: {
        marginBottom: -2,
        color: 'white',
    },

    cardsContainer: {
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        // justifyContent: 'center',
        // gap: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddding:0
    },
});
