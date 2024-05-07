import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, FlatList, View, Image, Modal, Button, TextInput, Dimensions, Pressable } from 'react-native';

import { useUser } from '../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { setConnectedUsers, setFeedUsers } from '../store/Users';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

import FeedMemberCard from '../components/FeedMemberCard/FeedMemberCard';

import { colors, utilities } from '../styles/utilities';
import { SearchIcon, AudioWaveform } from 'lucide-react-native';

import PictureHeader from '../components/PictureHeader/PictureHeader';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import AiMatchMakingModal from '../components/Modals/AiMatchMakingModal';
import FloatingActionButton from '../components/FloatingActionButton/FloatingActionButton';

const Feed = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [userInput, setUserInput] = useState('');

    const { currentUser } = useUser();
    const dispatch = useDispatch();

    const users = useSelector((global) => global.usersSlice.feedUsers);

    useEffect(() => {
        getUsers();
    }, [currentUser, refreshing]);

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

    const handleProceed = async () => {
        console.log('HERE');
        console.log({ message: userInput });
        try {
            const response = await sendRequest(requestMethods.POST, 'ai/', { message: userInput });
            if (response.status !== 200) throw new Error('Failed to fetch users');
            console.log('RESPONSE', response.data);
            if(response.data.length === 0) {
                console.log('NO USERS');

                return;
            }
            dispatch(setFeedUsers(response.data));
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };

    return users && users.length === 0 ? (
        <LoadingScreen />
    ) : (
        <>
            <View style={styles.listContainer}>
                <FlatList
                    data={users}
                    renderItem={({ item, i }) => {
                        return <FeedMemberCard key={item.id} user={item} navigation={navigation} />;
                    }}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.cardsContainer}
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        getUsers().finally(() => setRefreshing(false));
                    }}
                />
            </View>
            <AiMatchMakingModal
                userInput={userInput}
                setUserInput={setUserInput}
                modalVisible={modalVisible}
                handlePress={handleProceed}
                setModalVisible={setModalVisible}
            />
            <FloatingActionButton onPress={() => setModalVisible(true)} text={'Ai'} />

        </>
    );
};

export default Feed;

const height = Dimensions.get('window').height;

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
        flex: 1,
        backgroundColor: colors.bgDark,
        paddingHorizontal: 14,
    },

    welcomeDisplay: {
        marginBottom: -2,
        color: 'white',
    },

    cardsContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddding: 0,
    },
});
