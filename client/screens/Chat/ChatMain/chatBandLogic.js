import { fireStoreDb } from '../../../core/config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useUser } from '../../../core/data/contexts/UserContext';
import { sendRequest, requestMethods } from '../../../core/tools/apiRequest';

const useChatBandLogic = (route, onSend, chatProperties, setChatProperties, setModalsVisibility) => {
    const { currentUser } = useUser();
    const { id, chatTitle, participants } = route.params;

    const getParticipants = (newParticipant, add = true) => {
        let newParticipantsList =
            chatProperties.chatParticipants.length > 0 ? chatProperties.chatParticipants : participants;

        if (add) {
            newParticipantsList =
                newParticipantsList.length > 0 ? [...newParticipantsList, newParticipant] : [newParticipant];
        } else {
            newParticipantsList = newParticipantsList.filter((participant) => participant.id !== newParticipant.id);
        }

        const newParticipantsIdsList = newParticipantsList.map((participant) => participant.id);
        if (!newParticipantsIdsList.includes(currentUser.id)) {
            newParticipantsIdsList.push(currentUser.id);
        }

        return [newParticipantsList, newParticipantsIdsList];
    };

    const addParticipant = async (newParticipant) => {
        const newParticipantId = newParticipant.id;

        if (newParticipantId && participants.some((participant) => participant.id === newParticipantId)) {
            return;
        }

        const [newParticipantsList, newParticipantsIdsList] = getParticipants(newParticipant);

        try {
            const chatRef = doc(fireStoreDb, 'chats', id);
            const chatDoc = await getDoc(chatRef);

            if (chatDoc.exists()) {
                await updateDoc(chatRef, {
                    participantsIds: newParticipantsIdsList,
                });
            }

            setModalsVisibility((prev) => ({ ...prev, connectionModalVisible: false }));

            const messageData = {
                _id: `${currentUser.id}-${Date.now()}`,
                text: `${currentUser.name} added ${newParticipant.name} to the chat`,
                createdAt: new Date(),
                system: true,
            };

            onSend([messageData]);

            setChatProperties((prev) => ({
                ...prev,
                chatConnections: prev.chatConnections.filter((connection) => connection.id !== newParticipantId),
                chatParticipants: newParticipantsList,
            }));

            (chatTitle || chatProperties.localChatTitle.bandName) &&
                updateBandMembers(chatTitle || chatProperties.localChatTitle.bandName, newParticipantsIdsList);
        } catch (error) {
            console.log('Error adding participant', error);
        }
        setModalsVisibility((prev) => ({ ...prev, connectionModalVisible: false }));
    };

    const removeParticipant = async (participant) => {
        setModalsVisibility((prev) => ({ ...prev, bandModalVisible: false }));
        if (!chatProperties.isAdmin || chatProperties.chatParticipants.length === 1) return;
        const [newParticipantsList, newParticipantsIdsList] = getParticipants(participant, false);

        try {
            const chatRef = doc(fireStoreDb, 'chats', id);
            const chatDoc = await getDoc(chatRef);

            if (chatDoc.exists()) {
                await updateDoc(chatRef, {
                    participantsIds: newParticipantsIdsList,
                });
            }

            const messageData = {
                _id: `${currentUser.id}-${Date.now()}`,
                text: `${currentUser.name} removed ${participant.name} from the chat`,
                createdAt: new Date(),
                system: true,
            };

            onSend([messageData]);

            setChatProperties((prev) => ({
                ...prev,
                chatParticipants: newParticipantsList,
            }));

            (chatTitle || chatProperties.localChatTitle.bandName) &&
                updateBandMembers(chatTitle || chatProperties.localChatTitle.bandName, newParticipantsIdsList);
        } catch (error) {
            console.log('Error removing participant', error);
        }
    };

    const updateBandMembers = async (bandName, membersIds) => {
        try {
            const response = await sendRequest(requestMethods.POST, 'bands', {
                name: bandName,
                members: membersIds,
            });
            if (response.status !== 200) throw new Error('Failed to update band members');
        } catch (error) {
            console.log('Error updating band members:', error);
        }
    };

    const handleFormBand = async (bandName) => {
        if (!bandName || bandName.length === 0 || participants.length === 0) return;

        const participantsIds = participants.map((participant) => participant.id);
        participantsIds.push(currentUser.id);

        try {
            const response = await sendRequest(requestMethods.POST, `bands`, {
                name: bandName,
                members: participantsIds,
            });

            if (response.status !== 201) throw new Error('Failed to create band');

            setModalsVisibility((prev) => ({ ...prev, bandModalVisible: false }));

            const chatRef = doc(fireStoreDb, 'chats', id);
            await updateDoc(chatRef, {
                chatTitle: bandName,
            });

            setChatProperties((prev) => ({ ...prev, localChatTitle: { bandName } }));

            const messageData = {
                _id: `${currentUser.id}-${Date.now()}-${bandName}`,
                text: `We have formed the band \'${bandName}\'!`,
                createdAt: new Date(),
                user: {
                    _id: currentUser.id,
                    // avatar: getMessageAvatar(currentUser.id),
                },
            };

            onSend([messageData]);
        } catch (error) {
            console.log('Error processing band formation:', error);
        }
    };
    return {
        addParticipant,
        handleFormBand,
        removeParticipant,
    };
};

export default useChatBandLogic;
