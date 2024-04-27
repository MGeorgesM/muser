import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { useUser } from '../contexts/UserContext';

import { LogOut } from 'lucide-react-native';

const Profile = ({ navigation }) => {
    const { handleSignOut } = useUser();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => handleSignOut(navigation)}>
                    <LogOut size={30} color={'black'} style={{ marginEnd: 20 }} />
                </TouchableOpacity>
            ),
        });
    }, []);
    return (
        <View>
            <Text>Profile</Text>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({});
