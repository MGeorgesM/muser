import React from 'react';
import { Text, View, TextInput } from 'react-native';

const { styles } = require('./styles');

const SignUpForm = ({ userRegistrationInfo, setUserRegistrationInfo }) => {
    return (
        <View>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Georges Mouawad"
                value={userRegistrationInfo?.name}
                onChangeText={(text) => setUserRegistrationInfo({ ...userRegistrationInfo, name: text })}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="user@mail.com"
                value={userRegistrationInfo?.email}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                onChangeText={(text) => setUserRegistrationInfo({ ...userRegistrationInfo, email: text.toLowerCase() })}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="password"
                value={userRegistrationInfo?.password}
                onChangeText={(text) => setUserRegistrationInfo({ ...userRegistrationInfo, password: text })}
                autoCapitalize="none"
                secureTextEntry
            />
        </View>
    );
};

export default SignUpForm;
