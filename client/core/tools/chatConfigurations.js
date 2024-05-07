import { TouchableOpacity } from 'react-native';

import { Send as SendIcon } from 'lucide-react-native';
import { Bubble, Send, InputToolbar, Composer } from 'react-native-gifted-chat';
import { colors } from '../../styles/utilities';

export function renderBubble(props) {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#2E2E2E',
                    borderRadius: 12,
                    borderTopEndRadius: 0,
                },
                left: {
                    backgroundColor: '#D9D9D9',
                    borderRadius: 12,
                    borderTopLeftRadius: 0,
                },
            }}
            textStyle={{
                right: {
                    color: '#fff',
                },
                left: {
                    color: '#1E1E1E',
                },
            }}
        />
    );
}

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
