import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { setConnectedUsers, setFeedUsers, setUsers } from '../store/Users';
import { useUser } from '../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';

import { sendRequest, requestMethods, profilePicturesUrl } from '../core/tools/apiRequest';

import MasonryList from '@react-native-seoul/masonry-list';
import FeedMemberCard from '../components/FeedMemberCard/FeedMemberCard';

import { colors, utilities } from '../styles/utilities';
import { SearchIcon } from 'lucide-react-native';
import PictureHeader from '../components/PictureHeader/PictureHeader';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import { FlatList } from 'react-native-gesture-handler';

const Feed = ({ navigation }) => {
    const dispatch = useDispatch();
    const { currentUser } = useUser();
    const users = useSelector((global) => global.usersSlice.feedUsers);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getUsers();
    }, [currentUser?.id, refreshing]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <PictureHeader name={currentUser?.name} picture={currentUser?.picture} welcome={true} />,
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

    const getUsers = async () => {
        try {
            const response = await sendRequest(requestMethods.GET, 'users/type/musician', null);
            if (response.status !== 200) throw new Error('Failed to fetch users');
            dispatch(setConnectedUsers(response.data.connectedUsers));
            dispatch(setFeedUsers(response.data.feedUsers));
            setRefreshing(false);
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };

    return users && users.length === 0 ? (
        <LoadingScreen />
    ) : (
        <View style={styles.listContainer}>
            <FlatList
                data={users}
                renderItem={({ item, i }) => {
                    return <FeedMemberCard user={item} navigation={navigation} />;
                }}
                keyExtractor={(item) => item.id}
                numColumns={2}
                style={{ flex: 1 }}
                contentContainerStyle={styles.cardsContainer}
                refreshing={refreshing}
                onRefresh={() => setRefreshing(true)}
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
        paddding: 0,
    },
});
