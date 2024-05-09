require('dotenv').config();

export default {
    expo: {
        name: 'client',
        slug: 'client',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'light',
        splash: {
            image: './assets/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
            googleServicesFile: './google-services.json',
            package: 'com.sef.muser',
        },
        web: {
            favicon: './assets/favicon.png',
        },
        plugins: [
            'expo-build-properties',
            ['@stream-io/video-react-native-sdk'],
            [
                '@config-plugins/react-native-webrtc',
                {
                    cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
                    microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone',
                },
            ],
            [
                'expo-build-properties',
                {
                    android: {
                        minSdkVersion: 24,
                        compileSdkVersion: 34,
                        targetSdkVersion: 33,
                        extraMavenRepos: ['$rootDir/../../../node_modules/@notifee/react-native/android/libs'],
                    },
                },
            ],
            [
                'expo-font',
                {
                    fonts: [
                        './assets/fonts/Montserrat-Black.ttf',
                        './assets/fonts/Montserrat-Bold.ttf',
                        './assets/fonts/Montserrat-Light.ttf',
                        './assets/fonts/Montserrat-Medium.ttf',
                        './assets/fonts/Montserrat-Regular.ttf',
                        './assets/fonts/Montserrat-SemiBold.ttf',
                    ],
                },
            ],
        ],
        extra: {
            apiKey: process.env.API_KEY,
            authDomain: process.env.AUTH_DOMAIN,
            projectId: process.env.PROJECT_ID,
            storageBucket: process.env.STORAGE_BUCKET,
            messagingSenderId: process.env.MESSAGING_SENDER_ID,
            appId: process.env.APP_ID,
        },
    },
};
