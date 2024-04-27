import React, { useEffect, useState } from 'react';
import { Image, View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { useUser } from '../contexts/UserContext';

import SignInForm from '../components/AuthenticationForms/SignInForm';
import SignUpForm from '../components/AuthenticationForms/SignUpForm';

const logoImg = require('../assets/logo.png');
const { styles } = require('../components/AuthenticationForms/styles');

const Authentication = ({ navigation }) => {
    const [switchHandler, setSwitchHandler] = useState(false);
    const [error, setError] = useState(null);

    const { handleSignIn, userInfo, setUserInfo, authError, loggedIn } = useUser();

    const handleProceed = () => {
        console.log('Form:', userInfo);
        console.log('Error:', error);
        console.log('authError:', authError);
        if (switchHandler) {
            userInfo.name.length > 0 ? navigation.navigate('UserRole') : setError('Please fill out all fields');
            return;
        } else {
            handleSignIn();
            setError(authError);
        }

        authError && setError(authError);
    };

    useEffect(() => {
        if ((!userInfo.email.includes('@') || !userInfo.email.includes('.')) && userInfo.email.length > 0) {
            setError('Please enter a valid email address');
        } else if (userInfo.password.length < 6 && userInfo.password.length > 0) {
            setError('Password must be at least 6 characters long');
        } else {
            setError(null);
        }
    }, [userInfo, switchHandler]);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.topInnerContainer}>
                <Image style={styles.welcomeLogo} source={logoImg} />
                <Text style={styles.header}>{switchHandler ? 'Join Muser' : 'Welcome Back!'}</Text>
                {switchHandler ? (
                    <SignUpForm userInfo={userInfo} setUserInfo={setUserInfo} />
                ) : (
                    <SignInForm userInfo={userInfo} setUserInfo={setUserInfo} />
                )}
            </View>
            <View style={styles.bottomInnerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={handleProceed}>
                    <Text style={styles.primaryBtnText}>{!switchHandler ? 'Log In' : 'Continue'}</Text>
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
