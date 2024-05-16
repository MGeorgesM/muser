import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useUser } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { profilePicturesUrl, requestMethods, sendRequest } from '../../core/tools/apiRequest';

const useProfileDetailsLogic = (userId) => {
    const { currentUser } = useUser();
    
    const [user, setUser] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    const navigation = useNavigation();
    const feedUsers = useSelector((global) => global.usersSlice.feedUsers);
    const connectedUsers = useSelector((global) => global.usersSlice.connectedUsers);
    const chatId = [currentUser.id, userId].sort((a, b) => a - b).join('-');
    const imageUrl = `${profilePicturesUrl + user.picture}`;

    useLayoutEffect(() => {
        if (!userId) return;

        const foundUser =
            feedUsers.find((user) => user.id === userId) ||
            connectedUsers.find((user) => user.id === userId) ||
            (currentUser.id === userId ? currentUser : null);

        if (foundUser) {
            setUser(foundUser);
            setIsConnected(connectedUsers.some((user) => user.id === userId));
        } else {
            getUserFromApi();
        }
    }, [userId, feedUsers, connectedUsers, currentUser]);

    const getUserFromApi = async () => {
        console.log('Fetching user from API');
        try {
            const response = await sendRequest(requestMethods.GET, `users/${userId}`);
            if (response.status !== 200) throw new Error('Failed to fetch user');
            setUser(response.data);
        } catch (error) {
            console.log('Error fetching user:', error);
        }
    };

    const handlePress = () => {
        navigation.navigate('Chat', {
            screen: 'ChatDetails',
            params: {
                id: chatId,
                participants: [
                    {
                        id: user.id,
                        name: user.name,
                        picture: user.picture,
                        instrument: user.instrument,
                    },
                ],
                onBackPress: () =>
                    navigation.navigate('ProfileDetails', {
                        userId: user.id,
                    }),
            },
        });
    };
    return {
        user,
        imageUrl,
        isConnected,
        handlePress,
        navigation
    };
};

export default useProfileDetailsLogic;