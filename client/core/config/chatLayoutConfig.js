import { Send as SendIcon } from 'lucide-react-native';
import { Bubble, Send, InputToolbar, Composer, Day } from 'react-native-gifted-chat';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/utilities';

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
            <Text style={{ marginBottom: 14, color: colors.gray, fontSize: 12, fontFamily: 'Montserrat-Regular' }}>
                {props.currentMessage.text}
            </Text>
        </View>
    );
};

export const renderDay = (props) => {
    return (
        <Day
            {...props}
            textStyle={{
                color: colors.gray,
                fontSize: 12,
                fontFamily: 'Montserrat-Regular',
            }}
        />
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
