import { fireStoreDb } from '../../config/firebase';
import { serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useUser } from '../../core/data/contexts/UserContext';
import { sendRequest, requestMethods } from '../../core/tools/apiRequest';

const useChatBandLogic = (route, onSend, chatProperties, setChatProperties, setModalsVisibility) => {
    const { currentUser } = useUser();
    const { id, chatTitle, participants } = route.params;

    const addParticipant = async (newParticipant) => {
        const newParticipantId = newParticipant.id;

        if (newParticipantId && participants.some((participant) => participant.id === newParticipantId)) {
            return;
        }

        try {
            const chatRef = doc(fireStoreDb, 'chats', id);
            const chatDoc = await getDoc(chatRef);

            const newParticipantsList =
                chatProperties.chatParticipants.length > 0
                    ? [...chatProperties.chatParticipants, newParticipant]
                    : [...participants, newParticipant];

            const newParticipantsIdsList = newParticipantsList.map((participant) => participant.id);
            newParticipantsIdsList.push(currentUser.id);

            if (chatDoc.exists()) {
                setModalsVisibility((prev) => ({ ...prev, connectionModalVisible: false }));
                await updateDoc(chatRef, {
                    participantsIds: newParticipantsIdsList,
                });
            }

            const messageData = {
                _id: `${currentUser.id}-${Date.now()}`,
                text: `${newParticipant.name} has joined the chat!`,
                createdAt: serverTimestamp(),
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
        if (bandName.length === 0 || participants.length === 0) return;

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
                createdAt: serverTimestamp(),
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
    };
};

export default useChatBandLogic;
