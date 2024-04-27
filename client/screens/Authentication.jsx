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

    const { handleSignIn, userInfo, setUserInfo, authError } = useUser();

    const handleProceed = () => {
        console.log('Sign In Form:', userInfo);
        console.log('Sign Up Form:', userInfo);
        if (switchHandler) {
            navigation.navigate('UserRole');
        } else {
            handleSignIn(userInfo);
        }
    };

    useEffect(() => {
        if ((!userInfo.email.includes('@') || !userInfo.email.includes('.')) && userInfo.email.length > 0) {
            setError('Please enter a valid email address');
        } else if (userInfo.password.length < 6 && userInfo.password.length > 0) {
            setError('Password must be at least 6 characters long');
        } else {
            setError(null);
        }
    }, [userInfo]);

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
                <Text style={styles.errorText}>{authError}</Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={handleProceed}>
                    <Text style={styles.primaryBtnText}>{!switchHandler ? 'Log In' : 'Register'}</Text>
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
