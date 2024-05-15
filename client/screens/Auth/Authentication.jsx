import React from 'react';
import { Image, ScrollView, Text, View} from 'react-native';

import useKeyboardVisibility from '../../core/tools/keyboardVisibility';
import useAuthenticationLogic from './authenticationLogic';
import { colors, utilities } from '../../styles/utilities';
import { useNavigationBarColor } from '../../core/tools/systemNavigationBar';

import SignInForm from '../../components/Forms/SignInForm';
import SignUpForm from '../../components/Forms/SignUpForm';
import PrimaryBtn from '../../components/Misc/PrimaryBtn/PrimaryBtn';

const logoImg = require('../../assets/appImages/logoOnboard.png');
const imageSource = require('../../assets/appImages/onboardBlurred.jpg');

const { styles } = require('../../components/Forms/styles');

const Authentication = () => {
    const {
        error,
        setError,
        userInfo,
        authError,
        setUserInfo,
        handleProceed,
        switchHandler,
        setSwitchHandler,
    } = useAuthenticationLogic();
    useNavigationBarColor(colors.bgDarkest);
    const keyboardVisible = useKeyboardVisibility();
    return (
        <>
            <Image source={imageSource} style={styles.imageBackground} />
            <View style={[utilities.container, utilities.photoOverlayM]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[styles.topInnerContainer]}>
                        <Image style={styles.welcomeLogo} source={logoImg} />
                        <Text style={styles.header}>{switchHandler ? 'Join Muser' : 'Welcome Back'}</Text>
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
