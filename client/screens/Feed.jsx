import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, FlatList, View, Dimensions, RefreshControl } from 'react-native';

import { useUser } from '../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { setConnectedUsers, setFeedUsers } from '../store/Users';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

import FeedMemberCard from '../components/Cards/FeedMemberCard/FeedMemberCard';

import { colors } from '../styles/utilities';
import { SearchIcon } from 'lucide-react-native';

import PictureHeader from '../components/PictureHeader/PictureHeader';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import AiMatchMakingModal from '../components/Modals/AiMatchMakingModal';
import FloatingActionButton from '../components/Elements/FloatingActionButton/FloatingActionButton';

const Feed = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [userInput, setUserInput] = useState('');

    const { currentUser } = useUser();
    const dispatch = useDispatch();

    const users = useSelector((global) => global.usersSlice.feedUsers);

    useEffect(() => {
        getUsers();
    }, [currentUser]);

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
            setRefreshing(true);
            const response = await sendRequest(requestMethods.GET, 'users/type/musician', null);
            if (response.status !== 200) throw new Error('Failed to fetch users');
            dispatch(setConnectedUsers(response.data.connectedUsers));
            dispatch(setFeedUsers(response.data.feedUsers));
        } catch (error) {
            console.log('Error fetching users:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const handleAiMatchMaking = async () => {
        setModalVisible(false);
        setIsLoading(true);
        try {
            const response = await sendRequest(requestMethods.POST, 'ai/', { message: userInput });
            if (response.status !== 200) throw new Error('Failed to fetch users');
            console.log('RESPONSE', response.data);
            if (response.data.length === 0) {
                console.log('NO USERS');

                return;
            }
            dispatch(setFeedUsers(response.data));
        } catch (error) {
            console.log('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProceed = async () => {
        if (userInput === '') return;
        handleAiMatchMaking();
    };

    return (users && users.length === 0) || isLoading ? (
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
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.cardsContainer}
                    refreshControl={
                        <RefreshControl
                            colors={[colors.white]}
                            progressBackgroundColor={colors.primary}
                            refreshing={refreshing}
                            onRefresh={() => {
                                setRefreshing(true);
                                getUsers().finally(() => setRefreshing(false));
                            }}
                        />
                    }
                />
            </View>
            <AiMatchMakingModal
                userInput={userInput}
                setUserInput={setUserInput}
                modalVisible={modalVisible}
                handlePress={handleProceed}
                setModalVisible={setModalVisible}
            />
            <FloatingActionButton handlePress={() => setModalVisible(true)} />
        </>
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
