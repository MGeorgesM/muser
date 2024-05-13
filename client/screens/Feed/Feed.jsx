import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, FlatList, View, RefreshControl } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import { useUser } from '../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { setConnectedUsers, setFeedUsers } from '../../store/Users';

import { sendRequest, requestMethods } from '../../core/tools/apiRequest';

import { colors } from '../../styles/utilities';
import { Mail } from 'lucide-react-native';

import { BrainCog, MessageCirclePlus } from 'lucide-react-native';

import PictureHeader from '../../components/Misc/PictureHeader/PictureHeader';
import LoadingScreen from '../../components/Misc/LoadingScreen/LoadingScreen';
import AiMatchMakingModal from '../../components/Modals/AiMatchMakingModal';
import FeedMemberCard from '../../components/Cards/FeedMemberCard/FeedMemberCard';
import FloatingActionButton from '../../components/Misc/FloatingActionButton/FloatingActionButton';

const Feed = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [matchedUsers, setMatchedUsers] = useState([]);

    const { currentUser } = useUser();
    const dispatch = useDispatch();

    const users = useSelector((global) => global.usersSlice.feedUsers);

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
                    <Mail size={20} color="white" />
                </View>
            ),
            headerStyle: {
                backgroundColor: colors.bgDark,
                height: 128,
                shadowColor: 'transparent',
                elevation: 0,
            },
        });

        const setNavigationBarColor = async () => {
            try {
                await SystemNavigationBar.setNavigationColor(colors.bgDark);
            } catch (error) {
                console.error('Failed to change system navigation bar color:', error);
            }
        };
        setNavigationBarColor();
    });

    useEffect(() => {
        getUsers();
    }, [currentUser]);

    const getUsers = async () => {
        console.log('Fetching users');
        try {
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
        console.log('Calling OpenAi');
        try {
            const response = await sendRequest(requestMethods.POST, 'ai/', { message: userInput });
            if (response.status !== 200) throw new Error('Failed to fetch users');
            if (response.data.length === 0) {
                return;
            }
            setMatchedUsers(response.data);
        } catch (error) {
            console.log('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProceed = async () => {
        if (userInput === '') {
            setMatchedUsers([]);
            setModalVisible(false);
            return;
        }
        handleAiMatchMaking();
    };

    const handleChatInititation = () => {
        const matchedUsersIds = matchedUsers.map((user) => user.id);
        const chatId = [currentUser.id, ...matchedUsersIds].sort((a, b) => a - b).join('-');
        const participants = matchedUsers.map((user) => {
            return {
                id: user.id,
                name: user.name,
                picture: user.picture,
            };
        });

        navigation.navigate('Chat', {
            screen: 'ChatDetails',
            params: {
                id: chatId,
                participants,
            },
        });
    };

    const renderItem = ({ item, index }) => {
        let isLastItem;
        let isOddTotal;

        if (matchedUsers && matchedUsers.length > 0) {
            isLastItem = index === matchedUsers.length - 1;
            isOddTotal = matchedUsers.length % 2 !== 0;
        } else {
            isLastItem = index === users.length - 1;
            isOddTotal = users.length % 2 !== 0;
        }

        return (
            <>
                <FeedMemberCard key={item.id} user={item} navigation={navigation} />
                {isLastItem && isOddTotal && <View style={{ width: '50%' }} />}
            </>
        );
    };

    const listData = () => {
        if (matchedUsers && matchedUsers.length > 0) {
            return matchedUsers;
        } else {
            return users;
        }
    };

    return users && users.length === 0 ? (
        <LoadingScreen />
    ) : (
        <>
            <View style={styles.listContainer}>
                <FlatList
                    data={listData()}
                    renderItem={renderItem}
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
                                getUsers();
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
            <FloatingActionButton icon={BrainCog} handlePress={() => setModalVisible(true)} isLoading={isLoading} />
            {matchedUsers && matchedUsers.length > 0 && (
                <FloatingActionButton
                    icon={MessageCirclePlus}
                    handlePress={handleChatInititation}
                    bottom={88}
                    primary={false}
                />
            )}
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
