import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View, Keyboard, KeyboardAvoidingView, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import { useUser } from '../contexts/UserContext';

import { colors, utilities } from '../styles/utilities';
import { sendRequest, requestMethods } from '../core/tools/apiRequest';

import SignInForm from '../components/AuthenticationForms/SignInForm';
import SignUpForm from '../components/AuthenticationForms/SignUpForm';
import PrimaryBtn from '../components/Elements/PrimaryBtn';

const logoImg = require('../assets/appImages/logoOnboard.png');
const imageSource = require('../assets/appImages/onboard.jpg');

const { styles } = require('../components/AuthenticationForms/styles');

const Authentication = ({ navigation }) => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [switchHandler, setSwitchHandler] = useState(false);
    const [error, setError] = useState(null);

    const { userInfo, setUserInfo, authError, setAuthError, handleSignIn, handleGoogleSignIn } = useUser();

    useEffect(() => {
        console.log('User Info:', userInfo);
        if (!userInfo) return;

        if ((!userInfo.email.includes('@') || !userInfo.email.includes('.')) && userInfo.email.length > 0) {
            setError('Please enter a valid email address');
        } else if (userInfo.password.length < 6 && userInfo.password.length > 0) {
            setError('Password must be at least 6 characters long');
        } else {
            setError(null);
            setAuthError(null);
        }
    }, [userInfo, switchHandler]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        const setNavigationBarColor = async (color) => {
            try {
                await SystemNavigationBar.setNavigationColor(color);
            } catch (error) {
                console.log('Error setting navigation bar color:', error);
            }
        };
        setNavigationBarColor(colors.bgDarkest);
    }, []);

    const checkEmail = async () => {
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/register/email', { email: userInfo.email });
            if (response.status === 200) {
                return false;
            } else if (response.status === 401) {
                setError('Email already in use');
                return true;
            }
        } catch (error) {
            setError('Email already in use');
            return true;
        }
    };

    const handleProceed = async () => {
        setError(null);
        if (switchHandler) {
            if (userInfo.email.length < 1 || userInfo.password.length < 1 || userInfo.name.length < 1) {
                setError('Please fill out all fields');
                return;
            }
            const emailExists = await checkEmail();
            if (!emailExists) {
                navigation.navigate('UserRole');
            }
        } else {
            handleSignIn();
        }
    };

    return (
        <>
            <Image source={imageSource} style={styles.imageBackground} />
            <View style={[utilities.container, utilities.photoOverlayL]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[styles.topInnerContainer]}>
                        <Image style={styles.welcomeLogo} source={logoImg} />
                        <Text style={styles.header}>{switchHandler ? 'Join Muser' : 'Welcome Back!'}</Text>
                        {switchHandler ? (
                            <SignUpForm userInfo={userInfo} setUserInfo={setUserInfo} />
                        ) : (
                            <SignInForm userInfo={userInfo} setUserInfo={setUserInfo} />
                        )}
                    </View>
                </ScrollView>
                {!keyboardVisible && (
                    <View style={styles.bottomInnerContainer}>
                        <Text style={styles.errorText}>{error || authError}</Text>
                        {!switchHandler && <TouchableOpacity style={utilities.secondaryBtn} onPress={handleGoogleSignIn}>
                            <Text style={[utilities.secondaryBtnText, { position: 'relative' }]}>
                                Sign in with Google
                            </Text>
                            <Image source={require('../assets/appImages/googleLogo.png')} style={styles.googleLogo} />
                        </TouchableOpacity>}
                        <PrimaryBtn
                            text={!switchHandler ? 'Sign in' : 'Continue'}
                            handlePress={handleProceed}
                            marginBottom={0}
                            marginTop={12}
                        />
                        <Text style={styles.promptText}>
                            {switchHandler ? 'Have an account? ' : "Don't have an account? "}
                            <Text
                                style={styles.promptLink}
                                onPress={() => {
                                    setSwitchHandler(!switchHandler);
                                    setError(null);
                                }}
                            >
                                {switchHandler ? 'Sign In' : 'Register'}
                            </Text>
                        </Text>
                    </View>
                )}
            </View>
        </>
    );
};

export default Authentication;
