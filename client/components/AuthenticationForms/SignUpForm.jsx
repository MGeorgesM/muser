import React from 'react';
import { Text, View, TextInput } from 'react-native';

const { styles } = require('./styles');

const SignUpForm = ({ signUpForm, setSignUpForm }) => {
    return (
        <View>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Georges Mouawad"
                value={signUpForm?.name}
                onChangeText={(text) => setSignUpForm({ ...signUpForm, name: text })}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="user@mail.com"
                value={signUpForm?.email}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                onChangeText={(text) => setSignUpForm({ ...signUpForm, email: text.toLowerCase() })}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="password"
                value={signUpForm?.password}
                onChangeText={(text) => setSignUpForm({ ...signUpForm, password: text })}
                autoCapitalize="none"
                secureTextEntry
            />
        </View>
    );
};

export default SignUpForm;
