import React from 'react';
import { Text, View, TextInput } from 'react-native';

const { styles } = require('./styles');

const SignInForm = ({ signInForm, setSignInForm }) => {
    return (
        <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="user@muser.com"
                value={signInForm?.email}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                onChangeText={(text) => setSignInForm({ ...signInForm, email: text.toLowerCase() })}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="********"
                value={signInForm?.password}
                onChangeText={(text) => setSignInForm({ ...signInForm, password: text })}
                autoCapitalize="none"
                secureTextEntry
            />
        </View>
    );
};

export default SignInForm;