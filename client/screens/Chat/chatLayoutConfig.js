import { useLayoutEffect } from 'react';
import { TouchableOpacity, View, Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { utilities, colors } from '../../styles/utilities';
import { Send as SendIcon } from 'lucide-react-native';
import { Bubble, Send, InputToolbar, Composer } from 'react-native-gifted-chat';
import { truncateText } from '../../core/tools/formatDate';
import { PlusIcon, ChevronLeft } from 'lucide-react-native';
import PictureHeader from '../../components/Misc/PictureHeader/PictureHeader';

export const useChatLayoutHeader = (id, chatTitle, participants, chatProperties, onBackPress, setModalsVisibility) => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => {
                const title = chatTitle || chatProperties.localChatTitle.bandName;
                if (title)
                    return <Text style={[utilities.textM, utilities.myFontMedium]}>{truncateText(title, 20)}</Text>;
                else if (chatProperties.localChatTitle.participantsNames) {
                    return (
                        <Text style={[utilities.textM, utilities.myFontMedium]}>
                            {`You, ${truncateText(chatProperties.localChatTitle.participantsNames, 15)}`}
                        </Text>
                    );
                } else {
                    if (!participants) return;
                    const participantsList =
                        chatProperties.chatParticipants.length > 0 ? chatProperties.chatParticipants : participants;
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

export function renderBubble(props) {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: colors.bgOffDark,
                    borderRadius: 12,
                    borderTopEndRadius: 0,
                    marginBottom: 2,
                },
                left: {
                    backgroundColor: colors.bglighter,
                    borderRadius: 12,
                    borderTopLeftRadius: 0,
                    marginBottom: 2,
                },
            }}
            textStyle={{
                right: {
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 14,
                    color: colors.white,
                },
                left: {
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 14,
                    color: colors.bgDarkest,
                },
            }}
            timeTextStyle={{
                right: {
                    color: colors.gray,
                },
                left: {
                    color: colors.darkGray,
                },
            }}
        />
    );
}

export const renderSystemMessage = (props) => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
            <Text style={{ color: '#b2b2b2', fontSize: 12, fontWeight: 600 }}>{props.currentMessage.text}</Text>
        </View>
    );
};

export function renderSend(props) {
    return (
        <Send
            {...props}
            containerStyle={{
                borderTopWidth: 0,
                borderBottomWidth: 0,
                backgroundColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <TouchableOpacity
                style={{
                    marginEnd: 8,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    backgroundColor: 'transparent',
                }}
                onPress={() => {
                    if (props.text && props.onSend) {
                        props.onSend({ text: props.text.trim() }, true);
                    }
                }}
            >
                <SendIcon size={24} color="#fff" />
            </TouchableOpacity>
        </Send>
    );
}

export function renderComposer(props) {
    return (
        <Composer
            {...props}
            textInputStyle={{
                color: '#fff',
                marginEnd: 8,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                backgroundColor: 'transparent',
            }}
        />
    );
}

export function renderInputToolbar(props) {
    return (
        <InputToolbar
            {...props}
            containerStyle={{
                backgroundColor: colors.bgDark,
                padding: 6,
                borderTopColor: '#fff',
                borderTopWidth: 0.5,
                borderBottomColor: '#fff',
                borderBottomWidth: 0.5,
            }}
            renderComposer={renderComposer}
            primaryStyle={{ alignItems: 'center', justifyContent: 'center' }}
        />
    );
}
