import React, { useState } from 'react';
import { sendRequest, requestMethods } from '../core/tools/apiRequest';
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
const { styles } = require('./SignIn');

const SignUp = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        console.log('Registering:', name, email, password);

        navigation.navigate('Chat');

        // const response = await sendRequest('auth/register', requestMethods.POST, {
        //     name,
        //     email,
        //     password,
        // });

        // if (response.error) {
        //     console.error('Error registering:', response.error);
        // } else {
        //     navigation.navigate('Chat');
        // }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.topInnerContainer}>
                    <Image style={styles.welcomeLogo} source={logoImg} />
                    <Text style={styles.header}>Welcome Back!</Text>
                    <View>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Georges Mouawad"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="user@muser.com"
                            value={email}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            autoCapitalize='none'
                            onChangeText={(text) => setEmail(text)}
                        />
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="password"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                        />
                    </View>
                </View>

                <View style={styles.bottomInnerContainer}>
                    <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister}>
                        <Text style={styles.primaryBtnText}>Register</Text>
                    </TouchableOpacity>
                    <Text style={styles.promptText}>
                        Have an account?{' '}
                        <Text style={styles.promptLink} onPress={() => navigation.navigate('SignUp')}>
                            Log In
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignUp;