import { useEffect, useState, useLayoutEffect } from 'react';
import { useUser } from '../../../core/data/contexts/UserContext';
import { fireStoreDb } from '../../../core/config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const useChatsOverviewLogic = () => {
    const { currentUser } = useUser();
    const navigation = useNavigation();
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Your Connections',
        });
    });

    useEffect(() => {
        if (!currentUser) return;

        const chatRef = collection(fireStoreDb, 'chats');
        const q = query(chatRef, where('participantsIds', 'array-contains', currentUser.id));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatsArray = [];
            querySnapshot.forEach((doc) => {
                chatsArray.push({ id: doc.id, ...doc.data() });
            });
            chatsArray.sort((a, b) => {
                if (a.lastMessage?.createdAt && b.lastMessage?.createdAt) {
                    return b.lastMessage.createdAt - a.lastMessage.createdAt;
                }
                return 0;
            });

            setChats(chatsArray);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return {
        chats,
        isLoading,
    };
};

export default useChatsOverviewLogic;
