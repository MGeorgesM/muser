import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { colors, utilities } from '../../../styles/utilities';

import { Send } from 'lucide-react-native';

const UserComposer = ({ placeholder, value, onChangeText, onSendPress, overlay = false }) => {
    return (
        <KeyboardAvoidingView
            style={{ height: 48 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <View
                style={[
                    styles.userInputField,
                    overlay ? { borderTopColor: colors.white } : {},
                    utilities.photoOverlayS,
                ]}
            >
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={overlay? colors.white : colors.gray}
                    value={value}
                    onChangeText={onChangeText}
                    style={styles.input}
                />
                <TouchableOpacity onPress={onSendPress}>
                    <Send size={24} color={overlay ? colors.lightGray : colors.gray } />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default UserComposer;

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
