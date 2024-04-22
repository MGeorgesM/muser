import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { StyleSheet, Image, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';

cosnt logoImg = require('../assets/');

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('Chat');
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome Back!</Text>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={handleSignIn}>
                <Text style={styles.primaryBtnText}>Log In</Text>
            </TouchableOpacity>
            <Text style={styles.promptText}>
                Don't have an account? <Text style={styles.promptLink} onPress={() => navigation.navigate('SignUp')}>Register</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    header: {
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 44,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        marginLeft: 8,
    },
    input: {
        height: 48,
        borderRadius: 24,
        borderWidth: 0.5,
        borderColor: '#212529',
        padding: 16,
        marginBottom: 14,
    },
    primaryBtn: {
        height: 48,
        borderRadius: 24,
        backgroundColor: '#212529',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },

    promptText: {
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },

    promptLink: {
        color: 'blue',
        textDecorationLine: 'underline',
    },  

});

export default SignIn;
