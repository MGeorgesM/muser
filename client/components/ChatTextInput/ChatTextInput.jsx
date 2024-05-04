import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

import { colors } from '../../styles/utilities';

import { Send } from 'lucide-react-native';

const ChatTextInput = ({ placeholder, value, onChangeText, onSendPress }) => {
    return (
        <View style={styles.userInputField}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={colors.gray}
                value={value}
                onChangeText={onChangeText}
                style={styles.input}
            />
            <TouchableOpacity onPress={onSendPress}>
                <Send size={24} color={colors.gray} />
            </TouchableOpacity>
        </View>
    );
};

export default ChatTextInput;

const styles = StyleSheet.create({
    userInputField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 20,
        height: 48,
        borderTopColor: colors.lightGray,
        borderTopWidth: 0.5,
    },
    input: {
        flex: 1,
        fontFamily: 'Montserrat-Regular',
        color: colors.white,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
    },
});
