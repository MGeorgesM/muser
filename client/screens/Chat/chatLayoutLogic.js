import { useLayoutEffect, useState } from 'react';
import { TouchableOpacity, View, Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { utilities, colors } from '../../styles/utilities';
import { truncateText } from '../../core/tools/formatDate';
import { PlusIcon, ChevronLeft } from 'lucide-react-native';
import PictureHeader from '../../components/Misc/PictureHeader/PictureHeader';

export const useChatLayoutLogic = (route, chatProperties) => {
    const navigation = useNavigation();
    const { id, participants, chatTitle, onBackPress } = route.params;
    const [modalsVisibility, setModalsVisibility] = useState({
        connectionModalVisible: false,
        bandModalVisible: false,
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => {
                const title = chatTitle || chatProperties?.localChatTitle.bandName;
                if (title)
                    return <Text style={[utilities.textM, utilities.myFontMedium]}>{truncateText(title, 20)}</Text>;
                else if (chatProperties?.localChatTitle.participantsNames) {
                    return (
                        <Text style={[utilities.textM, utilities.myFontMedium]}>
                            {`You, ${truncateText(chatProperties?.localChatTitle.participantsNames, 15)}`}
                        </Text>
                    );
                } else {
                    if (!participants) return;
                    const participantsList =
                        chatProperties?.chatParticipants.length > 0 ? chatProperties?.chatParticipants : participants;
                    const receiverName = participantsList.map((participant) => participant?.name).join(', ');
                    const reciverPicture = participantsList[0].picture;
                    const receiverId = participantsList[0].id;

                    return (
                        <PictureHeader
                            picture={participantsList.length > 1 ? null : reciverPicture}
                            name={truncateText(receiverName, 20)}
                            handlePress={() =>
                                navigation.navigate('Feed', {
                                    screen: 'ProfileDetails',
                                    params: { userId: receiverId },
                                })
                            }
                        />
                    );
                }
            },
            headerLeft: () => (
                <TouchableOpacity
                    onPress={onBackPress || (() => navigation.navigate('ChatMain'))}
                    style={{ marginLeft: 20 }}
                >
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center', gap: 8 }}>
                    <Pressable
                        style={styles.bandBtn}
                        onPress={() => setModalsVisibility((prev) => ({ ...prev, bandModalVisible: true }))}
                    >
                        <Text style={styles.bandBtnText}>Band</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setModalsVisibility((prev) => ({ ...prev, connectionModalVisible: true }))}
                    >
                        <PlusIcon size={24} color="white" />
                    </Pressable>
                </View>
            ),
        });
    }, [id, participants, chatProperties, chatTitle]);

    return { modalsVisibility, setModalsVisibility };
};

const styles = StyleSheet.create({
    bandBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: utilities.borderRadius.m,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bandBtnText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 1,
        color: colors.white,
    },
});
