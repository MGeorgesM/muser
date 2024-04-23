import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import {
    StyleSheet,
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

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { handleSignIn } = useUser();

    // const handleSignIn = async () => {
    //     try {
    //         const response = await signInWithEmailAndPassword(auth, email, password);
    //         const user = response.user;
    //         const token = await user.getIdToken();
    //         await AsyncStorage.setItem('token', token);
    //         navigation.navigate('ChatStack', {
    //             screen: 'Chat',
    //         });
    //     } catch (error) {
    //         console.error('Error signing in:', error);
    //     }
    // };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.topInnerContainer}>
                    <Image style={styles.welcomeLogo} source={logoImg} />
                    <Text style={styles.header}>Welcome Back!</Text>
                    <View>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="user@muser.com"
                            value={email}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            autoCapitalize="none"
                            onChangeText={(text) => setEmail(text)}
                        />
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="********"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            autoCapitalize="none"
                            secureTextEntry
                        />
                    </View>
                </View>

                <View style={styles.bottomInnerContainer}>
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => handleSignIn(email, password)}>
                        <Text style={styles.primaryBtnText}>Log In</Text>
                    </TouchableOpacity>
                    <Text style={styles.promptText}>
                        Don't have an account?{' '}
                        <Text style={styles.promptLink} onPress={() => navigation.navigate('SignUp')}>
                            Register
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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

export default SignIn;
