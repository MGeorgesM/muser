import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const SignInForm = ({ setEmail, setPassword }) => {
    return (
        <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="user@muser.com"
                value={email}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="********"
                value={password}
                onChangeText={(text) => setPassword(text)}
                autoCapitalize="none"
                secureTextEntry
            />
        </View>
    );
};

export default SignInForm;

const styles = StyleSheet.create({});
