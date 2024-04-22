import React, { useState } from 'react';
import { sendRequest, requestMethods } from '../core/tools/apiRequest';
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
const { styles } = require('./SignIn');

const SignUp = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        console.log('Registering:', name, email, password);

        const response = await sendRequest('auth/register', requestMethods.POST, {
            name,
            email,
            password,
        });

        console.log('Response:', response);

        if (response.status === 200) {
            navigation.navigate('ChatStack', {
                screen: 'Chat',
            });
        }
        if (response.error) {
            console.error('Error registering:', response.error);
        } else {
            navigation.navigate('SignIn');
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.topInnerContainer}>
                    <Image style={styles.welcomeLogo} source={logoImg} />
                    <Text style={styles.header}>Join Muser</Text>
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
