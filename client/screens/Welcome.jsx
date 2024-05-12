import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, StatusBar } from 'react-native';
import { utilities } from '../styles/utilities';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import notifee from '@notifee/react-native';

import PrimaryBtn from '../components/Elements/PrimaryBtn';

const imageUrl = require('../assets/appImages/onboard.jpg');

const Welcome = ({ navigation }) => {
    useEffect(() => {
        const setNavigationBarColor = async (color) => {
            try {
                await SystemNavigationBar.setNavigationColor(color);
            } catch (error) {
                console.log('Error setting navigation bar color:', error);
            }
        };
        setNavigationBarColor('translucent');
    }, []);

    async function onDisplayNotification() {
        try {
            console.log('Displaying notification');
            // Request permissions (required for iOS)
            await notifee.requestPermission();

            // Create a channel (required for Android)
            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
            });

            // Display a notification
            await notifee.displayNotification({

                title: 'Notification Title',
                body: 'Main body content of the notification',
                
                android: {
                    channelId,
                    
                    smallIcon: '@mipmap/ic_launcher', // optional, defaults to 'ic_launcher'.
                    // pressAction is needed if you want the notification to open the app when pressed
                    pressAction: {
                        id: 'default',
                    },
                },
            });
        } catch (error) {
            console.log('Error displaying notification:', error);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar translucent hidden={true} />
            <ImageBackground
                style={[styles.welcomeContainer, styles.imageBackground]}
                source={imageUrl}
                resizeMode="cover"
            >
                <View style={[utilities.photoOverlayS, { paddingHorizontal: 20, justifyContent: 'flex-end' }]}>
                    <Text style={styles.welcomeText}>BE PART OF MUSER</Text>
                    <PrimaryBtn
                        text={'Get Started'}
                        // handlePress={() => navigation.navigate('Authentication')}
                        handlePress={onDisplayNotification}
                        marginBottom={96}
                    />
                </View>
            </ImageBackground>
        </View>
    );
};

export default Welcome;

const styles = StyleSheet.create({
    welcomeContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    welcomeText: {
        color: 'white',
        fontSize: 40,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 8,
        marginLeft: 8,
    },
});
