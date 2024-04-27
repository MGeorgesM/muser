import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Image, View, Text, ScrollView, TouchableOpacity } from 'react-native';

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

    const { handleSignIn,signUpForm, setSignUpForm } = useUser();

    const handleProceed = () => {
        if (switchHandler) {
            navigation.navigate('UserRole');
        } else {
            handleSignIn(signInForm);
        }
    };

    useEffect(() => {
        if (!signInForm.email.includes('@') || !signInForm.email.includes('.')) {
            setError('Please enter a valid email address');
        } else if (signInForm.password.length < 6) {
            setError('Password must be at least 6 characters long');
        } else {
            setError(null);
        }
    }, []);


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.topInnerContainer}>
                <Image style={styles.welcomeLogo} source={logoImg} />
                <Text style={styles.header}>{switchHandler ? 'Join Muser' : 'Welcome Back!'}</Text>
                {switchHandler ? <SignUpForm /> : <SignInForm signInForm={signInForm} setSignInForm={setSignInForm} />}
            </View>
            <View style={styles.bottomInnerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={handleProceed}>
                    <Text style={styles.primaryBtnText}>Log In</Text>
                </TouchableOpacity>
                <Text style={styles.promptText}>
                    {switchHandler ? 'Have an account? ' : "Don't have an account? "}
                    <Text style={styles.promptLink} onPress={() => setSwitchHandler(!switchHandler)}>
                        {switchHandler ? 'Log In' : 'Register'}
                    </Text>
                </Text>
            </View>
        </ScrollView>
    );
};

export default Authentication;
