import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const ProfileDetails = ({ route }) => {
const { username, photo } = route.params;

console.log('username', username);

    return (
        <View>
            <Text>ProfileDetails</Text>
        </View>
    );
};

export default ProfileDetails;

const styles = StyleSheet.create({});
