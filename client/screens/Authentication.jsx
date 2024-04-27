import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Image, View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import SignInForm from '../components/AuthenticationForms/SignInForm';
import SignUpForm from '../components/AuthenticationForms/SignUpForm';

const { styles } = require('../components/AuthenticationForms/styles');
const logoImg = require('../assets/logo.png');

const Authentication = ({ navigation }) => {
    const [switchHandler, setSwitchHandler] = useState(false);
    const [error, setError] = useState(null);
    const [signInForm, setSignInForm] = useState({
        email: '',
        password: '',
    });

    const { handleSignIn, handleSignUp } = useUser();

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.topInnerContainer}>
                <Image style={styles.welcomeLogo} source={logoImg} />
                <Text style={styles.header}>{switchHandler ? 'Join Muser' : 'Welcome Back!'}</Text>
                {switchHandler ? <SignUpForm /> : <SignInForm signInForm={signInForm} setSignInForm={setSignInForm} />}
            </View>
            <View style={styles.bottomInnerContainer}>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => handleSignIn(email, password)}>
                    <Text style={styles.primaryBtnText}>Log In</Text>
                </TouchableOpacity>
                <Text style={styles.promptText}>
                    {switchHandler ? 'Have an account?' : "Don't have an account? "}
                    <Text style={styles.promptLink} onPress={() => setSwitchHandler(!switchHandler)}>
                        {switchHandler ? 'Log In' : 'Register'}
                    </Text>
                </Text>
            </View>
        </ScrollView>
    );
};

export default Authentication;
