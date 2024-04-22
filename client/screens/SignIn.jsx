import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { StyleSheet, Image, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';

const logoImg = require('../assets/logo.png');

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
            <View style={styles.topInnerContainer}>
                <Image style={styles.welcomeLogo} source={logoImg} />
                <Text style={styles.header}>Welcome Back!</Text>
                <View>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} placeholder="user@muser.com" value={email} onChangeText={setEmail} />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
            </View>

            <View style={styles.bottomInnerContainer}>
                <TouchableOpacity style={styles.primaryBtn} onPress={handleSignIn}>
                    <Text style={styles.primaryBtnText}>Log In</Text>
                </TouchableOpacity>
                <Text style={styles.promptText}>
                    Don't have an account?{' '}
                    <Text style={styles.promptLink} onPress={() => navigation.navigate('SignUp')}>
                        Register
                    </Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    header: {
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 24,
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

    welcomeLogo: {
        width: 130,
        height: 130,
        alignSelf: 'center',
    },

    topInnerContainer: {
        marginTop: 128,
    },

    bottomInnerContainer: {
        marginBottom: 64,
    },
});

export default SignIn;
