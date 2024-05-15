import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Mail } from 'lucide-react-native';
import { colors } from '../../styles/utilities';
import { useUser } from '../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setConnectedUsers, setFeedUsers } from '../../store/Users';
import { sendRequest, requestMethods } from '../../core/tools/apiRequest';

import PictureHeader from '../../components/Misc/PictureHeader/PictureHeader';
import FeedMemberCard from '../../components/Cards/FeedMemberCard/FeedMemberCard';

const useFeedLogic = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [matchedUsers, setMatchedUsers] = useState([]);

    const { currentUser } = useUser();
    const navigation = useNavigation();

    const dispatch = useDispatch();

    const feedUsers = useSelector((global) => global.usersSlice.feedUsers);
    const connectedUsers = useSelector((global) => global.usersSlice.connectedUsers);
    const users = [...feedUsers, ...connectedUsers];

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
    }, [currentUser]);

    useEffect(() => {
        getUsers();
    }, [currentUser]);

    const getUsers = async () => {
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
        setIsAiLoading(true);
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
            setIsAiLoading(false);
        }
    };

    const handleProceed = async () => {
        if (isLoading) return;

        if (userInput === '') {
            setMatchedUsers([]);
            setModalVisible(false);
            return;
        }
        handleAiMatchMaking();
    };

    const handleChatInititation = () => {
        if (isLoading) return;
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
    return {
        users,
        isLoading,
        isAiLoading,
        refreshing,
        modalVisible,
        userInput,
        matchedUsers,
        getUsers,
        handleProceed,
        handleChatInititation,
        renderItem,
        listData,
        setModalVisible,
        setUserInput,
        setRefreshing
    };
};

export default useFeedLogic;

const styles = StyleSheet.create({});
