import React from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

import { colors } from '../../styles/utilities';
const { styles } = require('./styles');

const SignUpForm = ({ userInfo, setUserInfo }) => {
    return (
        <View>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.authInput}
                placeholder="Your name"
                placeholderTextColor={colors.gray}
                autoCapitalize="words"
                value={userInfo?.name}
                onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.authInput}
                placeholder="user@mail.com"
                placeholderTextColor={colors.gray}
                value={userInfo?.email}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                onChangeText={(text) => setUserInfo({ ...userInfo, email: text.toLowerCase() })}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.authInput}
                placeholder="Password"
                placeholderTextColor={colors.gray}
                value={userInfo?.password}
                onChangeText={(text) => setUserInfo({ ...userInfo, password: text })}
                autoCapitalize="none"
                secureTextEntry
            />
        </View>
    );
};

export default SignUpForm;
