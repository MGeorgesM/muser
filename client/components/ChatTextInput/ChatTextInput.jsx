import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { colors } from '../../styles/utilities';

import { Send } from 'lucide-react-native';

const ChatTextInput = ({ placeholder, value, onChangeText, onSendPress }) => {
    return (
        <KeyboardAvoidingView
            style={{ height: 48 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            {/* <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: colors.bgDark }}></View> */}
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
        </KeyboardAvoidingView>
    );
};

export default ChatTextInput;

const styles = StyleSheet.create({
    userInputField: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 20,
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
