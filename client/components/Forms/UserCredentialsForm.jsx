import React from 'react';
import { Text, View, TextInput } from 'react-native';
import { colors, utilities } from '../../styles/utilities';

const UserCredentialsForm = ({ userInfo, setUserInfo }) => {
    const inputFields = [
        {
            label: 'Edit Your Email',
            placeholder: 'Enter your email',
            value: userInfo.email,
            key: 'email',
            secureTextEntry: false,
        },
        {
            label: 'Current Password',
            placeholder: 'Enter your current password',
            value: userInfo.current_password,
            key: 'current_password',
            secureTextEntry: true,
        },
        {
            label: 'New Password',
            placeholder: 'Enter your new password',
            value: userInfo.new_password,
            key: 'new_password',
            secureTextEntry: true,
        },
        {
            label: 'Confirm New Password',
            placeholder: 'Confirm your new password',
            value: userInfo.new_password_confirmation,
            key: 'new_password_confirmation',
            secureTextEntry: true,
        },
    ];

    return (
        <View>
            {inputFields.map((field) => (
                <View key={field.key} style={{ marginBottom: 20 }}>
                    <Text style={[utilities.textM, utilities.myFontMedium]}>{field.label}</Text>
                    <TextInput
                        placeholder={field.placeholder}
                        placeholderTextColor={colors.gray}
                        autoCapitalize="none"
                        secureTextEntry={field.secureTextEntry}
                        cursorColor={colors.primary}
                        style={[utilities.myFontRegular, { color: colors.lightGray }]}
                        value={field.value}
                        onChangeText={(text) => setUserInfo((prev) => ({ ...prev, [field.key]: text }))}
                    />
                </View>
            ))}
        </View>
    );
};

export default UserCredentialsForm;
