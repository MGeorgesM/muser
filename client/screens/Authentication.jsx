import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { useUser } from '../contexts/UserContext';

import SignInForm from '../components/AuthenticationForms/SignInForm';
import SignUpForm from '../components/AuthenticationForms/SignUpForm';
import { sendRequest, requestMethods } from '../core/tools/apiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { utilities } from '../styles/utilities';
import PrimaryBtn from '../components/Elements/PrimaryBtn';

const logoImg = require('../assets/logowhite.png');
const { styles } = require('../components/AuthenticationForms/styles');

const Authentication = ({ navigation }) => {
    const [switchHandler, setSwitchHandler] = useState(false);
    const [error, setError] = useState(null);

    const { userInfo, setUserInfo, authError, setLoggedIn, loggedIn, setCurrentUser } = useUser();

    const imageSource = switchHandler
        ? require('../assets/appImages/onboard00.jpg')
        : require('../assets/appImages/onboard00.jpg');

    useEffect(() => {
        if ((!userInfo.email.includes('@') || !userInfo.email.includes('.')) && userInfo.email.length > 0) {
            setError('Please enter a valid email address');
        } else if (userInfo.password.length < 6 && userInfo.password.length > 0) {
            setError('Password must be at least 6 characters long');
        } else {
            setError(null);
        }
    }, [userInfo, switchHandler, authError]);

    const handleSignIn = async () => {
        setError(null);
        try {
            const response = await sendRequest(requestMethods.POST, 'auth/login', userInfo);

            if (response.status === 200) {
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('streamToken', response.data.stream_token);
                setLoggedIn(true);
                setCurrentUser(response.data.user);
                console.log('User login successful:', response.data.user);
                loggedIn && navigation.navigate('Feed', { screen: 'FeedMain' });
            }
        } catch (error) {
            console.log('Error signing in:', error);
            setError('Invalid email or password');
        }
    };

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
            <View style={[utilities.container, utilities.photoOverlayS]}>
                <ScrollView showsHorizontalScrollIndicator={false}>
                <View style={styles.topInnerContainer}>
                    <Image style={styles.welcomeLogo} source={logoImg} />
                    <Text style={styles.header}>{switchHandler ? 'Join Muser' : 'Welcome Back!'}</Text>
                    {switchHandler ? (
                        <SignUpForm userInfo={userInfo} setUserInfo={setUserInfo} />
                    ) : (
                        <SignInForm userInfo={userInfo} setUserInfo={setUserInfo} />
                    )}
                </View>
                </ScrollView>
                <View style={styles.bottomInnerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <PrimaryBtn
                        text={!switchHandler ? 'Log In' : 'Continue'}
                        handlePress={handleProceed}
                        marginBottom={0}
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
                            {switchHandler ? 'Log In' : 'Register'}
                        </Text>
                    </Text>
                </View>
                {/* </View> */}
            </View>
        </>
    );
};

export default Authentication;
