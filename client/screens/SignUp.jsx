import React, { useState } from 'react';
import { useRegister } from '../contexts/RegisterContext';

import {
    Platform,
    Image,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';

const logoImg = require('../assets/logo.png');
const { styles } = require('./Authentication');

const SignUp = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setUserInfo } = useRegister();

    const handleRegister = async () => {
        if (!name || !email || !password) return;
        setUserInfo((prev) => ({ ...prev, name, email, password }));

        navigation.navigate('UserRole');
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.topInnerContainer}>
                    <Image style={styles.welcomeLogo} source={logoImg} />
                    <Text style={styles.header}>Join Muser</Text>
                </View>

                <View style={styles.bottomInnerContainer}>
                    <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister}>
                        <Text style={styles.primaryBtnText}>Register</Text>
                    </TouchableOpacity>
                    <Text style={styles.promptText}>
                        Have an account?{' '}
                        <Text style={styles.promptLink} onPress={() => navigation.navigate('SignIn')}>
                            Log In
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignUp;
