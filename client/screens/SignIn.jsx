import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Image, View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import SignInForm from '../components/AuthenticationForms/SignInForm';

const logoImg = require('../assets/logo.png');

const Authentication = ({ navigation }) => {
    const [switchHandler, setSwitchHandler] = useState(false);
    const [signInForm, setSignInForm] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);

    const { handleSignIn } = useUser();

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.topInnerContainer}>
                <Image style={styles.welcomeLogo} source={logoImg} />
                <Text style={styles.header}>Welcome Back!</Text>
                {switchHandler ? <SignInForm signInForm={signInForm} setSignInForm={setSignInForm} /> : <SignUpForm />}
            </View>

            <View style={styles.bottomInnerContainer}>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => handleSignIn(email, password)}>
                    <Text style={styles.primaryBtnText}>Log In</Text>
                </TouchableOpacity>
                <Text style={styles.promptText}>
                    Don't have an account?{' '}
                    <Text style={styles.promptLink} onPress={() => setSwitchHandler(false)}>
                        Register
                    </Text>
                </Text>
            </View>
        </ScrollView>
    );
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
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

export default Authentication;
