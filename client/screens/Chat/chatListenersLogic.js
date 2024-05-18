import { useEffect, useState } from 'react';
import { fireStoreDb } from '../../config/firebase';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { useUser } from '../../core/data/contexts/UserContext';
import { profilePicturesUrl } from '../../core/tools/apiRequest';
import { useSelector } from 'react-redux';

const useChatListenersLogic = (route) => {
    const { currentUser } = useUser();
    const { id, participants, chatTitle, chatAdminId } = route.params;
    const userConnections = useSelector((global) => global.usersSlice.connectedUsers);
    const feedUsers = useSelector((global) => global.usersSlice.feedUsers);

    const chatPropertiesInitialState = {
        isAdmin: chatAdminId ? chatAdminId === currentUser.id : false,
        chatMessages: [],
        chatParticipants: [],
        chatConnections: [],
        localChatTitle: {
            bandName: '',
            participantsNames: '',
        },
    };

    const [chatProperties, setChatProperties] = useState(chatPropertiesInitialState);

    useEffect(() => {
        let messagesUnsubscribe;
        let chatTitleUnsubscribe;
        let participantsUnsubscribe;

        setChatProperties(chatPropertiesInitialState);

        const chatRef = doc(fireStoreDb, 'chats', id);

        const setupChatTitleListener = () => {
            if (chatTitle) {
                return;
            }

            chatTitleUnsubscribe = onSnapshot(chatRef, (doc) => {
                const chatData = doc.data();
                chatData &&
                    chatData.adminId == currentUser.id &&
                    setChatProperties((prev) => ({ ...prev, isAdmin: true }));
                if (chatData?.chatTitle) {
                    setChatProperties((prev) => ({ ...prev, localChatTitle: { bandName: chatData.chatTitle } }));
                } else if (chatData?.participantsIds?.length > 1) {
                    const participantIds = chatData.participantsIds.filter((pid) => pid !== currentUser.id);
                    const participantNames = participantIds
                        .map((pid) => {
                            const user =
                                feedUsers.find((user) => user.id === pid) ||
                                userConnections.find((user) => user.id === pid);
                            return user ? user.name : null;
                        })
                        .filter((name) => name !== null);

                    if (participantNames.length > 1) {
                        setChatProperties((prev) => ({
                            ...prev,
                            localChatTitle: { participantsNames: participantNames.join(', ') },
                        }));
                    }
                }
            });
        };

        const setUpParticipantsListener = () => {
            participantsUnsubscribe = onSnapshot(chatRef, (doc) => {
                const chatData = doc.data();
                if (!chatData) return;

                const participantsIds = chatData.participantsIds;
                if (
                    participantsIds.length === chatProperties.chatParticipants.length + 1 ||
                    participantsIds.length === participants.length + 1
                ) {
                    return;
                }
                const participantsList = participantsIds
                    .filter((pid) => pid !== currentUser.id)
                    .map((pid) => {
                        const user =
                            feedUsers.find((user) => user.id === pid) ||
                            userConnections.find((user) => user.id === pid);
                        return user;
                    });

                setChatProperties((prev) => ({
                    ...prev,
                    chatParticipants: participantsList,
                    chatConnections: prev.chatConnections.filter((connection) =>
                        participantsList.every((participant) => participant.id !== connection.id)
                    ),
                }));
            });
        };

        const setupMessagesListener = () => {
            const messagesRef = collection(chatRef, 'messages');
            const q = query(messagesRef, orderBy('createdAt', 'desc'));

            messagesUnsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedMessages = snapshot.docs.map((doc) => ({
                    _id: doc.id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
                    system: doc.data().system,
                    user: {
                        _id: doc.data().userId,
                        avatar: getMessageAvatar(doc.data().userId),
                    },
                }));

                setChatProperties((prev) => ({ ...prev, chatMessages: fetchedMessages }));
            });
        };

        setupMessagesListener();
        setUpParticipantsListener();
        setupChatTitleListener();
        getRemainingConnections();

        return () => {
            chatTitleUnsubscribe && chatTitleUnsubscribe();
            messagesUnsubscribe && messagesUnsubscribe();
            participantsUnsubscribe && participantsUnsubscribe();
        };
    }, [id, participants]);

    const getMessageAvatar = (userId) => {
        if (participants && participants.length > 1 && userId !== currentUser.id) {
            const user = participants.find((user) => user.id === userId);
            if (user) {
                return `${profilePicturesUrl + user.picture}`;
            }
        }

        return null;
    };

    const getRemainingConnections = async () => {
        if (!userConnections) return;

        const remainingConnections = userConnections.filter((connection) =>
            participants.every((participant) => participant.id !== connection.id)
        );

        setChatProperties((prev) => ({ ...prev, chatConnections: remainingConnections }));
    };

    return {
        id,
        chatTitle,
        currentUser,
        participants,
        chatProperties,
        setChatProperties,
    };
};

export default useChatListenersLogic;
